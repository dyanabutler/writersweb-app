import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if Blob token is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('BLOB_READ_WRITE_TOKEN is not configured')
      return NextResponse.json({ error: 'Storage not configured' }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }

    // Generate unique filename for character images
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const filename = `characters/${userId}/${timestamp}.${fileExtension}`

    console.log('Attempting to upload character image:', filename)

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    })

    console.log('Character image upload successful:', blob.url)

    return NextResponse.json({ 
      url: blob.url,
      filename: blob.pathname 
    })

  } catch (error) {
    console.error('Detailed character image upload error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Upload failed: ${errorMessage}` }, 
      { status: 500 }
    )
  }
} 