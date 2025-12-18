'use client'

import { notFound } from 'next/navigation'
import { projects } from '@/lib/projects/data'
import { motion } from 'framer-motion'
import { ArrowLeft, Github, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface ProjectDetailPageProps {
  params: {
    id: string
  }
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = projects.find((p) => p.id === params.id)

  if (!project) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <Link
        href="/projects"
        className="inline-flex items-center space-x-2 text-foreground/70 hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-3">{project.name}</h1>
            <p className="text-xl text-foreground/70">{project.tagline}</p>
          </div>
          <div className="flex items-center space-x-3">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-card rounded transition-colors"
                title="GitHub"
              >
                <Github className="w-5 h-5 text-foreground/60 hover:text-foreground" />
              </a>
            )}
            {project.links.demo && (
              <a
                href={project.links.demo}
                className="p-2 hover:bg-card rounded transition-colors"
                title="Live Demo"
              >
                <ExternalLink className="w-5 h-5 text-foreground/60 hover:text-foreground" />
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-sm font-medium text-foreground/60 mb-2">Problem</h3>
            <p className="text-foreground/80">{project.problem}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-sm font-medium text-foreground/60 mb-2">Solution</h3>
            <p className="text-foreground/80">{project.solution}</p>
          </div>
        </div>
      </motion.div>

      {/* Architecture Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-foreground mb-6">System Architecture</h2>
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <p className="text-foreground/80 mb-6">{project.architecture.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-accent mb-3">On-Chain Responsibilities</h3>
              <ul className="space-y-2">
                {project.architecture.onChain.map((item, i) => (
                  <li key={i} className="flex items-start text-sm text-foreground/70">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-accent mb-3">Off-Chain Responsibilities</h3>
              <ul className="space-y-2">
                {project.architecture.offChain.map((item, i) => (
                  <li key={i} className="flex items-start text-sm text-foreground/70">
                    <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-semibold text-accent mb-3">Wallet Interaction Flow</h3>
          <div className="space-y-3">
            {project.architecture.flow.map((step, i) => (
              <div key={i} className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-sm font-medium text-accent mr-3">
                  {i + 1}
                </div>
                <p className="text-sm text-foreground/70 pt-1.5">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Tech Stack */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-foreground mb-6">Tech Stack</h2>
        <div className="flex flex-wrap gap-3">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground/80"
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.section>

      {/* Tradeoffs & Improvements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-foreground">Tradeoffs</h3>
          </div>
          <ul className="space-y-2">
            {project.tradeoffs.map((tradeoff, i) => (
              <li key={i} className="text-sm text-foreground/70 flex items-start">
                <span className="text-yellow-500 mr-2">▸</span>
                <span>{tradeoff}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-foreground">Future Improvements</h3>
          </div>
          <ul className="space-y-2">
            {project.improvements.map((improvement, i) => (
              <li key={i} className="text-sm text-foreground/70 flex items-start">
                <span className="text-green-500 mr-2">▸</span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  )
}

