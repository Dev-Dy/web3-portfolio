export interface PersonalInfo {
  name: string
  title: string
  tagline: string
  location: string
  timezone: string
  availability: 'open' | 'busy' | 'consulting'
  email: string
  bio: string
  yearsExperience: number
  education?: Education[]
  certifications?: Certification[]
}

export interface Education {
  degree: string
  institution: string
  year: string
  description?: string
}

export interface Certification {
  name: string
  issuer: string
  year: string
  link?: string
}

export interface Experience {
  company: string
  role: string
  startDate: string
  endDate: string | 'Present'
  description: string
  achievements: string[]
  techStack: string[]
  link?: string
}

export const personalInfo: PersonalInfo = {
  name: 'Dheeraj Yadav',
  title: 'Web3 & Blockchain Engineer',
  tagline: 'Building decentralized systems with architectural precision',
  location: 'India',
  timezone: 'IST (UTC+5:30)',
  availability: 'consulting',
  email: 'dheerajkryadav08@gmail.com',
  bio: 'Web3 engineer focused on building decentralized systems with a strong emphasis on architecture, security, and user experience. Specialized in Solana blockchain development, smart contract design, and full-stack Web3 applications. I approach Web3 development with a systems-thinking mindset, ensuring that every component from smart contracts to frontend interfaces is designed for scalability, maintainability, and production readiness.',
  yearsExperience: 3,
  education: [
    {
      degree: 'Bachelor\'s Degree',
      institution: 'Apj Abdul Kalam Technological University',
      year: '2019',
      description: 'Computer Science and Engineering'
    }
  ],
  certifications: []
}

export const experience: Experience[] = [
  {
    company: 'Optimiser',
    role: 'Senior Software Engineer',
    startDate: '2021',
    endDate: 'Present',
    description: 'Leading development of decentralized applications on Solana blockchain',
    achievements: [
      'Architected and deployed multiple production smart contracts',
      'Built scalable frontend applications with wallet integration',
      'Optimized transaction costs and improved user experience'
    ],
    techStack: ['Solana', 'Rust', 'Anchor', 'Next.js', 'TypeScript'],
    link: 'https://www.optimiser.com'
  }
]
