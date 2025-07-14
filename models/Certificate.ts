import mongoose, { Document, Model, Schema } from 'mongoose'

export interface ICertificate extends Document {
  user: mongoose.Types.ObjectId
  course: mongoose.Types.ObjectId
  certificateId: string // unique certificate ID
  qrCode: string // QR code for validation
  issuedAt: Date
  isVerified: boolean
  verifiedBy?: mongoose.Types.ObjectId
  verifiedAt?: Date
  template: string
  metadata: {
    userScore: number
    completionTime: number // in days
    courseDuration: number // in hours
    certificateHash: string // for blockchain verification (future)
  }
  isRevoked: boolean
  revokedAt?: Date
  revokedBy?: mongoose.Types.ObjectId
  revokeReason?: string
  createdAt: Date
  updatedAt: Date
}

const certificateSchema = new Schema<ICertificate>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  certificateId: {
    type: String,
    required: true,
    unique: true
  },
  qrCode: {
    type: String,
    required: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  },
  template: {
    type: String,
    default: 'default'
  },
  metadata: {
    userScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    completionTime: {
      type: Number,
      required: true,
      min: 0
    },
    courseDuration: {
      type: Number,
      required: true,
      min: 0
    },
    certificateHash: {
      type: String,
      default: ''
    }
  },
  isRevoked: {
    type: Boolean,
    default: false
  },
  revokedAt: {
    type: Date
  },
  revokedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  revokeReason: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
})

// Compound index for user-course uniqueness
certificateSchema.index({ user: 1, course: 1 }, { unique: true })
certificateSchema.index({ certificateId: 1 })
certificateSchema.index({ qrCode: 1 })
certificateSchema.index({ isVerified: 1 })

// Generate unique certificate ID before saving
certificateSchema.pre('save', function(next) {
  if (!this.certificateId) {
    const crypto = require('crypto')
    this.certificateId = `CERT-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`
  }
  next()
})

const Certificate: Model<ICertificate> = mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', certificateSchema)

export default Certificate