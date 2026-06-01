/**
 * Database Seed Script
 * Run: npm run seed
 * Populates MongoDB with sample employees and admin users
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
const User = require('../models/User');

dotenv.config();

const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Product'];

const roles = {
  Engineering: ['Software Engineer', 'Senior Engineer', 'Tech Lead', 'DevOps Engineer', 'QA Engineer'],
  Marketing: ['Marketing Manager', 'Content Strategist', 'SEO Specialist', 'Brand Manager'],
  Sales: ['Sales Executive', 'Account Manager', 'Sales Director', 'Business Developer'],
  HR: ['HR Manager', 'Recruiter', 'HR Business Partner', 'Compensation Analyst'],
  Finance: ['Financial Analyst', 'Accountant', 'CFO', 'Budget Analyst'],
  Operations: ['Operations Manager', 'Project Manager', 'Process Analyst', 'Logistics Coordinator'],
  Design: ['UI/UX Designer', 'Graphic Designer', 'Product Designer', 'Creative Director'],
  Product: ['Product Manager', 'Product Owner', 'Business Analyst', 'Scrum Master']
};

const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan', 'Fiona', 'George', 'Hannah', 'Ivan', 'Julia',
  'Kevin', 'Laura', 'Michael', 'Nina', 'Oscar', 'Priya', 'Quinn', 'Rachel', 'Sam', 'Tina',
  'Umar', 'Vanessa', 'William', 'Xena', 'Yusuf', 'Zoe', 'Aaron', 'Bella', 'Carlos', 'Dana'];

const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Wilson', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin',
  'Thompson', 'Moore', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen'];

const locations = ['New York', 'San Francisco', 'Chicago', 'Austin', 'Seattle', 'Boston', 'Denver', 'Miami'];

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const generateEmployees = (count) => {
  const employees = [];
  const usedEmails = new Set();

  for (let i = 1; i <= count; i++) {
    const firstName = getRandomItem(firstNames);
    const lastName = getRandomItem(lastNames);
    const name = `${firstName} ${lastName}`;
    const dept = getRandomItem(departments);
    const role = getRandomItem(roles[dept]);

    let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@hranalytics.com`;
    if (usedEmails.has(email)) {
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@hranalytics.com`;
    }
    usedEmails.add(email);

    const joiningDate = getRandomDate(new Date('2018-01-01'), new Date('2024-06-01'));
    const isInactive = Math.random() < 0.12; // ~12% attrition rate
    const isOnLeave = !isInactive && Math.random() < 0.05;

    // Salary based on role seniority
    let salaryBase = 50000;
    if (role.includes('Senior') || role.includes('Lead') || role.includes('Manager')) salaryBase = 80000;
    if (role.includes('Director') || role.includes('CFO') || role.includes('Creative Director')) salaryBase = 110000;

    const salary = salaryBase + getRandomInt(-10000, 30000);

    employees.push({
      employeeId: `EMP${String(i).padStart(4, '0')}`,
      name,
      email,
      department: dept,
      role,
      salary,
      joiningDate,
      status: isInactive ? 'Inactive' : isOnLeave ? 'On Leave' : 'Active',
      phone: `+1-${getRandomInt(200, 999)}-${getRandomInt(100, 999)}-${getRandomInt(1000, 9999)}`,
      location: getRandomItem(locations),
      manager: i > 5 ? `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}` : null,
      exitDate: isInactive ? getRandomDate(joiningDate, new Date()) : null
    });
  }
  return employees;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hr_analytics');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Employee.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users with hashed passwords
    const salt = await bcrypt.genSalt(12);
    const usersToCreate = [
      { name: 'Admin User', email: 'admin@hranalytics.com', password: await bcrypt.hash('admin123', salt), role: 'Admin' },
      { name: 'HR Manager', email: 'hr@hranalytics.com', password: await bcrypt.hash('hr123456', salt), role: 'HR Manager' }
    ];
    const users = await User.insertMany(usersToCreate);
    console.log(`👤 Created ${users.length} users`);
    console.log('   Admin: admin@hranalytics.com / admin123');
    console.log('   HR Manager: hr@hranalytics.com / hr123456');

    // Create employees
    const employees = generateEmployees(120);
    await Employee.insertMany(employees);
    console.log(`👥 Created ${employees.length} employees`);

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seedDatabase();
