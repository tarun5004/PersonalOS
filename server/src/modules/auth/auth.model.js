import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    avatarId: {
      type: String,
      default: 'avatar_01',
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: '',
      trim: true,
    },
    avatarPublicId: {
      type: String,
      default: '',
      trim: true,
    },
    dashboardBackgroundUrl: {
      type: String,
      default: '',
      trim: true,
    },
    dashboardBackgroundPublicId: {
      type: String,
      default: '',
      trim: true,
    },
    xp: {
      type: Number,
      default: 0,
      min: 0,
    },
    achievementIds: {
      type: [String],
      default: [],
    },
  },
  {
    collection: 'users',
    timestamps: true,
  },
);

userSchema.index({ email: 1 }, { unique: true });

export const User = mongoose.model('User', userSchema);
