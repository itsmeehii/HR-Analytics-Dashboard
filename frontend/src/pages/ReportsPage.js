import React, { useState } from 'react';
import { reportService } from '../services/employeeService';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Legal', 'Product'];

export default function ReportsPage() {
  const [filters, setFilters] = useState({ department: '', status: '', startDate: '', endDate: '', role: '' });
  const [loading, setLoading] = useState({ csv: false, pdf: false, preview: false });
  const [preview, setPreview] = useState(null);

  const updateFilter = (key, val) => setFilters(p => ({ ...p, [key]: val }));

  const cleanFilters = () => Object.fromEntries(Object.entries(filters).filter(([, v]) => v));

  const handleDownloadCSV = async () => {
    setLoading(p => ({ ...p, csv: true }));
    try {
      const res = await reportService.downloadCSV(cleanFilters());
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `employees_report_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('CSV downloaded successfully');
    } catch {
      toast.error('Failed to download CSV');
    } finally {
      setLoading(p => ({ ...p, csv: false }));
    }
  };

  const handlePreview = async () => {
    setLoading(p => ({ ...p, preview: true }));
    try {
      const res = await reportService.getJSON(cleanFilters());
      setPreview(res.data.data);
    } catch {
      toast.error('Failed to generate preview');
    } finally {
      setLoading(p => ({ ...p, preview: false }));
    }
  };

  const handleDownloadPDF = async () => {
    setLoading(p => ({ ...p, pdf: true }));
    try {
      let data = preview;
      if (!data) {
        const res = await reportService.getJSON(cleanFilters());
        data = res.data.data;
      }

      const doc = new jsPDF({ orientation: 'landscape' });

      // Title
      doc.setFontSize(20);
      doc.setTextColor(15, 22, 36);
      doc.text('HR Analytics — Employee Report', 14, 20);

      // Generated date
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 14, 28);

      // Summary
      doc.setFontSize(11);
      doc.setTextColor(15, 22, 36);
      doc.text(`Total Employees: ${data.summary.total}  |  Avg Salary: $${data.summary.avgSalary?.toLocaleString()}  |  Total Payroll: $${data.summary.totalPayroll?.toLocaleString()}`, 14, 38);

      // Table
      doc.autoTable({
        startY: 44,
        head: [['ID', 'Name', 'Department', 'Role', 'Salary', 'Status', 'Joining Date', 'Location']],
        body: data.employees.map(e => [
          e.employeeId,
          e.name,
          e.department,
          e.role,
          `$${e.salary?.toLocaleString()}`,
          e.status,
          e.joiningDate ? new Date(e.joiningDate).toLocaleDateString() : '',
          e.location || ''
        ]),
        styles: { fontSize: 8.5, cellPadding: 4 },
        headStyles: { fillColor: [15, 22, 36], textColor: [255, 255, 255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [248, 249, 251] },
        columnStyles: { 4: { halign: 'right' } }
      });

      doc.save(`employees_report_${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success('PDF downloaded successfully');
    } catch (err) {
      toast.error('Failed to generate PDF');
    } finally {
      setLoading(p => ({ ...p, pdf: false }));
    }
  };

  return (
    <div className="animate-fadeIn">
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Filter Panel */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 20 }}>Report Filters</h3>

          <div className="form-group">
            <label>Department</label>
            <select value={filters.department} onChange={e => updateFilter('department', e.target.value)}>
              <option value="">All Departments</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={filters.status} onChange={e => updateFilter('status', e.target.value)}>
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
          <div className="form-group">
            <label>Role (keyword)</label>
            <input placeholder="e.g. Engineer, Manager" value={filters.role} onChange={e => updateFilter('role', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Joining Date From</label>
            <input type="date" value={filters.startDate} onChange={e => updateFilter('startDate', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Joining Date To</label>
            <input type="date" value={filters.endDate} onChange={e => updateFilter('endDate', e.target.value)} />
          </div>

          <button className="btn btn-secondary" onClick={() => setFilters({ department: '', status: '', startDate: '', endDate: '', role: '' })}
            style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }}>
            Clear Filters
          </button>
          <button className="btn btn-primary" onClick={handlePreview} disabled={loading.preview}
            style={{ width: '100%', justifyContent: 'center' }}>
            {loading.preview ? 'Loading...' : '👁️ Preview Report'}
          </button>
        </div>

        {/* Main Content */}
        <div>
          {/* Export Actions */}
          <div className="card" style={{ padding: '20px 24px', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Export Report</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                  Download filtered employee data
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-secondary" onClick={handleDownloadCSV} disabled={loading.csv}>
                  {loading.csv ? 'Generating...' : '📥 Export CSV'}
                </button>
                <button className="btn btn-primary" onClick={handleDownloadPDF} disabled={loading.pdf}>
                  {loading.pdf ? 'Generating...' : '📄 Export PDF'}
                </button>
              </div>
            </div>
          </div>

          {/* Preview Table */}
          {preview ? (
            <div className="card" style={{ overflow: 'hidden' }}>
              {/* Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, padding: '16px 20px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
                {[
                  { label: 'Total Records', value: preview.summary.total },
                  { label: 'Avg Salary', value: `$${preview.summary.avgSalary?.toLocaleString()}` },
                  { label: 'Total Payroll', value: `$${preview.summary.totalPayroll?.toLocaleString()}` }
                ].map(item => (
                  <div key={item.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800 }}>{item.value}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ overflowX: 'auto', maxHeight: 500 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th><th>Name</th><th>Department</th><th>Role</th>
                      <th>Salary</th><th>Status</th><th>Joining Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.employees.slice(0, 50).map(emp => (
                      <tr key={emp._id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{emp.employeeId}</td>
                        <td style={{ fontWeight: 600 }}>{emp.name}</td>
                        <td>{emp.department}</td>
                        <td style={{ color: 'var(--color-text-secondary)' }}>{emp.role}</td>
                        <td style={{ fontWeight: 600 }}>${emp.salary?.toLocaleString()}</td>
                        <td>
                          <span className={`badge ${emp.status === 'Active' ? 'badge-active' : emp.status === 'Inactive' ? 'badge-inactive' : 'badge-leave'}`}>
                            {emp.status}
                          </span>
                        </td>
                        <td style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
                          {emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {preview.employees.length > 50 && (
                  <p style={{ textAlign: 'center', padding: '12px', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                    Showing first 50 of {preview.employees.length} records. Download for full data.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: '60px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>📊</div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>No Preview Generated</h3>
              <p style={{ color: 'var(--color-text-muted)', marginTop: 8, fontSize: '0.85rem' }}>
                Apply filters and click "Preview Report" to see the data before exporting
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
