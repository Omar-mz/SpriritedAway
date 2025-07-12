import speakeasy from 'speakeasy'
import qrcode from 'qrcode'
import crypto from 'crypto'

// 2FA configuration
const APP_NAME = process.env.APP_NAME || 'EduBoard LMS'
const ISSUER_NAME = process.env.ISSUER_NAME || 'EduBoard'

// Generate 2FA secret
export function generate2FASecret(userEmail: string): {
  secret: string
  otpauth_url: string
  manual_entry_key: string
} {
  const secret = speakeasy.generateSecret({
    name: `${APP_NAME} (${userEmail})`,
    issuer: ISSUER_NAME,
    length: 20,
  })

  return {
    secret: secret.base32,
    otpauth_url: secret.otpauth_url!,
    manual_entry_key: secret.base32,
  }
}

// Generate QR code for 2FA setup
export async function generate2FAQRCode(otpauth_url: string): Promise<string> {
  try {
    const qrCodeDataURL = await qrcode.toDataURL(otpauth_url, {
      width: 256,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
    return qrCodeDataURL
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

// Verify 2FA token
export function verify2FAToken(token: string, secret: string): boolean {
  try {
    // Remove any spaces or dashes from token
    const cleanToken = token.replace(/[\s-]/g, '')
    
    // Verify token with a window of 1 (30 seconds before and after)
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: cleanToken,
      window: 1,
    })

    return verified
  } catch (error) {
    console.error('Error verifying 2FA token:', error)
    return false
  }
}

// Generate backup codes
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = []
  
  for (let i = 0; i < count; i++) {
    // Generate 8-character backup code
    const code = crypto.randomBytes(4).toString('hex').toUpperCase()
    codes.push(code)
  }
  
  return codes
}

// Validate backup code format
export function isValidBackupCodeFormat(code: string): boolean {
  // Backup codes should be 8 characters, alphanumeric
  const cleanCode = code.replace(/[\s-]/g, '')
  return /^[A-Fa-f0-9]{8}$/.test(cleanCode)
}

// Hash backup codes for secure storage
export function hashBackupCodes(codes: string[]): string[] {
  return codes.map(code => {
    const cleanCode = code.replace(/[\s-]/g, '').toUpperCase()
    return crypto.createHash('sha256').update(cleanCode).digest('hex')
  })
}

// Verify backup code
export function verifyBackupCode(inputCode: string, hashedCodes: string[]): boolean {
  try {
    const cleanCode = inputCode.replace(/[\s-]/g, '').toUpperCase()
    const hashedInput = crypto.createHash('sha256').update(cleanCode).digest('hex')
    
    return hashedCodes.includes(hashedInput)
  } catch (error) {
    console.error('Error verifying backup code:', error)
    return false
  }
}

// Remove used backup code
export function removeUsedBackupCode(usedCode: string, hashedCodes: string[]): string[] {
  try {
    const cleanCode = usedCode.replace(/[\s-]/g, '').toUpperCase()
    const hashedUsedCode = crypto.createHash('sha256').update(cleanCode).digest('hex')
    
    return hashedCodes.filter(code => code !== hashedUsedCode)
  } catch (error) {
    console.error('Error removing used backup code:', error)
    return hashedCodes
  }
}

// Generate current TOTP token (for testing purposes)
export function generateCurrentTOTPToken(secret: string): string {
  return speakeasy.totp({
    secret: secret,
    encoding: 'base32',
  })
}

// Get remaining time for current TOTP token
export function getRemainingTOTPTime(): number {
  const epoch = Math.round(new Date().getTime() / 1000.0)
  const countDown = 30 - (epoch % 30)
  return countDown
}

// Validate 2FA setup
export interface Setup2FAResult {
  success: boolean
  error?: string
  qrCodeDataURL?: string
  manualEntryKey?: string
  backupCodes?: string[]
}

export async function setup2FA(userEmail: string, verificationToken: string): Promise<Setup2FAResult> {
  try {
    // Generate secret
    const secretData = generate2FASecret(userEmail)
    
    // Verify the token to ensure the user has set up their authenticator correctly
    const isValid = verify2FAToken(verificationToken, secretData.secret)
    
    if (!isValid) {
      return {
        success: false,
        error: 'Invalid verification token. Please check your authenticator app.',
      }
    }
    
    // Generate QR code
    const qrCodeDataURL = await generate2FAQRCode(secretData.otpauth_url)
    
    // Generate backup codes
    const backupCodes = generateBackupCodes()
    
    return {
      success: true,
      qrCodeDataURL,
      manualEntryKey: secretData.manual_entry_key,
      backupCodes,
    }
  } catch (error) {
    console.error('Error setting up 2FA:', error)
    return {
      success: false,
      error: 'Failed to set up 2FA. Please try again.',
    }
  }
}

// 2FA verification result
export interface Verify2FAResult {
  success: boolean
  method: '2fa' | 'backup' | null
  remainingBackupCodes?: number
  error?: string
}

export function verify2FA(
  token: string,
  secret: string,
  backupCodes: string[]
): Verify2FAResult {
  try {
    // First try to verify as TOTP token
    if (verify2FAToken(token, secret)) {
      return {
        success: true,
        method: '2fa',
      }
    }
    
    // If TOTP fails, try as backup code
    if (isValidBackupCodeFormat(token) && verifyBackupCode(token, backupCodes)) {
      const remainingCodes = backupCodes.length - 1
      return {
        success: true,
        method: 'backup',
        remainingBackupCodes: remainingCodes,
      }
    }
    
    return {
      success: false,
      method: null,
      error: 'Invalid 2FA token or backup code.',
    }
  } catch (error) {
    console.error('Error verifying 2FA:', error)
    return {
      success: false,
      method: null,
      error: 'Failed to verify 2FA. Please try again.',
    }
  }
}