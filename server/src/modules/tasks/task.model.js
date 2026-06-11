import mongoose from 'mongoose';

export const TASK_PRIORITIES = ['Low', 'Medium', 'High'];
export const TASK_STATUSES = ['Todo', 'In Progress', 'Completed'];

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    priority: {
      type: String,
      enum: TASK_PRIORITIES,
      default: 'Medium',
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: TASK_STATUSES,
      default: 'Todo',
      required: true,
      index: true,
    },
  },
  {
    collection: 'tasks',
    timestamps: true,
  },
);

taskSchema.index({ createdAt: -1 });
taskSchema.index({ updatedAt: -1 });
taskSchema.index({ userId: 1, createdAt: -1 });
taskSchema.index({ userId: 1, updatedAt: -1 });
taskSchema.index({ userId: 1, dueDate: 1 });
taskSchema.index({ userId: 1, status: 1 });

export const Task = mongoose.model('Task', taskSchema);
