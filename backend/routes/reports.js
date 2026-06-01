const express = require('express');
const router = express.Router();
const { generateCSV, generateJSON } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/employees/csv', generateCSV);
router.get('/employees/json', generateJSON);

module.exports = router;
