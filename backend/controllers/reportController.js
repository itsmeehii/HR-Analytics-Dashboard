/**
 * Reports Controller
 * Generate CSV and JSON reports with filters
 */

const Employee = require('../models/Employee');

// @desc    Generate employee report (CSV)
// @route   GET /api/reports/employees/csv
// @access  Private
exports.generateCSV = async (req, res) => {
  try {
    const { department, status, startDate, endDate, role } = req.query;
    const query = {};

    if (department) query.department = department;
    if (status) query.status = status;
    if (role) query.role = { $regex: role, $options: 'i' };
    if (startDate || endDate) {
      query.joiningDate = {};
      if (startDate) query.joiningDate.$gte = new Date(startDate);
      if (endDate) query.joiningDate.$lte = new Date(endDate);
    }

    const employees = await Employee.find(query).sort({ department: 1, name: 1 });

    // Build CSV manually
    const headers = ['Employee ID', 'Name', 'Email', 'Department', 'Role', 'Salary', 'Status', 'Joining Date', 'Location', 'Manager'];
    const rows = employees.map(emp => [
      emp.employeeId,
      emp.name,
      emp.email,
      emp.department,
      emp.role,
      emp.salary,
      emp.status,
      emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : '',
      emp.location || '',
      emp.manager || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="employees_report_${Date.now()}.csv"`);
    res.status(200).send(csvContent);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Generate report data (JSON for frontend PDF generation)
// @route   GET /api/reports/employees/json
// @access  Private
exports.generateJSON = async (req, res) => {
  try {
    const { department, status, startDate, endDate, role } = req.query;
    const query = {};

    if (department) query.department = department;
    if (status) query.status = status;
    if (role) query.role = { $regex: role, $options: 'i' };
    if (startDate || endDate) {
      query.joiningDate = {};
      if (startDate) query.joiningDate.$gte = new Date(startDate);
      if (endDate) query.joiningDate.$lte = new Date(endDate);
    }

    const employees = await Employee.find(query).sort({ department: 1, name: 1 });

    // Summary stats
    const totalSalary = employees.reduce((sum, e) => sum + e.salary, 0);
    const avgSalary = employees.length > 0 ? Math.round(totalSalary / employees.length) : 0;

    const deptBreakdown = employees.reduce((acc, e) => {
      acc[e.department] = (acc[e.department] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        employees,
        summary: {
          total: employees.length,
          avgSalary,
          totalPayroll: totalSalary,
          departmentBreakdown: deptBreakdown
        },
        generatedAt: new Date().toISOString(),
        filters: { department, status, startDate, endDate, role }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
