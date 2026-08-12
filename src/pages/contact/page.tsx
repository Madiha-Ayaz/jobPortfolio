'use client';

import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/ui/AnimatedSection';
import EnhancedContactForm from '@/components/contact/EnhancedContactForm';
import ContactInfoCards from '@/components/contact/ContactInfoCards';
import JobCompatibilityAnalyzer from '@/components/ai/JobCompatibilityAnalyzer';

const CosmicBackground = lazy(() => import('@/components/3d/CosmicBackground'));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

export default function ContactPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Suspense fallback={<div className="absolute inset-0" style={{ background: '#08081a' }} />}>
        <CosmicBackground />
      </Suspense>

      <AnimatedSection>
        <motion.div
          className="relative z-10 max-w-6xl mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Header */}
          <motion.div className="text-center mb-16 pt-16" variants={itemVariants}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-5 px-5 py-2 text-xs font-bold tracking-[0.25em] uppercase rounded-full"
              style={{ border: '1px solid rgba(167,139,250,0.3)', background: 'rgba(167,139,250,0.08)', color: '#c4b5fd' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span>Get In Touch</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-heading">
              Contact Me
            </h1>

            <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
              Have a project inquiry or want to discuss opportunities? I&apos;d be happy to hear from you.
              Let&apos;s connect and explore possibilities.
            </p>
          </motion.div>

          {/* Main Grid */}
          <motion.div className="grid md:grid-cols-3 gap-8" variants={itemVariants}>
            <motion.div className="md:col-span-1" variants={itemVariants}>
              <ContactInfoCards />
            </motion.div>

            <motion.div className="md:col-span-2" variants={itemVariants}>
              <div
                className="relative p-8 rounded-2xl"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(167,139,250,0.12)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 40px rgba(167,139,250,0.04)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div className="absolute -top-px left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.4), rgba(6,182,212,0.4), transparent)' }} />

                <div className="relative z-10">
                  <h2 className="text-2xl font-black mb-8 text-heading">Send Your Message</h2>
                  <EnhancedContactForm />
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-4 flex items-center justify-center gap-2 text-xs text-dim"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <span>Your message is secure and confidential</span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ═══ AI JOB COMPATIBILITY ANALYZER ═══ */}
          <motion.div className="mt-16 max-w-4xl mx-auto" variants={itemVariants}>
            <JobCompatibilityAnalyzer />
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-16 text-center pb-16"
          >
            <div
              className="inline-flex items-center gap-6 px-8 py-5 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="text-left">
                <p className="text-sm text-muted mb-1">Looking for other ways to connect?</p>
                <p className="text-body font-semibold">Check out my social profiles</p>
              </div>
              <div className="flex items-center gap-3">
                {[
                  { href: 'https://github.com/Madiha-Ayaz?tab=repositories', label: 'GitHub', icon: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z' },
                  { href: 'https://www.linkedin.com/in/madiha-ayaz-ba68512b5/', label: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(167,139,250,0.15)'; e.currentTarget.style.borderColor = 'rgba(167,139,250,0.4)'; e.currentTarget.style.color = '#c4b5fd'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#94a3b8'; }}
                    aria-label={s.label}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={s.icon} /></svg>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatedSection>
    </div>
  );
}
