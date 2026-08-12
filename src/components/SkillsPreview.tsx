// components/SkillsPreview.tsx

import { motion } from 'framer-motion'
import { FaReact, FaNodeJs, FaJs, FaHtml5, FaCss3Alt, FaGitAlt } from 'react-icons/fa'
import { SiTypescript, SiNextdotjs, SiTailwindcss, SiMongodb, SiPostgresql, SiFigma } from 'react-icons/si'
import { Link } from 'react-router-dom'

interface Skill {
  name: string
  icon: React.ReactNode
  level: number
  category: 'frontend' | 'backend' | 'tools' | 'design'
}

export default function SkillsPreview() {
  const skills: Skill[] = [
    { name: 'React', icon: <FaReact />, level: 95, category: 'frontend' },
    { name: 'TypeScript', icon: <SiTypescript />, level: 90, category: 'frontend' },
    { name: 'Next.js', icon: <SiNextdotjs />, level: 88, category: 'frontend' },
    { name: 'JavaScript', icon: <FaJs />, level: 92, category: 'frontend' },
    { name: 'Tailwind CSS', icon: <SiTailwindcss />, level: 85, category: 'frontend' },
    { name: 'Python', icon: <FaNodeJs />, level: 80, category: 'backend' },
    { name: 'javascript', icon: <SiMongodb />, level: 75, category: 'backend' },
    { name: 'ai chatboats', icon: <SiPostgresql />, level: 70, category: 'backend' },
    { name: 'firebase ', icon: <FaGitAlt />, level: 85, category: 'tools' },
    { name: 'Figma', icon: <SiFigma />, level: 80, category: 'design' },
    { name: 'HTML5', icon: <FaHtml5 />, level: 95, category: 'frontend' },
    { name: 'CSS3', icon: <FaCss3Alt />, level: 90, category: 'frontend' }
  ]

  const categories = ['frontend', 'backend', 'tools', 'design'] as const

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'frontend': return 'from-blue-500 to-cyan-500'
      case 'backend': return 'from-green-500 to-emerald-500'
      case 'tools': return 'from-orange-500 to-red-500'
      case 'design': return 'from-purple-500 to-pink-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full filter blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-200/20 dark:border-blue-800/20 rounded-full text-blue-600 dark:text-blue-400 font-medium text-sm mb-6">
            🚀 Technical Skills
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">My Expertise</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            A comprehensive skill set covering modern web development technologies, 
            from frontend frameworks to backend solutions and design tools.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-16">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                {/* Skill Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${getCategoryColor(skill.category)} rounded-2xl flex items-center justify-center text-white text-2xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  {skill.icon}
                </div>

                {/* Skill Name */}
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white text-center mb-3">
                  {skill.name}
                </h3>

                {/* Skill Level Bar */}
                <div className="relative">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2">
                    <motion.div
                      className={`h-2 bg-gradient-to-r ${getCategoryColor(skill.category)} rounded-full`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 text-center block">
                    {skill.level}%
                  </span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-2 right-2">
                  <span className={`inline-block w-3 h-3 bg-gradient-to-r ${getCategoryColor(skill.category)} rounded-full`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Category Legend */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6 mb-16"
        >
          {categories.map((category) => (
            <div key={category} className="flex items-center gap-2">
              <div className={`w-4 h-4 bg-gradient-to-r ${getCategoryColor(category)} rounded-full`} />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400 capitalize">
                {category}
              </span>
            </div>
          ))}
        </motion.div>

        {/* View All Skills Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            to="/skills"
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 glow-effect"
          >
            <span className="mr-2">Explore All Skills</span>
            <motion.div
              className="w-5 h-5"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              🚀
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}