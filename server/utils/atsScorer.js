// Deterministic ATS scorer utility
// Calculates a reproducible score (0-100) based on resume text and optional job description

const STOP_WORDS = new Set([
  "the","and","for","with","a","an","to","of","in","on","that","is","are","as","by","be","or","from","at","this","we","our",
]);

function extractKeywords(text) {
  if (!text) return [];
  const tokens = text
    .replace(/[\W_]+/g, " ")
    .split(/\s+/)
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));

  // return unique keywords maintaining deterministic order
  const seen = new Set();
  const out = [];
  for (const t of tokens) {
    if (!seen.has(t)) {
      seen.add(t);
      out.push(t);
    }
  }
  return out;
}

function percentToScore(pct) {
  return Math.round(Math.max(0, Math.min(100, Math.round(pct))));
}

export function calculateATSScore(resumeText = "", jobDescription = "") {
  const resume = (resumeText || "").toLowerCase();
  const job = (jobDescription || "").toLowerCase();

  // 1) Skills match (40%) — find job keywords and check presence in resume
  const jobKeywords = extractKeywords(job);
  const matched = [];
  for (const kw of jobKeywords) {
    if (resume.includes(kw)) matched.push(kw);
  }
  const skillsPct = jobKeywords.length > 0 ? (matched.length / jobKeywords.length) * 100 : 0;

  // 2) Experience (20%) — infer years of experience
  const yearsMatch = resume.match(/(\d{1,2})\s*\+?\s*(?:years|yrs|year)/i);
  const years = yearsMatch ? Math.min(25, Number(yearsMatch[1])) : 0;
  // map 0-15+ years into 0-100
  const experiencePct = Math.min(100, Math.round((years / 15) * 100));

  // 3) Projects (20%) — count mentions of project-like indicators
  const projectIndicators = ["project","projects","developed","built","implement","implementation","contributed"];
  let projectCount = 0;
  for (const ind of projectIndicators) {
    const matches = resume.split(ind).length - 1;
    projectCount += Math.max(0, matches);
  }
  const projectsPct = Math.min(100, Math.round(Math.min(5, projectCount) / 5 * 100));

  // 4) Education (10%) — presence and level
  let educationScore = 0;
  if (/phd|doctorate/.test(resume)) educationScore = 100;
  else if (/master|msc|m\.sc|m\.s|mba/.test(resume)) educationScore = 85;
  else if (/bachelor|b\.sc|b\.s|bs|ba|bachelors/.test(resume)) educationScore = 70;
  else if (/associate/.test(resume)) educationScore = 50;
  const educationPct = educationScore;

  // 5) Length / format (10%) — prefer length between 350-1000 words
  const words = resume.split(/\s+/).filter(Boolean).length;
  let lengthScore = 0;
  if (words >= 350 && words <= 1000) lengthScore = 100;
  else if (words >= 250 && words < 350) lengthScore = 70;
  else if (words > 1000 && words <= 1600) lengthScore = 60;
  else if (words >= 150 && words < 250) lengthScore = 40;
  else lengthScore = Math.max(10, Math.round((Math.min(words, 2000) / 2000) * 100));
  const lengthPct = lengthScore;

  // weighted sum
  const finalPct =
    (skillsPct * 0.4 + experiencePct * 0.2 + projectsPct * 0.2 + educationPct * 0.1 + lengthPct * 0.1);

  return {
    score: percentToScore(finalPct),
    breakdown: {
      skills: percentToScore(skillsPct),
      experience: percentToScore(experiencePct),
      projects: percentToScore(projectsPct),
      education: percentToScore(educationPct),
      length: percentToScore(lengthPct),
    },
    matchedSkills: matched,
    missingSkills: jobKeywords.filter((k) => !matched.includes(k)),
    words,
  };
}

export default calculateATSScore;
