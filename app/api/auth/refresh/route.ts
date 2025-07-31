import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { z } from 'zod'

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
})

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { refreshToken } = refreshSchema.parse(body)
    
    // Verify refresh token
    let decoded: any
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET)
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid refresh token' },
        { status: 401 }
      )
    }
    
    // Find user and check if refresh token exists
    const user = await User.findById(decoded.userId)
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return NextResponse.json(
        { message: 'Invalid refresh token' },
        { status: 401 }
      )
    }
    
    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { message: 'Account is deactivated' },
        { status: 401 }
      )
    }
    
    // Generate new access token
    const newAccessToken = jwt.sign(
      { userId: user._id, type: 'access' },
      JWT_SECRET,
      { expiresIn: '15m' }
    )
    
    return NextResponse.json({
      token: newAccessToken,
      message: 'Token refreshed successfully'
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation error', errors: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}