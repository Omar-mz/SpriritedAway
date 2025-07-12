import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken, extractTokenFromHeader, JWTPayload } from './jwt'
import { UserRole } from '../models/User'
import connectDB from '../mongodb'
import User from '../models/User'

// Extended request interface with user data
export interface AuthenticatedRequest extends NextRequest {
  user: {
    userId: string
    email: string
    role: UserRole
  }
}

// Authentication result interface
export interface AuthResult {
  success: boolean
  user?: {
    userId: string
    email: string
    role: UserRole
  }
  error?: string
}

// Authenticate user from request
export async function authenticateUser(request: NextRequest): Promise<AuthResult> {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader || undefined)
    
    if (!token) {
      return {
        success: false,
        error: 'No access token provided',
      }
    }
    
    // Verify token
    const payload = verifyAccessToken(token)
    
    if (!payload) {
      return {
        success: false,
        error: 'Invalid or expired access token',
      }
    }
    
    // Connect to database and verify user exists
    await connectDB()
    const user = await User.findById(payload.userId)
    
    if (!user) {
      return {
        success: false,
        error: 'User not found',
      }
    }
    
    // Check if user account is active
    if (user.status !== 'active') {
      return {
        success: false,
        error: 'Account is not active',
      }
    }
    
    return {
      success: true,
      user: {
        userId: payload.userId,
        email: payload.email,
        role: payload.role as UserRole,
      },
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return {
      success: false,
      error: 'Authentication failed',
    }
  }
}

// Middleware function to protect routes
export async function withAuth(
  request: NextRequest,
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const authResult = await authenticateUser(request)
  
  if (!authResult.success) {
    return NextResponse.json(
      { error: authResult.error || 'Authentication failed' },
      { status: 401 }
    )
  }
  
  // Attach user to request
  const authenticatedRequest = request as AuthenticatedRequest
  authenticatedRequest.user = authResult.user!
  
  return handler(authenticatedRequest)
}

// Middleware function to check user roles
export async function withRole(
  request: NextRequest,
  requiredRoles: UserRole[],
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const authResult = await authenticateUser(request)
  
  if (!authResult.success) {
    return NextResponse.json(
      { error: authResult.error || 'Authentication failed' },
      { status: 401 }
    )
  }
  
  // Check if user has required role
  if (!requiredRoles.includes(authResult.user!.role)) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    )
  }
  
  // Attach user to request
  const authenticatedRequest = request as AuthenticatedRequest
  authenticatedRequest.user = authResult.user!
  
  return handler(authenticatedRequest)
}

// Middleware function for admin only routes
export async function withAdminAuth(
  request: NextRequest,
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  return withRole(request, [UserRole.ADMIN], handler)
}

// Middleware function for moderator and admin routes
export async function withModeratorAuth(
  request: NextRequest,
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  return withRole(request, [UserRole.MODERATOR, UserRole.ADMIN], handler)
}

// Optional authentication middleware (doesn't require auth but adds user if present)
export async function withOptionalAuth(
  request: NextRequest,
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const authResult = await authenticateUser(request)
  
  // Attach user to request if authenticated, otherwise set to null
  const authenticatedRequest = request as AuthenticatedRequest
  if (authResult.success) {
    authenticatedRequest.user = authResult.user!
  } else {
    authenticatedRequest.user = null as any
  }
  
  return handler(authenticatedRequest)
}

// Rate limiting middleware (basic implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export interface RateLimitOptions {
  maxRequests: number
  windowMs: number
  message?: string
}

export async function withRateLimit(
  request: NextRequest,
  options: RateLimitOptions,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const { maxRequests, windowMs, message = 'Too many requests' } = options
  
  // Get client IP
  const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const key = `${clientIp}-${request.nextUrl.pathname}`
  
  const now = Date.now()
  const record = rateLimitMap.get(key)
  
  if (!record) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return handler(request)
  }
  
  if (now > record.resetTime) {
    // Reset the counter
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return handler(request)
  }
  
  if (record.count >= maxRequests) {
    return NextResponse.json(
      { error: message },
      { status: 429 }
    )
  }
  
  // Increment counter
  record.count++
  rateLimitMap.set(key, record)
  
  return handler(request)
}

// Combined middleware for authentication and rate limiting
export async function withAuthAndRateLimit(
  request: NextRequest,
  rateLimitOptions: RateLimitOptions,
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  return withRateLimit(request, rateLimitOptions, async (limitedRequest) => {
    return withAuth(limitedRequest, handler)
  })
}

// Utility function to check if user is authenticated in client-side components
export function isAuthenticated(user: any): boolean {
  return user && user.userId
}

// Utility function to check if user has specific role
export function hasRole(user: any, role: UserRole): boolean {
  return user && user.role === role
}

// Utility function to check if user has any of the specified roles
export function hasAnyRole(user: any, roles: UserRole[]): boolean {
  return user && roles.includes(user.role)
}

// Utility function to check if user is admin
export function isAdmin(user: any): boolean {
  return hasRole(user, UserRole.ADMIN)
}

// Utility function to check if user is moderator or admin
export function isModerator(user: any): boolean {
  return hasAnyRole(user, [UserRole.MODERATOR, UserRole.ADMIN])
}

// Error response helper
export function createErrorResponse(message: string, status: number): NextResponse {
  return NextResponse.json(
    { error: message },
    { status }
  )
}

// Success response helper
export function createSuccessResponse(data: any, status: number = 200): NextResponse {
  return NextResponse.json(data, { status })
}