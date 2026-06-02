 HEAD
# 📊 HR Analytics Dashboard

A production-ready, full-stack HR Analytics web application built with React, Node.js, Express, and MongoDB.

## ✨ Features

- **Dashboard** — KPI cards + 4 interactive charts (department distribution, hiring trends, salary distribution, attrition)
- **Employee Management** — Full CRUD with search, filter, pagination
- **Reports** — CSV & PDF export with filters
- **Authentication** — JWT-based with Admin / HR Manager roles
- **Dark/Light Mode** — Persistent theme toggle

---

## 🗂️ Project Structure

```
hr-analytics/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   ├── analyticsController.js
│   │   └── reportController.js
│   ├── middleware/
│   │   └── auth.js               # JWT protect + authorize
│   ├── models/
│   │   ├── Employee.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── employees.js
│   │   ├── analytics.js
│   │   └── reports.js
│   ├── utils/
│   │   └── seed.js               # Sample data generator
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── charts/           # Recharts-based chart components
│       │   ├── common/           # KPICard, etc.
│       │   ├── employees/        # EmployeeModal
│       │   └── layout/           # Sidebar, Topbar, Layout
│       ├── context/
│       │   ├── AuthContext.js
│       │   └── ThemeContext.js
│       ├── pages/
│       │   ├── LoginPage.js
│       │   ├── DashboardPage.js
│       │   ├── EmployeesPage.js
│       │   └── ReportsPage.js
│       ├── services/
│       │   ├── api.js            # Axios instance
│       │   └── employeeService.js
│       ├── App.js
│       ├── index.js
│       └── index.css
│
├── package.json                  # Root with concurrently scripts
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org)
- **MongoDB** (local) — [Download](https://www.mongodb.com/try/download/community) OR use **MongoDB Atlas** (free cloud)
- **npm** v9+

---

### Step 1 — Clone & Install

```bash
# Navigate to project root
cd hr-analytics

# Install root dependencies (for concurrently)
npm install

# Install backend + frontend dependencies
npm run install:all
```

---

### Step 2 — Configure Environment

```bash
# Copy example env file
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hr_analytics
JWT_SECRET=change_this_to_a_random_secret_string
JWT_EXPIRE=7d
NODE_ENV=development
```

**Using MongoDB Atlas?** Replace `MONGODB_URI` with your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hr_analytics
```

---

### Step 3 — Start MongoDB (local)

```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Windows
net start MongoDB

# Or run directly
mongod --dbpath /data/db
```

---

### Step 4 — Seed the Database

```bash
npm run seed
```

This creates:
- 👤 **Admin**: `admin@hranalytics.com` / `admin123`
- 👤 **HR Manager**: `hr@hranalytics.com` / `hr123456`
- 👥 **120 sample employees** across all departments

---

### Step 5 — Start Both Servers

```bash
# Start both frontend & backend together
npm run dev
```

Or run separately:
```bash
# Terminal 1 - Backend (port 5000)
npm run dev:backend

# Terminal 2 - Frontend (port 3000)
npm run dev:frontend
```

---

### Step 6 — Open the App

Open [http://localhost:3000](http://localhost:3000) in your browser.

Login with the demo credentials from Step 4.

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/register` | Register new user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout |

### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | List employees (search, filter, pagination) |
| POST | `/api/employees` | Create employee |
| GET | `/api/employees/:id` | Get employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee (Admin only) |
| GET | `/api/employees/departments` | Get department list |

#### Query params for GET /api/employees:
- `search` — search name/email/ID
- `department`, `status`, `role` — filters
- `page`, `limit` — pagination
- `sortBy`, `sortOrder` — sorting

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/summary` | KPI summary |
| GET | `/api/analytics/by-department` | Dept distribution |
| GET | `/api/analytics/hiring-trends` | Monthly hires (12mo) |
| GET | `/api/analytics/salary-distribution` | Salary buckets |
| GET | `/api/analytics/attrition` | Attrition by dept |
| GET | `/api/analytics/status-breakdown` | Active/Inactive/Leave |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/employees/csv` | Download CSV |
| GET | `/api/reports/employees/json` | Preview JSON data |

All report endpoints accept: `department`, `status`, `role`, `startDate`, `endDate`

---

## 🔐 Roles

| Feature | HR Manager | Admin |
|---------|-----------|-------|
| View dashboard & employees | ✅ | ✅ |
| Add / edit employees | ✅ | ✅ |
| Delete employees | ❌ | ✅ |
| Generate reports | ✅ | ✅ |

---

## 🛠️ VS Code Tips

1. Install **ESLint** and **Prettier** extensions
2. Install **MongoDB for VS Code** to browse your data
3. Install **REST Client** or **Thunder Client** to test APIs
4. Use the built-in terminal: `Ctrl+` ` `` `

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Recharts, Axios |
| Styling | Custom CSS with CSS variables (dark/light mode) |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| PDF Export | jsPDF + jsPDF-AutoTable |
| Dev | Nodemon, Concurrently |

