import mongoose, { Document, Model, Schema } from 'mongoose'

export interface ILesson extends Document {
  title: string
  description: string
  content: string
  type: 'video' | 'text' | 'interactive' | 'assignment'
  videoUrl?: string
  duration: number // in minutes
  order: number
  isPublished: boolean
  course: mongoose.Types.ObjectId
  resources: mongoose.Types.ObjectId[]
  quiz?: mongoose.Types.ObjectId
  isPreview: boolean
  metadata: {
    views: number
    completions: number
    averageTimeSpent: number
  }
  createdAt: Date
  updatedAt: Date
}

const lessonSchema = new Schema<ILesson>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    maxlength: 500
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['video', 'text', 'interactive', 'assignment'],
    required: true
  },
  videoUrl: {
    type: String,
    default: null
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  order: {
    type: Number,
    required: true,
    min: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  resources: [{
    type: Schema.Types.ObjectId,
    ref: 'Resource'
  }],
  quiz: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    default: null
  },
  isPreview: {
    type: Boolean,
    default: false
  },
  metadata: {
    views: {
      type: Number,
      default: 0
    },
    completions: {
      type: Number,
      default: 0
    },
    averageTimeSpent: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
})

// Indexes
lessonSchema.index({ course: 1, order: 1 })
lessonSchema.index({ isPublished: 1 })

const Lesson: Model<ILesson> = mongoose.models.Lesson || mongoose.model<ILesson>('Lesson', lessonSchema)

export default Lesson