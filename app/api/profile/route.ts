import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('Profile API: Starting request processing')
    
    // Verify authentication
    const { userId } = await auth()
    console.log('Profile API: Auth result:', { userId })
    
    if (!userId) {
      console.log('Profile API: No userId found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { bio, public_profile, email, full_name, avatar_url } = body
    console.log('Profile API: Request body:', { bio, public_profile, email, full_name, avatar_url })

    // Check if profile exists
    console.log('Profile API: Checking if profile exists for userId:', userId)
    const { data: existingProfile, error: checkError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle() // Use maybeSingle to avoid error when no row found

    if (checkError) {
      console.error('Profile API: Error checking existing profile:', checkError)
      return NextResponse.json(
        { error: 'Database error while checking profile' },
        { status: 500 }
      )
    }

    console.log('Profile API: Existing profile check result:', existingProfile)

    let result

    if (!existingProfile) {
      console.log('Profile API: Creating new profile')
      // Create profile if it doesn't exist
      result = await supabaseAdmin
        .from('profiles')
        .insert({
          id: userId,
          email: email || '',
          full_name: full_name || null,
          avatar_url: avatar_url || null,
          subscription_tier: 'free',
          bio: bio || null,
          public_profile: public_profile || false
        })
        .select()
        .single()
    } else {
      console.log('Profile API: Updating existing profile')
      // Update existing profile
      result = await supabaseAdmin
        .from('profiles')
        .update({
          email: email || '',
          full_name: full_name || null,
          avatar_url: avatar_url || null,
          bio: bio || null,
          public_profile: public_profile || false
        })
        .eq('id', userId)
        .select()
        .single()
    }

    console.log('Profile API: Database operation result:', result)

    if (result.error) {
      console.error('Profile API: Database operation error:', result.error)
      return NextResponse.json(
        { error: 'Failed to update profile', details: result.error.message },
        { status: 500 }
      )
    }

    console.log('Profile API: Success!')
    return NextResponse.json({ 
      success: true, 
      profile: result.data 
    })

  } catch (error) {
    console.error('Profile API: Unexpected error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 