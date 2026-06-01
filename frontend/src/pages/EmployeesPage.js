import React, { useEffect, useState, useCallback } from 'react';
import { employeeService } from '../services/employeeService';
import EmployeeModal from '../components/employees/EmployeeModal';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Legal', 'Product'];

const StatusBadge = ({ status }) => {
  const cls = { Active: 'badge-active', Inactive: 'badge-inactive', 'On Leave': 'badge-leave' };
  return <span className={`badge ${cls[status] || ''}`}>{status}</span>;
};

const Avatar = ({ name }) => {
  const colors = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#f97316'];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div style={{
      width: 34, height: 34, borderRadius: '50%', background: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.8rem', fontWeight: 700, color: 'white', flexShrink: 0
    }}>
      {name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
    </div>
  );
};

export default function EmployeesPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await employeeService.getAll({
        page: currentPage, limit: 10,
        search, department: deptFilter, status: statusFilter
      });
      setEmployees(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, deptFilter, statusFilter]);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  // Debounce search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setCurrentPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (modal === 'edit') {
        await employeeService.update(selectedEmployee._id, data);
        toast.success('Employee updated');
      } else {
        await employeeService.create(data);
        toast.success('Employee added');
      }
      setModal(null);
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await employeeService.delete(id);
      toast.success('Employee deleted');
      setDeleteConfirm(null);
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Header actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', flex: 1 }}>
          <input
            placeholder="🔍 Search by name, email, or ID..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            style={{ maxWidth: 280 }}
          />
          <select value={deptFilter} onChange={e => { setDeptFilter(e.target.value); setCurrentPage(1); }} style={{ width: 160 }}>
            <option value="">All Departments</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} style={{ width: 130 }}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => { setSelectedEmployee(null); setModal('add'); }} style={{ marginLeft: 12, flexShrink: 0 }}>
          + Add Employee
        </button>
      </div>

      {/* Stats bar */}
      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 12 }}>
        Showing {employees.length} of {pagination.total} employees
        {(search || deptFilter || statusFilter) && ' (filtered)'}
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>ID</th>
                <th>Department</th>
                <th>Role</th>
                <th>Salary</th>
                <th>Joining Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '60px' }}><div className="spinner" style={{ margin: '0 auto' }} /></td></tr>
              ) : employees.length === 0 ? (
                <tr><td colSpan={8}>
                  <div className="empty-state">
                    <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>👥</div>
                    <h3>No employees found</h3>
                    <p>Try adjusting your filters or add a new employee</p>
                  </div>
                </td></tr>
              ) : employees.map(emp => (
                <tr key={emp._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={emp.name} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{emp.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{emp.employeeId}</td>
                  <td>
                    <span style={{ padding: '3px 10px', background: 'var(--color-surface-2)', borderRadius: 6, fontSize: '0.78rem', fontWeight: 500 }}>
                      {emp.department}
                    </span>
                  </td>
                  <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{emp.role}</td>
                  <td style={{ fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                    ${emp.salary?.toLocaleString()}
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    {emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                  </td>
                  <td><StatusBadge status={emp.status} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                      <button className="btn btn-ghost"
                        style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                        onClick={() => { setSelectedEmployee(emp); setModal('edit'); }}>
                        ✏️
                      </button>
                      {user?.role === 'Admin' && (
                        <button className="btn btn-danger"
                          style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                          onClick={() => setDeleteConfirm(emp)}>
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Page {pagination.page} of {pagination.pages}
            </span>
            <div className="pagination">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</button>
              <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>‹</button>
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const page = Math.max(1, Math.min(currentPage - 2, pagination.pages - 4)) + i;
                return (
                  <button key={page} className={currentPage === page ? 'active' : ''} onClick={() => setCurrentPage(page)}>
                    {page}
                  </button>
                );
              })}
              <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === pagination.pages}>›</button>
              <button onClick={() => setCurrentPage(pagination.pages)} disabled={currentPage === pagination.pages}>»</button>
            </div>
          </div>
        )}
      </div>

      {/* Employee Modal */}
      {modal && (
        <EmployeeModal
          employee={modal === 'edit' ? selectedEmployee : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
          loading={saving}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.05rem' }}>Delete Employee</h2>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm._id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
