import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePortfolio } from '@/context/PortfolioContext';
import { useAgent } from '@/context/useAgent';
import { useTheme } from '@/context/ThemeContext';
import { readingTime, useTilt } from '@/components/blog/BlogPostCard';
import ArticleAssistant from '@/components/blog/ArticleAssistant';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { blogPosts } = usePortfolio();
  const { setIsOpen } = useAgent();
  const { t } = useTheme();
  const imgTilt = useTilt<HTMLDivElement>(8, 10);
  const posts = blogPosts ?? [];
  const post = posts.find((p) => p.slug === slug);

  const related = useMemo(() => {
    if (!post) return [];
    return posts
      .filter((p) => p.id !== post.id && (p.tags || []).some((t) => (post.tags || []).includes(t)))
      .slice(0, 3);
  }, [posts, post]);

  const postIndex = posts.findIndex((p) => p.id === post?.id);
  const prev = postIndex > 0 ? posts[postIndex - 1] : null;
  const next = postIndex >= 0 && postIndex < posts.length - 1 ? posts[postIndex + 1] : null;

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <p className="text-5xl mb-4">📄</p>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>{t('post.notFoundTitle')}</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          {t('post.notFoundSub')}
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-6 py-2.5 font-bold rounded-full text-white transition-all hover:scale-105"
          style={{ background: 'linear-gradient(120deg, var(--brand), var(--accent))' }}
        >
          ← {t('post.back')}
        </Link>
      </div>
    );
  }

  const date = new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="relative min-h-screen text-body">
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-14 pb-20">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold mb-8 transition-all hover:-translate-x-1" style={{ color: 'var(--accent)' }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          {t('post.back')}
        </Link>

        {/* ═══ HEADER ═══ */}
        <header className="text-center mb-12">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5 db-chips">
            <span
              className="db-chip db-chip-solid px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full text-white"
            >
              {post.category || post.tags?.[0] || 'General'}
            </span>
            <span className="db-chip px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full">
              {readingTime(post.content)} {t('blog.minRead')}
            </span>
            {(post.tags || []).slice(0, 4).map((tag, i) => (
              <span
                key={tag}
                className="db-chip px-3 py-1 text-[10px] font-semibold rounded-full"
                style={{ ['--db-r' as string]: `${(i % 2 === 0 ? -1 : 1) * 2.2}deg` } as React.CSSProperties}
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-5" style={{ color: 'var(--text-heading)' }}>
            {post.title}
          </h1>

          <p className="text-lg leading-relaxed max-w-2xl mx-auto mb-8" style={{ color: 'var(--text-muted)' }}>
            {post.excerpt}
          </p>

          <div className="flex items-center justify-center gap-3">
            <img
              src="/arab-woman-abaya-hijab-girl-muslim-working-laptop-office-education-online-entrepreneur-freelancer_1030874-9889.avif"
              alt={post.author}
              className="db-avatar"
            />
            <div className="text-left">
              <div className="text-sm font-extrabold" style={{ color: 'var(--text-heading)' }}>
                {post.author}
              </div>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-dim)' }}>
                {date}
              </div>
            </div>
          </div>
        </header>

        {/* ═══ HERO IMAGE (3D) ═══ */}
        <div className="db-frame mb-14 rounded-[26px]">
          {post.imageUrl && post.imageUrl !== '#' ? (
            <div
              ref={imgTilt.ref}
              onPointerMove={imgTilt.onPointerMove}
              onPointerLeave={imgTilt.onPointerLeave}
              className="db-rot"
            >
              <div className="db-layer-back" aria-hidden="true" />
              <div className="db-imgwrap">
                <img src={post.imageUrl} alt={post.title} />
                <div className="db-imgshade" aria-hidden="true" />
              </div>
              <i className="db-glare" aria-hidden="true" />
            </div>
          ) : (
            <div
              className="rounded-3xl h-64 md:h-96"
              style={{
                background:
                  'linear-gradient(135deg, color-mix(in srgb, var(--brand) 34%, transparent), color-mix(in srgb, var(--accent) 20%, #0a0d12))',
              }}
            />
          )}
        </div>

        {/* ═══ BODY ═══ */}
        <article
          className="prose prose-invert prose-lg max-w-none mx-auto"
          style={{
            color: 'var(--text-muted)',
            ['--tw-prose-body' as any]: 'var(--text-muted)',
            ['--tw-prose-headings' as any]: 'var(--text-heading)',
            ['--tw-prose-links' as any]: 'var(--accent)',
            ['--tw-prose-bold' as any]: 'var(--text-heading)',
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        <div className="mt-16 flex flex-wrap gap-2 justify-center">
          {(post.tags || []).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-semibold rounded-full transition-transform hover:-translate-y-0.5"
              style={{ background: 'color-mix(in srgb, var(--brand) 10%, var(--surface))', border: '1px solid color-mix(in srgb, var(--brand) 22%, var(--border-subtle))', color: 'var(--brand)' }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* ═══ AI ARTICLE ASSISTANT ═══ */}
        <ArticleAssistant post={post} />

        {/* ═══ AI POLISH ═══ */}
        <div
          className="mt-12 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-4 justify-between"
          style={{ background: 'color-mix(in srgb, var(--brand) 8%, var(--card-bg))', border: '1px solid color-mix(in srgb, var(--brand) 20%, var(--border-subtle))' }}
        >
          <p className="text-sm font-semibold text-center sm:text-left" style={{ color: 'var(--text-heading)' }}>
            {t('post.polishTitle')}
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-full text-white transition-all hover:-translate-y-0.5 flex-shrink-0"
            style={{ background: 'linear-gradient(120deg, var(--brand), var(--accent))', boxShadow: '0 8px 24px color-mix(in srgb, var(--brand) 35%, transparent)' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
            {t('post.polishBtn')}
          </button>
        </div>

        {/* ═══ PREV / NEXT ═══ */}
        {(prev || next) && (
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prev ? (
              <Link
                to={`/blog/${prev.slug}`}
                className="db-rel group p-5 rounded-2xl text-left transition-all duration-300"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--border-subtle)' }}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider db-rel-tag" style={{ color: 'var(--text-dim)' }}>
                  ← {t('post.prevArticle')}
                </span>
                <h3 className="mt-2 font-bold leading-snug transition-colors group-hover:text-accent" style={{ color: 'var(--text-heading)' }}>
                  {prev.title}
                </h3>
              </Link>
            ) : <span />}
            {next ? (
              <Link
                to={`/blog/${next.slug}`}
                className="db-rel group p-5 rounded-2xl text-right transition-all duration-300"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--border-subtle)' }}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider db-rel-tag" style={{ color: 'var(--text-dim)' }}>
                  {t('post.nextArticle')} →
                </span>
                <h3 className="mt-2 font-bold leading-snug transition-colors group-hover:text-accent" style={{ color: 'var(--text-heading)' }}>
                  {next.title}
                </h3>
              </Link>
            ) : <span />}
          </div>
        )}

        {/* ═══ RELATED ═══ */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-black mb-6" style={{ color: 'var(--text-heading)' }}>
              {t('post.keepReading')}
            </h2>
            <div className="db-rel-grid grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/blog/${p.slug}`}
                  className="db-rel group p-5 rounded-2xl transition-all duration-300"
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--border-subtle)' }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2 db-rel-tag" style={{ color: 'var(--text-dim)' }}>
                    {readingTime(p.content)} {t('blog.minRead')}
                  </p>
                  <h3 className="font-bold leading-snug mb-2 transition-colors group-hover:text-accent" style={{ color: 'var(--text-heading)' }}>
                    {p.title}
                  </h3>
                  <p className="text-xs line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                    {p.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ── Header chips ── */
        .db-chips { perspective: 900px; }
        .db-chip {
          display: inline-flex; align-items: center;
          transform: rotate(var(--db-r, 0deg)) translateZ(0);
          transition: transform 260ms ease, box-shadow 260ms ease;
          background: color-mix(in srgb, var(--brand) 10%, var(--surface));
          border: 1px solid color-mix(in srgb, var(--brand) 22%, var(--border-subtle));
          color: var(--brand);
          box-shadow: 0 6px 16px -6px rgba(0,0,0,0.4);
        }
        .db-chip:hover {
          transform: rotate(0deg) translateY(-3px) scale(1.05);
          box-shadow: 0 10px 24px -8px color-mix(in srgb, var(--brand) 40%, rgba(0,0,0,0.5));
        }
        .db-chip-solid {
          background: linear-gradient(120deg, var(--brand), var(--accent));
          border: 0;
          box-shadow: 0 8px 22px color-mix(in srgb, var(--brand) 40%, transparent);
        }

        /* ── 3D hero image ── */
        .db-frame { perspective: 1200px; perspective-origin: 50% 30%; }
        .db-rot {
          position: relative;
          transform-style: preserve-3d;
          transform: rotateX(var(--bt-rx, 0deg)) rotateY(var(--bt-ry, 0deg));
          transition: transform 420ms cubic-bezier(0.22, 0.7, 0.16, 1);
          will-change: transform;
        }
        .db-layer-back {
          position: absolute;
          inset: 14px -18px -14px 18px;
          transform: translateZ(-50px) rotateY(6deg);
          border-radius: 30px;
          background: linear-gradient(135deg, color-mix(in srgb, var(--brand) 34%, transparent), color-mix(in srgb, var(--accent) 22%, transparent));
          filter: blur(3px);
          opacity: 0.65;
        }
        .db-imgwrap {
          position: relative;
          border-radius: 26px;
          overflow: hidden;
          transform: translateZ(28px);
          box-shadow: 0 32px 80px -18px rgba(0,0,0,0.55);
          border: 1px solid rgba(255,255,255,0.07);
        }
        .db-imgwrap img {
          width: 100%;
          height: clamp(260px, 44vw, 420px);
          object-fit: cover;
          display: block;
        }
        .db-imgshade {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(2,4,8,0.4), transparent 55%);
          pointer-events: none;
        }
        .db-glare {
          position: absolute; inset: 0;
          transform: translateZ(56px);
          border-radius: 26px;
          background: radial-gradient(200px circle at var(--bt-gx, 50%) var(--bt-gy, 50%), rgba(255,255,255,0.18), transparent 60%);
          opacity: 0; pointer-events: none;
          transition: opacity 300ms ease;
          mix-blend-mode: screen;
        }
        .db-rot:hover .db-glare { opacity: 1; }

        /* ── Related cards ── */
        .db-rel-grid { perspective: 1100px; }
        .db-rel { transform: translateZ(0); }
        .db-rel:hover {
          transform: translateY(-6px) rotateX(3deg) scale(1.02);
          box-shadow: 0 20px 44px -14px rgba(0,0,0,0.5), 0 0 26px color-mix(in srgb, var(--brand) 14%, transparent);
        }
        .db-rel-tag { transition: color 200ms ease; }
        .db-rel:hover .db-rel-tag { color: var(--accent); }

        /* ── Header author ── */
        .db-avatar {
          width: 44px; height: 44px;
          border-radius: 14px;
          object-fit: cover;
          border: 1px solid var(--border-subtle);
          box-shadow: 0 8px 20px -8px rgba(0,0,0,0.5);
        }

        /* ── Article AI assistant ── */
        .aa-dot {
          width: 7px; height: 7px; border-radius: 999px;
          background: currentColor;
          box-shadow: 0 0 10px currentColor;
          animation: aaPulse 1.6s ease-in-out infinite;
        }
        @keyframes aaPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
        .aa-chip:disabled { cursor: not-allowed; }
        .aa-bubble {
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 0.9rem;
          line-height: 1.55;
        }
        .aa-bubble-user {
          margin-left: auto;
          max-width: 84%;
          color: #fff;
          background: linear-gradient(120deg, color-mix(in srgb, var(--brand) 78%, #0a0d12), color-mix(in srgb, var(--accent) 78%, #0a0d12));
          border-bottom-right-radius: 6px;
        }
        .aa-bubble-ai {
          margin-right: auto;
          max-width: 92%;
          background: var(--surface);
          border: 1px solid var(--border-subtle);
          border-bottom-left-radius: 6px;
        }
        .aa-loader {
          display: inline-block;
          width: 14px; height: 14px;
          margin-right: 10px;
          vertical-align: -2px;
          border: 2px solid color-mix(in srgb, var(--brand) 30%, transparent);
          border-top-color: var(--brand);
          border-radius: 999px;
          animation: aaSpin 0.8s linear infinite;
        }
        @keyframes aaSpin { to { transform: rotate(360deg); } }

        @media (prefers-reduced-motion: reduce) {
          .db-chip, .db-rot, .db-rel, .aa-dot, .aa-loader { transition: none !important; animation: none; }
        }
      `}</style>
    </div>
  );
}