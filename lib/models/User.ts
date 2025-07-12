import mongoose, { Schema, Document, Model } from 'mongoose'
import bcrypt from 'bcryptjs'

// User roles enum
export enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
}

// User account status
export enum AccountStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  DEACTIVATED = 'deactivated',
}

// User interface
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  email: string
  password: string
  firstName: string
  lastName: string
  fullName: string
  avatar?: string
  role: UserRole
  status: AccountStatus
  
  // Email verification
  emailVerified: boolean
  emailVerificationToken?: string
  emailVerificationExpires?: Date
  
  // Password reset
  passwordResetToken?: string
  passwordResetExpires?: Date
  
  // 2FA
  twoFactorEnabled: boolean
  twoFactorSecret?: string
  twoFactorBackupCodes?: string[]
  
  // Refresh tokens
  refreshTokens: string[]
  
  // Profile information
  bio?: string
  dateOfBirth?: Date
  phoneNumber?: string
  location?: string
  website?: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    github?: string
  }
  
  // Learning progress
  xp: number
  level: number
  badges: string[]
  
  // Preferences
  preferences: {
    notifications: {
      email: boolean
      push: boolean
      inApp: boolean
    }
    theme: 'light' | 'dark' | 'system'
    language: string
  }
  
  // Timestamps
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
  
  // Instance methods
  comparePassword(candidatePassword: string): Promise<boolean>
  generateEmailVerificationToken(): string
  generatePasswordResetToken(): string
  addRefreshToken(token: string): void
  removeRefreshToken(token: string): void
  clearRefreshTokens(): void
}

// User schema
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false, // Don't include password in queries by default
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    status: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.PENDING,
    },
    
    // Email verification
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    
    // Password reset
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    
    // 2FA
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      select: false,
    },
    twoFactorBackupCodes: {
      type: [String],
      select: false,
    },
    
    // Refresh tokens
    refreshTokens: {
      type: [String],
      select: false,
    },
    
    // Profile information
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    dateOfBirth: Date,
    phoneNumber: String,
    location: String,
    website: String,
    socialLinks: {
      twitter: String,
      linkedin: String,
      github: String,
    },
    
    // Learning progress
    xp: {
      type: Number,
      default: 0,
      min: 0,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    badges: {
      type: [String],
      default: [],
    },
    
    // Preferences
    preferences: {
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: true,
        },
        inApp: {
          type: Boolean,
          default: true,
        },
      },
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
      },
      language: {
        type: String,
        default: 'en',
      },
    },
    
    // Timestamps
    lastLogin: Date,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        const { 
          password, 
          refreshTokens, 
          emailVerificationToken, 
          emailVerificationExpires, 
          passwordResetToken, 
          passwordResetExpires, 
          twoFactorSecret, 
          twoFactorBackupCodes, 
          ...safeRet 
        } = ret
        return safeRet
      },
    },
  }
)

// Virtual for full name
userSchema.virtual('fullName').get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`
})

// Indexes
userSchema.index({ email: 1 })
userSchema.index({ role: 1 })
userSchema.index({ status: 1 })
userSchema.index({ createdAt: -1 })

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  
  try {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12')
    this.password = await bcrypt.hash(this.password, saltRounds)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

// Instance method to generate email verification token
userSchema.methods.generateEmailVerificationToken = function (): string {
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  this.emailVerificationToken = token
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  return token
}

// Instance method to generate password reset token
userSchema.methods.generatePasswordResetToken = function (): string {
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  this.passwordResetToken = token
  this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  return token
}

// Instance method to add refresh token
userSchema.methods.addRefreshToken = function (token: string): void {
  this.refreshTokens.push(token)
}

// Instance method to remove refresh token
userSchema.methods.removeRefreshToken = function (token: string): void {
  this.refreshTokens = this.refreshTokens.filter((rt: string) => rt !== token)
}

// Instance method to clear all refresh tokens
userSchema.methods.clearRefreshTokens = function (): void {
  this.refreshTokens = []
}

// Create and export model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema)

export default User