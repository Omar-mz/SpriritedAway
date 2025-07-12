import jwt, { JwtPayload } from 'jsonwebtoken'
import { IUser } from '../models/User'

// JWT payload interface
export interface JWTPayload extends JwtPayload {
  userId: string
  email: string
  role: string
  type: 'access' | 'refresh'
}

// JWT secrets
const JWT_SECRET = process.env.JWT_SECRET!
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT secrets are not defined in environment variables')
}

// Generate access token
export function generateAccessToken(user: IUser): string {
  const payload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    type: 'access',
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    issuer: process.env.NEXT_PUBLIC_APP_NAME || 'EduBoard LMS',
  })
}

// Generate refresh token
export function generateRefreshToken(user: IUser): string {
  const payload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    type: 'refresh',
  }

  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: process.env.NEXT_PUBLIC_APP_NAME || 'EduBoard LMS',
  })
}

// Generate token pair
export function generateTokenPair(user: IUser): { accessToken: string; refreshToken: string } {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  }
}

// Verify access token
export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    
    if (decoded.type !== 'access') {
      return null
    }
    
    return decoded
  } catch (error) {
    console.error('Access token verification failed:', error)
    return null
  }
}

// Verify refresh token
export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload
    
    if (decoded.type !== 'refresh') {
      return null
    }
    
    return decoded
  } catch (error) {
    console.error('Refresh token verification failed:', error)
    return null
  }
}

// Extract token from Authorization header
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader) return null
  
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }
  
  return parts[1]
}

// Get token expiration time
export function getTokenExpirationTime(token: string): Date | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload
    if (!decoded || !decoded.exp) return null
    
    return new Date(decoded.exp * 1000)
  } catch (error) {
    return null
  }
}

// Check if token is expired
export function isTokenExpired(token: string): boolean {
  const expirationTime = getTokenExpirationTime(token)
  if (!expirationTime) return true
  
  return expirationTime < new Date()
}