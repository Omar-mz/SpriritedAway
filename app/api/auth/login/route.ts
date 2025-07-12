import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import connectDB from '@/lib/mongodb'
import User, { AccountStatus } from '@/lib/models/User'
import { generateTokenPair } from '@/lib/auth/jwt'
import { verify2FA } from '@/lib/auth/2fa'
import { sendSecurityNotificationEmail } from '@/lib/auth/email'
import { withRateLimit } from '@/lib/auth/middleware'

// Login schema validation
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  twoFactorCode: z.string().optional(),
  rememberMe: z.boolean().optional().default(false),
})

// POST /api/auth/login
async function loginHandler(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    
    // Validate request body
    const validationResult = loginSchema.safeParse(body)
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
    
    const { email, password, twoFactorCode, rememberMe } = validationResult.data
    
    // Connect to database
    await connectDB()
    
    // Find user and include password for verification
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password +twoFactorSecret +twoFactorBackupCodes +refreshTokens')
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Check account status
    if (user.status === AccountStatus.SUSPENDED) {
      return NextResponse.json(
        { error: 'Account is suspended. Please contact support.' },
        { status: 403 }
      )
    }
    
    if (user.status === AccountStatus.DEACTIVATED) {
      return NextResponse.json(
        { error: 'Account is deactivated. Please contact support.' },
        { status: 403 }
      )
    }
    
    // Check email verification
    if (!user.emailVerified) {
      return NextResponse.json(
        { 
          error: 'Email not verified. Please verify your email before logging in.',
          requiresEmailVerification: true
        },
        { status: 403 }
      )
    }
    
    // Handle 2FA if enabled
    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        return NextResponse.json(
          { 
            error: 'Two-factor authentication code required',
            requires2FA: true
          },
          { status: 200 }
        )
      }
      
      // Verify 2FA code
      const twoFactorResult = verify2FA(
        twoFactorCode,
        user.twoFactorSecret || '',
        user.twoFactorBackupCodes || []
      )
      
      if (!twoFactorResult.success) {
        return NextResponse.json(
          { error: twoFactorResult.error || 'Invalid 2FA code' },
          { status: 401 }
        )
      }
      
      // If backup code was used, update user's backup codes
      if (twoFactorResult.method === 'backup') {
        // Remove the used backup code
        const updatedBackupCodes = user.twoFactorBackupCodes?.filter(
          code => !twoFactorCode || code !== twoFactorCode
        ) || []
        user.twoFactorBackupCodes = updatedBackupCodes
        await user.save()
        
        // Send security notification
        await sendSecurityNotificationEmail(
          user,
          'Backup Code Used',
          `A backup code was used to access your account. ${twoFactorResult.remainingBackupCodes} backup codes remaining.`
        )
      }
    }
    
    // Generate JWT tokens
    const { accessToken, refreshToken } = generateTokenPair(user)
    
    // Save refresh token to user
    user.addRefreshToken(refreshToken)
    user.lastLogin = new Date()
    
    // Update user status to active if pending
    if (user.status === AccountStatus.PENDING) {
      user.status = AccountStatus.ACTIVE
    }
    
    await user.save()
    
    // Prepare response data
    const responseData = {
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        xp: user.xp,
        level: user.level,
        badges: user.badges,
        preferences: user.preferences,
        lastLogin: user.lastLogin,
      },
      tokens: {
        accessToken,
        refreshToken: rememberMe ? refreshToken : undefined, // Only include refresh token if remember me is checked
      }
    }
    
    // Set HTTP-only cookie for refresh token if remember me is enabled
    const response = NextResponse.json(responseData, { status: 200 })
    
    if (rememberMe) {
      response.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
      })
    }
    
    return response
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Apply rate limiting to login endpoint
export async function POST(request: NextRequest): Promise<NextResponse> {
  return withRateLimit(
    request,
    {
      maxRequests: 10, // 10 login attempts
      windowMs: 15 * 60 * 1000, // per 15 minutes
      message: 'Too many login attempts. Please try again later.',
    },
    loginHandler
  )
}