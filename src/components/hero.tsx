
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { FaPlay, FaCode, FaRocket } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const roles = [
  'Frontend Developer',
  'React Specialist',
  'UI/UX Engineer',
  'Next.js Expert'
]

export default function HeroSection() {
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopNum, setLoopNum] = useState(0)
  const [typingSpeed, setTypingSpeed] = useState(150)

  useEffect(() => {
    const handleType = () => {
      const current = loopNum % roles.length
      const fullText = roles[current]

      setText(isDeleting 
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1)
      )

      setTypingSpeed(isDeleting ? 30 : 150)

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 500)
      } else if (isDeleting && text === '') {
        setIsDeleting(false)
        setLoopNum(loopNum + 1)
      }
    }

    const timer = setTimeout(handleType, typingSpeed)
    return () => clearTimeout(timer)
  }, [text, isDeleting, loopNum, typingSpeed])

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full filter blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-cyan-400/20 rounded-full filter blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-200/20 dark:border-indigo-800/20 rounded-full text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-4">
              👋 Welcome to my portfolio
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="block text-slate-800 dark:text-white">Hi, I&apos;m</span>
            <span className="block gradient-text fire-animation">Madiha Ayaz</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-600 dark:text-slate-300 mb-8 h-16 flex items-center justify-center lg:justify-start"
          >
            <span className="mr-2">I&apos;m a</span>
            <span className="gradient-text border-r-2 border-indigo-500 pr-2">
              {text}
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
          >
            I create exceptional digital experiences with modern technologies. 
            Passionate about clean code, user experience, and bringing ideas to life 
            through innovative web solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link
              to="/projects"
              className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 glow-effect"
            >
              <span className="relative z-10 flex items-center justify-center">
                <FaRocket className="mr-2 group-hover:animate-bounce" />
                View My Work
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.05 }}
              />
            </Link>

            <Link
              to="/contact"
              className="group px-8 py-4 border-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 font-semibold rounded-full hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-400 dark:hover:text-slate-900 transition-all duration-300 hover:scale-105 flex items-center justify-center"
            >
              <FaPlay className="mr-2 group-hover:translate-x-1 transition-transform duration-300" />
              Let&apos;s Talk
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-slate-200 dark:border-slate-700"
          >
            {[
              { number: '50+', label: 'Projects Completed' },
              { number: '3+', label: 'Years Experience' },
              { number: '100%', label: 'Client Satisfaction' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Image/Animation */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative w-80 h-80 md:w-96 md:h-96">
            {/* Profile Image Placeholder */}
            <motion.div
              className="w-full h-full bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-6xl font-bold shadow-2xl"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <FaCode className="text-8xl opacity-20" />
            </motion.div>

            {/* Floating Elements */}
            {[
              { icon: '⚛️', position: 'top-0 left-0', delay: 0 },
              { icon: '🎨', position: 'top-0 right-0', delay: 1 },
              { icon: '💻', position: 'bottom-0 left-0', delay: 2 },
              { icon: '🚀', position: 'bottom-0 right-0', delay: 3 }
            ].map((item, index) => (
              <motion.div
                key={index}
                className={`absolute ${item.position} w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-2xl shadow-lg border border-slate-200 dark:border-slate-700`}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: item.delay
                }}
              >
                {item.icon}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-slate-400 dark:border-slate-600 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}