import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      try {
          const res = await axios.post( 'https://task4-4-2q6w.onrender.com/login', form);
          localStorage.setItem('token', res.data.token);
          navigate('/admin');
      } catch {
          setError('Login failed. User may be blocked or credentials incorrect.');
      }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-2">
      <div className="card shadow-sm w-100" style={{ maxWidth: '420px' }}>
        <div className="card-body p-4 p-sm-4 p-md-5">

          <div className="text-center mb-4">
            <h2 className="h6 text-uppercase text-secondary">
              Sign in to the app
            </h2>
          </div>

          {error && (
            <div className="alert alert-danger small py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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

            <div className="form-floating mb-3">
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

            <div className="form-check mb-3">
              <input className="form-check-input" type="checkbox" id="remember" />
              <label className="form-check-label small" htmlFor="remember">
                Remember me
              </label>
            </div>

            <button className="btn btn-primary w-100 py-2" type="submit">
              Sign In
            </button>

            <p className="mt-3 text-center small text-muted">
              Don’t have an account?{' '}
              <Link to="/register" className="text-decoration-none">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
