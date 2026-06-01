const express = require('express');
const router = express.Router();
const {
  getSummary,
  getByDepartment,
  getHiringTrends,
  getSalaryDistribution,
  getAttrition,
  getStatusBreakdown
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/summary', getSummary);
router.get('/by-department', getByDepartment);
router.get('/hiring-trends', getHiringTrends);
router.get('/salary-distribution', getSalaryDistribution);
router.get('/attrition', getAttrition);
router.get('/status-breakdown', getStatusBreakdown);

module.exports = router;
