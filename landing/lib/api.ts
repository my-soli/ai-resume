const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function req<T>(
  path: string,
  opts: { method?: string; body?: unknown } = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const res = await fetch(`${BASE}/api/v1${path}`, {
    method: opts.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(opts.body !== undefined ? { body: JSON.stringify(opts.body) } : {}),
  });
  if (res.status === 204) return null as T;
  const text = await res.text();
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Server error ${res.status} — is the backend running?`);
  }
  if (!res.ok) throw new Error((data.detail as string) ?? `Error ${res.status}`);
  return data as T;
}

// ── Types ──────────────────────────────────────────────────────────────────

export type AuthTokens = { access_token: string; refresh_token: string };

export type User = {
  id: string;
  email: string;
  full_name: string;
  is_pro: boolean;
};

export type PersonalInfo = {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary?: string;
};

export type WorkExperience = {
  company: string;
  position: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description: string;
  achievements: string[];
};

export type Education = {
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date?: string;
  gpa?: string;
};

export type Project = {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
};

export type ResumePayload = {
  title: string;
  personal_info: PersonalInfo;
  work_experience: WorkExperience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  job_description?: string;
};

export type Resume = ResumePayload & {
  id: string;
  user_id: string;
  pdf_url?: string;
  created_at: string;
  updated_at: string;
};

export type AIResult = {
  id: string;
  resume_id: string;
  operation: string;
  resume_text: string;
  ats_score: number;
  improvements: string[];
  keywords_used: string[];
  structured_data: Record<string, unknown>;
  created_at: string;
};

export type Usage = {
  is_pro: boolean;
  calls_used: number;
  calls_limit: number | null;
};

// ── Auth ───────────────────────────────────────────────────────────────────

export const auth = {
  register: (full_name: string, email: string, password: string) =>
    req<AuthTokens>("/auth/register", {
      method: "POST",
      body: { full_name, email, password },
    }),

  login: (email: string, password: string) =>
    req<AuthTokens>("/auth/login", {
      method: "POST",
      body: { email, password },
    }),
};

// ── Users ──────────────────────────────────────────────────────────────────

export const users = {
  me: () => req<User>("/users/me"),
};

// ── Resumes ────────────────────────────────────────────────────────────────

export const resumes = {
  list: () => req<Resume[]>("/resumes"),
  get: (id: string) => req<Resume>(`/resumes/${id}`),
  create: (data: ResumePayload) =>
    req<Resume>("/resumes", { method: "POST", body: data }),
  update: (id: string, data: Partial<ResumePayload>) =>
    req<Resume>(`/resumes/${id}`, { method: "PATCH", body: data }),
  delete: (id: string) => req<null>(`/resumes/${id}`, { method: "DELETE" }),

  parseUpload: async (file: File): Promise<ResumePayload & { title: string }> => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${BASE}/api/v1/resumes/upload-parse`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    const text = await res.text();
    let data: Record<string, unknown>;
    try { data = JSON.parse(text); }
    catch { throw new Error(`Server error ${res.status} — is the backend running?`); }
    if (!res.ok) throw new Error((data.detail as string) ?? `Error ${res.status}`);
    return data as ResumePayload & { title: string };
  },
};

export async function downloadPdf(resumeId: string, title: string, template = "modern") {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const res = await fetch(`${BASE}/api/v1/resumes/${resumeId}/download?template=${template}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Download failed");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/\s+/g, "_")}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── AI ─────────────────────────────────────────────────────────────────────

export const ai = {
  generate: (resume_id: string) =>
    req<AIResult>("/ai/generate", { method: "POST", body: { resume_id } }),
  improve: (resume_id: string) =>
    req<AIResult>("/ai/improve", { method: "POST", body: { resume_id } }),
  score: (resume_id: string) =>
    req<AIResult>("/ai/score", { method: "POST", body: { resume_id } }),
  usage: () => req<Usage>("/ai/usage"),
  latestResult: (resume_id: string) =>
    req<AIResult | null>(`/ai/results/${resume_id}/latest`),
};
