/**
 * /api/job-match — "Am I a fit for this job?" analyzer.
 * Takes a job description and returns a compatibility score, matched /
 * missing skills, strengths, suggestions and a cover-letter opening.
 * Falls back to deterministic keyword analysis when the LLM is unavailable.
 */
import { Router } from 'express';
import { completeJson, isAiAvailable } from '../lib/aiClient.ts';
import { JOB_MATCH_SYSTEM } from '../lib/prompts.ts';
import { skills, profileToText, profile } from '../lib/portfolio.ts';
import { sanitizeText } from '../lib/security.ts';

const router = Router();

const ROLE_SIGNALS: { role: string; keywords: string[] }[] = [
  { role: 'Frontend Developer', keywords: ['frontend', 'front-end', 'react', 'typescript', 'javascript', 'ui', 'css', 'tailwind'] },
  { role: 'React / Next.js Developer', keywords: ['react', 'next.js', 'nextjs'] },
  { role: 'Full-Stack Developer', keywords: ['fullstack', 'full-stack', 'full stack', 'node', 'api', 'backend', 'firebase'] },
  { role: 'AI / GenAI Engineer', keywords: ['ai', 'generative', 'chatbot', 'openai', 'llm', 'prompt', 'machine learning'] },
  { role: 'UI / UX Designer', keywords: ['ui', 'ux', 'figma', 'design', 'prototype'] },
];

interface KeywordMatch {
  matchedSkills: { skill: string; confidence: number }[];
  missingSkills: string[];
  score: number;
  roleGuess: string | null;
  summary: string;
  strengths: string[];
  suggestions: string[];
  coverLetter: string;
}

function keywordMatch(jobDescription: string): KeywordMatch {
  const jd = jobDescription.toLowerCase();
  const matchedSkills: { skill: string; confidence: number }[] = [];
  const missingSkills: string[] = [];

  for (const skill of skills) {
    if (jd.includes(skill.name.toLowerCase())) {
      matchedSkills.push({ skill: skill.name, confidence: skill.level / 100 });
    } else if (['React', 'Node.js', 'TypeScript', 'Python', 'Firebase', 'Next.js', 'Tailwind CSS'].includes(skill.name)) {
      // Only flag the "expected" stack as missing when the JD talks about web dev.
      missingSkills.push(skill.name);
    }
  }

  const avgLevel = matchedSkills.length
    ? matchedSkills.reduce((s, m) => s + m.confidence, 0) / matchedSkills.length
    : 0;
  const coverage = matchedSkills.length / skills.length;
  const score = Math.round(Math.min(98, 45 * coverage + 55 * avgLevel));

  const roleGuess = ROLE_SIGNALS.find((r) => r.keywords.some((k) => jd.includes(k)))?.role || null;

  const strengths = matchedSkills.slice(0, 5).map((m) => `Strong ${m.skill} experience (${Math.round(m.confidence * 100)}% proficiency).`);
  const suggestions = missingSkills.slice(0, 3).map((s) => `Highlight work that demonstrates ${s}.`);
  if (suggestions.length === 0) suggestions.push('Include concrete metrics / impact from your projects.');

  return {
    matchedSkills,
    missingSkills: missingSkills.slice(0, 8),
    score,
    roleGuess,
    summary: `The profile covers ${matchedSkills.length} of the skill areas mentioned in the job description.`,
    strengths,
    suggestions,
    coverLetter: `Dear Hiring Team,\n\nI was excited to see the opening for ${roleGuess || 'this role'}. As a frontend developer with ${matchedSkills.length} of the core skills in your description${matchedSkills[0] ? ` — including ${matchedSkills[0].skill}` : ''} — I would love to discuss how I can contribute.`,
  };
}

router.post('/', async (req, res) => {
  try {
    const jobDescription = sanitizeText(req.body?.jobDescription, 6000);
    if (!jobDescription) {
      return res.status(400).json({ error: 'jobDescription is required' });
    }

    const aiEnabled = isAiAvailable();
    let result: KeywordMatch | null = null;

    if (aiEnabled) {
      const parsed = await completeJson<Partial<KeywordMatch>>(
        JOB_MATCH_SYSTEM,
        `DEVELOPER PROFILE:\n${profileToText()}\n\nJOB DESCRIPTION:\n${jobDescription}`,
        { temperature: 0.2, maxTokens: 1000 }
      );

      if (parsed && typeof parsed.score === 'number') {
        result = {
          matchedSkills: Array.isArray(parsed.matchedSkills) ? parsed.matchedSkills : [],
          missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [],
          score: Math.max(0, Math.min(100, Math.round(parsed.score))),
          roleGuess: typeof parsed.roleGuess === 'string' ? parsed.roleGuess : null,
          summary: typeof parsed.summary === 'string' ? parsed.summary : '',
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
          suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
          coverLetter: typeof parsed.coverLetter === 'string' ? parsed.coverLetter : '',
        };
      }
    }

    const fallback = !result || result.score === 0 ? keywordMatch(jobDescription) : result;

    return res.json({
      ...fallback,
      candidate: profile.name,
      aiEnabled,
      confidence: aiEnabled ? 0.92 : 0.7,
      analyzedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[job-match] failed:', err);
    const jobDescription = sanitizeText(req.body?.jobDescription, 6000);
    return res.json({
      ...keywordMatch(jobDescription),
      candidate: profile.name,
      aiEnabled: false,
      confidence: 0.7,
      degraded: true,
    });
  }
});

export default router;
