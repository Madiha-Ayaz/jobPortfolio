
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { lazy, Suspense } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Lazy load 3D scene to keep initial bundle small
const HeroScene3D = lazy(() => import('../3d/HeroScene3D'));

const Hero = () => {
  useGSAP(() => {
    // Set initial states for a more dynamic "3D" entrance
    gsap.set('.hero-section', { perspective: 800 });
    gsap.set('.hero-image', { autoAlpha: 0, scale: 0.5, rotationY: -30 });
    gsap.set('.char', { autoAlpha: 0, y: 40, rotationX: -90, z: -50 });
    gsap.set('.sub-text', { autoAlpha: 0, y: 30 });
    gsap.set('.hero-cta', { autoAlpha: 0, y: 30 });

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.to('.char', {
      autoAlpha: 1,
      y: 0,
      rotationX: 0,
      z: 0,
      stagger: {
        each: 0.03,
        from: 'random'
      },
      duration: 1,
    })
    .to('.sub-text', {
      autoAlpha: 1,
      y: 0,
      duration: 1,
    }, "-=0.8")
    .to('.hero-cta', {
        autoAlpha: 1,
        y: 0,
        duration: 1,
    }, "-=0.8")
    .to('.hero-image', {
      autoAlpha: 1,
      scale: 1,
      rotationY: 0,
      duration: 1.5,
      ease: 'elastic.out(1, 0.5)',
    }, "-=0.8");

    // Enhanced parallax scroll effect for a more "3D" feel
    gsap.to('.hero-content', {
        y: -150,
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
        }
    });
    
    gsap.to('.hero-image', {
        y: -250,
        scale: 1.2,
        rotationX: 10,
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
        }
    });

  }, []);

  const text = "Crafting Digital Experiences";
  const chars = text.split('').map((char, index) => (
    <span key={index} className="char inline-block">{char === ' ' ? '\u00A0' : char}</span>
  ));

  return (
    <section id="hero" className="hero-section text-center min-h-screen flex flex-col items-center justify-center overflow-hidden relative">
      {/* 3D Background Scene */}
      <Suspense fallback={null}>
        <HeroScene3D />
      </Suspense>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-900/70 z-[1]" />

      <div className="relative z-10 hero-content">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4">
          {chars}
        </h1>
        <p className="sub-text text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-8">
          A Full-Stack Developer specializing in creating beautiful, functional, and user-centric web applications.
        </p>
        <div className="hero-cta flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <Link to="/projects" className="bg-accent text-white font-bold py-3 px-8 rounded-full hover:bg-accent-dark transition-colors">
            View My Work
          </Link>
          <Link to="/contact" className="border border-border-color text-text-secondary font-bold py-3 px-8 rounded-full hover:border-accent hover:text-accent transition-colors">
            Contact Me
          </Link>
        </div>
      </div>
      
      {/* Decorative background image removed to avoid parsing error and 404s */}
    </section>
  );
};

export default Hero;
