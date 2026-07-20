// src/components/EmployeeDashboard.jsx
import React, { useState, useEffect } from 'react';

export default function EmployeeDashboard() {
    const [employees, setEmployees] = useState([]);
    const [form, setForm] = useState({ empId: '', name: '', email: '', department: '', designation: '' });
    const [serverAlert, setServerAlert] = useState({ message: '', isSuccess: true });

    const API_URL = 'http://localhost:5001/api/employees';

    // Fetch Database Records
    const fetchEmployees = async () => {
        try {
            const res = await fetch(API_URL);
            const resData = await res.json();
            if (resData.success) {
                setEmployees(resData.data);
            }
        } catch (err) {
            console.error("Error loading employees:", err);
        }
    };

    useEffect(() => { fetchEmployees(); }, []);

    // Form Submission Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const resData = await res.json();

            // Display the exact architectural custom message returned from your Node API
            setServerAlert({ message: resData.message, isSuccess: resData.success });

            if (resData.success) {
                setForm({ empId: '', name: '', email: '', department: '', designation: '' });
                fetchEmployees(); // Refresh view
            }
        } catch (err) {
            setServerAlert({ message: "Network connection breakdown.", isSuccess: false });
        }
    };

    // Offboarding (Delete) Handler
    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            const resData = await res.json();
            
            setServerAlert({ message: resData.message, isSuccess: resData.success });
            if (resData.success) fetchEmployees();
        } catch (err) {
            setServerAlert({ message: "Error contacting system server.", isSuccess: false });
        }
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
            <h2>Enterprise Employee Management Portal</h2>
            
            {/* Banner rendering the custom architecture message */}
            {serverAlert.message && (
                <div style={{
                    padding: '1rem', 
                    marginBottom: '1.5rem', 
                    borderRadius: '4px',
                    backgroundColor: serverAlert.isSuccess ? '#e6f4ea' : '#fce8e6',
                    color: serverAlert.isSuccess ? '#137333' : '#c5221f',
                    border: `1px solid ${serverAlert.isSuccess ? '#34a853' : '#ea4335'}`
                }}>
                    <strong>System Message:</strong> {serverAlert.message}
                </div>
            )}

            {/* Onboarding Form */}
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', marginBottom: '2rem' }}>
                <input type="text" placeholder="Employee ID (e.g., EMP101)" value={form.empId} onChange={e => setForm({...form, empId: e.target.value})} required />
                <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                <input type="email" placeholder="Corporate Email Address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                <input type="text" placeholder="Department" value={form.department} onChange={e => setForm({...form, department: e.target.value})} required />
                <input type="text" placeholder="Designation Role" value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} required />
                <button type="submit" style={{ padding: '10px', background: '#0056b3', color: '#fff', border: 'none', cursor: 'pointer' }}>Onboard Employee</button>
            </form>

            {/* Records Inventory Table */}
            <h3>Active Directory Records</h3>
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f1f1f1' }}>
                        <th>ID</th><th>Name</th><th>Email</th><th>Department</th><th>Role</th><th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.length === 0 ? (
                        <tr><td colSpan="6" style={{ textAlign: 'center' }}>No active employee files found.</td></tr>
                    ) : (
                        employees.map(emp => (
                            <tr key={emp._id}>
                                <td>{emp.empId}</td>
                                <td>{emp.name}</td>
                                <td>{emp.email}</td>
                                <td>{emp.department}</td>
                                <td>{emp.designation}</td>
                                <td>
                                    <button onClick={() => handleDelete(emp._id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}