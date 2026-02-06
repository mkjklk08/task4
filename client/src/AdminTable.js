import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminTable = () => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const api = axios.create({
    baseURL: 'https://task4-4-2q6w.onrender.com',
    headers: { Authorization: `Bearer ${token}` }
  });

  const loadUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadUsers(); }, []);

  const handleAction = async (action) => {
    try {
      await api.post('/users/action', { ids: selected, action });
      setSelected([]);
      loadUsers();
    } catch (err) {
      loadUsers();
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User Management</h2>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => { localStorage.clear(); navigate('/login'); }}>Logout</button>
      </div>
        
      <div className="mb-3 p-3 bg-light border rounded d-flex gap-2">
        <button className="btn btn-danger" onClick={() => handleAction('blocked')}>Block</button>
        <button className="btn btn-light border" onClick={() => handleAction('active')} title="Unblock">
          <i className="bi bi-unlock-fill"></i> Unblock
        </button>
        <button className="btn btn-dark" onClick={() => handleAction('delete')} title="Delete">
          <i className="bi bi-trash-fill"></i>
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="bg-light">
            <tr>
              <th style={{ width: 40 }}>
                <input
                  type="checkbox"
                  onChange={e =>
                    setSelected(e.target.checked ? users.map(u => u.id) : [])
                  }
                  checked={selected.length === users.length && users.length > 0}
                />
              </th>
              {['Name', 'Email', 'Last Login', 'Status'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr
                key={u.id}
                className={u.status === 'blocked' ? 'text-muted' : ''}
                style={{ cursor: 'default' }}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(u.id)}
                    onChange={() =>
                      setSelected(prev =>
                        prev.includes(u.id)
                          ? prev.filter(id => id !== u.id)
                          : [...prev, u.id]
                      )
                    }
                  />
                </td>
                <td>{u.name}</td>
                <td className="text-truncate" style={{ maxWidth: 200 }}>
                  {u.email}
                </td>
                <td>{u.last_login ? new Date(u.last_login).toLocaleString() : 'Never'}</td>
                <td>
                  <span
                    className={`badge ${
                      u.status === 'active' ? 'bg-success' : 'bg-danger'
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminTable;