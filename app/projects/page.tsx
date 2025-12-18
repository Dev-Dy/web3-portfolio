'use client'

import { projects } from '@/lib/projects/data'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { motion } from 'framer-motion'
import { Code2, Layers } from 'lucide-react'

export default function ProjectsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-accent/10 rounded-xl">
            <Code2 className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-5xl font-bold text-foreground">Projects</h1>
        </div>
        <p className="text-xl text-foreground/80 max-w-3xl leading-relaxed">
          Web3 systems built with a focus on architecture, scalability, and production-ready
          smart contracts. Each project is presented as a complete system with clear
          on-chain and off-chain responsibilities.
        </p>
      </motion.div>

      <div className="mb-8 flex items-center space-x-2 text-sm text-foreground/60">
        <Layers className="w-4 h-4" />
        <span>{projects.length} projects</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 bg-gradient-to-br from-card/80 to-background/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-card"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-accent to-accent-dark rounded-full" />
          <h3 className="text-2xl font-bold text-foreground">
            Architecture-First Approach
          </h3>
        </div>
        <p className="text-base text-foreground/80 mb-6 leading-relaxed">
          Each project is designed with clear separation between on-chain and off-chain
          responsibilities. Smart contracts handle state and business logic, while
          frontend and indexers provide user experience and data aggregation.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-background/30 rounded-xl border border-border/50">
            <h4 className="text-foreground font-semibold mb-3 text-accent">On-Chain</h4>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li className="flex items-center">
                <span className="text-accent mr-2">▸</span>
                State management
              </li>
              <li className="flex items-center">
                <span className="text-accent mr-2">▸</span>
                Business logic
              </li>
              <li className="flex items-center">
                <span className="text-accent mr-2">▸</span>
                Permission enforcement
              </li>
              <li className="flex items-center">
                <span className="text-accent mr-2">▸</span>
                Transaction validation
              </li>
            </ul>
          </div>
          <div className="p-5 bg-background/30 rounded-xl border border-border/50">
            <h4 className="text-foreground font-semibold mb-3 text-accent">Off-Chain</h4>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li className="flex items-center">
                <span className="text-accent mr-2">▸</span>
                User interface
              </li>
              <li className="flex items-center">
                <span className="text-accent mr-2">▸</span>
                Data indexing
              </li>
              <li className="flex items-center">
                <span className="text-accent mr-2">▸</span>
                Analytics & charts
              </li>
              <li className="flex items-center">
                <span className="text-accent mr-2">▸</span>
                Notification systems
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
