"use client";
import axios from "axios";
import {
    AlertCircle,
    AlertTriangle,
    BookOpen,
    CheckCircle2,
    ChevronRight,
    FileSearch,
    FileText,
    Lightbulb,
    Loader2,
    Sparkles,
    Star,
    Tag,
    TrendingUp,
    Upload,
    XCircle,
    Zap,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

// ── Helpers ──────────────────────────────────────────────────────────────────

function ScoreRing({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  const label =
    score >= 75 ? "Excellent" : score >= 50 ? "Average" : "Needs Work";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="currentColor"
            className="text-gray-200 dark:text-gray-700" strokeWidth="10" />
          <circle cx="64" cy="64" r={radius} fill="none" stroke={color}
            strokeWidth="10" strokeDasharray={circumference}
            strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.2s ease" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-800 dark:text-gray-100">{score}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">/ 100</span>
        </div>
      </div>
      <span className="text-sm font-bold px-3 py-1 rounded-full"
        style={{ background: color + "22", color }}>{label}</span>
    </div>
  );
}

function ScoreBar({ label, value, max, color }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-300 font-medium">{label}</span>
        <span className="text-gray-800 dark:text-gray-200 font-bold">{value}/{max}</span>
      </div>
      <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

const priorityConfig = {
  High: {
    color: "text-rose-700 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-900/20",
    border: "border-rose-200 dark:border-rose-800",
    icon: XCircle,
    iconColor: "text-rose-500",
  },
  Medium: {
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
  },
  Low: {
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    icon: Lightbulb,
    iconColor: "text-blue-500",
  },
};

const CARD = "bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700";

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    const allowed = ["application/pdf", "text/plain", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(f.type)) {
      toast.error("Please upload a PDF, DOC, DOCX, or TXT file.");
      return;
    }
    setFile(f);
    setAnalysis(null);
    setError(null);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const analyzeResume = async () => {
    if (!file) return toast.error("Please upload your resume first.");
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const fd = new FormData();
      fd.append("resume", file);
      const res = await axios.post("/api/resume-analyzer", fd);
      setAnalysis(res.data.analysis);
      toast.success("Resume analyzed successfully!");
    } catch (e) {
      const msg = e?.response?.data?.error || "Failed to analyze resume. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/30 py-10 px-4 sm:px-6 lg:px-10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* ── Header ── */}
        <div className="text-center animate-fade-in-down space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-2">
            <Sparkles className="w-4 h-4" />
            AI-Powered
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
            Resume ATS Analyzer
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-sm md:text-base">
            Upload your resume and get an instant ATS compatibility score with
            actionable recommendations to land more interviews.
          </p>
        </div>

        {/* ── Upload Card ── */}
        <div className={`${CARD} p-6 md:p-8 animate-fade-in-up`}>
          {/* Drop Zone */}
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => inputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-4 py-12 px-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
              dragging
                ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 scale-[1.01]"
                : file
                ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-indigo-300 hover:bg-indigo-50/40 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/10"
            }`}
          >
            <input ref={inputRef} type="file" accept=".pdf,.doc,.docx,.txt"
              className="hidden" onChange={(e) => handleFile(e.target.files[0])} />

            {file ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-800 dark:text-gray-100 text-lg">{file.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB • Click to change
                  </p>
                </div>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Ready to analyze
                </span>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-700 dark:text-gray-200 text-lg">
                    Drop your resume here
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    or <span className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2">browse files</span>
                  </p>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">PDF, DOC, DOCX, TXT • Max 5MB</p>
              </>
            )}
          </div>

          {/* Analyze Button */}
          <button
            onClick={analyzeResume}
            disabled={!file || loading}
            className="mt-5 w-full flex items-center justify-center gap-3 py-4 rounded-2xl btn-shimmer text-white font-bold text-base shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing your resume...</>
            ) : (
              <><FileSearch className="w-5 h-5" /> Analyze Resume <Sparkles className="w-4 h-4 opacity-80" /></>
            )}
          </button>
        </div>

        {/* ── Loading shimmer ── */}
        {loading && (
          <div className={`${CARD} p-8 animate-pulse space-y-4`}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                <div className="h-3 bg-gray-100 dark:bg-gray-700/60 rounded w-36" />
              </div>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-3 bg-gray-100 dark:bg-gray-700/60 rounded w-full" />
            ))}
          </div>
        )}

        {/* ── Error ── */}
        {error && !loading && (
          <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl p-5 flex items-center gap-4 animate-fade-in">
            <AlertCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-rose-700 dark:text-rose-400">Analysis Failed</p>
              <p className="text-rose-600 dark:text-rose-300 text-sm mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* ── Results ── */}
        {analysis && !loading && (
          <div className="space-y-6 animate-fade-in-up">

            {/* Score Hero */}
            <div className={`${CARD} p-6 md:p-8`}>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <ScoreRing score={analysis.atsScore ?? 0} />
                </div>
                <div className="flex-1 w-full space-y-3">
                  <h2 className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-500" />
                    Score Breakdown
                  </h2>
                  {analysis.scoreBreakdown && (
                    <>
                      <ScoreBar label="Formatting" value={analysis.scoreBreakdown.formatting ?? 0} max={20} color="#6366f1" />
                      <ScoreBar label="Keywords" value={analysis.scoreBreakdown.keywords ?? 0} max={25} color="#8b5cf6" />
                      <ScoreBar label="Experience" value={analysis.scoreBreakdown.experience ?? 0} max={25} color="#06b6d4" />
                      <ScoreBar label="Skills" value={analysis.scoreBreakdown.skills ?? 0} max={15} color="#10b981" />
                      <ScoreBar label="Education" value={analysis.scoreBreakdown.education ?? 0} max={15} color="#f59e0b" />
                    </>
                  )}
                </div>
              </div>

              {analysis.summary && (
                <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                  <p className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    <BookOpen className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                    {analysis.summary}
                  </p>
                </div>
              )}
            </div>

            {/* Skills */}
            {analysis.skills && (
              <div className={`${CARD} p-6 md:p-8`}>
                <h2 className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-5 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-indigo-500" />
                  Detected Skills
                </h2>
                <div className="space-y-4">
                  {analysis.skills.technical?.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-2">Technical</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.skills.technical.map((s, i) => (
                          <span key={i} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-xl border border-indigo-100 dark:border-indigo-800">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {analysis.skills.soft?.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-2">Soft Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.skills.soft.map((s, i) => (
                          <span key={i} className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-xl border border-purple-100 dark:border-purple-800">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Strengths + Gaps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysis.strengths?.length > 0 && (
                <div className={`${CARD} p-6`}>
                  <h2 className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500" />
                    Strengths
                  </h2>
                  <ul className="space-y-3">
                    {analysis.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {analysis.gaps?.length > 0 && (
                <div className={`${CARD} p-6`}>
                  <h2 className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                    Gaps Found
                  </h2>
                  <ul className="space-y-3">
                    {analysis.gaps.map((g, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                        <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Keywords */}
            {analysis.keywords && (
              <div className={`${CARD} p-6 md:p-8`}>
                <h2 className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-5 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-indigo-500" />
                  ATS Keywords
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {analysis.keywords.found?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">
                        ✓ Found in Resume
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.keywords.found.map((k, i) => (
                          <span key={i} className="px-2.5 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-lg border border-green-100 dark:border-green-800">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {analysis.keywords.missing?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2">
                        ✗ Missing / Suggested
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.keywords.missing.map((k, i) => (
                          <span key={i} className="px-2.5 py-1 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-xs font-medium rounded-lg border border-rose-100 dark:border-rose-800">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations?.length > 0 && (
              <div className={`${CARD} p-6 md:p-8`}>
                <h2 className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-5 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-indigo-500" />
                  Recommendations to Improve
                </h2>
                <div className="space-y-4">
                  {analysis.recommendations.map((rec, i) => {
                    const cfg = priorityConfig[rec.priority] || priorityConfig.Low;
                    const Icon = cfg.icon;
                    return (
                      <div key={i} className={`flex gap-4 p-4 rounded-2xl border ${cfg.bg} ${cfg.border}`}>
                        <div className="flex-shrink-0 mt-0.5">
                          <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`font-bold text-sm ${cfg.color}`}>{rec.title}</p>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                              {rec.priority}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 leading-relaxed">
                            {rec.description}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0 self-center" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reset */}
            <div className="flex justify-center pb-4">
              <button
                onClick={() => { setFile(null); setAnalysis(null); setError(null); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium text-sm hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all duration-200"
              >
                <Upload className="w-4 h-4" />
                Analyze Another Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
