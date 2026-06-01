/**
 * Employee Controller
 * Full CRUD operations with search, filter, and pagination
 */

const Employee = require('../models/Employee');

// @desc    Get all employees (with search, filter, pagination)
// @route   GET /api/employees
// @access  Private
exports.getEmployees = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      department,
      status,
      role,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};

    // Search by name, email, or employeeId
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }

    if (department) query.department = department;
    if (status) query.status = status;
    if (role) query.role = { $regex: role, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [employees, total] = await Promise.all([
      Employee.find(query).sort(sort).skip(skip).limit(parseInt(limit)),
      Employee.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: employees,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }
    res.status(200).json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private (Admin, HR Manager)
exports.createEmployee = async (req, res) => {
  try {
    // Auto-generate employeeId if not provided
    if (!req.body.employeeId) {
      const count = await Employee.countDocuments();
      req.body.employeeId = `EMP${String(count + 1).padStart(4, '0')}`;
    }

    const employee = await Employee.create(req.body);
    res.status(201).json({ success: true, data: employee, message: 'Employee created successfully.' });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({ success: false, message: `${field} already exists.` });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private (Admin, HR Manager)
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    res.status(200).json({ success: true, data: employee, message: 'Employee updated successfully.' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private (Admin only)
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }
    res.status(200).json({ success: true, message: 'Employee deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all unique departments
// @route   GET /api/employees/departments
// @access  Private
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Employee.distinct('department');
    res.status(200).json({ success: true, data: departments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
