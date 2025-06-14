export interface DocSection {
  id: string
  title: string
  description: string
  icon: string
  docs: DocItem[]
}

export interface DocItem {
  id: string
  title: string
  description: string
  path: string
  category: 'setup' | 'features' | 'technical' | 'troubleshooting'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  lastUpdated: string
}

export const docsData: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Essential setup and configuration guides',
    icon: '🚀',
    docs: [
      {
        id: 'setup-guide',
        title: 'Complete Setup Guide',
        description: 'Step-by-step guide to set up your Story Manager with Supabase and Clerk',
        path: '/docs/setup-guide',
        category: 'setup',
        difficulty: 'beginner',
        lastUpdated: '2024-01-15'
      },
      {
        id: 'jwt-template-setup',
        title: 'JWT Template Configuration',
        description: 'Configure Clerk JWT templates for Supabase integration',
        path: '/docs/jwt-template-setup',
        category: 'setup',
        difficulty: 'intermediate',
        lastUpdated: '2024-01-15'
      },
      {
        id: 'database-setup',
        title: 'Database Setup',
        description: 'Supabase database schema and RLS configuration',
        path: '/docs/database-setup',
        category: 'setup',
        difficulty: 'intermediate',
        lastUpdated: '2024-01-15'
      }
    ]
  },
  {
    id: 'profile-management',
    title: 'Profile Management',
    description: 'User profiles, pictures, and public sharing features',
    icon: '👤',
    docs: [
      {
        id: 'profile-features',
        title: 'Profile Management Features',
        description: 'Complete guide to profile pictures, display names, and bio editing',
        path: '/docs/profile-features',
        category: 'features',
        difficulty: 'beginner',
        lastUpdated: '2024-01-15'
      },
      {
        id: 'public-profiles',
        title: 'Public Profile System',
        description: 'Share your writing publicly with featured content and professional profiles',
        path: '/docs/public-profiles',
        category: 'features',
        difficulty: 'beginner',
        lastUpdated: '2024-01-15'
      },
      {
        id: 'featured-content',
        title: 'Featured Content System',
        description: 'Showcase your best stories, characters, and scenes',
        path: '/docs/featured-content',
        category: 'features',
        difficulty: 'intermediate',
        lastUpdated: '2024-01-15'
      }
    ]
  },
  {
    id: 'technical-guides',
    title: 'Technical Documentation',
    description: 'In-depth technical implementation details',
    icon: '⚙️',
    docs: [
      {
        id: 'clerk-implementation',
        title: 'Clerk Implementation',
        description: 'Authentication system implementation with Clerk',
        path: '/docs/clerk-implementation',
        category: 'technical',
        difficulty: 'advanced',
        lastUpdated: '2024-01-15'
      },
      {
        id: 'production-setup',
        title: 'Production Implementation',
        description: 'Deploy your Story Manager to production',
        path: '/docs/production-setup',
        category: 'technical',
        difficulty: 'advanced',
        lastUpdated: '2024-01-15'
      }
    ]
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Common issues and solutions',
    icon: '🔧',
    docs: [
      {
        id: 'profile-rls-fix',
        title: 'Profile RLS Issues',
        description: 'Fix Row Level Security issues with profile management',
        path: '/docs/profile-rls-fix',
        category: 'troubleshooting',
        difficulty: 'intermediate',
        lastUpdated: '2024-01-15'
      },
      {
        id: 'profile-save-fix',
        title: 'Profile Save Issues',
        description: 'Troubleshoot profile saving and persistence problems',
        path: '/docs/profile-save-fix',
        category: 'troubleshooting',
        difficulty: 'intermediate',
        lastUpdated: '2024-01-15'
      }
    ]
  }
]

export function getDocById(id: string): DocItem | null {
  for (const section of docsData) {
    const doc = section.docs.find(doc => doc.id === id)
    if (doc) return doc
  }
  return null
}

export function getDocsByCategory(category: DocItem['category']): DocItem[] {
  return docsData.flatMap(section => section.docs).filter(doc => doc.category === category)
} 