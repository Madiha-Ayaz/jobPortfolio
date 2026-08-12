/**
 * BlogPostCard
 * ------------
 * 3D-feel blog post card used on the Blog index.
 *  - 3D tilt on hover (TiltCard).
 *  - Cursor-tracked coloured glow.
 *  - Parallax depth on the cover image vs the text.
 *  - GSAP entrance animation.
 */
import { Link } from 'react-router-dom';
import { BlogPost } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TiltCard, { TiltLayer } from '@/components/3d/TiltCard';

gsap.registerPlugin(ScrollTrigger);

interface BlogPostCardProps {
  post: BlogPost;
  index: number;
}

const BlogPostCard = ({ post, index }: BlogPostCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      cardRef.current,
      { autoAlpha: 0, y: 50 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        delay: (index % 2) * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, { scope: cardRef });

  return (
    <div ref={cardRef} className="opacity-0 h-full">
      <Link to={`/blog/${post.slug}`} className="block group h-full">
        <TiltCard
          className="rounded-xl overflow-hidden border border-border-color bg-gray-800/30 backdrop-blur-sm h-full"
          intensity={9}
          depth={24}
          glowColor="rgba(236, 72, 153, 0.30)"
        >
          <div className="relative h-56 overflow-hidden">
            <TiltLayer depth={36} className="w-full h-full">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 will-change-transform"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </TiltLayer>
          </div>

          <TiltLayer depth={16} className="p-6">
            <p className="text-sm text-text-secondary mb-2">
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
            <h3 className="text-2xl font-bold text-text group-hover:text-accent transition-colors mb-3 drop-shadow">
              {post.title}
            </h3>
            <p className="text-text-secondary mb-4">{post.excerpt}</p>
            <span className="font-semibold text-accent">Read More →</span>
          </TiltLayer>
        </TiltCard>
      </Link>
    </div>
  );
};

export default BlogPostCard;
