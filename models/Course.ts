import mongoose, { Document, Model, Schema } from 'mongoose'

export interface ICourse extends Document {
  title: string
  description: string
  content: string
  coverImage?: string
  videoUrl?: string
  authors: mongoose.Types.ObjectId[]
  category: string
  tags: mongoose.Types.ObjectId[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number // in minutes
  price: number
  isPaid: boolean
  isPublished: boolean
  isActive: boolean
  enrollmentCount: number
  rating: number
  reviewCount: number
  lessons: mongoose.Types.ObjectId[]
  quizzes: mongoose.Types.ObjectId[]
  resources: mongoose.Types.ObjectId[]
  prerequisites: mongoose.Types.ObjectId[]
  learningObjectives: string[]
  targetAudience: string
  certificateTemplate?: string
  completionCriteria: {
    lessonsRequired: number
    quizzesRequired: number
    minimumScore: number
  }
  metadata: {
    lastUpdated: Date
    version: string
    views: number
    likes: number
    bookmarks: number
  }
  seo: {
    metaTitle?: string
    metaDescription?: string
    keywords: string[]
  }
  createdAt: Date
  updatedAt: Date
}

const courseSchema = new Schema<ICourse>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  content: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    default: null
  },
  videoUrl: {
    type: String,
    default: null
  },
  authors: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  category: {
    type: String,
    required: true
  },
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  enrollmentCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  lessons: [{
    type: Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  quizzes: [{
    type: Schema.Types.ObjectId,
    ref: 'Quiz'
  }],
  resources: [{
    type: Schema.Types.ObjectId,
    ref: 'Resource'
  }],
  prerequisites: [{
    type: Schema.Types.ObjectId,
    ref: 'Course'
  }],
  learningObjectives: [{
    type: String,
    maxlength: 200
  }],
  targetAudience: {
    type: String,
    maxlength: 500
  },
  certificateTemplate: {
    type: String,
    default: null
  },
  completionCriteria: {
    lessonsRequired: {
      type: Number,
      default: 0
    },
    quizzesRequired: {
      type: Number,
      default: 0
    },
    minimumScore: {
      type: Number,
      default: 70,
      min: 0,
      max: 100
    }
  },
  metadata: {
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    version: {
      type: String,
      default: '1.0.0'
    },
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    bookmarks: {
      type: Number,
      default: 0
    }
  },
  seo: {
    metaTitle: {
      type: String,
      maxlength: 60
    },
    metaDescription: {
      type: String,
      maxlength: 160
    },
    keywords: [{
      type: String
    }]
  }
}, {
  timestamps: true
})

// Indexes for better query performance
courseSchema.index({ title: 'text', description: 'text' })
courseSchema.index({ category: 1, difficulty: 1 })
courseSchema.index({ isPublished: 1, isActive: 1 })
courseSchema.index({ 'authors': 1 })
courseSchema.index({ 'tags': 1 })
courseSchema.index({ rating: -1, enrollmentCount: -1 })

const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>('Course', courseSchema)

export default Course