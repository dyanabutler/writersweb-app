import { NextRequest, NextResponse } from 'next/server'
import { getMarkdownContent } from '@/lib/docs/markdown-reader'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const content = await getMarkdownContent(params.slug)
    
    if (!content) {
      return NextResponse.json(
        { error: 'Documentation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error fetching documentation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 