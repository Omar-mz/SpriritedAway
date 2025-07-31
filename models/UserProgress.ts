import mongoose, { Document, Model, Schema } from 'mongoose'

export interface ICourseProgress {
  course: mongoose.Types.ObjectId
  enrolledAt: Date
  lastAccessed: Date
  progress: number // percentage 0-100
  completedLessons: mongoose.Types.ObjectId[]
  completedQuizzes: mongoose.Types.ObjectId[]
  quizAttempts: {
    quiz: mongoose.Types.ObjectId
    attempts: number
    bestScore: number
    lastAttempt: Date
  }[]
  timeSpent: number // in minutes
  isCompleted: boolean
  completedAt?: Date
  certificateIssued: boolean
  certificateId?: mongoose.Types.ObjectId
  currentLesson?: mongoose.Types.ObjectId
}

export interface IUserProgress extends Document {
  user: mongoose.Types.ObjectId
  courses: ICourseProgress[]
  totalXP: number
  currentLevel: number
  badges: {
    badgeId: string
    earnedAt: Date
    description: string
  }[]
  achievements: {
    type: 'course_completion' | 'quiz_master' | 'streak' | 'forum_contributor'
    value: number
    achievedAt: Date
  }[]
  streaks: {
    current: number
    longest: number
    lastActivity: Date
  }
  statistics: {
    totalCoursesCompleted: number
    totalQuizzesPassed: number
    totalTimeSpent: number
    averageScore: number
    forumPosts: number
    forumComments: number
  }
  createdAt: Date
  updatedAt: Date
}

const courseProgressSchema = new Schema({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedLessons: [{
    type: Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  completedQuizzes: [{
    type: Schema.Types.ObjectId,
    ref: 'Quiz'
  }],
  quizAttempts: [{
    quiz: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true
    },
    attempts: {
      type: Number,
      default: 0
    },
    bestScore: {
      type: Number,
      default: 0
    },
    lastAttempt: {
      type: Date,
      default: Date.now
    }
  }],
  timeSpent: {
    type: Number,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateId: {
    type: Schema.Types.ObjectId,
    ref: 'Certificate'
  },
  currentLesson: {
    type: Schema.Types.ObjectId,
    ref: 'Lesson'
  }
})

const userProgressSchema = new Schema<IUserProgress>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  courses: [courseProgressSchema],
  totalXP: {
    type: Number,
    default: 0
  },
  currentLevel: {
    type: Number,
    default: 1
  },
  badges: [{
    badgeId: {
      type: String,
      required: true
    },
    earnedAt: {
      type: Date,
      default: Date.now
    },
    description: {
      type: String,
      required: true
    }
  }],
  achievements: [{
    type: {
      type: String,
      enum: ['course_completion', 'quiz_master', 'streak', 'forum_contributor'],
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    achievedAt: {
      type: Date,
      default: Date.now
    }
  }],
  streaks: {
    current: {
      type: Number,
      default: 0
    },
    longest: {
      type: Number,
      default: 0
    },
    lastActivity: {
      type: Date,
      default: Date.now
    }
  },
  statistics: {
    totalCoursesCompleted: {
      type: Number,
      default: 0
    },
    totalQuizzesPassed: {
      type: Number,
      default: 0
    },
    totalTimeSpent: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    forumPosts: {
      type: Number,
      default: 0
    },
    forumComments: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
})

// Indexes
userProgressSchema.index({ user: 1 })
userProgressSchema.index({ 'courses.course': 1 })

const UserProgress: Model<IUserProgress> = mongoose.models.UserProgress || mongoose.model<IUserProgress>('UserProgress', userProgressSchema)

export default UserProgress