import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import {
  projects as staticProjects,
  blogPosts as staticPosts,
  profile as staticProfile,
  skills as staticSkills,
  certifications as staticCerts,
  education as staticEducation,
  Project,
  BlogPost,
  Profile,
  Skill,
  Certification,
  Education,
} from '@/lib/data';
import { apiUrl } from '@/utils/api';
import { useNotification } from '@/context/NotificationContext';

interface MutationResult<T> {
  ok: boolean;
  error?: string;
  value?: T;
}

interface PortfolioContextValue {
  projects: Project[];
  blogPosts: BlogPost[];
  profile: Profile;
  skills: Skill[];
  certifications: Certification[];
  education: Education[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addProject: (input: Partial<Project>) => Promise<MutationResult<Project>>;
  updateProject: (id: number, input: Partial<Project>) => Promise<MutationResult<Project>>;
  deleteProject: (id: number) => Promise<MutationResult<Project>>;
  addPost: (input: Partial<BlogPost>) => Promise<MutationResult<BlogPost>>;
  updatePost: (id: number, input: Partial<BlogPost>) => Promise<MutationResult<BlogPost>>;
  deletePost: (id: number) => Promise<MutationResult<BlogPost>>;
  updateProfile: (input: Partial<Profile>) => Promise<MutationResult<Profile>>;
}

const PortfolioContext = createContext<PortfolioContextValue | undefined>(undefined);

async function post<T>(path: string, body?: unknown, method = 'POST'): Promise<MutationResult<T>> {
  try {
    const resp = await fetch(apiUrl(path), {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      return { ok: false, error: data?.error || `Request failed (${resp.status})` };
    }
    return { ok: true, value: data.value ?? data };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Network error' };
  }
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const { notify, toast } = useNotification();
  const [projects, setProjects] = useState<Project[]>(staticProjects);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(staticPosts);
  const [profile, setProfile] = useState<Profile>(staticProfile);
  const [skills, setSkills] = useState<Skill[]>(staticSkills);
  const [certifications, setCertifications] = useState<Certification[]>(staticCerts);
  const [education, setEducation] = useState<Education[]>(staticEducation);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const resp = await fetch(apiUrl('/content'), {
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (!resp.ok) throw new Error(`Status ${resp.status}`);
      const data = await resp.json();
      if (Array.isArray(data.projects)) setProjects(data.projects);
      if (Array.isArray(data.blogPosts)) setBlogPosts(data.blogPosts);
      if (data.profile) setProfile(data.profile);
      if (Array.isArray(data.skills)) setSkills(data.skills);
      if (Array.isArray(data.certifications)) setCertifications(data.certifications);
      if (Array.isArray(data.education)) setEducation(data.education);
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Could not reach the content API. Showing local data.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    refresh();
    const onChanged = () => refresh();
    window.addEventListener('portfolio:changed', onChanged);
    return () => window.removeEventListener('portfolio:changed', onChanged);
  }, [refresh]);

  const announce = (message: string) => {
    window.dispatchEvent(new CustomEvent('portfolio:changed'));
    toast('success', message);
  };

  const addProject = useCallback(
    async (input: Partial<Project>) => {
      const res = await post<Project>('/content/projects', input);
      if (!res.ok) {
        notify('error', 'Could not add project', res.error);
        return res;
      }
      announce(`Project "${res.value?.title}" added.`);
      return res;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [notify, toast],
  );

  const updateProject = useCallback(
    async (id: number, input: Partial<Project>) => {
      const res = await post<Project>(`/content/projects/${id}`, input, 'PATCH');
      if (!res.ok) {
        notify('error', 'Could not update project', res.error);
        return res;
      }
      announce(`Project "${res.value?.title ?? id}" updated.`);
      return res;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [notify, toast],
  );

  const deleteProject = useCallback(
    async (id: number) => {
      const res = await post<Project>(`/content/projects/${id}`, undefined, 'DELETE');
      if (!res.ok) {
        notify('error', 'Could not delete project', res.error);
        return res;
      }
      announce('Project deleted.');
      return res;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [notify, toast],
  );

  const addPost = useCallback(
    async (input: Partial<BlogPost>) => {
      const res = await post<BlogPost>('/content/blogs', input);
      if (!res.ok) {
        notify('error', 'Could not create blog post', res.error);
        return res;
      }
      announce(`Blog post "${res.value?.title}" created.`);
      return res;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [notify, toast],
  );

  const updatePost = useCallback(
    async (id: number, input: Partial<BlogPost>) => {
      const res = await post<BlogPost>(`/content/blogs/${id}`, input, 'PATCH');
      if (!res.ok) {
        notify('error', 'Could not update blog post', res.error);
        return res;
      }
      announce(`Blog post "${res.value?.title ?? id}" updated.`);
      return res;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [notify, toast],
  );

  const deletePost = useCallback(
    async (id: number) => {
      const res = await post<BlogPost>(`/content/blogs/${id}`, undefined, 'DELETE');
      if (!res.ok) {
        notify('error', 'Could not delete blog post', res.error);
        return res;
      }
      announce('Blog post deleted.');
      return res;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [notify, toast],
  );

  const updateProfile = useCallback(
    async (input: Partial<Profile>) => {
      const res = await post<Profile>('/content/profile', input, 'PATCH');
      if (!res.ok) {
        notify('error', 'Could not update profile', res.error);
        return res;
      }
      announce('Profile updated.');
      return res;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [notify, toast],
  );

  const value = useMemo<PortfolioContextValue>(
    () => ({
      projects,
      blogPosts,
      profile,
      skills,
      certifications,
      education,
      loading,
      error,
      refresh,
      addProject,
      updateProject,
      deleteProject,
      addPost,
      updatePost,
      deletePost,
      updateProfile,
    }),
    [projects, blogPosts, profile, skills, certifications, education, loading, error, refresh, addProject, updateProject, deleteProject, addPost, updatePost, deletePost, updateProfile],
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio(): PortfolioContextValue {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a <PortfolioProvider>');
  }
  return context;
}