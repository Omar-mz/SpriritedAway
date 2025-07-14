import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IQuestion {
  id: string
  type: 'multiple-choice' | 'checkbox' | 'fill-in-blank' | 'true-false' | 'essay'
  question: string
  options?: string[]
  correctAnswers: string[]
  explanation?: string
  points: number
  order: number
}

export interface IQuiz extends Document {
  title: string
  description: string
  course?: mongoose.Types.ObjectId
  lesson?: mongoose.Types.ObjectId
  questions: IQuestion[]
  timeLimit: number // in minutes, 0 for unlimited
  attempts: number // maximum attempts, 0 for unlimited
  passingScore: number // percentage
  isRandomized: boolean
  showResults: boolean
  isPublished: boolean
  isActive: boolean
  metadata: {
    totalAttempts: number
    averageScore: number
    passRate: number
  }
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const questionSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'checkbox', 'fill-in-blank', 'true-false', 'essay'],
    required: true
  },
  question: {
    type: String,
    required: true,
    maxlength: 1000
  },
  options: [{
    type: String,
    maxlength: 500
  }],
  correctAnswers: [{
    type: String,
    required: true
  }],
  explanation: {
    type: String,
    maxlength: 1000
  },
  points: {
    type: Number,
    required: true,
    min: 0
  },
  order: {
    type: Number,
    required: true,
    min: 0
  }
})

const quizSchema = new Schema<IQuiz>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    maxlength: 1000
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  },
  lesson: {
    type: Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  questions: [questionSchema],
  timeLimit: {
    type: Number,
    default: 0,
    min: 0
  },
  attempts: {
    type: Number,
    default: 3,
    min: 0
  },
  passingScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  isRandomized: {
    type: Boolean,
    default: false
  },
  showResults: {
    type: Boolean,
    default: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    totalAttempts: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    passRate: {
      type: Number,
      default: 0
    }
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

// Indexes
quizSchema.index({ course: 1 })
quizSchema.index({ lesson: 1 })
quizSchema.index({ isPublished: 1, isActive: 1 })

const Quiz: Model<IQuiz> = mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', quizSchema)

export default Quiz