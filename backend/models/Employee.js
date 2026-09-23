const mongoose = require('mongoose');

// Employee Schema for MongoDB Atlas
const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full Name is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required'],
      min: [1, 'Salary must be a valid positive number'],
    },
    joinDate: {
      type: String,
      required: [true, 'Join Date is required'],
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

module.exports = mongoose.model('Employee', employeeSchema);
