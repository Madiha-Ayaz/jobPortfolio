import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  Cpu,
  FileText,
  Award,
  GraduationCap,
  Bot,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  LayoutDashboard,
  ArrowRight,
  Database,
  MessageSquare,
  Users,
  MousePointerClick,
} from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { useTheme } from '@/context/ThemeContext';
import StatCard from '@/components/dashboard/StatCard';
import { DonutChart, BarChart, SkillBars } from '@/components/dashboard/Charts';
import { apiUrl } from '@/utils/api';

const CATEGORY_COLORS: Record<string, string> = {
  frontend: 'var(--brand)',
  backend: 'var(--accent)',
  ai: 'var(--highlight)',
  design: 'var(--success)',
  tools: 'var(--warning)',
};

const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  ai: 'AI',
  design: 'Design',
  tools: 'Tools',
};

interface HealthInfo {
  hasKey: boolean;
  aiAvailable: boolean;
  provider: string | null;
  model: string | null;
}

interface DbSummary {
  available: boolean;
  sessions?: number;
  pageViews?: number;
  projectViews?: number;
  chats?: number;
  contacts?: number;
  finders?: number;
  users?: number;
}

const hasLiveUrl = (url: string) => Boolean(url) && url !== '#' && url !== '/' && !/^\s*$/.test(url);

const Dashboard = () => {
  const { projects, blogPosts, skills, certifications, education, loading } = usePortfolio();
  const { t } = useTheme();
  const [health, setHealth] = useState<HealthInfo | null>(null);
  const [db, setDb] = useState<DbSummary | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch(apiUrl('/health'))
      .then((r) => r.json())
      .then((d) => {
        if (!mounted) return;
        setHealth({
          hasKey: Boolean(d?.hasKey),
          aiAvailable: Boolean(d?.aiAvailable),
          provider: d?.provider ?? null,
          model: d?.model ?? null,
        });
        if (d?.database) setDb({ available: Boolean(d.database.available) });
      })
      .catch(() => {
        if (mounted) {
          setHealth({ hasKey: false, aiAvailable: false, provider: null, model: null });
        }
      });
    fetch(apiUrl('/admin/summary'))
      .then((r) => r.json())
      .then((d: DbSummary) => {
        if (mounted) setDb(d);
      })
      .catch(() => {
        /* non-fatal */
      });
    return () => {
      mounted = false;
    };
  }, []);

  const skillCategoryData = useMemo(
    () =>
      Object.entries(CATEGORY_COLORS).map(([cat, color]) => ({
        label: CATEGORY_LABELS[cat],
        value: skills.filter((s) => s.category === cat).length,
        color,
      })),
    [skills],
  );

  const tagFrequency = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of projects) {
      for (const tag of p.tags || []) {
        map.set(tag, (map.get(tag) || 0) + 1);
      }
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([label, value], i) => ({
        label,
        value,
        color: i % 2 === 0 ? 'var(--brand)' : 'var(--accent)',
      }));
  }, [projects]);

  const topSkills = useMemo(
    () =>
      [...skills]
        .sort((a, b) => b.level - a.level)
        .slice(0, 8)
        .map((s, i) => ({
          label: s.name,
          value: s.level,
          color: i % 3 === 0 ? 'var(--brand)' : i % 3 === 1 ? 'var(--accent)' : 'var(--highlight)',
        })),
    [skills],
  );

  const liveProjects = projects.filter((p) => hasLiveUrl(p.liveUrl));
  const pctLive = projects.length ? Math.round((liveProjects.length / projects.length) * 100) : 0;
  const projectsWithDescription = projects.filter((p) => p.description && p.description.trim().length > 20).length;
  const pctDescribed = projects.length ? Math.round((projectsWithDescription / projects.length) * 100) : 0;

  const healthIssues = useMemo(
    () => [
      {
        icon: AlertTriangle,
        label: t('dash.issueUrl'),
        count: projects.length - liveProjects.length,
        fix: '/projects',
      },
      {
        icon: FileText,
        label: t('dash.issueDesc'),
        count: projects.length - projectsWithDescription,
        fix: '/projects',
      },
      {
        icon: AlertTriangle,
        label: t('dash.issueTags'),
        count: projects.filter((p) => !p.tags || p.tags.length === 0).length,
        fix: '/projects',
      },
      {
        icon: FileText,
        label: t('dash.issueCover'),
        count: blogPosts.filter((p) => !p.imageUrl || /^\s*$/.test(p.imageUrl)).length,
        fix: '/blog',
      },
    ],
    [projects, blogPosts, liveProjects, projectsWithDescription, t],
  );

  const openIssues = healthIssues.reduce((sum, h) => sum + h.count, 0);
  const healthScore = Math.max(0, 100 - openIssues * 15 - (health && !health.aiAvailable ? 10 : 0));

  return (
    <div className="min-h-screen" style={{ color: 'var(--text-body)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="badge inline-flex items-center gap-1" style={{ color: 'var(--brand-light)', borderColor: 'color-mix(in srgb, var(--brand) 40%, transparent)' }}>
              <LayoutDashboard size={12} />
              {t('dash.badge')}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black" style={{ color: 'var(--text-heading)' }}>
            Portfolio <span className="text-gradient">{t('dash.analytics')}</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm" style={{ color: 'var(--text-muted)' }}>
            {t('dash.liveNote')}
          </p>
        </motion.div>

        {loading ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="w-11 h-11 rounded-xl mb-3" style={{ background: 'var(--surface-hover)' }} />
                <div className="h-4 w-24 rounded mb-2" style={{ background: 'var(--surface-hover)' }} />
                <div className="h-8 w-16 rounded" style={{ background: 'var(--surface-hover)' }} />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <StatCard
                icon={FolderKanban}
                label={t('dash.statProjects')}
                value={projects.length}
                description={`${pctLive}% ${t('dash.haveLiveLink')}`}
                trend={{ value: `${projects.length - liveProjects.length} ${t('dash.needUrl')}`, positive: liveProjects.length === projects.length, neutral: liveProjects.length === projects.length }}
                accent="var(--brand)"
                index={0}
              />
              <StatCard
                icon={Cpu}
                label={t('dash.statSkills')}
                value={skills.length}
                description={t('dash.acrossCategories')}
                accent="var(--accent)"
                index={1}
              />
              <StatCard
                icon={FileText}
                label={t('dash.statPosts')}
                value={blogPosts.length}
                description={t('dash.articlesWritten')}
                accent="var(--highlight)"
                index={2}
              />
              <StatCard
                icon={Award}
                label={t('dash.statCerts')}
                value={certifications.length}
                description={t('dash.fromIssuers')}
                accent="var(--success)"
                index={3}
              />
              <StatCard
                icon={GraduationCap}
                label={t('dash.statEducation')}
                value={education.length}
                description={education[0]?.degree ? t('dash.singleDegree') : t('dash.noEducation')}
                accent="var(--warning)"
                index={4}
              />
              <StatCard
                icon={Bot}
                label={t('dash.statAssistant')}
                value={health ? (health.aiAvailable ? t('dash.online') : t('dash.offline')) : '…'}
                description={
                  health
                    ? health.aiAvailable
                      ? `${t('dash.model')}: ${health.model || t('common.unknown')}`
                      : t('dash.addKey')
                    : t('dash.checking')
                }
                accent={health?.aiAvailable ? 'var(--success)' : 'var(--danger)'}
                index={5}
              />
            </div>

            {/* Charts row */}
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35 }}
                className="card card-hover p-5"
              >
                <h2 className="text-sm font-bold mb-4" style={{ color: 'var(--text-heading)' }}>
                  {t('dash.byCategory')}
                </h2>
                <DonutChart data={skillCategoryData} centerLabel={t('common.skills')} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: 0.06 }}
                className="card card-hover p-5"
              >
                <h2 className="text-sm font-bold mb-4" style={{ color: 'var(--text-heading)' }}>
                  {t('dash.topTech')}
                </h2>
                {tagFrequency.length ? (
                  <BarChart data={tagFrequency} />
                ) : (
                  <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{t('dash.noTags')}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: 0.12 }}
                className="card card-hover p-5"
              >
                <h2 className="text-sm font-bold mb-4" style={{ color: 'var(--text-heading)' }}>
                  {t('dash.topSkillsBy')}
                </h2>
                <SkillBars data={topSkills} />
              </motion.div>
            </div>

            {/* Neon live data */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35 }}
                className="card card-hover p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Database size={15} style={{ color: 'var(--brand)' }} />
                  <h2 className="text-sm font-bold" style={{ color: 'var(--text-heading)' }}>
                    Visitor sessions
                  </h2>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl p-3" style={{ background: 'var(--surface)' }}>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>Sessions</p>
                    <p className="text-xl font-black tabular-nums" style={{ color: 'var(--text-heading)' }}>{db?.sessions ?? (db ? 0 : '…')}</p>
                  </div>
                  <div className="rounded-xl p-3" style={{ background: 'var(--surface)' }}>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>Views</p>
                    <p className="text-xl font-black tabular-nums" style={{ color: 'var(--text-heading)' }}>{db?.pageViews ?? (db ? 0 : '…')}</p>
                  </div>
                  <div className="rounded-xl p-3" style={{ background: 'var(--surface)' }}>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>Projects</p>
                    <p className="text-xl font-black tabular-nums" style={{ color: 'var(--text-heading)' }}>{db?.projectViews ?? (db ? 0 : '…')}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: 0.04 }}
                className="card card-hover p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare size={15} style={{ color: 'var(--accent)' }} />
                  <h2 className="text-sm font-bold" style={{ color: 'var(--text-heading)' }}>Neon Data</h2>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'AI Chat messages', value: db?.chats, icon: MessageSquare },
                    { label: 'Contacts', value: db?.contacts, icon: Users },
                    { label: 'Finder searches', value: db?.finders, icon: MousePointerClick },
                  ].map((row) => {
                    const Icon = row.icon;
                    return (
                      <div key={row.label} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: 'var(--surface)' }}>
                        <span className="inline-flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                          <Icon size={12} />
                          {row.label}
                        </span>
                        <span className="text-sm font-black tabular-nums" style={{ color: 'var(--text-heading)' }}>
                          {row.value ?? (db ? 0 : '…')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: 0.08 }}
                className="card card-hover p-5 sm:col-span-2"
              >
                <h2 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
                  <Database size={15} style={{ color: db?.available ? 'var(--success)' : 'var(--warning)' }} />
                  {db?.available ? 'Neon (Postgres) — live' : db ? 'Neon not connected' : 'Checking Neon…'}
                </h2>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {db?.available
                    ? 'Every visit (session open/close), page view, project open, AI chat message, contact submission and project-finder query is written to your Neon database — viewable per visitor below.'
                    : 'Add your DATABASE_URL to .env and restart the server to start persisting analytics.'}
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="text-center rounded-xl p-2" style={{ background: 'var(--surface)' }}>
                    <p className="text-lg font-black tabular-nums" style={{ color: 'var(--brand)' }}>{db?.pageViews ?? '—'}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-dim)' }}>page views</p>
                  </div>
                  <div className="text-center rounded-xl p-2" style={{ background: 'var(--surface)' }}>
                    <p className="text-lg font-black tabular-nums" style={{ color: 'var(--accent)' }}>{db?.chats ?? '—'}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-dim)' }}>chat msgs</p>
                  </div>
                  <div className="text-center rounded-xl p-2" style={{ background: 'var(--surface)' }}>
                    <p className="text-lg font-black tabular-nums" style={{ color: 'var(--highlight)' }}>{db?.contacts ?? '—'}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-dim)' }}>contacts</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Health + AI plan */}
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35 }}
                className="card card-hover p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold" style={{ color: 'var(--text-heading)' }}>
                    {t('dash.healthScore')}
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${healthScore === 100 ? '' : ''}`}
                    style={{
                      color: healthScore >= 80 ? 'var(--success)' : healthScore >= 50 ? 'var(--warning)' : 'var(--danger)',
                      background: healthScore >= 80
                        ? 'color-mix(in srgb, var(--success) 12%, transparent)'
                        : healthScore >= 50
                        ? 'color-mix(in srgb, var(--warning) 12%, transparent)'
                        : 'color-mix(in srgb, var(--danger) 12%, transparent)',
                    }}
                  >
                    {healthScore}/100
                  </span>
                </div>
                <div className="space-y-2.5">
                  {healthIssues.map((issue, i) => {
                    const Icon = issue.icon;
                    return (
                      <div key={i} className="flex items-center gap-3">
                        {issue.count === 0 ? (
                          <CheckCircle2 size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                        ) : (
                          <Icon size={16} style={{ color: 'var(--warning)', flexShrink: 0 }} />
                        )}
                        <span className="flex-1 text-xs" style={{ color: 'var(--text-body)' }}>
                          {issue.label}
                        </span>
                        <span className="text-xs font-bold tabular-nums" style={{ color: 'var(--text-heading)' }}>
                          {issue.count}
                        </span>
                        {issue.count > 0 && (
                          <Link
                            to={issue.fix}
                            className="inline-flex items-center gap-0.5 text-xs font-semibold hover:underline"
                            style={{ color: 'var(--brand-light)' }}
                          >
                            {t('dash.fix')} <ArrowRight size={11} />
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: 0.08 }}
                className="card card-hover p-5 relative overflow-hidden"
              >
                <div
                  className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-20 blur-3xl pointer-events-none"
                  style={{ background: 'var(--brand)' }}
                />
                <h2 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
                  <Sparkles size={15} style={{ color: 'var(--brand)' }} />
                  {t('dash.novaReady')}
                </h2>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {t('dash.novaDesc')}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    t('dash.suggImprove'),
                    t('dash.suggDesc'),
                    t('dash.suggPost'),
                  ].map((q) => (
                    <span key={q} className="chip" style={{ background: 'var(--surface)', borderColor: 'var(--border-default)', color: 'var(--text-muted)' }}>
                      “{q}”
                    </span>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <Link
                    to="/projects"
                    className="inline-flex items-center gap-2 text-sm font-semibold rounded-xl px-4 py-2 text-white transition-all hover:-translate-y-0.5"
                    style={{ background: 'var(--chat-user-bg)', boxShadow: '0 6px 16px var(--glow-brand)' }}
                  >
                    <FolderKanban size={15} />
                    {t('dash.reviewProjects')}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;