import Groq from "groq-sdk";
import { PDFParse } from "pdf-parse";
import crypto from "crypto";
import Analysis from "../models/Analysis.js";
import calculateATSScore from "../utils/atsScorer.js";

const analyzeResume = async (req, res) => {
  try {
    const { resumeText, jobDescription, resumeLabel, jobLabel } = req.body;
    let finalResumeText = resumeText?.trim() || "";
    const trimmedResumeLabel = resumeLabel?.trim() || "";
    const trimmedJobLabel = jobLabel?.trim() || "";
    const originalFileName = req.file?.originalname || "";

    const generatedResumeLabel =
      trimmedResumeLabel ||
      originalFileName ||
      finalResumeText?.split("\n").map((line) => line.trim()).find(Boolean) ||
      "Untitled Resume";

    const generatedJobLabel =
      trimmedJobLabel ||
      jobDescription
        ?.split("\n")
        .map((line) => line.trim())
        .find(Boolean) ||
      "No Job Label";
    const hasJobDescription = jobDescription && jobDescription.trim() !== "";

    if (req.file) {
      try {
        const parser = new PDFParse({
          data: req.file.buffer,
        });

        const parsedPdf = await parser.getText();
        finalResumeText = parsedPdf.text.trim();
      } catch (error) {
        console.error("PDF parse error:", error);

        return res.status(400).json({
          message: "Failed to parse uploaded PDF.",
        });
      }
    }

    if (!finalResumeText) {
      return res.status(400).json({
        message: "Resume text or PDF file is required.",
      });
    }

    // Create a content hash to detect duplicate uploads
    const resumeHash = crypto.createHash("sha256").update(finalResumeText).digest("hex");

    // If we've already analyzed this exact resume, return stored result
    const existing = await Analysis.findOne({ hash: resumeHash });
    if (existing) {
      return res.status(200).json({
        message: "Resume already analyzed — returning cached result.",
        analysis: existing.analysisResult,
        resumeText: existing.resumeText,
        jobDescription: existing.jobDescription || jobDescription?.trim() || "",
        resumeLabel: existing.resumeLabel || generatedResumeLabel,
        jobLabel: existing.jobLabel || generatedJobLabel,
        originalFileName: existing.originalFileName || originalFileName,
        cached: true,
      });
    }

    // Deterministic ATS scoring (rule-based)
    const atsResult = calculateATSScore(finalResumeText, jobDescription || "");

    // Use Groq (LLM) only for suggestions, missing skills, and a short summary
    const groqKey = process.env.GROQ_API_KEY;
    let suggestions = [];
    let missingSkills = atsResult.missingSkills || [];
    let summary = "";

    if (groqKey) {
      try {
        const client = new Groq({ apiKey: groqKey });
        const model = "openai/gpt-oss-20b";

        const groqPrompt = `You are a professional resume assistant. Return ONLY valid JSON in this EXACT format:\n{\n  "suggestions": [],\n  "missing_skills": [],\n  "summary": ""\n}\n\nResume:\n${finalResumeText}\n\nJob Description:\n${hasJobDescription ? jobDescription.trim() : "Not provided"}\n`;

        const response = await client.chat.completions.create({
          model,
          messages: [
            { role: "system", content: "You are a concise resume assistant." },
            { role: "user", content: groqPrompt },
          ],
          temperature: 0,
        });

        const aiText =
          response?.choices?.[0]?.message?.content ||
          response?.output?.[0]?.content?.[0]?.text ||
          response?.output?.[0]?.content?.[0]?.content ||
          response?.output?.[0]?.text ||
          "";

        try {
          const cleaned = aiText.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleaned);
          suggestions = parsed.suggestions || [];
          // merge groq missing_skills with deterministic missingSkills (dedupe)
          const groqMissing = parsed.missing_skills || [];
          missingSkills = Array.from(new Set([...(missingSkills || []), ...groqMissing]));
          summary = parsed.summary || "";
        } catch (err) {
          console.error("Failed to parse Groq suggestions JSON:", err);
        }
      } catch (err) {
        console.error("Groq suggestion error:", err);
      }
    }

    const analysisPayload = {
      score: atsResult.score,
      breakdown: atsResult.breakdown,
      matchedSkills: atsResult.matchedSkills,
      missingSkills,
      suggestions,
      summary,
    };

    // Persist analysis for caching and history
    try {
      await Analysis.create({
        user: req.user?.userId || null,
        resumeText: finalResumeText,
        jobDescription: jobDescription || "",
        analysisResult: analysisPayload,
        resumeLabel: generatedResumeLabel,
        jobLabel: generatedJobLabel,
        originalFileName: originalFileName || "",
        hash: resumeHash,
        score: atsResult.score,
        suggestions,
        missingSkills,
      });
    } catch (dbErr) {
      console.error("Failed to save analysis cache:", dbErr);
    }

    return res.status(200).json({
      message: "Resume analyzed successfully.",
      analysis: analysisPayload,
      resumeText: finalResumeText,
      jobDescription: jobDescription?.trim() || "",
      resumeLabel: generatedResumeLabel,
      jobLabel: generatedJobLabel,
      originalFileName,
    });

  } catch (error) {
    console.error("AI Error:", error);

    const errorMessage =
      error?.response?.data?.error?.message ||
      error?.message ||
      "Error analyzing resume with AI.";

    return res.status(500).json({
      message: `AI analysis failed: ${errorMessage}`,
    });
  }
};
const getUserAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find({ user: req.user.userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json(analyses);
  } catch (error) {
    console.error("Fetch Analyses Error:", error);

    return res.status(500).json({
      message: "Failed to fetch analysis history.",
    });
  }
};

const deleteAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({
        message: "Analysis not found.",
      });
    }

    if (analysis.user.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Not authorized to delete this analysis.",
      });
    }

    await analysis.deleteOne();

    return res.status(200).json({
      message: "Analysis deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Analysis Error:", error);

    return res.status(500).json({
      message: "Failed to delete analysis.",
    });
  }
};
const saveAnalysis = async (req, res) => {
  try {
    const {
      resumeText,
      jobDescription,
      analysisResult,
      resumeLabel,
      jobLabel,
      originalFileName,
    } = req.body;

    if (!resumeText || !analysisResult) {
      return res.status(400).json({
        message: "Missing required data to save analysis.",
      });
    }

    const savedAnalysis = await Analysis.create({
      user: req.user.userId,
      resumeText,
      jobDescription: jobDescription || "",
      analysisResult,
      resumeLabel: resumeLabel || "Untitled Resume",
      jobLabel: jobLabel || "No Job Label",
      originalFileName: originalFileName || "",
    });

    return res.status(201).json({
      message: "Analysis saved successfully.",
      savedAnalysisId: savedAnalysis._id,
    });
  } catch (error) {
    console.error("Save Analysis Error:", error);

    return res.status(500).json({
      message: "Failed to save analysis.",
    });
  }
};
export { analyzeResume, getUserAnalyses, deleteAnalysis, saveAnalysis };