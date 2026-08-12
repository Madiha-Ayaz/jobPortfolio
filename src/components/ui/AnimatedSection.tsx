'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AnimatedSection = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (section) {
      gsap.fromTo(section, 
        { autoAlpha: 0, y: 50 }, 
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, { scope: sectionRef });

  return (
    <div ref={sectionRef} className={`opacity-0 ${className}`}>
      {children}
    </div>
  );
};

export default AnimatedSection;
