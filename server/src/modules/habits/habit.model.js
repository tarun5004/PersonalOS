import mongoose from 'mongoose';

export const HABIT_NAME_MAX_LENGTH = 50;
export const HABIT_DESCRIPTION_MAX_LENGTH = 120;
export const DEFAULT_HABIT_COLOR = '#1D9E75';
export const HABIT_COLOR_OPTIONS = [
  DEFAULT_HABIT_COLOR,
  '#D68910',
  '#C0392B',
  '#378ADD',
  '#7F77DD',
  '#D4537E',
  '#639922',
  '#888780',
];

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
    description: {
      type: String,
      default: '',
      trim: true,
      maxLength: HABIT_DESCRIPTION_MAX_LENGTH,
    },
    color: {
      type: String,
      default: DEFAULT_HABIT_COLOR,
      enum: HABIT_COLOR_OPTIONS,
    },
  },
  {
    collection: 'habits',
    timestamps: true,
  },
);

export const Habit = mongoose.model('Habit', habitSchema);
