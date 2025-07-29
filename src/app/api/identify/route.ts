import { NextRequest, NextResponse } from 'next/server'
import { identifyPet } from '@/lib/petIdentifier'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an image.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Please upload an image smaller than 10MB.' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Identify the pet
    const result = await identifyPet(buffer, file.type)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error identifying pet:', error)
    return NextResponse.json(
      { error: 'Failed to identify pet breed. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Snake identification API endpoint. Use POST to upload an image.' },
    { status: 200 }
  )
}
