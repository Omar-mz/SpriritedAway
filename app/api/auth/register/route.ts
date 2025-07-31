import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { sendVerificationEmail } from '@/lib/email'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
})

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    const validatedData = registerSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: validatedData.email.toLowerCase() },
        { username: validatedData.username }
      ]
    })
    
    if (existingUser) {
      return NextResponse.json(
        { 
          message: existingUser.email === validatedData.email.toLowerCase() 
            ? 'Email already registered' 
            : 'Username already taken'
        },
        { status: 400 }
      )
    }
    
    // Create new user
    const user = new User({
      email: validatedData.email.toLowerCase(),
      password: validatedData.password,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      username: validatedData.username,
      role: 'user'
    })
    
    // Generate verification token
    const verificationToken = user.generateVerificationToken()
    await user.save()
    
    // Send verification email
    try {
      await sendVerificationEmail(user.email, verificationToken, user.firstName)
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Continue with registration even if email fails
    }
    
    return NextResponse.json(
      { 
        message: 'Registration successful. Please check your email to verify your account.',
        userId: user._id
      },
      { status: 201 }
    )
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation error', errors: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}