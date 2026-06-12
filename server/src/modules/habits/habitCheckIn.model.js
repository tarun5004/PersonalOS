import mongoose from 'mongoose';

const habitCheckInSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Habit',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      default: '',
      trim: true,
      maxLength: 200,
    },
  },
  {
    collection: 'habit_check_ins',
    timestamps: true,
  },
);

habitCheckInSchema.index({ userId: 1, habitId: 1, date: 1 }, { unique: true });
habitCheckInSchema.index({ userId: 1, month: 1 });

export const HabitCheckIn = mongoose.model('HabitCheckIn', habitCheckInSchema);
