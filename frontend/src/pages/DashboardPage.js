import React, { useEffect, useState } from 'react';
import { analyticsService } from '../services/employeeService';
import KPICard from '../components/common/KPICard';
import DepartmentChart from '../components/charts/DepartmentChart';
import HiringTrendsChart from '../components/charts/HiringTrendsChart';
import SalaryDistributionChart from '../components/charts/SalaryDistributionChart';
import AttritionChart from '../components/charts/AttritionChart';

const formatCurrency = (n) => n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`;

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [deptData, setDeptData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [salaryData, setSalaryData] = useState([]);
  const [attritionData, setAttritionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);

  useEffect(() => {
    // Fetch summary KPIs first
    analyticsService.getSummary()
      .then(res => setSummary(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));

    // Fetch chart data in parallel
    Promise.all([
      analyticsService.getByDepartment(),
      analyticsService.getHiringTrends(),
      analyticsService.getSalaryDistribution(),
      analyticsService.getAttrition()
    ]).then(([dept, trends, salary, attrition]) => {
      setDeptData(dept.data.data);
      setTrendData(trends.data.data);
      setSalaryData(salary.data.data);
      setAttritionData(attrition.data.data);
    }).catch(console.error)
      .finally(() => setChartsLoading(false));
  }, []);

  return (
    <div className="animate-fadeIn">
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
        <KPICard
          title="Total Employees" icon="👥"
          value={loading ? '—' : summary?.totalEmployees?.toLocaleString()}
          subtitle="All time headcount"
          color="blue" loading={loading}
        />
        <KPICard
          title="Active Employees" icon="✅"
          value={loading ? '—' : summary?.activeEmployees?.toLocaleString()}
          subtitle={loading ? '' : `${((summary?.activeEmployees / summary?.totalEmployees) * 100).toFixed(0)}% of workforce`}
          color="green" loading={loading}
        />
        <KPICard
          title="Attrition Rate" icon="📉"
          value={loading ? '—' : `${summary?.attritionRate}%`}
          subtitle="Overall turnover rate"
          color="red" loading={loading}
        />
        <KPICard
          title="Average Salary" icon="💰"
          value={loading ? '—' : formatCurrency(summary?.averageSalary || 0)}
          subtitle="Across all departments"
          color="amber" loading={loading}
        />
        <KPICard
          title="Total Payroll" icon="🏦"
          value={loading ? '—' : `$${((summary?.totalPayroll || 0) / 1_000_000).toFixed(2)}M`}
          subtitle="Annual salary cost"
          color="purple" loading={loading}
        />
        <KPICard
          title="On Leave" icon="🏖️"
          value={loading ? '—' : (summary?.totalEmployees - summary?.activeEmployees - summary?.inactiveEmployees)?.toLocaleString() || '0'}
          subtitle="Currently away"
          color="teal" loading={loading}
        />
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <DepartmentChart data={deptData} loading={chartsLoading} />
        <HiringTrendsChart data={trendData} loading={chartsLoading} />
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <SalaryDistributionChart data={salaryData} loading={chartsLoading} />
        <AttritionChart data={attritionData} loading={chartsLoading} />
      </div>
    </div>
  );
}
