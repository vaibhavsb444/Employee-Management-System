const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Employee = require('../models/Employee');

// Helper middleware to check if MongoDB is connected
function checkDbConnection(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(500).json({
      success: false,
      message: 'Database is not connected. Please configure your MONGODB_URI in backend/.env',
    });
  }
  next();
}

// --------------------------------------------------------------------------
// 1. GET /api/employees — Retrieve all employees (with optional search)
// --------------------------------------------------------------------------
router.get('/', checkDbConnection, async (req, res) => {
  try {
    const { search, department, sort } = req.query;
    let query = {};

    // Optional search across name, role, department
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { department: searchRegex },
        { role: searchRegex },
      ];
    }

    if (department && department !== 'All') {
      query.department = department;
    }

    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'name') sortOption = { name: 1 };
    if (sort === 'salary_asc') sortOption = { salary: 1 };
    if (sort === 'salary_desc') sortOption = { salary: -1 };
    if (sort === 'date') sortOption = { joinDate: -1 };

    const employees = await Employee.find(query).sort(sortOption);

    return res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve employee records',
      error: error.message,
    });
  }
});

// --------------------------------------------------------------------------
// 2. GET /api/employees/:id — Retrieve single employee by ID
// --------------------------------------------------------------------------
router.get('/:id', checkDbConnection, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID format',
      });
    }

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving employee',
      error: error.message,
    });
  }
});

// --------------------------------------------------------------------------
// 3. POST /api/employees — Add new employee
// --------------------------------------------------------------------------
router.post('/', checkDbConnection, async (req, res) => {
  try {
    const { name, department, role, salary, joinDate } = req.body;

    // Field-level validations
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Full Name is required' });
    }
    if (!department || !department.trim()) {
      return res.status(400).json({ success: false, message: 'Department is required' });
    }
    if (!role || !role.trim()) {
      return res.status(400).json({ success: false, message: 'Role is required' });
    }
    if (salary === undefined || salary === null || isNaN(salary) || Number(salary) <= 0) {
      return res.status(400).json({ success: false, message: 'Salary must be a valid positive number' });
    }
    if (!joinDate || !joinDate.trim() || isNaN(Date.parse(joinDate))) {
      return res.status(400).json({ success: false, message: 'Join Date is required and must be a valid date' });
    }

    const newEmployee = new Employee({
      name: name.trim(),
      department: department.trim(),
      role: role.trim(),
      salary: Number(salary),
      joinDate: joinDate.trim(),
    });

    const savedEmployee = await newEmployee.save();

    return res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: savedEmployee,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Server error saving employee',
      error: error.message,
    });
  }
});

// --------------------------------------------------------------------------
// 4. PUT /api/employees/:id — Update existing employee
// --------------------------------------------------------------------------
router.put('/:id', checkDbConnection, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID format',
      });
    }

    const { name, department, role, salary, joinDate } = req.body;

    // Field validations
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Full Name is required' });
    }
    if (!department || !department.trim()) {
      return res.status(400).json({ success: false, message: 'Department is required' });
    }
    if (!role || !role.trim()) {
      return res.status(400).json({ success: false, message: 'Role is required' });
    }
    if (salary === undefined || salary === null || isNaN(salary) || Number(salary) <= 0) {
      return res.status(400).json({ success: false, message: 'Salary must be a valid positive number' });
    }
    if (!joinDate || !joinDate.trim() || isNaN(Date.parse(joinDate))) {
      return res.status(400).json({ success: false, message: 'Join Date is required and must be a valid date' });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        department: department.trim(),
        role: role.trim(),
        salary: Number(salary),
        joinDate: joinDate.trim(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Server error updating employee',
      error: error.message,
    });
  }
});

// --------------------------------------------------------------------------
// 5. DELETE /api/employees/:id — Delete employee
// --------------------------------------------------------------------------
router.delete('/:id', checkDbConnection, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID format',
      });
    }

    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
      data: { id: deletedEmployee._id, name: deletedEmployee.name },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error deleting employee',
      error: error.message,
    });
  }
});

module.exports = router;
