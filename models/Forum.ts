import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IForumComment extends Document {
  content: string
  author: mongoose.Types.ObjectId
  post: mongoose.Types.ObjectId
  parent?: mongoose.Types.ObjectId // for nested replies
  likes: mongoose.Types.ObjectId[]
  isReported: boolean
  isActive: boolean
  reportCount: number
  createdAt: Date
  updatedAt: Date
}

export interface IForumPost extends Document {
  title: string
  content: string
  author: mongoose.Types.ObjectId
  course?: mongoose.Types.ObjectId
  category: string
  tags: string[]
  views: number
  likes: mongoose.Types.ObjectId[]
  comments: mongoose.Types.ObjectId[]
  isPinned: boolean
  isLocked: boolean
  isReported: boolean
  isActive: boolean
  reportCount: number
  lastActivity: Date
  createdAt: Date
  updatedAt: Date
}

const forumCommentSchema = new Schema<IForumComment>({
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'ForumPost',
    required: true
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'ForumComment',
    default: null
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  isReported: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  reportCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

const forumPostSchema = new Schema<IForumPost>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  },
  category: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    maxlength: 50
  }],
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'ForumComment'
  }],
  isPinned: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  isReported: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  reportCount: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Indexes
forumPostSchema.index({ title: 'text', content: 'text' })
forumPostSchema.index({ category: 1, lastActivity: -1 })
forumPostSchema.index({ author: 1 })
forumPostSchema.index({ course: 1 })
forumPostSchema.index({ tags: 1 })

forumCommentSchema.index({ post: 1, createdAt: 1 })
forumCommentSchema.index({ author: 1 })
forumCommentSchema.index({ parent: 1 })

export const ForumPost: Model<IForumPost> = mongoose.models.ForumPost || mongoose.model<IForumPost>('ForumPost', forumPostSchema)
export const ForumComment: Model<IForumComment> = mongoose.models.ForumComment || mongoose.model<IForumComment>('ForumComment', forumCommentSchema)

export default { ForumPost, ForumComment }