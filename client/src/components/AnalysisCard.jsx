import AnalysisSection from "./AnalysisSection";

function AnalysisCard({ analysis, loading }) {
  if (!analysis && !loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-white/5 px-6 text-center text-sm leading-6 text-slate-400">
        No analysis yet. Submit resume text to generate structured feedback.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-[24px] border border-white/10 bg-white/5 text-sm text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent border-white/40" />
          <div>Generating analysis...</div>
        </div>
      </div>
    );
  }

  // Support both old format (overallScore / atsMatchScore) and new format (score, missingSkills)
  const scorePercent =
    analysis?.score ??
    (analysis?.overallScore !== undefined && analysis?.overallScore !== null
      ? Math.round((Number(analysis.overallScore) / 10) * 100)
      : null);

  const showAtsSection = scorePercent !== null && scorePercent !== undefined;

  return (
    <div className="space-y-6">
      <div className={`grid gap-4 ${showAtsSection ? "md:grid-cols-2" : ""}`}>
        <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            ATS Score
          </p>

          <div className="mt-3">
            <div className="flex items-center justify-between">
              <div className="text-3xl font-semibold text-white">{scorePercent ?? "-"}%</div>
              <div className="text-sm text-slate-300">(higher is better)</div>
            </div>

            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-cyan-400"
                style={{ width: `${scorePercent ?? 0}%` }}
              />
            </div>
          </div>
        </div>

        {showAtsSection && analysis?.atsMatchScore !== undefined && (
          <div className="rounded-[24px] border border-purple-400/20 bg-purple-400/10 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-300">
              ATS Match Score
            </p>

            <div className="mt-3 flex items-end gap-3">
              <h3 className="text-5xl font-semibold text-white">
                {analysis.atsMatchScore}
              </h3>
              <span className="pb-2 text-sm text-slate-300">/ 10</span>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Summary
        </h3>
        <p className="text-sm leading-7 text-slate-300">{analysis.summary}</p>
      </div>

      {showAtsSection && analysis.matchedKeywords?.length > 0 && (
        <div className="rounded-[24px] border border-green-400/20 bg-green-400/10 p-6">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-green-300">
            Matched Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.matchedKeywords.map((word, index) => (
              <span
                key={index}
                className="rounded-full border border-green-400/20 bg-green-500/20 px-3 py-1 text-sm text-green-200"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Support new missingSkills field */}
      {showAtsSection && (analysis.missingSkills || analysis.missingKeywords)?.length > 0 && (
        <div className="rounded-[24px] border border-yellow-400/20 bg-yellow-400/10 p-6">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-yellow-300">
            Missing Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {(analysis.missingSkills || analysis.missingKeywords || []).map((word, index) => (
              <span
                key={index}
                className="rounded-full border border-yellow-400/20 bg-yellow-500/20 px-3 py-1 text-sm text-yellow-200"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      <AnalysisSection
        title="Key Strengths"
        items={analysis.strengths}
        color="green"
      />

      <AnalysisSection
        title="Areas for Improvement"
        items={analysis.weaknesses}
        color="yellow"
      />

      <AnalysisSection
        title="Actionable Suggestions"
        items={analysis.suggestions || analysis.atsSuggestions || []}
        color="blue"
      />
    </div>
  );
}

export default AnalysisCard;