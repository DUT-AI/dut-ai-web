export interface PredefinedSkill {
  id: string
  name: string
  category: 'tech' | 'tool'
}

export const PREDEFINED_TECHSTACK: PredefinedSkill[] = [
  // Languages
  { id: 'python', name: 'Python', category: 'tech' },
  { id: 'typescript', name: 'TypeScript', category: 'tech' },
  { id: 'javascript', name: 'JavaScript', category: 'tech' },
  { id: 'cpp', name: 'C++', category: 'tech' },
  { id: 'c', name: 'C', category: 'tech' },
  { id: 'java', name: 'Java', category: 'tech' },
  { id: 'go', name: 'Go', category: 'tech' },
  { id: 'rust', name: 'Rust', category: 'tech' },
  { id: 'html', name: 'HTML5', category: 'tech' },
  { id: 'css', name: 'CSS3', category: 'tech' },
  { id: 'sql', name: 'SQL', category: 'tech' },

  // Frameworks & Web
  { id: 'react', name: 'React', category: 'tech' },
  { id: 'react-native', name: 'React Native', category: 'tech' },
  { id: 'nextjs', name: 'Next.js', category: 'tech' },
  { id: 'nodejs', name: 'Node.js', category: 'tech' },
  { id: 'express', name: 'Express', category: 'tech' },
  { id: 'nestjs', name: 'NestJS', category: 'tech' },
  { id: 'fastapi', name: 'FastAPI', category: 'tech' },
  { id: 'django', name: 'Django', category: 'tech' },
  { id: 'flask', name: 'Flask', category: 'tech' },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'tech' },

  // AI & Data
  { id: 'pytorch', name: 'PyTorch', category: 'tech' },
  { id: 'tensorflow', name: 'TensorFlow', category: 'tech' },
  { id: 'opencv', name: 'OpenCV', category: 'tech' },

  // Databases
  { id: 'postgresql', name: 'PostgreSQL', category: 'tech' },
  { id: 'mysql', name: 'MySQL', category: 'tech' },
  { id: 'mongodb', name: 'MongoDB', category: 'tech' },
  { id: 'redis', name: 'Redis', category: 'tech' },
  { id: 'sqlite', name: 'SQLite', category: 'tech' },
]

export const PREDEFINED_TOOLSTACK: PredefinedSkill[] = [
  { id: 'vscode', name: 'VS Code', category: 'tool' },
  { id: 'pycharm', name: 'PyCharm', category: 'tool' },
  { id: 'jupyter', name: 'Jupyter', category: 'tool' },
  { id: 'postman', name: 'Postman', category: 'tool' },
  { id: 'git', name: 'Git', category: 'tool' },
  { id: 'github', name: 'GitHub', category: 'tool' },
  { id: 'docker', name: 'Docker', category: 'tool' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'tool' },
  { id: 'aws', name: 'AWS', category: 'tool' },
  { id: 'vercel', name: 'Vercel', category: 'tool' },
  { id: 'slack', name: 'Slack', category: 'tool' },
  { id: 'linux', name: 'Linux', category: 'tool' },
  { id: 'macos', name: 'MacOS', category: 'tool' },
  { id: 'figma', name: 'Figma', category: 'tool' },
]
