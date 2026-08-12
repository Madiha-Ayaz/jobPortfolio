// src/app/blog/[slug]/page.tsx
import { blogPosts } from '@/lib/data';
import { useParams } from 'react-router-dom';
import AnimatedSection from '@/components/ui/AnimatedSection';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <AnimatedSection>
      <article className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">{post.title}</h1>
        <div className="text-center text-text-secondary mb-8">
          <span>By {post.author}</span>
          <span className="mx-2">&bull;</span>
          <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        
        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-12">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="object-cover w-full h-full"
          />
        </div>

        <div 
          className="prose prose-invert prose-lg max-w-none mx-auto
                     prose-h3:text-accent prose-a:text-accent hover:prose-a:text-accent-dark"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-12 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="bg-accent/20 text-accent text-xs font-semibold px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
      </article>
    </AnimatedSection>
  );
}
