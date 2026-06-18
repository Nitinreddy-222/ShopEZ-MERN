import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const { data } = await axios.post('/api/users/register', { name, email, password });
      if (data.success) {
        localStorage.setItem('userInfo', JSON.stringify(data.data));
        navigate(redirect);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-6 col-lg-4">
        <div className="card shadow-sm p-4 mt-5">
          <h2 className="text-center mb-4 fw-bold text-primary">Register</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={submitHandler}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input 
                type="text" 
                className="form-control" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input 
                type="email" 
                className="form-control" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input 
                type="password" 
                className="form-control" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3">Register</button>
            <div className="text-center">
              Have an Account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
