const { Schema, model } = require("mongoose");

const taskSchema = new Schema(
  {
    title: {
      type: String,
      //! can also be required: true without message
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Task description is required"],
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    status: {
      type: String,
      required: [true, "Task status is required"],
      enum: ["todo", "inProgress", "completed"],
      default: "todo",
    },
    priority: {
      type: String,
      required: [true, "Task priority is required"],
      enum: ["low", "normal", "high"],
      default: "normal",
    },
    // Removing createdAt and adding a timestamp instead of that
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Create the model and export it
const Task = model("Task", taskSchema);
module.exports = Task;

/**
 * @swagger
 * 
 * components:
 *  schemas:
 *   Task:
 *    type: object
 *    required:
 *      - title
 *      - description
 *      - status
 *      - priority
 *      - dueDate
 *    properties:
 *      title:
 *        type: string
 *        description: the title of the task
 *        maxLength: 100
 *      description:
 *        type: string
 *        description: The description of the task
 *        maxLength: 500
 *      status:
 *        type: string
 *        description: The status of the task
 *        enum:
 *          - todo
 *          - inProgress
 *          - completed
 *      priority:
 *        type: string
 *        description: The priority of the task
 *        enum:
 *          - low
 *          - normal
 *          - high
 *      dueDate:
 *        type: string
 *        description: The due date of the task
 *        format: date
 *    Example:
 *      title: "Task title"
 *      description: "Task description"
 *      status: "todo"
 *      priority: "normal"
 *      dueDate: "2022-01-01"
 * 
 *      
 *      
 * 
 */