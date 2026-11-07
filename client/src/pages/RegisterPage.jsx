import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const { register, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Passwords must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    const res = await register({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
    });

    if (res.success) {
      navigate(redirectUrl);
    } else {
      setErrorMsg(res.error || 'Failed to create account.');
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 flex flex-col items-center">
      {/* Amazon Logo */}
      <Link to="/" className="mb-6">
        <span className="text-3xl font-black text-gray-950 tracking-tight flex items-baseline">
          amazon<span className="text-amber-500 text-base font-bold">.in</span>
        </span>
      </Link>

      {/* Register Card */}
      <div className="w-full max-w-sm border border-gray-300 rounded-lg p-6 sm:p-7 shadow-sm bg-white">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Create Account</h1>

        {errorMsg && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-300 text-xs text-red-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">There was a problem</p>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-gray-800 mb-1">Your name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-400 rounded text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              placeholder="First and last name"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">Mobile number (optional)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-400 rounded text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              placeholder="10-digit mobile number"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-400 rounded text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">Password *</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-400 rounded text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              placeholder="At least 6 characters"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Passwords must be at least 6 characters.
            </p>
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">Re-enter password *</label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-400 rounded text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              placeholder="Confirm password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-950 font-bold rounded-md border border-[#fcd200] shadow-sm text-xs transition active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-900 border-t-transparent"></div>
            ) : (
              <span>Create your Amazon account</span>
            )}
          </button>
        </form>

        <p className="text-[11px] text-gray-600 mt-4 leading-relaxed border-t border-gray-200 pt-3">
          By creating an account, you agree to Amazon's{' '}
          <a href="#" className="text-amazon-link hover:underline">Conditions of Use</a> and{' '}
          <a href="#" className="text-amazon-link hover:underline">Privacy Notice</a>.
        </p>

        <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-700">
          Already have an account?{' '}
          <Link
            to={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
            className="text-amazon-link hover:underline font-bold"
          >
            Sign in &gt;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
