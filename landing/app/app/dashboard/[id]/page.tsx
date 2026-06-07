"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  resumes, ai, downloadPdf,
  type Resume, type AIResult, type Usage,
  type WorkExperience, type Education, type Project,
} from "@/lib/api";

const TABS = ["Personal", "Experience", "Education", "Skills", "Projects", "Job Description"] as const;
type Tab = typeof TABS[number];

const TEMPLATES = [
  { id: "modern",    name: "Modern",    preview: "bg-gradient-to-b from-indigo-500 via-indigo-100 to-white" },
  { id: "classic",   name: "Classic",   preview: "bg-gradient-to-b from-gray-800 via-gray-200 to-white" },
  { id: "executive", name: "Executive", preview: "bg-gradient-to-b from-blue-900 via-blue-100 to-white" },
  { id: "minimal",   name: "Minimal",   preview: "bg-gradient-to-b from-gray-100 to-white border border-gray-200" },
];

export default function ResumeEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("Personal");

  // Form state
  const [title, setTitle] = useState("");
  const [personal, setPersonal] = useState({ name: "", email: "", phone: "", location: "", linkedin: "", github: "", website: "", summary: "" });
  const [workExp, setWorkExp] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skillsRaw, setSkillsRaw] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [jobDescription, setJobDescription] = useState("");

  // AI state
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [copied, setCopied] = useState(false);
  const [template, setTemplate] = useState("modern");
  const [coverLetter, setCoverLetter] = useState("");
  const [clCompany, setClCompany] = useState("");
  const [clJobTitle, setClJobTitle] = useState("");
  const [clCopied, setClCopied] = useState(false);
  const [showCL, setShowCL] = useState(false);

  const populateForm = useCallback((r: Resume) => {
    setTitle(r.title);
    const pi = r.personal_info as Record<string, string>;
    setPersonal({
      name: pi.name ?? "", email: pi.email ?? "", phone: pi.phone ?? "",
      location: pi.location ?? "", linkedin: pi.linkedin ?? "",
      github: pi.github ?? "", website: pi.website ?? "", summary: pi.summary ?? "",
    });
    setWorkExp((r.work_experience as WorkExperience[]) ?? []);
    setEducation((r.education as Education[]) ?? []);
    setSkillsRaw((r.skills as string[]).join(", "));
    setProjects((r.projects as Project[]) ?? []);
    setJobDescription(r.job_description ?? "");
  }, []);

  useEffect(() => {
    Promise.all([
      resumes.get(id),
      ai.latestResult(id).catch(() => null),
      ai.usage().catch(() => null),
    ]).then(([r, result, usageData]) => {
      setResume(r);
      populateForm(r);
      setAiResult(result);
      setUsage(usageData);
    }).finally(() => setLoading(false));
  }, [id, populateForm]);

  async function handleSave() {
    setSaving(true);
    setSaveMsg("");
    try {
      const updated = await resumes.update(id, {
        title,
        personal_info: personal,
        work_experience: workExp,
        education,
        skills: skillsRaw.split(",").map((s) => s.trim()).filter(Boolean),
        projects: projects.map((p) => ({
          ...p,
          technologies: typeof p.technologies === "string"
            ? (p.technologies as string).split(",").map((t: string) => t.trim()).filter(Boolean)
            : p.technologies,
        })),
        job_description: jobDescription || undefined,
      });
      setResume(updated);
      setSaveMsg("Saved");
      setTimeout(() => setSaveMsg(""), 2000);
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function runAI(op: "generate" | "improve" | "score") {
    setAiLoading(true);
    setAiError("");
    try {
      // Save first so AI sees latest data
      await handleSave();
      const result = await ai[op](id);
      setAiResult(result);
      const usageData = await ai.usage();
      setUsage(usageData);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "AI operation failed");
    } finally {
      setAiLoading(false);
    }
  }

  function applyAIToForm() {
    if (!aiResult?.structured_data) return;
    const sd = aiResult.structured_data as Record<string, unknown>;

    if (typeof sd.summary === "string" && sd.summary)
      setPersonal((p) => ({ ...p, summary: sd.summary as string }));

    if (Array.isArray(sd.skills) && (sd.skills as string[]).length > 0)
      setSkillsRaw((sd.skills as string[]).join(", "));

    if (Array.isArray(sd.experience)) {
      setWorkExp((prev) =>
        prev.map((w, i) => {
          const aiExp = (sd.experience as Array<{ bullets?: string[] }>)[i];
          if (!aiExp?.bullets?.length) return w;
          return { ...w, achievements: aiExp.bullets };
        })
      );
    }

    if (Array.isArray(sd.projects)) {
      setProjects((prev) =>
        prev.map((p, i) => {
          const ap = (sd.projects as Array<{ description?: string; impact?: string }>)[i];
          if (!ap) return p;
          const desc = [ap.description, ap.impact].filter(Boolean).join(" ") || p.description;
          return { ...p, description: desc };
        })
      );
    }

    setSaveMsg("AI applied — click Save to keep changes");
    setTimeout(() => setSaveMsg(""), 4000);
  }

  function shareScoreCard(atsScore: number, name: string) {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 420;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 800, 420);
    grad.addColorStop(0, "#4F46E5");
    grad.addColorStop(1, "#7C3AED");
    ctx.fillStyle = grad;
    ctx.roundRect(0, 0, 800, 420, 24);
    ctx.fill();

    // White card
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.roundRect(40, 40, 720, 340, 16);
    ctx.fill();

    // Score circle
    const cx = 200, cy = 210, r = 100;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 14;
    ctx.stroke();

    const scoreColor = atsScore >= 80 ? "#10B981" : atsScore >= 60 ? "#F59E0B" : "#EF4444";
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + (atsScore / 100) * Math.PI * 2);
    ctx.strokeStyle = scoreColor;
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 56px Arial";
    ctx.textAlign = "center";
    ctx.fillText(String(atsScore), cx, cy + 10);
    ctx.font = "18px Arial";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText("ATS Score", cx, cy + 38);

    // Text
    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px Arial";
    ctx.fillText(name || "My CV", 340, 160);

    ctx.font = "20px Arial";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    const verdict = atsScore >= 80 ? "Strong — Ready for top employers" : atsScore >= 60 ? "Average — Needs some improvements" : "Needs Work — High ATS rejection risk";
    ctx.fillText(verdict, 340, 200);

    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "16px Arial";
    ctx.fillText("Scored by AI CV Builder", 340, 250);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "bold 16px Arial";
    ctx.fillText("aicvbuilder.co.ke", 340, 275);

    // Download
    const a = document.createElement("a");
    a.download = `ATS-Score-${atsScore}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  }

  function updateWork(i: number, field: keyof WorkExperience, value: unknown) {
    setWorkExp((prev) => prev.map((w, idx) => idx === i ? { ...w, [field]: value } : w));
  }
  function updateEdu(i: number, field: keyof Education, value: string) {
    setEducation((prev) => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));
  }
  function updateProject(i: number, field: keyof Project, value: unknown) {
    setProjects((prev) => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!resume) {
    return <div className="p-8 text-gray-500">Resume not found.</div>;
  }

  const usedOps = usage?.calls_used ?? 0;
  const opLimit = usage?.calls_limit ?? null;
  const atLimit = !usage?.is_pro && opLimit !== null && usedOps >= opLimit;

  // ATS score circle
  const score = aiResult?.ats_score ?? 0;
  const circumference = 2 * Math.PI * 36;
  const dash = (score / 100) * circumference;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* ── Left: Editor ─────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 p-6 lg:p-8 overflow-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/app/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 text-xl font-bold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-200 focus:border-primary focus:outline-none transition-colors py-0.5"
          />
          <div className="flex items-center gap-2 shrink-0">
            {saveMsg && (
              <span className={`text-xs font-medium ${saveMsg === "Saved" ? "text-green-500" : "text-red-500"}`}>
                {saveMsg}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 flex-wrap mb-6 bg-gray-100 p-1 rounded-xl">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === tab
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          {/* Personal */}
          {activeTab === "Personal" && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <FInput label="Full Name" value={personal.name} onChange={(v) => setPersonal({ ...personal, name: v })} />
                <FInput label="Email" value={personal.email} onChange={(v) => setPersonal({ ...personal, email: v })} />
                <FInput label="Phone" value={personal.phone} onChange={(v) => setPersonal({ ...personal, phone: v })} />
                <FInput label="Location" value={personal.location} onChange={(v) => setPersonal({ ...personal, location: v })} />
                <FInput label="LinkedIn" value={personal.linkedin} onChange={(v) => setPersonal({ ...personal, linkedin: v })} />
                <FInput label="GitHub" value={personal.github} onChange={(v) => setPersonal({ ...personal, github: v })} />
                <FInput label="Website" value={personal.website} onChange={(v) => setPersonal({ ...personal, website: v })} />
              </div>
              <FTextArea label="Summary" value={personal.summary} onChange={(v) => setPersonal({ ...personal, summary: v })} rows={3} placeholder="Brief career summary..." />
            </div>
          )}

          {/* Experience */}
          {activeTab === "Experience" && (
            <div className="space-y-6">
              {workExp.map((w, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Position {i + 1}</span>
                    <button onClick={() => setWorkExp((p) => p.filter((_, idx) => idx !== i))}
                      className="text-xs text-red-400 hover:text-red-600">Remove</button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <FInput label="Company" value={w.company} onChange={(v) => updateWork(i, "company", v)} />
                    <FInput label="Position" value={w.position} onChange={(v) => updateWork(i, "position", v)} />
                    <FInput label="Start Date" value={w.start_date} onChange={(v) => updateWork(i, "start_date", v)} />
                    <FInput label="End Date" value={w.end_date ?? ""} onChange={(v) => updateWork(i, "end_date", v)} />
                  </div>
                  <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                    <input type="checkbox" checked={w.current} onChange={(e) => updateWork(i, "current", e.target.checked)} className="accent-primary" />
                    Current role
                  </label>
                  <FTextArea label="Description" value={w.description} onChange={(v) => updateWork(i, "description", v)} rows={3} />
                  <FTextArea label="Achievements (one per line)" value={w.achievements.join("\n")} onChange={(v) => updateWork(i, "achievements", v.split("\n"))} rows={3} />
                </div>
              ))}
              <button onClick={() => setWorkExp((p) => [...p, { company: "", position: "", start_date: "", end_date: "", current: false, description: "", achievements: [] }])}
                className="text-sm text-primary font-medium hover:underline">+ Add position</button>
            </div>
          )}

          {/* Education */}
          {activeTab === "Education" && (
            <div className="space-y-6">
              {education.map((e, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Degree {i + 1}</span>
                    <button onClick={() => setEducation((p) => p.filter((_, idx) => idx !== i))}
                      className="text-xs text-red-400 hover:text-red-600">Remove</button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <FInput label="Institution" value={e.institution} onChange={(v) => updateEdu(i, "institution", v)} />
                    <FInput label="Degree" value={e.degree} onChange={(v) => updateEdu(i, "degree", v)} />
                    <FInput label="Field of Study" value={e.field} onChange={(v) => updateEdu(i, "field", v)} />
                    <FInput label="GPA" value={e.gpa ?? ""} onChange={(v) => updateEdu(i, "gpa", v)} />
                    <FInput label="Start Date" value={e.start_date} onChange={(v) => updateEdu(i, "start_date", v)} />
                    <FInput label="End Date" value={e.end_date ?? ""} onChange={(v) => updateEdu(i, "end_date", v)} />
                  </div>
                </div>
              ))}
              <button onClick={() => setEducation((p) => [...p, { institution: "", degree: "", field: "", start_date: "", end_date: "", gpa: "" }])}
                className="text-sm text-primary font-medium hover:underline">+ Add degree</button>
            </div>
          )}

          {/* Skills */}
          {activeTab === "Skills" && (
            <div className="space-y-3">
              <FTextArea label="Skills (comma-separated)" value={skillsRaw} onChange={setSkillsRaw} rows={3} placeholder="Python, React, AWS, Docker..." />
              {skillsRaw && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {skillsRaw.split(",").map((s) => s.trim()).filter(Boolean).map((skill, i) => (
                    <span key={i} className="text-xs bg-indigo-50 text-primary px-2.5 py-1 rounded-full">{skill}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Projects */}
          {activeTab === "Projects" && (
            <div className="space-y-6">
              {projects.map((p, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Project {i + 1}</span>
                    <button onClick={() => setProjects((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-xs text-red-400 hover:text-red-600">Remove</button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <FInput label="Name" value={p.name} onChange={(v) => updateProject(i, "name", v)} />
                    <FInput label="URL" value={p.url ?? ""} onChange={(v) => updateProject(i, "url", v)} />
                  </div>
                  <FTextArea label="Description" value={p.description} onChange={(v) => updateProject(i, "description", v)} rows={2} />
                  <FInput label="Technologies (comma-separated)" value={Array.isArray(p.technologies) ? p.technologies.join(", ") : (p.technologies as string ?? "")} onChange={(v) => updateProject(i, "technologies", v)} />
                </div>
              ))}
              <button onClick={() => setProjects((p) => [...p, { name: "", description: "", technologies: [], url: "" }])}
                className="text-sm text-primary font-medium hover:underline">+ Add project</button>
            </div>
          )}

          {/* Job Description */}
          {activeTab === "Job Description" && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500">Paste the job posting to tailor your resume. The AI will match your experience to its exact keywords.</p>
              <FTextArea label="Job Description" value={jobDescription} onChange={setJobDescription} rows={12} placeholder="Paste the full job description here..." />
            </div>
          )}
        </div>
      </div>

      {/* ── Right: AI Panel ──────────────────────────────────────────────── */}
      <div className="w-full lg:w-96 shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100 bg-white p-6 flex flex-col gap-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-1">AI Tools</h2>
          {usage && (
            <p className="text-xs text-gray-400">
              {usage.is_pro
                ? "Unlimited operations (Pro)"
                : `${usedOps} / ${opLimit} free operations used this month`}
            </p>
          )}
        </div>

        {/* AI Action buttons */}
        <div className="space-y-2">
          {(["generate", "improve", "score"] as const).map((op) => {
            const labels = {
              generate: { icon: "✨", label: "Generate Resume", desc: "Create from scratch" },
              improve: { icon: "⚡", label: "Improve Resume", desc: "Strengthen language & keywords" },
              score: { icon: "📊", label: "Score Resume", desc: "Get ATS compatibility score" },
            }[op];
            return (
              <button
                key={op}
                onClick={() => runAI(op)}
                disabled={aiLoading || atLimit}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-primary hover:bg-indigo-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-left"
              >
                <span className="text-xl shrink-0">{labels.icon}</span>
                <div>
                  <div className="text-sm font-medium text-gray-900">{labels.label}</div>
                  <div className="text-xs text-gray-500">{labels.desc}</div>
                </div>
                {aiLoading && (
                  <div className="ml-auto w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                )}
              </button>
            );
          })}

          {/* Cover Letter */}
          <button
            onClick={() => setShowCL((v) => !v)}
            disabled={aiLoading || atLimit}
            className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-violet-400 hover:bg-violet-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-left"
          >
            <span className="text-xl shrink-0">✉️</span>
            <div>
              <div className="text-sm font-medium text-gray-900">Cover Letter</div>
              <div className="text-xs text-gray-500">AI-written cover letter</div>
            </div>
          </button>
          {showCL && (
            <div className="space-y-2 px-1">
              <input
                value={clJobTitle}
                onChange={(e) => setClJobTitle(e.target.value)}
                placeholder="Job title (optional)"
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
              <input
                value={clCompany}
                onChange={(e) => setClCompany(e.target.value)}
                placeholder="Company name (optional)"
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
              <button
                onClick={async () => {
                  setAiLoading(true);
                  setAiError("");
                  try {
                    await handleSave();
                    const result = await ai.coverLetter(id, clCompany, clJobTitle);
                    setCoverLetter(result.resume_text);
                    const usageData = await ai.usage();
                    setUsage(usageData);
                    setShowCL(false);
                  } catch (err) {
                    setAiError(err instanceof Error ? err.message : "Failed");
                  } finally {
                    setAiLoading(false);
                  }
                }}
                disabled={aiLoading}
                className="w-full bg-violet-600 text-white py-2 rounded-lg text-xs font-medium hover:bg-violet-700 transition-colors disabled:opacity-60"
              >
                {aiLoading ? "Generating…" : "Generate Cover Letter"}
              </button>
            </div>
          )}
        </div>

        {/* Template Picker */}
        <div>
          <h3 className="text-xs font-semibold text-gray-700 mb-2">Resume Template</h3>
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all text-xs font-medium gap-1 ${
                  template === t.id
                    ? "border-primary bg-indigo-50 text-primary"
                    : "border-gray-100 hover:border-gray-300 text-gray-500"
                }`}
              >
                <div className={`w-full h-10 rounded-lg ${t.preview}`} />
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Download PDF — always visible */}
        <button
          onClick={() => downloadPdf(id, title, template).catch((e) => alert(e.message))}
          className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF ({TEMPLATES.find((t) => t.id === template)?.name})
        </button>

        {atLimit && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
            Free limit reached. Upgrade to Pro for unlimited AI operations.
          </div>
        )}

        {aiError && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-600">
            {aiError}
          </div>
        )}

        {/* AI Result */}
        {aiResult && (
          <div className="space-y-4 border-t border-gray-100 pt-4">
            {/* ATS Score */}
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 88 88">
                  <circle cx="44" cy="44" r="36" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                  <circle
                    cx="44" cy="44" r="36" fill="none"
                    stroke={score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444"}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(score / 100) * circumference} ${circumference}`}
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-gray-900">{score}</span>
                  <span className="text-xs text-gray-400">ATS</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-0.5">
                  {score >= 80 ? "Strong" : score >= 60 ? "Average" : "Needs Work"}
                </div>
                <div className="text-xs text-gray-500">
                  {aiResult.operation.charAt(0).toUpperCase() + aiResult.operation.slice(1)} result
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(aiResult.created_at).toLocaleString()}
                </div>
                {/* Share Score Card */}
                <button
                  onClick={() => shareScoreCard(score, personal.name || title)}
                  className="mt-2 text-xs text-primary hover:underline flex items-center gap-1"
                >
                  📤 Share my score
                </button>
              </div>
            </div>

            {/* Keywords */}
            {aiResult.keywords_used.length > 0 && (
              <div>
                <div className="text-xs font-medium text-gray-600 mb-2">Keywords detected</div>
                <div className="flex flex-wrap gap-1">
                  {aiResult.keywords_used.slice(0, 12).map((kw, i) => (
                    <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{kw}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Improvements */}
            {aiResult.improvements.length > 0 && (
              <div>
                <div className="text-xs font-medium text-gray-600 mb-2">Improvements</div>
                <ul className="space-y-1.5">
                  {aiResult.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="text-amber-500 mt-0.5 shrink-0">→</span>
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Apply AI Changes */}
            <button
              onClick={applyAIToForm}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Apply AI Changes to Resume
            </button>

            {/* Resume Text */}
            {aiResult.resume_text && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-medium text-gray-600">Generated Resume</div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(aiResult.resume_text);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-xs text-primary hover:underline"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={aiResult.resume_text}
                  rows={8}
                  className="w-full text-xs text-gray-600 border border-gray-100 rounded-xl p-3 bg-gray-50 resize-none focus:outline-none"
                />
              </div>
            )}

          </div>
        )}

        {!aiResult && !aiLoading && !coverLetter && (
          <div className="text-center py-6 text-gray-400">
            <div className="text-3xl mb-2">🤖</div>
            <p className="text-xs">Run an AI operation to see your score and improvements</p>
          </div>
        )}

        {/* Cover Letter Result */}
        {coverLetter && (
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-violet-700 flex items-center gap-1.5">
                ✉️ Cover Letter
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(coverLetter);
                    setClCopied(true);
                    setTimeout(() => setClCopied(false), 2000);
                  }}
                  className="text-xs text-violet-600 hover:underline"
                >
                  {clCopied ? "Copied!" : "Copy"}
                </button>
                <button onClick={() => setCoverLetter("")} className="text-xs text-gray-400 hover:text-red-400">
                  Clear
                </button>
              </div>
            </div>
            <textarea
              readOnly
              value={coverLetter}
              rows={10}
              className="w-full text-xs text-gray-700 border border-violet-100 rounded-xl p-3 bg-violet-50 resize-none focus:outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function FInput({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
    </div>
  );
}

function FTextArea({ label, value, onChange, rows = 4, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none" />
    </div>
  );
}
