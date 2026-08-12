
import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaGithub, FaExternalLinkAlt, FaPlay } from 'react-icons/fa'
import { Link } from 'react-router-dom'

interface Project {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  demoUrl?: string
  codeUrl?: string
  featured: boolean
}

export default function FeaturedProjects() {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)

  const featuredProjects: Project[] = [
    {
      id: '1',
      title: 'E-Commerce Platform',
      description: 'A modern e-commerce solution built with Next.js, featuring real-time inventory, payment integration, and admin dashboard.',
      image: '/api/placeholder/600/400',
      tags: ['Next.js', 'TypeScript', 'Stripe', 'Prisma', 'Tailwind CSS'],
      demoUrl: 'https://demo.example.com',
      codeUrl: 'https://github.com/example',
      featured: true
    },
    {
      id: '2', 
      title: 'Task Management App',
      description: 'Collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
      image: '/api/placeholder/600/400',
      tags: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Material-UI'],
      demoUrl: 'https://demo.example.com',
      codeUrl: 'https://github.com/example',
      featured: true
    },
    {
      id: '3',
      title: 'AI-Powered Dashboard',
      description: 'Analytics dashboard with AI-driven insights, interactive charts, and predictive analytics for business intelligence.',
      image: '/api/placeholder/600/400',
      tags: ['React', 'D3.js', 'Python', 'TensorFlow', 'FastAPI'],
      demoUrl: 'https://demo.example.com',
      codeUrl: 'https://github.com/example',
      featured: true
    }
  ]

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full filter blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full filter blur-3xl" />
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
          <span className="inline-block px-6 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-200/20 dark:border-indigo-800/20 rounded-full text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-6">
            💼 Featured Work
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">Recent Projects</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Discover some of my latest work where creativity meets functionality. 
            Each project represents a unique challenge solved with modern technologies.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200/50 dark:border-slate-700/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <FaPlay className="text-white text-xl ml-1" />
                    </div>
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                  >
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                      {project.demoUrl && (
                        <motion.a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-white/20 backdrop-blur-sm text-white text-center py-2 px-4 rounded-lg hover:bg-white/30 transition-colors duration-200 text-sm font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaExternalLinkAlt className="inline mr-2" />
                          Live Demo
                        </motion.a>
                      )}
                      {project.codeUrl && (
                        <motion.a
                          href={project.codeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-white/20 backdrop-blur-sm text-white text-center py-2 px-4 rounded-lg hover:bg-white/30 transition-colors duration-200 text-sm font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaGithub className="inline mr-2" />
                          Code
                        </motion.a>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded-full border border-indigo-200/30 dark:border-indigo-800/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Projects Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            to="/projects"
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 glow-effect"
          >
            <span className="mr-2">View All Projects</span>
            <motion.div
              className="w-5 h-5"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <FaExternalLinkAlt />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
