import fs from 'fs'
import path from 'path'

// Map doc IDs to actual markdown files
const docFileMap: Record<string, string> = {
  'setup-guide': 'SETUP_GUIDE.md',
  'jwt-template-setup': 'JWT_TEMPLATE_SETUP.md',
  'database-setup': 'SUPABASE_DATABASE_SETUP.md',
  'profile-features': 'PROFILE_MANAGEMENT_FEATURES.md',
  'public-profiles': 'PUBLIC_PROFILE_FEATURE.md',
  'featured-content': 'FEATURED_CONTENT_SYSTEM.md',
  'clerk-implementation': 'clerk-implementation.md',
  'production-setup': 'production-implementation.md',
  'profile-rls-fix': 'PROFILE_RLS_FIX.md',
  'profile-save-fix': 'PROFILE_SAVE_FIX_SUMMARY.md'
}

export async function getMarkdownContent(docId: string): Promise<string | null> {
  try {
    const fileName = docFileMap[docId]
    if (!fileName) {
      console.log(`No file mapping found for doc ID: ${docId}`)
      return null
    }

    const docsPath = path.join(process.cwd(), 'docs', fileName)
    
    // Check if file exists
    if (!fs.existsSync(docsPath)) {
      console.log(`File not found: ${docsPath}`)
      return null
    }

    const content = fs.readFileSync(docsPath, 'utf8')
    return content
  } catch (error) {
    console.error(`Error reading markdown file for ${docId}:`, error)
    return null
  }
}

export function getAvailableDocIds(): string[] {
  return Object.keys(docFileMap)
} 