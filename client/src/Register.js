import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('https://task4-4-2q6w.onrender.com/register', form);
      navigate('/login');
    } catch (err) {
      setError(
        err.response?.data?.message === 'Email exists'
          ? 'This email is already registered.'
          : 'Registration failed. Please try again.'
      );
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-2">
      <div className="card shadow-sm w-100" style={{ maxWidth: '420px' }}>
        <div className="card-body p-4 p-sm-4 p-md-5">

          <div className="text-center mb-4">
            <h2 className="h6 text-uppercase text-secondary">
              Sign up
            </h2>
          </div>

          {error && (
            <div className="alert alert-danger small py-2 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className="form-control"
                    id="nameInput"
                    placeholder="Full Name"
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                />
                <label htmlFor="nameInput">Full name</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="emailInput"
                placeholder="name@example.com"
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
              <label htmlFor="emailInput">E-mail</label>
            </div>

            <div className="form-floating mb-4">
              <input
                type="password"
                className="form-control"
                id="passInput"
                placeholder="Password"
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
              <label htmlFor="passInput">Password</label>
            </div>

            <button className="btn btn-primary w-100 py-2" type="submit">
              Sign Up
            </button>

            <p className="mt-3 text-center small text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-decoration-none">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
