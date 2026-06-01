import React, { useState, useEffect } from 'react';

const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Legal', 'Product'];

const initialForm = {
  name: '', email: '', department: '', role: '', salary: '',
  joiningDate: '', status: 'Active', phone: '', location: '', manager: ''
};

export default function EmployeeModal({ employee, onClose, onSave, loading }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const isEdit = !!employee;

  useEffect(() => {
    if (employee) {
      setForm({
        ...employee,
        salary: employee.salary || '',
        joiningDate: employee.joiningDate ? employee.joiningDate.slice(0, 10) : ''
      });
    } else {
      setForm(initialForm);
    }
  }, [employee]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.department) e.department = 'Required';
    if (!form.role.trim()) e.role = 'Required';
    if (!form.salary || isNaN(form.salary) || form.salary < 0) e.salary = 'Valid salary required';
    if (!form.joiningDate) e.joiningDate = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({ ...form, salary: parseFloat(form.salary) });
  };

  const Field = ({ label, name, type = 'text', required, children }) => (
    <div className="form-group">
      <label>{label}{required && <span style={{ color: 'var(--color-red)', marginLeft: 2 }}>*</span>}</label>
      {children || (
        <input type={type} name={name} value={form[name] || ''} onChange={handleChange}
          style={{ borderColor: errors[name] ? 'var(--color-red)' : undefined }} />
      )}
      {errors[name] && <span style={{ fontSize: '0.75rem', color: 'var(--color-red)', marginTop: 4, display: 'block' }}>{errors[name]}</span>}
    </div>
  );

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.1rem' }}>{isEdit ? 'Edit Employee' : 'Add New Employee'}</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
              {isEdit ? 'Update employee information' : 'Fill in the details to add a new employee'}
            </p>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ fontSize: '1.2rem', padding: '6px 10px' }}>×</button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
            <Field label="Full Name" name="name" required />
            <Field label="Email Address" name="email" type="email" required />
            <Field label="Department" name="department" required>
              <select name="department" value={form.department} onChange={handleChange}
                style={{ borderColor: errors.department ? 'var(--color-red)' : undefined }}>
                <option value="">Select department</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.department && <span style={{ fontSize: '0.75rem', color: 'var(--color-red)', marginTop: 4, display: 'block' }}>{errors.department}</span>}
            </Field>
            <Field label="Role / Position" name="role" required />
            <Field label="Salary (USD)" name="salary" type="number" required />
            <Field label="Joining Date" name="joiningDate" type="date" required />
            <Field label="Status" name="status">
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
            </Field>
            <Field label="Phone" name="phone" />
            <Field label="Location" name="location" />
            <Field label="Manager" name="manager" />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? '...' : isEdit ? 'Save Changes' : 'Add Employee'}
          </button>
        </div>
      </div>
    </div>
  );
}
