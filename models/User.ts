import mongoose, { Document, Model, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: 'admin' | 'moderator' | 'user'
  isVerified: boolean
  isActive: boolean
  avatar?: string
  bio?: string
  dateOfBirth?: Date
  phone?: string
  xp: number
  level: number
  badges: string[]
  lastLogin?: Date
  emailVerificationToken?: string
  emailVerificationExpiry?: Date
  passwordResetToken?: string
  passwordResetExpiry?: Date
  twoFactorSecret?: string
  twoFactorEnabled: boolean
  refreshTokens: string[]
  preferences: {
    notifications: {
      email: boolean
      push: boolean
      inApp: boolean
    }
    theme: 'light' | 'dark' | 'system'
    language: string
  }
  socialLinks: {
    linkedin?: string
    twitter?: string
    github?: string
    website?: string
  }
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
  generateVerificationToken(): string
  generatePasswordResetToken(): string
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'moderator', 'user'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: 500
  },
  dateOfBirth: Date,
  phone: String,
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  badges: [{
    type: String
  }],
  lastLogin: Date,
  emailVerificationToken: String,
  emailVerificationExpiry: Date,
  passwordResetToken: String,
  passwordResetExpiry: Date,
  twoFactorSecret: String,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  refreshTokens: [{
    type: String
  }],
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true }
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  socialLinks: {
    linkedin: String,
    twitter: String,
    github: String,
    website: String
  }
}, {
  timestamps: true
})

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

// Generate verification token
userSchema.methods.generateVerificationToken = function (): string {
  const crypto = require('crypto')
  const token = crypto.randomBytes(32).toString('hex')
  this.emailVerificationToken = token
  this.emailVerificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  return token
}

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function (): string {
  const crypto = require('crypto')
  const token = crypto.randomBytes(32).toString('hex')
  this.passwordResetToken = token
  this.passwordResetExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  return token
}

// Calculate level based on XP
userSchema.virtual('calculatedLevel').get(function () {
  return Math.floor(this.xp / 1000) + 1
})

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema)

export default User