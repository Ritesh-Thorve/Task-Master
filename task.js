// task.js

/**
 * @typedef {Object} RecurrencePattern
 * @property {'daily'|'weekly'|'monthly'|'yearly'|'custom'} type - The type of recurrence
 * @property {Date} startDate - When the recurrence starts
 * @property {Date} [endDate] - Optional end date for recurrence
 * @property {number} [interval] - Interval for custom recurrence
 * @property {string} [intervalUnit] - Unit for custom recurrence interval
 * @property {number[]} [daysOfWeek] - Days of week (0-6, 0=Sunday) for weekly recurrence
 * @property {number} [dayOfMonth] - Day of month (1-31) for monthly recurrence
 * @property {number} [weekOfMonth] - Week of month (1-5, 5=last) for monthly recurrence
 * @property {number} [dayOfWeek] - Day of week (0-6, 0=Sunday) for monthly/yearly
 * @property {number} [monthOfYear] - Month of year (1-12, 1=January) for yearly
 */

/**
 * @typedef {Object} Task
 * @property {string} id - Unique identifier for the task
 * @property {string} title - Title of the task
 * @property {string} [description] - Optional description
 * @property {Date} [dueDate] - Optional due date
 * @property {boolean} completed - Completion status
 * @property {RecurrencePattern} [recurrence] - Optional recurrence pattern
 */

// Runtime validation using Zod
const { z } = require('zod');

const RecurrencePatternSchema = z.object({
  type: z.enum(['daily', 'weekly', 'monthly', 'yearly', 'custom']),
  startDate: z.date(),
  endDate: z.date().optional(),
  interval: z.number().optional(),
  intervalUnit: z.string().optional(),
  daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
  dayOfMonth: z.number().min(1).max(31).optional(),
  weekOfMonth: z.number().min(1).max(5).optional(),
  dayOfWeek: z.number().min(0).max(6).optional(),
  monthOfYear: z.number().min(1).max(12).optional()
});

const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  completed: z.boolean(),
  recurrence: RecurrencePatternSchema.optional()
});

/**
 * Validates and creates a task object
 * @param {Object} taskData
 * @returns {Task}
 */
function createTask(taskData) {
  return TaskSchema.parse({
    id: taskData.id || generateId(),
    title: taskData.title,
    description: taskData.description,
    dueDate: taskData.dueDate,
    completed: taskData.completed || false,
    recurrence: taskData.recurrence
  });
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

module.exports = {
  TaskSchema,
  RecurrencePatternSchema,
  createTask
};