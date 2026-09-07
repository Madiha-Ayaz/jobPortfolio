import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '@/context/PortfolioContext';
import { useSearch } from '@/context/SearchContext';
import { useTheme } from '@/context/ThemeContext';
import BlogPostCard, { readingTime, useTilt } from '@/components/blog/BlogPostCard';
import { inspirationalQuotes } from '@/lib/data';

const Q_ACCENTS = ['#2dd4a7', '#8b5cf6', '#e879f9', '#22d3ee', '#fbbf24', '#a78bfa'];

const FLOAT_POS = [
  { left: '6%', top: '16%', d: '0s', r: '-6deg', lg: true },
  { left: '92%', top: '22%', d: '1.2s', r: '5deg', lg: false },
  { left: '8%', top: '80%', d: '0.6s', r: '4deg', lg: false },
  { left: '94%', top: '74%', d: '1.8s', r: '-5deg', lg: true },
  { left: '50%', top: '94%', d: '2.4s', r: '0deg', lg: true },
];

export default function BlogPage() {
  const { blogPosts } = usePortfolio();
  const { searchQuery } = useSearch();
  const { t } = useTheme();
  const featTilt = useTilt<HTMLAnchorElement>(7, 9);
  const [category, setCategory] = useState('All');

  const posts = blogPosts ?? [];

  const CANONICAL_CATEGORIES = [
    'AI & Artificial Intelligence',
    'AI Agents & Automation',
    'Web Development',
    'UI/UX & 3D Web Design',
    'Projects & Case Studies',
    'Learning & Career',
    'Teaching & Technology',
  ];

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((p) => {
      const c = p.category || p.tags?.[0] || 'General';
      counts[c] = (counts[c] || 0) + 1;
    });
    return CANONICAL_CATEGORIES.filter((c) => counts[c]).map((name) => ({ name, count: counts[name] }));
  }, [posts]);

  const filtered = useMemo(
    () =>
      posts.filter((p) => {
        const pc = p.category || p.tags?.[0] || 'General';
        const matchesCategory = category === 'All' || pc === category;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(q));
        return matchesCategory && matchesSearch;
      }),
    [posts, category, searchQuery]
  );

  const totalMinutes = useMemo(() => posts.reduce((sum, p) => sum + readingTime(p.content), 0), [posts]);
  const [featured, ...rest] = filtered;

  return (
    <div className="relative min-h-screen text-body">
      <div className="relative z-10">
        {/* ═══ HERO ═══ */}
        <div className="relative text-center pt-16 pb-12 px-4 overflow-hidden">
          <div className="bf-glow" aria-hidden="true" />
          <div className="relative inline-block">
            <div
              className="inline-flex items-center gap-2 mb-5 px-5 py-2 text-xs font-bold tracking-[0.25em] uppercase rounded-full backdrop-blur-sm"
              style={{
                background: 'color-mix(in srgb, var(--brand) 10%, transparent)',
                border: '1px solid color-mix(in srgb, var(--brand) 30%, transparent)',
                color: 'var(--brand)',
              }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              <span>{t('blog.badge')}</span>
            </div>

            <h1
              className="text-5xl md:text-7xl font-black mb-5 leading-tight bf-head"
              style={{
                background: 'linear-gradient(120deg, var(--brand), var(--accent))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 34px color-mix(in srgb, var(--brand) 30%, transparent))',
              }}
            >
              {t('blog.title')}
            </h1>

            <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10" style={{ color: 'var(--text-muted)' }}>
              {t('blog.subtitle')}
            </p>
          </div>

          {/* Floating 3D chips */}
          {categories.length > 0 &&
            FLOAT_POS.map((pos, i) => {
              const chip = categories[i] ?? categories[(i * 3) % categories.length];
              return (
                <span
                  key={i}
                  aria-hidden="true"
                  className={`bf-chip ${pos.lg ? 'hidden md:inline-flex' : 'hidden lg:inline-flex'}`}
                  style={{
                    left: pos.left,
                    top: pos.top,
                    ['--bf-d' as string]: pos.d,
                    ['--bf-r' as string]: pos.r,
                    ['--bf-c' as string]: i % 2 === 0 ? 'var(--brand)' : 'var(--accent)',
                  } as React.CSSProperties}
                >
                  <i className="bf-dot" />
                  {chip.name}
                </span>
              );
            })}

          {/* Real stats */}
          <div className="flex items-center justify-center gap-5 sm:gap-8 md:gap-14 relative">
            {[
              { value: posts.length, label: t('blog.statArticles') },
              { value: categories.length, label: t('blog.statTopics') },
              { value: totalMinutes, label: t('blog.statMinutes') },
            ].map((stat) => (
              <div key={stat.label} className="text-center bf-stat">
                <div className="text-3xl md:text-4xl font-black bf-stat-num" style={{ color: 'var(--brand)' }}>
                  {stat.value}
                </div>
                <div className="text-[10px] font-semibold tracking-[0.2em] uppercase mt-1" style={{ color: 'var(--text-dim)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ FILTERS ═══ */}
        <div className="max-w-5xl mx-auto px-4 mb-10">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setCategory('All')}
              className="px-4 py-2 text-xs font-bold rounded-full transition-all hover:-translate-y-0.5"
              style={
                category === 'All'
                  ? { background: 'linear-gradient(120deg, var(--brand), var(--accent))', color: '#fff', boxShadow: '0 6px 18px color-mix(in srgb, var(--brand) 30%, transparent)' }
                  : { background: 'var(--surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }
              }
            >
              {t('blog.all')} ({posts.length})
            </button>
            {categories.map((c) => (
              <button
                key={c.name}
                onClick={() => setCategory(c.name)}
                className="px-4 py-2 text-xs font-bold rounded-full transition-all hover:-translate-y-0.5"
                style={
                  category === c.name
                    ? { background: 'linear-gradient(120deg, var(--brand), var(--accent))', color: '#fff', boxShadow: '0 6px 18px color-mix(in srgb, var(--brand) 30%, transparent)' }
                    : { background: 'var(--surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }
                }
              >
                {c.name} ({c.count})
              </button>
            ))}
          </div>
        </div>

        {/* ═══ CONTENT ═══ */}
        {filtered.length === 0 ? (
          <div className="max-w-md mx-auto px-4 text-center py-16">
            <p className="text-4xl mb-4">🔎</p>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
              {t('blog.emptyTitle')}
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {t('blog.emptySub')}
            </p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto px-4 pb-8">
            {/* Featured first article */}
            {featured && (
              <Link
                ref={featTilt.ref}
                to={`/blog/${featured.slug}`}
                onPointerMove={featTilt.onPointerMove}
                onPointerLeave={featTilt.onPointerLeave}
                className="bt group block rounded-[26px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg, #05070d)]"
              >
                <div className="bt-rot bt-feat">
                  <div className="bt-feat-bg">
                    {featured.imageUrl && featured.imageUrl !== '#' ? (
                      <img src={featured.imageUrl} alt={featured.title} loading="lazy" />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{
                          background:
                            'linear-gradient(135deg, color-mix(in srgb, var(--brand) 34%, transparent), color-mix(in srgb, var(--accent) 22%, #0a0d12))',
                        }}
                      />
                    )}
                  </div>
                  <div className="bt-feat-grad" aria-hidden="true" />

                  <span className="bt-feat-badge">
                    {t('blog.featured')}
                  </span>
                  <span className="bt-feat-badge bt-feat-time">
                    {readingTime(featured.content)} {t('blog.minRead')}
                  </span>

                  <div className="bt-feat-body">
                    <div className="bt-feat-author">
                      <img
                        src="/arab-woman-abaya-hijab-girl-muslim-working-laptop-office-education-online-entrepreneur-freelancer_1030874-9889.avif"
                        alt={featured.author}
                        className="bt-feat-avatar"
                        loading="lazy"
                      />
                      <div className="bt-feat-author-meta">
                        <span className="bt-feat-author-name">{featured.author}</span>
                        <span className="bt-feat-author-cat">
                          {featured.category || (featured.tags?.[0] ?? 'General')} · {t('blog.featured')}
                        </span>
                      </div>
                    </div>
                    <p className="bt-meta">
                      {new Date(featured.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <h2 className="bt-feat-title">{featured.title}</h2>
                    <p className="bt-feat-excerpt">{featured.excerpt}</p>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {(featured.tags || []).map((tag) => (
                        <span key={tag} className="bt-tag bt-tag-onimage">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="bt-read bt-read-onimage">
                      {t('blog.readFull')}
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  </div>

                  <div className="bt-halo" aria-hidden="true" />
                  <i className="bt-glare" aria-hidden="true" />
                </div>
              </Link>
            )}

            {/* Rest of the grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                {rest.map((post, i) => (
                  <BlogPostCard key={post.id} post={post} index={i} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ WISDOM QUOTES ═══ */}
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 mb-5 px-5 py-2 text-xs font-bold tracking-[0.25em] uppercase rounded-full backdrop-blur-sm"
              style={{
                background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
                border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
                color: 'var(--accent)',
              }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.97-4.03 9-9 9a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.97 4.03-9 9-9s9 4.03 9 9z" />
              </svg>
              <span>{t('blog.quoteBadge')}</span>
            </div>
            <h2 className="qz-title text-4xl md:text-5xl font-black mb-3">{t('blog.quoteTitle')}</h2>
            <p className="text-sm md:text-base" style={{ color: 'var(--text-muted)' }}>
              {t('blog.quoteSub')}
            </p>
          </div>

          <div className="qz-grid">
            {inspirationalQuotes.map((q, i) => (
              <figure
                key={i}
                className="qz-card group"
                style={{ ['--qa' as string]: Q_ACCENTS[i % Q_ACCENTS.length] } as React.CSSProperties}
              >
                <span className="qz-mark" aria-hidden="true">
                  &ldquo;
                </span>
                <blockquote className="qz-quote">{q.quote}</blockquote>
                <figcaption className="qz-fig">
                  {q.image ? (
                    <img src={q.image} alt={q.author} className="qz-avatar qz-photo" loading="lazy" />
                  ) : (
                    <span className="qz-avatar" aria-hidden="true">
                      {q.author.charAt(0)}
                    </span>
                  )}
                  <span className="qz-meta">
                    <span className="qz-author">{q.author}</span>
                    <span className="qz-prof">{q.profession}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <div className="px-4 py-20 text-center">
          <div
            className="max-w-2xl mx-auto p-10 rounded-3xl"
            style={{
              background: 'linear-gradient(140deg, color-mix(in srgb, var(--brand) 8%, var(--card-bg)) 0%, var(--card-bg) 55%, color-mix(in srgb, var(--accent) 8%, var(--card-bg)) 100%)',
              border: '1px solid color-mix(in srgb, var(--brand) 16%, var(--border-subtle))',
            }}
          >
            <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ background: 'linear-gradient(120deg, var(--brand), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {t('blog.ctaTitle')}
            </h2>
            <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
              {t('blog.ctaSub')}
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 font-bold rounded-full transition-all hover:scale-105"
              style={{ background: 'linear-gradient(120deg, var(--brand), var(--accent))', color: '#fff', boxShadow: '0 10px 40px color-mix(in srgb, var(--brand) 35%, transparent)' }}
            >
              {t('blog.openDashboard')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ── 3D tilt cards (shared with BlogPostCard) ── */
        .bt { perspective: 1100px; perspective-origin: 50% 42%; }
        .bt-rot {
          position: relative;
          height: 100%;
          border-radius: 22px;
          transform-style: preserve-3d;
          transform: rotateX(var(--bt-rx, 0deg)) rotateY(var(--bt-ry, 0deg)) translateZ(0);
          transition: transform 420ms cubic-bezier(0.22, 0.7, 0.16, 1), box-shadow 420ms ease;
          will-change: transform;
          background: var(--card-bg);
          border: 1px solid var(--border-subtle);
          box-shadow: var(--card-shadow);
        }
        .group:hover .bt-rot {
          transform: rotateX(var(--bt-rx, 0deg)) rotateY(var(--bt-ry, 0deg)) translateZ(0) scale(1.02);
          box-shadow: 0 26px 60px -14px rgba(0,0,0,0.55), 0 0 0 1px color-mix(in srgb, var(--bt-strong, var(--brand)) 24%, var(--border-subtle)), 0 0 42px color-mix(in srgb, var(--bt-strong, var(--brand)) 16%, transparent);
        }

        .bt-media {
          position: relative;
          margin: 10px 10px 0;
          height: clamp(150px, 30vw, 205px);
          border-radius: 15px;
          overflow: hidden;
          transform: translateZ(34px);
          box-shadow: 0 14px 30px -10px rgba(0,0,0,0.5);
        }
        .bt-img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 700ms cubic-bezier(0.22, 0.7, 0, 1);
          will-change: transform;
        }
        .group:hover .bt-img { transform: scale(1.08); }
        .bt-media::after {
          content: "";
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(2,4,8,0.55), transparent 55%);
          pointer-events: none;
        }
        .bt-chip {
          position: absolute;
          display: inline-flex; align-items: center;
          font-size: 10px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase;
          color: #fff;
          padding: 6px 11px; border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.22);
          background: rgba(6,9,14,0.55);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.35);
          transition: transform 300ms ease;
        }
        .bt-chip-time { top: 12px; left: 12px; }
        .bt-chip-cat {
          right: 12px; bottom: 12px;
          color: var(--bt-accent, var(--brand));
          border-color: color-mix(in srgb, var(--bt-strong, var(--brand)) 60%, transparent);
          background: color-mix(in srgb, var(--bt-strong, var(--brand)) 30%, rgba(6,9,14,0.55));
          text-transform: none;
          letter-spacing: 0.08em;
          font-size: 10px;
        }
        .bt-cat-dot {
          width: 6px; height: 6px; border-radius: 999px;
          background: currentColor;
          box-shadow: 0 0 8px currentColor;
        }
        .group:hover .bt-chip { transform: translateY(-2px); }

        .bt-author {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 12px;
        }
        .bt-avatar {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          object-fit: cover;
          flex: none;
          border: 1px solid var(--border-subtle);
          box-shadow: 0 6px 14px -6px rgba(0,0,0,0.5);
        }
        .bt-author-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .bt-author-name {
          font-size: 0.82rem;
          font-weight: 800;
          color: var(--text-heading);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .bt-date {
          font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--text-dim); margin: 0;
        }

        .bt-body {
          position: relative;
          padding: 16px 20px 20px;
          transform: translateZ(56px);
        }
        .bt-title {
          font-size: 1.2rem; font-weight: 800; line-height: 1.28; letter-spacing: -0.01em;
          color: var(--text-heading); margin: 0 0 10px;
          transition: color 200ms ease;
        }
        .group:hover .bt-title { color: var(--bt-accent, var(--brand)); }
        .bt-excerpt { font-size: 0.875rem; line-height: 1.6; color: var(--text-muted); margin: 0 0 14px; }
        .bt-tag {
          font-size: 10px; font-weight: 700;
          padding: 5px 10px; border-radius: 999px;
          background: color-mix(in srgb, var(--bt-strong, var(--brand)) 12%, var(--surface));
          border: 1px solid color-mix(in srgb, var(--bt-strong, var(--brand)) 26%, var(--border-subtle));
          color: var(--bt-accent, var(--brand));
        }
        .bt-read {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 0.875rem; font-weight: 800;
          color: var(--brand);
        }
        .bt-read svg { width: 15px; height: 15px; }

        .bt-glare {
          position: absolute; inset: 0;
          transform: translateZ(78px);
          border-radius: 22px;
          background: radial-gradient(190px circle at var(--bt-gx, 50%) var(--bt-gy, 50%), rgba(255,255,255,0.16), transparent 62%);
          opacity: 0; pointer-events: none;
          transition: opacity 300ms ease;
          mix-blend-mode: screen;
        }
        .group:hover .bt-glare { opacity: 1; }
        .bt-halo {
          position: absolute; inset: 0;
          transform: translateZ(30px);
          border-radius: 22px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 300ms ease;
        }
        .group:hover .bt-halo {
          opacity: 1;
          box-shadow:
            inset 0 0 0 1px color-mix(in srgb, var(--bt-strong, var(--brand)) 45%, transparent),
            inset 0 0 30px color-mix(in srgb, var(--bt-strong, var(--brand)) 12%, transparent),
            0 0 40px color-mix(in srgb, var(--bt-strong, var(--brand)) 20%, transparent);
        }

        /* ── Featured ── */
        .bt-feat {
          min-height: clamp(380px, 58vw, 500px);
          border-radius: 26px;
        }
        .bt-feat-bg {
          position: absolute; inset: 0;
          transform: translateZ(28px);
          border-radius: 26px;
          overflow: hidden;
        }
        .bt-feat-bg img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 900ms cubic-bezier(0.22, 0.7, 0, 1);
        }
        .group:hover .bt-feat-bg img { transform: scale(1.05); }
        .bt-feat-grad {
          position: absolute; inset: 0;
          transform: translateZ(30px);
          border-radius: 26px;
          background: linear-gradient(to top, rgba(2,4,8,0.85) 0%, rgba(2,4,8,0.3) 50%, transparent 82%);
          pointer-events: none;
        }
        .bt-feat-badge {
          position: absolute; top: 20px; left: 22px;
          transform: translateZ(54px);
          display: inline-flex; align-items: center;
          font-size: 10px; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase;
          color: #fff;
          padding: 8px 14px; border-radius: 999px;
          background: linear-gradient(120deg, var(--brand), var(--accent));
          box-shadow: 0 8px 24px color-mix(in srgb, var(--brand) 45%, transparent);
        }
        .bt-feat-time {
          left: auto; right: 22px;
          background: rgba(6,9,14,0.55);
          border: 1px solid rgba(255,255,255,0.18);
          backdrop-filter: blur(8px);
        }
        .bt-feat-body {
          position: absolute; left: 0; right: 0; bottom: 0;
          padding: 0 26px 26px;
          transform: translateZ(58px);
        }
        .bt-meta {
          font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
          color: color-mix(in srgb, var(--accent) 80%, #fff); margin: 0 0 10px;
        }
        .bt-feat-author {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0 0 12px;
        }
        .bt-feat-avatar {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          object-fit: cover;
          flex: none;
          border: 1px solid rgba(255,255,255,0.22);
          box-shadow: 0 8px 20px -8px rgba(0,0,0,0.6);
        }
        .bt-feat-author-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .bt-feat-author-name {
          font-size: 0.9rem;
          font-weight: 800;
          color: #fff;
        }
        .bt-feat-author-cat {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: color-mix(in srgb, var(--accent) 80%, #fff);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .bt-feat-title {
          font-size: clamp(1.7rem, 4vw, 2.6rem);
          font-weight: 900; line-height: 1.12; letter-spacing: -0.02em;
          color: #fff; margin: 0 0 12px;
          text-shadow: 0 2px 22px rgba(0,0,0,0.6);
          max-width: 22ch;
        }
        .bt-feat-excerpt {
          font-size: 0.95rem; line-height: 1.6;
          color: rgba(235,240,248,0.88);
          margin: 0 0 16px;
          max-width: 62ch;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .bt-tag-onimage {
          background: rgba(6,9,14,0.5);
          border-color: rgba(255,255,255,0.16);
          color: color-mix(in srgb, var(--accent) 80%, #fff);
          backdrop-filter: blur(6px);
        }
        .bt-read-onimage { color: #fff; }

        /* ── Hero floaters ── */
        .bf-glow {
          position: absolute; left: 50%; top: 42%;
          width: 560px; height: 280px;
          transform: translate(-50%, -50%);
          background: radial-gradient(closest-side, color-mix(in srgb, var(--brand) 24%, transparent), transparent);
          filter: blur(46px);
          pointer-events: none;
        }
        @keyframes bfFloat {
          0%, 100% { transform: translate(-50%, -50%) translateY(0) rotate(var(--bf-r, -4deg)); }
          50% { transform: translate(-50%, -50%) translateY(-15px) rotate(var(--bf-r, -4deg)); }
        }
        .bf-chip {
          position: absolute;
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--bf-c, var(--brand));
          padding: 11px 17px; border-radius: 999px;
          background: color-mix(in srgb, var(--bf-c, var(--brand)) 8%, var(--card-bg));
          border: 1px solid color-mix(in srgb, var(--bf-c, var(--brand)) 30%, var(--border-subtle));
          box-shadow: 0 12px 32px -10px rgba(0,0,0,0.5);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transform: translate(-50%, -50%);
          animation: bfFloat var(--bf-d, 6s) ease-in-out infinite;
          will-change: transform;
          z-index: 5;
        }
        .bf-chip .bf-dot {
          width: 7px; height: 7px; border-radius: 999px;
          background: currentColor;
          box-shadow: 0 0 10px currentColor;
        }
        .bf-chip:hover { animation-play-state: paused; }
        .bf-head { position: relative; z-index: 2; }
        .bf-stat { transition: transform 300ms ease; }
        .bf-stat:hover { transform: translateY(-4px); }
        .bf-stat-num { display: inline-block; transition: transform 300ms ease, text-shadow 300ms ease; }
        .bf-stat:hover .bf-stat-num {
          transform: translateZ(0) scale(1.12);
          text-shadow: 0 0 26px color-mix(in srgb, var(--brand) 45%, transparent);
        }

        @media (prefers-reduced-motion: reduce) {
          .bt-rot, .bt-img, .bt-chip, .bt-glare, .bt-halo, .bt-feat-bg img, .bf-chip, .bf-stat, .bf-stat-num, .qz-card {
            transition: none !important;
          }
          .bf-chip { animation: none; }
        }

        /* ── Wisdom quotes ── */
        .qz-title {
          background: linear-gradient(120deg, var(--brand), var(--accent));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
        .qz-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 18px;
        }
        .qz-card {
          position: relative;
          padding: 28px 24px 20px;
          border-radius: 20px;
          background: linear-gradient(165deg, color-mix(in srgb, var(--qa) 10%, var(--card-bg)), var(--card-bg) 62%);
          border: 1px solid color-mix(in srgb, var(--qa) 26%, var(--border-subtle));
          box-shadow: var(--card-shadow);
          transform: rotate(var(--qz-r, 0deg));
          transition: transform 0.35s cubic-bezier(.22,.61,.36,1), box-shadow 0.35s ease, border-color 0.35s ease;
          overflow: hidden;
        }
        .qz-card:nth-child(3n + 1) { --qz-r: -1.4deg; }
        .qz-card:nth-child(3n + 2) { --qz-r: 1.1deg; }
        .qz-card:nth-child(3n) { --qz-r: -0.6deg; }
        .qz-card:hover {
          transform: rotate(0deg) translateY(-6px) scale(1.02);
          border-color: color-mix(in srgb, var(--qa) 55%, transparent);
          box-shadow: 0 22px 50px -16px rgba(0,0,0,0.55), 0 0 34px color-mix(in srgb, var(--qa) 22%, transparent);
        }
        .qz-mark {
          position: absolute;
          top: -14px;
          right: 16px;
          font-size: 74px;
          line-height: 1;
          font-weight: 900;
          font-family: Georgia, 'Times New Roman', serif;
          color: color-mix(in srgb, var(--qa) 55%, transparent);
          pointer-events: none;
        }
        .qz-quote {
          font-size: 0.98rem;
          line-height: 1.65;
          font-weight: 600;
          font-style: italic;
          color: var(--text-heading);
          margin: 0 0 22px;
        }
        .qz-fig {
          display: flex;
          align-items: center;
          gap: 12px;
          border-top: 1px solid color-mix(in srgb, var(--qa) 18%, var(--border-subtle));
          padding-top: 16px;
        }
        .qz-avatar {
          width: 40px;
          height: 40px;
          border-radius: 14px;
          flex: none;
          display: grid;
          place-items: center;
          font-weight: 900;
          font-size: 15px;
          color: #fff;
          background: linear-gradient(135deg, var(--qa), color-mix(in srgb, var(--qa) 42%, #fff));
          box-shadow: 0 6px 16px color-mix(in srgb, var(--qa) 40%, transparent);
        }
        .qz-photo {
          object-fit: cover;
          border: 1px solid color-mix(in srgb, var(--qa) 45%, var(--border-subtle));
        }
        .qz-meta { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .qz-author { font-weight: 800; font-size: 0.9rem; color: var(--text-heading); }
        .qz-prof {
          font-size: 0.66rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--qa);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}