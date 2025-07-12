import nodemailer from 'nodemailer'
import { IUser } from '../models/User'

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
}

// Create transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG)

// Verify email configuration
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    await transporter.verify()
    console.log('📧 Email configuration verified successfully')
    return true
  } catch (error) {
    console.error('❌ Email configuration verification failed:', error)
    return false
  }
}

// Send email verification
export async function sendEmailVerification(user: IUser, token: string): Promise<boolean> {
  try {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`
    
    const emailTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Email Verification - EduBoard LMS</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Welcome to EduBoard LMS!</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName},</h2>
            <p>Thank you for registering with EduBoard LMS. To complete your registration, please verify your email address by clicking the button below:</p>
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p><a href="${verificationUrl}">${verificationUrl}</a></p>
            <p>This verification link will expire in 24 hours.</p>
            <p>If you didn't create an account with us, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} EduBoard LMS. All rights reserved.</p>
          </div>
        </body>
      </html>
    `

    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `EduBoard LMS <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Verify your email address - EduBoard LMS',
      html: emailTemplate,
    })

    console.log('✅ Email verification sent successfully:', result.messageId)
    return true
  } catch (error) {
    console.error('❌ Failed to send email verification:', error)
    return false
  }
}

// Send password reset email
export async function sendPasswordResetEmail(user: IUser, token: string): Promise<boolean> {
  try {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`
    
    const emailTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset - EduBoard LMS</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName},</h2>
            <p>We received a request to reset your password for your EduBoard LMS account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <div class="warning">
              <strong>Important:</strong> This password reset link will expire in 1 hour. If you didn't request this password reset, please ignore this email or contact support if you have concerns.
            </div>
            <p>For security reasons, this link can only be used once.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} EduBoard LMS. All rights reserved.</p>
          </div>
        </body>
      </html>
    `

    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `EduBoard LMS <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request - EduBoard LMS',
      html: emailTemplate,
    })

    console.log('✅ Password reset email sent successfully:', result.messageId)
    return true
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error)
    return false
  }
}

// Send welcome email after verification
export async function sendWelcomeEmail(user: IUser): Promise<boolean> {
  try {
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    
    const emailTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to EduBoard LMS!</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .feature { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #667eea; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Welcome to EduBoard LMS!</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName},</h2>
            <p>Your email has been successfully verified! Welcome to EduBoard LMS, your comprehensive learning management system.</p>
            
            <div class="feature">
              <h3>🎓 What you can do:</h3>
              <ul>
                <li>Enroll in courses and track your progress</li>
                <li>Take quizzes and earn certificates</li>
                <li>Participate in community forums</li>
                <li>Build your learning profile and earn badges</li>
              </ul>
            </div>
            
            <p>Ready to start your learning journey?</p>
            <a href="${dashboardUrl}" class="button">Go to Dashboard</a>
            
            <p>If you have any questions, don't hesitate to reach out to our support team.</p>
            <p>Happy learning!</p>
            <p><strong>The EduBoard LMS Team</strong></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} EduBoard LMS. All rights reserved.</p>
          </div>
        </body>
      </html>
    `

    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `EduBoard LMS <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Welcome to EduBoard LMS! 🎉',
      html: emailTemplate,
    })

    console.log('✅ Welcome email sent successfully:', result.messageId)
    return true
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error)
    return false
  }
}

// Send notification email for important security events
export async function sendSecurityNotificationEmail(
  user: IUser,
  event: string,
  details: string
): Promise<boolean> {
  try {
    const emailTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Security Alert - EduBoard LMS</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .alert { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔒 Security Alert</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName},</h2>
            <div class="alert">
              <strong>Security Event:</strong> ${event}
            </div>
            <p><strong>Details:</strong> ${details}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p>If this was not you, please contact our support team immediately and consider changing your password.</p>
            <p>Stay secure!</p>
            <p><strong>The EduBoard LMS Security Team</strong></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} EduBoard LMS. All rights reserved.</p>
          </div>
        </body>
      </html>
    `

    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `EduBoard LMS Security <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Security Alert: ${event} - EduBoard LMS`,
      html: emailTemplate,
    })

    console.log('✅ Security notification email sent successfully:', result.messageId)
    return true
  } catch (error) {
    console.error('❌ Failed to send security notification email:', error)
    return false
  }
}