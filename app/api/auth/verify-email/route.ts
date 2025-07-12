import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import connectDB from '@/lib/mongodb'
import User, { AccountStatus } from '@/lib/models/User'
import { sendWelcomeEmail } from '@/lib/auth/email'
import { withRateLimit } from '@/lib/auth/middleware'

// Email verification schema
const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
})

// POST /api/auth/verify-email
async function verifyEmailHandler(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    
    // Validate request body
    const validationResult = verifyEmailSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }
    
    const { token } = validationResult.data
    
    // Connect to database
    await connectDB()
    
    // Find user with the verification token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    }).select('+emailVerificationToken +emailVerificationExpires')
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }
    
    // Check if email is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: 'Email is already verified' },
        { status: 200 }
      )
    }
    
    // Verify email
    user.emailVerified = true
    user.emailVerificationToken = undefined
    user.emailVerificationExpires = undefined
    
    // Activate account if it was pending
    if (user.status === AccountStatus.PENDING) {
      user.status = AccountStatus.ACTIVE
    }
    
    await user.save()
    
    // Send welcome email
    const welcomeEmailSent = await sendWelcomeEmail(user)
    if (!welcomeEmailSent) {
      console.error('Failed to send welcome email for user:', user.email)
    }
    
    return NextResponse.json(
      {
        message: 'Email verified successfully! Welcome to EduBoard LMS.',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: user.emailVerified,
          status: user.status,
        }
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/auth/verify-email?token=...
async function verifyEmailGetHandler(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }
    
    // Connect to database
    await connectDB()
    
    // Find user with the verification token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    }).select('+emailVerificationToken +emailVerificationExpires')
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }
    
    // Check if email is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: 'Email is already verified' },
        { status: 200 }
      )
    }
    
    // Verify email
    user.emailVerified = true
    user.emailVerificationToken = undefined
    user.emailVerificationExpires = undefined
    
    // Activate account if it was pending
    if (user.status === AccountStatus.PENDING) {
      user.status = AccountStatus.ACTIVE
    }
    
    await user.save()
    
    // Send welcome email
    const welcomeEmailSent = await sendWelcomeEmail(user)
    if (!welcomeEmailSent) {
      console.error('Failed to send welcome email for user:', user.email)
    }
    
    return NextResponse.json(
      {
        message: 'Email verified successfully! Welcome to EduBoard LMS.',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: user.emailVerified,
          status: user.status,
        }
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/auth/verify-email - for JSON requests
export async function POST(request: NextRequest): Promise<NextResponse> {
  return withRateLimit(
    request,
    {
      maxRequests: 10, // 10 verification attempts
      windowMs: 15 * 60 * 1000, // per 15 minutes
      message: 'Too many verification attempts. Please try again later.',
    },
    verifyEmailHandler
  )
}

// GET /api/auth/verify-email - for direct link clicks
export async function GET(request: NextRequest): Promise<NextResponse> {
  return withRateLimit(
    request,
    {
      maxRequests: 10, // 10 verification attempts
      windowMs: 15 * 60 * 1000, // per 15 minutes
      message: 'Too many verification attempts. Please try again later.',
    },
    verifyEmailGetHandler
  )
}