// src/app/blog/page.tsx
import { blogPosts } from '@/lib/data';
import AnimatedSection from '@/components/ui/AnimatedSection';
import BlogPostCard from '@/components/blog/BlogPostCard';

export default function BlogPage() {
  return (
    <div>
      <AnimatedSection>
        <h1 className="text-4xl font-bold text-center mb-4">From the Blog</h1>
        <p className="text-lg text-text-secondary text-center max-w-3xl mx-auto mb-12">
          Thoughts on web development, technology, and creative coding.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {blogPosts.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      </AnimatedSection>
    </div>
  );
}
