import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '@/lib/data';
import { useTheme } from '@/context/ThemeContext';

export const readingTime = (text: string): number =>
  Math.max(1, Math.round((text || '').trim().split(/\s+/).length / 220));

/* Shared pointer-tilt hook → drives the .bt-* 3D card CSS vars (see blog styles). */
export function useTilt<E extends HTMLElement = HTMLElement>(maxX = 12, maxY = 14) {
  const ref = useRef<E>(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current =
      typeof window !== 'undefined' &&
      !!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduced.current) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--bt-rx', `${(-py * maxX).toFixed(2)}deg`);
    el.style.setProperty('--bt-ry', `${(px * maxY).toFixed(2)}deg`);
    el.style.setProperty('--bt-gx', `${(px * 50 + 50).toFixed(2)}%`);
    el.style.setProperty('--bt-gy', `${(py * 50 + 50).toFixed(2)}%`);
  };

  const onPointerLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--bt-rx', '0deg');
    el.style.setProperty('--bt-ry', '0deg');
  };

  return { ref, onPointerMove, onPointerLeave };
}

const ACCENTS = [
  { strong: '#8b5cf6', accent: '#c4b5fd' },
  { strong: '#22d3ee', accent: '#a5f3fc' },
  { strong: '#e879f9', accent: '#f5d0fe' },
  { strong: '#fbbf24', accent: '#fde68a' },
  { strong: '#34d399', accent: '#a7f3d0' },
  { strong: '#f472b6', accent: '#fbcfe8' },
];

interface BlogPostCardProps {
  post: BlogPost;
  index: number;
}

const BlogPostCard = ({ post, index }: BlogPostCardProps) => {
  const { t } = useTheme();
  const tilt = useTilt<HTMLAnchorElement>();
  const acc = ACCENTS[index % ACCENTS.length];
  const date = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const minutes = readingTime(post.content);
  const cardVars = {
    '--bt-strong': acc.strong,
    '--bt-accent': acc.accent,
  } as React.CSSProperties;

  return (
    <Link
      ref={tilt.ref}
      to={`/blog/${post.slug}`}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      className="bt group block h-full rounded-[22px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
    >
      <div className="bt-rot" style={cardVars}>
        {/* ── Media layer ── */}
        <div className="bt-media">
          {post.imageUrl && post.imageUrl !== '#' ? (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="bt-img"
              loading="lazy"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background:
                  'linear-gradient(135deg, color-mix(in srgb, var(--bt-strong) 42%, transparent), color-mix(in srgb, var(--bt-accent) 30%, transparent))',
              }}
            />
          )}
          <span className="bt-chip bt-chip-time">
            {minutes} {t('blog.minRead')}
          </span>
          <span className="bt-chip bt-chip-cat">
            <i className="bt-cat-dot" />
            {post.category || (post.tags?.[0] ?? 'General')}
          </span>
        </div>

        {/* ── Body layer ── */}
        <div className="bt-body">
          <div className="bt-author">
            <img
              src="/arab-woman-abaya-hijab-girl-muslim-working-laptop-office-education-online-entrepreneur-freelancer_1030874-9889.avif"
              alt={post.author}
              className="bt-avatar"
              loading="lazy"
            />
            <div className="bt-author-meta">
              <span className="bt-author-name">{post.author}</span>
              <span className="bt-date">{date}</span>
            </div>
          </div>
          <h3 className="bt-title">{post.title}</h3>
          <p className="bt-excerpt line-clamp-2">{post.excerpt}</p>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {(post.tags || []).slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-[10px] font-semibold rounded-full bt-tag"
              >
                {tag}
              </span>
            ))}
          </div>

          <span className="bt-read">
            {t('blog.readMore')}
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </div>

        {/* ── 3D gloss + halo ── */}
        <div className="bt-halo" aria-hidden="true" />
        <i className="bt-glare" aria-hidden="true" />
      </div>
    </Link>
  );
};

export default BlogPostCard;