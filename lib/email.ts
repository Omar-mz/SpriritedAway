import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

function getVerificationEmailTemplate(name: string, token: string): EmailTemplate {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`
  
  return {
    subject: 'Welcome to EduBoard - Verify Your Email',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Verify Your Email - EduBoard</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to EduBoard!</h1>
              <p>Your Learning Journey Starts Here</p>
            </div>
            <div class="content">
              <h2>Hi ${name}!</h2>
              <p>Thank you for joining EduBoard, the comprehensive Learning Management System designed to help you achieve your educational goals.</p>
              <p>To get started, please verify your email address by clicking the button below:</p>
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
              <p>Once verified, you'll be able to:</p>
              <ul>
                <li>Enroll in courses and track your progress</li>
                <li>Take quizzes and earn certificates</li>
                <li>Participate in forum discussions</li>
                <li>Earn XP and unlock achievements</li>
              </ul>
              <p>This verification link will expire in 24 hours.</p>
            </div>
            <div class="footer">
              <p>If you didn't create an account with EduBoard, please ignore this email.</p>
              <p>&copy; 2024 EduBoard LMS. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Welcome to EduBoard!

Hi ${name}!

Thank you for joining EduBoard. To complete your registration, please verify your email address by visiting:

${verificationUrl}

This verification link will expire in 24 hours.

If you didn't create an account with EduBoard, please ignore this email.

© 2024 EduBoard LMS. All rights reserved.
    `
  }
}

function getCourseCompletionEmailTemplate(name: string, courseName: string, certificateUrl?: string): EmailTemplate {
  return {
    subject: `Congratulations! You've completed ${courseName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Course Completion - EduBoard</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .achievement { background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Congratulations!</h1>
              <p>Course Completed Successfully</p>
            </div>
            <div class="content">
              <h2>Hi ${name}!</h2>
              <div class="achievement">
                <h3>🏆 Achievement Unlocked!</h3>
                <p>You have successfully completed <strong>${courseName}</strong></p>
              </div>
              ${certificateUrl ? `
                <p>Your certificate is ready! Download it using the link below:</p>
                <div style="text-align: center;">
                  <a href="${certificateUrl}" class="button">Download Certificate</a>
                </div>
              ` : ''}
              <p>What's next?</p>
              <ul>
                <li>Explore more courses in our catalog</li>
                <li>Share your achievement with friends</li>
                <li>Join our community forums</li>
                <li>Continue building your skills</li>
              </ul>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Congratulations!

Hi ${name}!

You have successfully completed ${courseName}.

${certificateUrl ? `Your certificate is ready! Download it here: ${certificateUrl}` : ''}

Keep up the great work and continue your learning journey with EduBoard!

© 2024 EduBoard LMS. All rights reserved.
    `
  }
}

export async function sendVerificationEmail(email: string, token: string, name: string) {
  const template = getVerificationEmailTemplate(name, token)
  
  const mailOptions = {
    from: process.env.FROM_EMAIL || 'noreply@eduboard.com',
    to: email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  }
  
  await transporter.sendMail(mailOptions)
}

export async function sendCourseCompletionEmail(email: string, name: string, courseName: string, certificateUrl?: string) {
  const template = getCourseCompletionEmailTemplate(name, courseName, certificateUrl)
  
  const mailOptions = {
    from: process.env.FROM_EMAIL || 'noreply@eduboard.com',
    to: email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  }
  
  await transporter.sendMail(mailOptions)
}

export async function sendPasswordResetEmail(email: string, token: string, name: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`
  
  const mailOptions = {
    from: process.env.FROM_EMAIL || 'noreply@eduboard.com',
    to: email,
    subject: 'Password Reset - EduBoard',
    html: `
      <h2>Password Reset Request</h2>
      <p>Hi ${name}!</p>
      <p>We received a request to reset your password. Click the link below to reset it:</p>
      <a href="${resetUrl}" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
    text: `Hi ${name}! Click this link to reset your password: ${resetUrl}. This link expires in 1 hour.`
  }
  
  await transporter.sendMail(mailOptions)
}