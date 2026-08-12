/**
 * /api/contact/assist — AI helper for the contact form.
 * Drafts professional messages + classifies intent/priority and flags spam,
 * so the owner can triage inbound leads (and keep the inbox spam-free).
 */
import { Router } from 'express';
import { completeJson, isAiAvailable } from '../lib/aiClient.ts';
import { CONTACT_ASSIST_SYSTEM } from '../lib/prompts.ts';
import { profile } from '../lib/portfolio.ts';
import { sanitizeText } from '../lib/security.ts';

const router = Router();

type Intent = 'hiring' | 'project' | 'collaboration' | 'question' | 'general';
type Priority = 'high' | 'medium' | 'low';

interface AssistResult {
  intent: Intent;
  priority: Priority;
  isSpam: boolean;
  confidence: number;
  suggestedSubject: string;
  draftedMessage: string;
}

const INTENT_KEYWORDS: [Intent, string[]][] = [
  ['hiring', ['hiring', 'position', 'role', 'job', 'vacancy', 'recruit', 'interview', 'offer']],
  ['project', ['project', 'build', 'develop', 'website', 'web app', 'landing page', 'dashboard', 'api', 'application']],
  ['collaboration', ['collab', 'partnership', 'freelance', 'team up', 'work together', 'contract']],
  ['question', ['question', 'how', 'what', 'advice', 'help', 'guidance', 'can you', 'tell me', 'curious']],
];

const SPAM_SIGNALS = [/(http|https|www\.)\S+/i, /(free offer|guaranteed|$$|winner|lottery|bitcoin)/i, /!{3,}/, /[A-Z0-9._%+-]+@\w+\.(xyz|top|loan|click|icu)/i];

function heuristicAssist(input: { name?: string; subject?: string; message?: string; purpose?: string }): AssistResult {
  const message = `${input.message || ''} ${input.purpose || ''} ${input.subject || ''}`.toLowerCase();
  const hasMessage = Boolean((input.message || '').trim());

  let intent: Intent = 'general';
  let best = 0;
  for (const [candidate, keywords] of INTENT_KEYWORDS) {
    const hits = keywords.filter((k) => message.includes(k)).length;
    if (hits > best) {
      best = hits;
      intent = candidate;
    }
  }

  const isSpam = hasMessage && SPAM_SIGNALS.some((re) => re.test(input.message || ''));

  const priority: Priority =
    isSpam ? 'low' : intent === 'hiring' ? 'high' : intent === 'project' ? 'high' : intent === 'collaboration' ? 'medium' : 'low';

  const name = (input.name || '').trim() || 'there';

  const drafts: Record<Intent, string> = {
    hiring: `Hi Madiha,\n\nI came across your portfolio and I'd love to discuss an opportunity. I believe your experience in ${input.subject || 'frontend development'} could be a great fit for what we're looking for. Could we set up a time to talk?\n\nBest regards,\n${name}`,
    project: `Hi Madiha,\n\nI have a project I'd like to discuss with you. I'm looking for someone with your frontend / AI skills to bring the idea to life. Could you let me know your availability and rough timeline?\n\nLooking forward to hearing from you,\n${name}`,
    collaboration: `Hi Madiha,\n\nI really like the work in your portfolio and I think there's a great opportunity to collaborate. Let me know if you'd be open to a quick chat about it.\n\nBest,\n${name}`,
    question: `Hi Madiha,\n\nI have a quick question I hope you can help with. Looking forward to your reply.\n\nThanks,\n${name}`,
    general: `Hi Madiha,\n\nI came across your portfolio and wanted to reach out. Looking forward to connecting.\n\nBest regards,\n${name}`,
  };

  return {
    intent,
    priority,
    isSpam,
    confidence: isSpam ? 0.8 : 0.65,
    suggestedSubject: intent === 'hiring' ? `Opportunity for a Frontend Developer` : `Project inquiry about ${input.subject || 'a new idea'}`,
    draftedMessage: hasMessage ? (input.message || '').trim() : drafts[intent],
  };
}

router.post('/assist', async (req, res) => {
  try {
    const body = req.body || {};
    const name = sanitizeText(body.name, 120);
    const email = sanitizeText(body.email, 200);
    const subject = sanitizeText(body.subject, 200);
    const message = sanitizeText(body.message, 4000);
    const purpose = sanitizeText(body.purpose, 400);

    if (!message && !purpose && !subject) {
      return res.status(400).json({ error: 'Provide a message, purpose or subject to assist with.' });
    }

    const aiEnabled = isAiAvailable();
    let result: AssistResult | null = null;

    if (aiEnabled && (message.length > 15 || purpose.length > 0)) {
      const parsed = await completeJson<Partial<AssistResult>>(
        CONTACT_ASSIST_SYSTEM,
        `Portfolio owner: ${profile.name} (${profile.role})\nVisitor name: ${name}\nVisitor email: ${email}\nSubject: ${subject || '(none)'}\nMessage: ${message || '(none)'}\nStated purpose: ${purpose || '(none)'}`,
        { temperature: 0.2, maxTokens: 600 }
      );
      if (parsed) {
        const validIntents: Intent[] = ['hiring', 'project', 'collaboration', 'question', 'general'];
        const validPriorities: Priority[] = ['high', 'medium', 'low'];
        result = {
          intent: validIntents.includes(parsed.intent as Intent) ? (parsed.intent as Intent) : 'general',
          priority: validPriorities.includes(parsed.priority as Priority) ? (parsed.priority as Priority) : 'low',
          isSpam: Boolean(parsed.isSpam),
          confidence: Math.max(0, Math.min(1, typeof parsed.confidence === 'number' ? parsed.confidence : 0.8)),
          suggestedSubject: typeof parsed.suggestedSubject === 'string' ? parsed.suggestedSubject : '',
          draftedMessage: typeof parsed.draftedMessage === 'string' ? parsed.draftedMessage : '',
        };
      }
    }

    const fallback = heuristicAssist({ name, subject, message, purpose });
    const final = result ?? fallback;

    return res.json({
      ...final,
      aiEnabled,
      // If AI drafted a message but the user already wrote one, keep theirs.
      draftedMessage: (message.trim() && !result) ? fallback.draftedMessage : final.draftedMessage,
    });
  } catch (err) {
    console.error('[contact/assist] failed:', err);
    return res.status(500).json({ error: 'Failed to generate contact assistance' });
  }
});

export default router;
