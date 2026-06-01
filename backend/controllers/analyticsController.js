/**
 * Analytics Controller
 * MongoDB aggregation pipelines for dashboard KPIs and charts
 */

const Employee = require('../models/Employee');

// @desc    Get dashboard KPI summary
// @route   GET /api/analytics/summary
// @access  Private
exports.getSummary = async (req, res) => {
  try {
    const [
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      salaryStats
    ] = await Promise.all([
      Employee.countDocuments(),
      Employee.countDocuments({ status: 'Active' }),
      Employee.countDocuments({ status: 'Inactive' }),
      Employee.aggregate([
        { $group: { _id: null, avgSalary: { $avg: '$salary' }, totalPayroll: { $sum: '$salary' } } }
      ])
    ]);

    const attritionRate = totalEmployees > 0
      ? ((inactiveEmployees / totalEmployees) * 100).toFixed(1)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        attritionRate: parseFloat(attritionRate),
        averageSalary: salaryStats[0]?.avgSalary ? Math.round(salaryStats[0].avgSalary) : 0,
        totalPayroll: salaryStats[0]?.totalPayroll ? Math.round(salaryStats[0].totalPayroll) : 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Employee distribution by department
// @route   GET /api/analytics/by-department
// @access  Private
exports.getByDepartment = async (req, res) => {
  try {
    const data = await Employee.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          activeCount: { $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] } },
          avgSalary: { $avg: '$salary' }
        }
      },
      { $sort: { count: -1 } },
      {
        $project: {
          department: '$_id',
          count: 1,
          activeCount: 1,
          avgSalary: { $round: ['$avgSalary', 0] },
          _id: 0
        }
      }
    ]);

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Monthly hiring trends (last 12 months)
// @route   GET /api/analytics/hiring-trends
// @access  Private
exports.getHiringTrends = async (req, res) => {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const data = await Employee.aggregate([
      { $match: { joiningDate: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$joiningDate' },
            month: { $month: '$joiningDate' }
          },
          hired: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          hired: 1,
          label: {
            $concat: [
              { $arrayElemAt: [['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], { $subtract: ['$_id.month', 1] }] },
              ' ',
              { $toString: '$_id.year' }
            ]
          }
        }
      }
    ]);

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Salary distribution by range buckets
// @route   GET /api/analytics/salary-distribution
// @access  Private
exports.getSalaryDistribution = async (req, res) => {
  try {
    const data = await Employee.aggregate([
      {
        $bucket: {
          groupBy: '$salary',
          boundaries: [0, 40000, 60000, 80000, 100000, 120000, 150000, Infinity],
          default: 'Other',
          output: { count: { $sum: 1 }, employees: { $push: '$name' } }
        }
      },
      {
        $project: {
          _id: 0,
          range: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id', 0] }, then: '<$40K' },
                { case: { $eq: ['$_id', 40000] }, then: '$40K–60K' },
                { case: { $eq: ['$_id', 60000] }, then: '$60K–80K' },
                { case: { $eq: ['$_id', 80000] }, then: '$80K–100K' },
                { case: { $eq: ['$_id', 100000] }, then: '$100K–120K' },
                { case: { $eq: ['$_id', 120000] }, then: '$120K–150K' },
                { case: { $eq: ['$_id', 150000] }, then: '>$150K' }
              ],
              default: 'Other'
            }
          },
          count: 1
        }
      }
    ]);

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Attrition by department
// @route   GET /api/analytics/attrition
// @access  Private
exports.getAttrition = async (req, res) => {
  try {
    const data = await Employee.aggregate([
      {
        $group: {
          _id: '$department',
          total: { $sum: 1 },
          inactive: { $sum: { $cond: [{ $eq: ['$status', 'Inactive'] }, 1, 0] } }
        }
      },
      {
        $project: {
          department: '$_id',
          _id: 0,
          total: 1,
          inactive: 1,
          attritionRate: {
            $round: [{ $multiply: [{ $divide: ['$inactive', '$total'] }, 100] }, 1]
          }
        }
      },
      { $sort: { attritionRate: -1 } }
    ]);

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Status breakdown (Active/Inactive/On Leave)
// @route   GET /api/analytics/status-breakdown
// @access  Private
exports.getStatusBreakdown = async (req, res) => {
  try {
    const data = await Employee.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } }
    ]);

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
