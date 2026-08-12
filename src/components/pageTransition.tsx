
// components/PageTransition.tsx

import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

interface PageTransitionProps {
  children: React.ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900"
        >
          <div className="relative">
            <motion.div
              className="w-20 h-20 border-4 border-transparent border-t-indigo-400 border-r-purple-400 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-2 w-16 h-16 border-4 border-transparent border-b-pink-400 border-l-cyan-400 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>
      ) : (
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}