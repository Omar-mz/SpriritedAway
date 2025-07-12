import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import connectDB from '@/lib/mongodb'
import User, { UserRole, AccountStatus } from '@/lib/models/User'
import { sendEmailVerification } from '@/lib/auth/email'
import { withRateLimit } from '@/lib/auth/middleware'

// Registration schema validation
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// POST /api/auth/register
async function registerHandler(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    
    // Validate request body
    const validationResult = registerSchema.safeParse(body)
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
    
    const { email, password, firstName, lastName } = validationResult.data
    
    // Connect to database
    await connectDB()
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }
    
    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      role: UserRole.USER,
      status: AccountStatus.PENDING,
    })
    
    // Generate email verification token
    const verificationToken = user.generateEmailVerificationToken()
    
    // Save user to database
    await user.save()
    
    // Send verification email
    const emailSent = await sendEmailVerification(user, verificationToken)
    
    if (!emailSent) {
      console.error('Failed to send verification email for user:', user.email)
      // Don't fail registration if email fails, just log it
    }
    
    // Return success response (without sensitive data)
    return NextResponse.json(
      {
        message: 'Registration successful! Please check your email to verify your account.',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          status: user.status,
          emailVerified: user.emailVerified,
        }
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Apply rate limiting to registration endpoint
export async function POST(request: NextRequest): Promise<NextResponse> {
  return withRateLimit(
    request,
    {
      maxRequests: 5, // 5 registration attempts
      windowMs: 15 * 60 * 1000, // per 15 minutes
      message: 'Too many registration attempts. Please try again later.',
    },
    registerHandler
  )
}