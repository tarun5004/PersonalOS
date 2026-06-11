import mongoose from 'mongoose';

export const HABIT_NAME_MAX_LENGTH = 120;

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: HABIT_NAME_MAX_LENGTH,
    },
  },
  {
    collection: 'habits',
    timestamps: true,
  },
);

export const Habit = mongoose.model('Habit', habitSchema);
