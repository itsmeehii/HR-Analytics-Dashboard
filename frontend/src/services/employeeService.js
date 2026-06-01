import api from './api';

export const employeeService = {
  getAll: (params) => api.get('/employees', { params }),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  getDepartments: () => api.get('/employees/departments')
};

export const analyticsService = {
  getSummary: () => api.get('/analytics/summary'),
  getByDepartment: () => api.get('/analytics/by-department'),
  getHiringTrends: () => api.get('/analytics/hiring-trends'),
  getSalaryDistribution: () => api.get('/analytics/salary-distribution'),
  getAttrition: () => api.get('/analytics/attrition'),
  getStatusBreakdown: () => api.get('/analytics/status-breakdown')
};

export const reportService = {
  downloadCSV: (params) => api.get('/reports/employees/csv', {
    params,
    responseType: 'blob'
  }),
  getJSON: (params) => api.get('/reports/employees/json', { params })
};
