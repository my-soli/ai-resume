"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { resumes, type ResumePayload, type WorkExperience, type Education, type Project } from "@/lib/api";

const EMPTY_WORK: WorkExperience = {
  company: "", position: "", start_date: "", end_date: "", current: false,
  description: "", achievements: [],
};
const EMPTY_EDU: Education = {
  institution: "", degree: "", field: "", start_date: "", end_date: "", gpa: "",
};
const EMPTY_PROJECT: Project = {
  name: "", description: "", technologies: [], url: "",
};

const STEPS = ["Personal Info", "Experience", "Education", "Skills & Projects", "Job Description"];

export default function NewResumePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [personalInfo, setPersonalInfo] = useState({
    name: "", email: "", phone: "", location: "",
    linkedin: "", github: "", website: "", summary: "",
  });
  const [workExp, setWorkExp] = useState<WorkExperience[]>([{ ...EMPTY_WORK }]);
  const [education, setEducation] = useState<Education[]>([{ ...EMPTY_EDU }]);
  const [skillsRaw, setSkillsRaw] = useState("");
  const [projects, setProjects] = useState<Project[]>([{ ...EMPTY_PROJECT }]);
  const [jobDescription, setJobDescription] = useState("");

  function updateWork(i: number, field: keyof WorkExperience, value: unknown) {
    setWorkExp((prev) => prev.map((w, idx) => idx === i ? { ...w, [field]: value } : w));
  }
  function updateEdu(i: number, field: keyof Education, value: string) {
    setEducation((prev) => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));
  }
  function updateProject(i: number, field: keyof Project, value: unknown) {
    setProjects((prev) => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p));
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const parsed = await resumes.parseUpload(file);
      if (parsed.title) setTitle(parsed.title);
      if (parsed.personal_info) {
        const pi = parsed.personal_info as Record<string, string>;
        setPersonalInfo({
          name: pi.name ?? "", email: pi.email ?? "", phone: pi.phone ?? "",
          location: pi.location ?? "", linkedin: pi.linkedin ?? "",
          github: pi.github ?? "", website: pi.website ?? "", summary: pi.summary ?? "",
        });
      }
      if (Array.isArray(parsed.work_experience) && parsed.work_experience.length > 0)
        setWorkExp(parsed.work_experience as WorkExperience[]);
      if (Array.isArray(parsed.education) && parsed.education.length > 0)
        setEducation(parsed.education as Education[]);
      if (Array.isArray(parsed.skills) && parsed.skills.length > 0)
        setSkillsRaw((parsed.skills as string[]).join(", "));
      if (Array.isArray(parsed.projects) && parsed.projects.length > 0)
        setProjects(parsed.projects as Project[]);
      if (parsed.job_description) setJobDescription(parsed.job_description);
      // Jump straight to review step
      setStep(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleSubmit() {
    setSaving(true);
    setError("");
    try {
      const payload: ResumePayload = {
        title: title || "My Resume",
        personal_info: personalInfo,
        work_experience: workExp.filter((w) => w.company || w.position),
        education: education.filter((e) => e.institution || e.degree),
        skills: skillsRaw.split(",").map((s) => s.trim()).filter(Boolean),
        projects: projects.filter((p) => p.name).map((p) => ({
          ...p,
          technologies: typeof p.technologies === "string"
            ? (p.technologies as string).split(",").map((t: string) => t.trim()).filter(Boolean)
            : p.technologies,
        })),
        job_description: jobDescription || undefined,
      };
      const resume = await resumes.create(payload);
      router.push(`/app/dashboard/${resume.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create resume");
      setSaving(false);
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/app/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Resume</h1>
          <p className="text-sm text-gray-500">Step {step + 1} of {STEPS.length}</p>
        </div>
      </div>

      {/* Upload existing CV */}
      <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">Have an existing CV?</p>
          <p className="text-xs text-gray-500 mt-0.5">Upload a PDF or DOCX and we&apos;ll fill in all the fields automatically.</p>
        </div>
        <label className={`shrink-0 cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${uploading ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-primary text-white hover:bg-indigo-700"}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          {uploading ? "Parsing…" : "Upload CV"}
          <input ref={fileRef} type="file" accept=".pdf,.docx,.doc" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {/* Progress */}
      <div className="flex gap-1 mb-8">
        {STEPS.map((s, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-primary" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">{STEPS[step]}</h2>

        {/* Step 0: Personal Info */}
        {step === 0 && (
          <div className="space-y-4">
            <Input label="Resume Title" value={title} onChange={setTitle} placeholder="e.g. Software Engineer @ Google" />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Full Name *" value={personalInfo.name} onChange={(v) => setPersonalInfo({ ...personalInfo, name: v })} placeholder="Jane Smith" />
              <Input label="Email *" value={personalInfo.email} onChange={(v) => setPersonalInfo({ ...personalInfo, email: v })} placeholder="jane@example.com" />
              <Input label="Phone *" value={personalInfo.phone} onChange={(v) => setPersonalInfo({ ...personalInfo, phone: v })} placeholder="+1 555 000 0000" />
              <Input label="Location *" value={personalInfo.location} onChange={(v) => setPersonalInfo({ ...personalInfo, location: v })} placeholder="San Francisco, CA" />
              <Input label="LinkedIn" value={personalInfo.linkedin ?? ""} onChange={(v) => setPersonalInfo({ ...personalInfo, linkedin: v })} placeholder="linkedin.com/in/jane" />
              <Input label="GitHub" value={personalInfo.github ?? ""} onChange={(v) => setPersonalInfo({ ...personalInfo, github: v })} placeholder="github.com/jane" />
            </div>
            <TextArea label="Professional Summary (optional)" value={personalInfo.summary ?? ""} onChange={(v) => setPersonalInfo({ ...personalInfo, summary: v })} placeholder="Brief 2-3 sentence summary of your career..." rows={3} />
          </div>
        )}

        {/* Step 1: Work Experience */}
        {step === 1 && (
          <div className="space-y-6">
            {workExp.map((w, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Experience {i + 1}</span>
                  {workExp.length > 1 && (
                    <button onClick={() => setWorkExp((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-xs text-red-400 hover:text-red-600">Remove</button>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input label="Company" value={w.company} onChange={(v) => updateWork(i, "company", v)} placeholder="Acme Inc." />
                  <Input label="Position" value={w.position} onChange={(v) => updateWork(i, "position", v)} placeholder="Software Engineer" />
                  <Input label="Start Date" value={w.start_date} onChange={(v) => updateWork(i, "start_date", v)} placeholder="Jan 2022" />
                  <Input label="End Date" value={w.end_date ?? ""} onChange={(v) => updateWork(i, "end_date", v)} placeholder="Present" />
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={w.current} onChange={(e) => updateWork(i, "current", e.target.checked)} className="accent-primary" />
                  I currently work here
                </label>
                <TextArea label="Description" value={w.description} onChange={(v) => updateWork(i, "description", v)} placeholder="Describe your role and responsibilities..." rows={3} />
                <TextArea label="Key Achievements (one per line)" value={w.achievements.join("\n")} onChange={(v) => updateWork(i, "achievements", v.split("\n").filter(Boolean))} placeholder="Increased revenue by 20%&#10;Led team of 5 engineers" rows={3} />
              </div>
            ))}
            <button onClick={() => setWorkExp((prev) => [...prev, { ...EMPTY_WORK }])}
              className="text-sm text-primary font-medium hover:underline">
              + Add another position
            </button>
          </div>
        )}

        {/* Step 2: Education */}
        {step === 2 && (
          <div className="space-y-6">
            {education.map((e, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Education {i + 1}</span>
                  {education.length > 1 && (
                    <button onClick={() => setEducation((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-xs text-red-400 hover:text-red-600">Remove</button>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input label="Institution" value={e.institution} onChange={(v) => updateEdu(i, "institution", v)} placeholder="MIT" />
                  <Input label="Degree" value={e.degree} onChange={(v) => updateEdu(i, "degree", v)} placeholder="Bachelor of Science" />
                  <Input label="Field of Study" value={e.field} onChange={(v) => updateEdu(i, "field", v)} placeholder="Computer Science" />
                  <Input label="GPA (optional)" value={e.gpa ?? ""} onChange={(v) => updateEdu(i, "gpa", v)} placeholder="3.8/4.0" />
                  <Input label="Start Date" value={e.start_date} onChange={(v) => updateEdu(i, "start_date", v)} placeholder="Sep 2018" />
                  <Input label="End Date" value={e.end_date ?? ""} onChange={(v) => updateEdu(i, "end_date", v)} placeholder="May 2022" />
                </div>
              </div>
            ))}
            <button onClick={() => setEducation((prev) => [...prev, { ...EMPTY_EDU }])}
              className="text-sm text-primary font-medium hover:underline">
              + Add another degree
            </button>
          </div>
        )}

        {/* Step 3: Skills & Projects */}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <TextArea label="Skills (comma-separated)" value={skillsRaw} onChange={setSkillsRaw}
                placeholder="Python, React, TypeScript, AWS, Docker, SQL..." rows={3} />
              {skillsRaw && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {skillsRaw.split(",").map((s) => s.trim()).filter(Boolean).map((skill, i) => (
                    <span key={i} className="text-xs bg-indigo-50 text-primary px-2.5 py-1 rounded-full">{skill}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Projects (optional)</h3>
              {projects.map((p, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Project {i + 1}</span>
                    {projects.length > 1 && (
                      <button onClick={() => setProjects((prev) => prev.filter((_, idx) => idx !== i))}
                        className="text-xs text-red-400 hover:text-red-600">Remove</button>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input label="Name" value={p.name} onChange={(v) => updateProject(i, "name", v)} placeholder="Resume AI" />
                    <Input label="URL (optional)" value={p.url ?? ""} onChange={(v) => updateProject(i, "url", v)} placeholder="github.com/..." />
                  </div>
                  <TextArea label="Description" value={p.description} onChange={(v) => updateProject(i, "description", v)} placeholder="What it does and its impact..." rows={2} />
                  <Input label="Technologies (comma-separated)" value={Array.isArray(p.technologies) ? p.technologies.join(", ") : (p.technologies as string)} onChange={(v) => updateProject(i, "technologies", v)} placeholder="React, FastAPI, PostgreSQL" />
                </div>
              ))}
              <button onClick={() => setProjects((prev) => [...prev, { ...EMPTY_PROJECT }])}
                className="text-sm text-primary font-medium hover:underline">
                + Add project
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Job Description */}
        {step === 4 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Paste the job description for the role you&apos;re targeting. The AI will tailor your resume to match its exact keywords and requirements.
            </p>
            <TextArea label="Job Description (optional)" value={jobDescription} onChange={setJobDescription}
              placeholder="Paste the full job posting here..." rows={12} />
          </div>
        )}

        {error && (
          <p className="mt-4 text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Creating…" : "Create Resume →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 4 }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
      />
    </div>
  );
}
