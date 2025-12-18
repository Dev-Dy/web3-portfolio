'use client'

import Link from 'next/link'
import { Project } from '@/lib/projects/data'
import { motion } from 'framer-motion'
import { ExternalLink, Github, ArrowRight } from 'lucide-react'

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 card-hover overflow-hidden"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-foreground/70 mb-3 leading-relaxed">{project.tagline}</p>
          </div>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              project.status === 'active'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : project.status === 'completed'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}
          >
            {project.status}
          </span>
        </div>

        <div className="mb-5 space-y-2">
          <p className="text-sm text-foreground/90 leading-relaxed">
            <span className="text-accent font-semibold">Problem:</span> {project.problem}
          </p>
          <p className="text-sm text-foreground/70 leading-relaxed">{project.solution}</p>
        </div>

        <div className="mb-5">
          <h4 className="text-xs font-semibold text-foreground/60 mb-3 uppercase tracking-wider">Tech Stack</h4>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 text-xs bg-background/50 border border-border/50 rounded-lg text-foreground/80 font-medium backdrop-blur-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-border/50">
          <Link
            href={`/projects/${project.id}`}
            className="flex items-center space-x-2 text-sm font-medium text-accent hover:text-accent-light transition-colors group/link"
          >
            <span>View Architecture</span>
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>
          <div className="flex items-center space-x-2">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-background/50 rounded-lg transition-all hover:scale-110"
                title="GitHub"
              >
                <Github className="w-4 h-4 text-foreground/60 hover:text-foreground transition-colors" />
              </a>
            )}
            {project.links.demo && (
              <a
                href={project.links.demo}
                className="p-2 hover:bg-background/50 rounded-lg transition-all hover:scale-110"
                title="Live Demo"
              >
                <ExternalLink className="w-4 h-4 text-foreground/60 hover:text-foreground transition-colors" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

