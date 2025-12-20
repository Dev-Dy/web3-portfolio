'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Code2, Zap, Database, Lock, Download, MapPin, Clock, Mail, Copy, Check, Github, Linkedin, ExternalLink } from 'lucide-react'
import { personalInfo, experience, type Experience } from '@/lib/data/personal'
import { AnimatedCodingAvatar } from '@/components/about/AnimatedCodingAvatar'

const skills = [
  {
    category: 'Blockchain Development',
    items: ['Solana', 'Rust', 'Anchor', 'Smart Contracts', 'PDAs', 'Program Architecture'],
    icon: Code2,
    color: 'from-blue-500/20 to-blue-500/5',
  },
  {
    category: 'Web3 Integration',
    items: ['Wallet Adapters', 'RPC Integration', 'Transaction Handling', 'On-chain Queries'],
    icon: Zap,
    color: 'from-purple-500/20 to-purple-500/5',
  },
  {
    category: 'Frontend Development',
    items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    icon: Database,
    color: 'from-green-500/20 to-green-500/5',
  },
  {
    category: 'Security & Architecture',
    items: ['System Design', 'Account Models', 'Authority Patterns', 'Best Practices'],
    icon: Lock,
    color: 'from-accent/20 to-accent/5',
  },
]

const principles = [
  {
    title: 'Architecture First',
    description: 'Design systems with clear separation of concerns, scalable patterns, and production-ready code.',
  },
  {
    title: 'Security Focused',
    description: 'Implement proper validation, permission checks, and follow Solana security best practices.',
  },
  {
    title: 'User Experience',
    description: 'Build intuitive interfaces that make complex blockchain interactions accessible.',
  },
  {
    title: 'Continuous Learning',
    description: 'Stay updated with the latest in Web3, Solana ecosystem, and blockchain technology.',
  },
]

export default function AboutPage() {
  const [copied, setCopied] = useState(false)
  const [resumeDownloaded, setResumeDownloaded] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      // Fallback for browsers that don't support clipboard API or in insecure contexts
      console.warn('Failed to copy email to clipboard:', error)
      // Optionally show user feedback about the error
    }
  }

  const downloadResume = () => {
    // Create a link element and trigger download
    const link = document.createElement('a')
    link.href = '/resume.pdf' // Make sure to add resume.pdf to public folder
    link.download = `${personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    setResumeDownloaded(true)
    setTimeout(() => setResumeDownloaded(false), 3000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-20"
      >
        <div className="text-center mb-12">
          {/* Animated Coding Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: 0.1, duration: 0.8, type: 'spring', stiffness: 200 }}
            className="mb-8 flex justify-center"
          >
            <AnimatedCodingAvatar />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-6xl md:text-7xl font-black text-foreground mb-4"
          >
            <span className="gradient-text">{personalInfo.name}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-2xl md:text-3xl font-bold text-foreground/90 mb-6"
          >
            {personalInfo.title}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8"
          >
            {personalInfo.tagline}
          </motion.p>
          
          {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-6 mb-8"
      >
            <div className="flex items-center space-x-2 text-foreground/80">
              <MapPin className="w-5 h-5 text-accent" />
              <span>{personalInfo.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-foreground/80">
              <Clock className="w-5 h-5 text-accent" />
              <span>{personalInfo.timezone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-green-500"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-foreground/80 capitalize">{personalInfo.availability} for opportunities</span>
            </div>
          </motion.div>

          {/* Availability Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500/20 to-green-500/10 border border-green-500/30 rounded-full backdrop-blur-sm"
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-green-500"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm font-medium text-green-400">
              {personalInfo.availability === 'open' ? 'Open to Work' : 
               personalInfo.availability === 'consulting' ? 'Available for Consulting' : 
               'Currently Busy'}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Personal Details Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold text-foreground mb-8">About Me</h2>
        <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 space-y-6">
          <p className="text-lg text-foreground/80 leading-relaxed">
            {personalInfo.bio}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border/50">
            <div>
              <h3 className="text-sm font-semibold text-foreground/60 mb-3 uppercase tracking-wider">Experience</h3>
              <p className="text-2xl font-bold text-accent">{personalInfo.yearsExperience}+</p>
              <p className="text-sm text-foreground/70">Years in Web3 & Blockchain</p>
            </div>
            {personalInfo.education && personalInfo.education.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground/60 mb-3 uppercase tracking-wider">Education</h3>
                {personalInfo.education.map((edu, i: number) => (
                  <div key={i}>
                    <p className="text-lg font-bold text-foreground">{edu.degree}</p>
                    <p className="text-sm text-foreground/70">{edu.institution} • {edu.year}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Experience Timeline */}
      {experience.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-foreground mb-8">Experience</h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent/50 to-transparent hidden md:block" />
            
            <div className="space-y-8">
              {experience.map((exp: Experience, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  className="relative pl-0 md:pl-20"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-6 top-2 w-4 h-4 bg-accent rounded-full border-4 border-background hidden md:block" />
                  
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 card-hover group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-accent transition-colors">
                          {exp.role}
                        </h3>
                        <div className="flex items-center space-x-2 mb-2">
                          {exp.link ? (
                            <a
                              href={exp.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent hover:text-accent-light font-semibold flex items-center space-x-1"
                            >
                              <span>{exp.company}</span>
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          ) : (
                            <span className="text-accent font-semibold">{exp.company}</span>
                          )}
                        </div>
                        <p className="text-sm text-foreground/60">
                          {exp.startDate} - {exp.endDate}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-foreground/80 mb-4 leading-relaxed">{exp.description}</p>
                    
                    {exp.achievements.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-foreground/90 mb-2">Key Achievements:</h4>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i} className="flex items-start text-sm text-foreground/70">
                              <span className="text-accent mr-2 mt-1">▸</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {exp.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                        {exp.techStack.map((tech: string) => (
                          <span
                            key={tech}
                            className="px-3 py-1.5 text-xs bg-background/50 border border-border/50 rounded-lg text-foreground/80 font-medium backdrop-blur-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Skills */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold text-foreground mb-8">Technical Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill, index) => {
            const Icon = skill.icon
            return (
              <motion.div
                key={skill.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`bg-gradient-to-br ${skill.color} border border-border/50 rounded-2xl p-6 backdrop-blur-sm card-hover group`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-background/50 rounded-lg group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{skill.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <motion.span
                      key={item}
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1.5 text-sm bg-background/50 border border-border/50 rounded-lg text-foreground/80 font-medium backdrop-blur-sm"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* Principles */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold text-foreground mb-8">Development Principles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 card-hover group"
            >
              <div className="flex items-start space-x-3">
                <motion.div
                  className="w-1 h-12 bg-gradient-to-b from-accent to-accent-dark rounded-full flex-shrink-0"
                  whileHover={{ scaleY: 1.2 }}
                  transition={{ duration: 0.3 }}
                />
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{principle.title}</h3>
                  <p className="text-foreground/70 leading-relaxed">{principle.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Resume Download Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-20"
      >
        <div className="bg-gradient-to-br from-card/80 via-card/60 to-background/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 relative overflow-hidden group">
          {/* Animated background */}
      <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-accent-secondary/10 to-purple-500/10"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{ backgroundSize: '200% 200%' }}
          />
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-3">Resume</h2>
                <p className="text-foreground/80 mb-4 leading-relaxed">
                  Download my resume to learn more about my experience, skills, and achievements.
                </p>
                <div className="flex items-center space-x-4 text-sm text-foreground/60">
                  <span>PDF Format</span>
                  <span>•</span>
                  <span>Updated regularly</span>
                </div>
              </div>
              <motion.button
                onClick={downloadResume}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-accent to-accent-secondary text-black font-bold rounded-xl shadow-lg hover:shadow-xl transition-all group/btn"
              >
                {resumeDownloaded ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 group-hover/btn:animate-bounce" />
                    <span>Download Resume</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Enhanced Get in Touch Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-20"
      >
        <div className="bg-gradient-to-br from-card/80 to-background/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Get in Touch</h2>
          <p className="text-foreground/80 mb-8 leading-relaxed max-w-2xl">
          Interested in collaborating on Web3 projects, discussing blockchain architecture,
            or exploring decentralized systems? I'm always open to interesting conversations and opportunities.
          </p>
          
          {/* Email with Copy */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-foreground/60 mb-2 block uppercase tracking-wider">Email</label>
            <div className="flex items-center space-x-3">
              <div className="flex-1 px-4 py-3 bg-background/50 border border-border/50 rounded-lg flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent" />
                <span className="text-foreground font-mono">{personalInfo.email}</span>
              </div>
              <motion.button
                onClick={copyEmail}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-background/50 border border-border/50 rounded-lg hover:border-accent/50 hover:bg-background/70 transition-all"
                title="Copy email"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-foreground/60 hover:text-foreground transition-colors" />
                )}
              </motion.button>
              <motion.a
                href={`mailto:${personalInfo.email}`}
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 bg-gradient-to-r from-accent to-accent-secondary text-black font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Send Email
              </motion.a>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <label className="text-sm font-semibold text-foreground/60 mb-4 block uppercase tracking-wider">Connect</label>
        <div className="flex flex-wrap gap-4">
              <motion.a
            href="https://github.com/dev-dy"
            target="_blank"
            rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center space-x-2 px-6 py-3 bg-background/50 border border-border/50 rounded-lg text-foreground hover:border-accent/50 hover:bg-background/70 transition-all font-medium group"
          >
                <Github className="w-5 h-5 group-hover:text-accent transition-colors" />
                <span>GitHub</span>
              </motion.a>
              <motion.a
            href="https://www.linkedin.com/in/dheeraj-yadav-113a19166"
            target="_blank"
            rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center space-x-2 px-6 py-3 bg-background/50 border border-border/50 rounded-lg text-foreground hover:border-accent/50 hover:bg-background/70 transition-all font-medium group"
          >
                <Linkedin className="w-5 h-5 group-hover:text-accent transition-colors" />
                <span>LinkedIn</span>
              </motion.a>
            </div>
          </div>

          {/* Response Time */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <p className="text-sm text-foreground/60">
              <span className="text-accent font-semibold">Response Time:</span> I typically respond within 24 hours
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
