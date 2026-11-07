import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      // If admin, they might prefer to go to /admin or redirect
      if (res.data?.isAdmin && redirectUrl === '/') {
        navigate('/admin');
      } else {
        navigate(redirectUrl);
      }
    } else {
      setErrorMsg(res.error || 'Invalid credentials');
    }
  };

  // Quick fill helper for testing
  const handleQuickFill = (role) => {
    if (role === 'admin') {
      setEmail('admin@amazon.com');
      setPassword('admin123');
    } else {
      setEmail('user@amazon.com');
      setPassword('user123');
    }
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4 flex flex-col items-center">
      {/* Amazon Logo */}
      <Link to="/" className="mb-6">
        <span className="text-3xl font-black text-gray-950 tracking-tight flex items-baseline">
          amazon<span className="text-amber-500 text-base font-bold">.in</span>
        </span>
      </Link>

      {/* Login Card */}
      <div className="w-full max-w-sm border border-gray-300 rounded-lg p-6 sm:p-7 shadow-sm bg-white">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign in</h1>

        {errorMsg && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-300 text-xs text-red-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">There was a problem</p>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-800 mb-1">
              Email or mobile phone number
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-gray-800">Password</label>
              <a href="#" className="text-amazon-link hover:underline text-[11px]">
                Forgot your password?
              </a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-950 font-bold rounded-md border border-[#fcd200] shadow-sm text-xs transition active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-900 border-t-transparent"></div>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <p className="text-[11px] text-gray-600 mt-4 leading-relaxed">
          By continuing, you agree to Amazon's{' '}
          <a href="#" className="text-amazon-link hover:underline">Conditions of Use</a> and{' '}
          <a href="#" className="text-amazon-link hover:underline">Privacy Notice</a>.
        </p>

        {/* Quick Demo Credentials */}
        <div className="mt-5 pt-4 border-t border-gray-200">
          <p className="text-[11px] font-bold text-gray-600 mb-2">⚡ Quick Test Credentials:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded text-[11px] font-bold transition flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3 h-3 text-amber-600" />
              <span>Admin Fill</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('user')}
              className="py-1.5 px-2 bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-300 rounded text-[11px] font-bold transition"
            >
              Customer Fill
            </button>
          </div>
        </div>
      </div>

      {/* New to Amazon? */}
      <div className="w-full max-w-sm mt-6 text-center">
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-3 text-gray-500 text-xs">New to Amazon?</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <Link
          to={`/register?redirect=${encodeURIComponent(redirectUrl)}`}
          className="block w-full py-2 px-4 mt-2 bg-gray-50 hover:bg-gray-100 text-gray-900 text-xs font-semibold rounded-md border border-gray-300 shadow-sm transition"
        >
          Create your Amazon account
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
