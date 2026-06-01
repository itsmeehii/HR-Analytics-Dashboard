/**
 * Employee Model
 * Defines the schema for employee records in MongoDB
 */

const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Legal', 'Product']
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required'],
      min: [0, 'Salary cannot be negative']
    },
    joiningDate: {
      type: Date,
      required: [true, 'Joining date is required']
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'On Leave'],
      default: 'Active'
    },
    phone: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    manager: {
      type: String,
      trim: true
    },
    avatar: {
      type: String,
      default: ''
    },
    // Tracks when employee left (for attrition calculation)
    exitDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual: years of service
employeeSchema.virtual('yearsOfService').get(function () {
  const end = this.exitDate || new Date();
  const diff = end - this.joiningDate;
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
});

// Index for faster queries
employeeSchema.index({ department: 1, status: 1 });
employeeSchema.index({ joiningDate: 1 });
employeeSchema.index({ employeeId: 1 });

module.exports = mongoose.model('Employee', employeeSchema);
