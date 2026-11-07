import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, AlertCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) { setErrorMsg('Please enter both email and password.'); return; }
    const res = await login(email, password);
    if (res.success) {
      navigate(res.data?.isAdmin && redirect === '/' ? '/admin' : redirect);
    } else {
      setErrorMsg(res.error || 'Invalid credentials');
    }
  };

  const quickFill = (role) => {
    setEmail(role === 'admin' ? 'admin@cartzy.com' : 'user@cartzy.com');
    setPassword(role === 'admin' ? 'admin123' : 'user123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-10">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-md">
          <ShoppingCart className="w-5 h-5 text-white" />
        </div>
        <span className="text-2xl font-black tracking-tight text-slate-900">
          Cart<span className="text-orange-500">zy</span>
        </span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-card p-7">
        <h1 className="text-2xl font-black text-slate-900 mb-1">Sign In</h1>
        <p className="text-xs text-slate-400 mb-5">Welcome back! Sign in to your Cartzy account.</p>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div><p className="font-bold">Sign in error</p><p>{errorMsg}</p></div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Email address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm bg-white placeholder-slate-400 transition"
              placeholder="name@example.com" />
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <a href="#" className="text-[11px] text-orange-500 hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm bg-white placeholder-slate-400 pr-10 transition"
                placeholder="At least 6 characters" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm shadow-sm transition active:scale-95 flex items-center justify-center gap-2">
            {loading
              ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              : 'Sign In to Cartzy'}
          </button>
        </form>

        <p className="text-[11px] text-slate-400 mt-4 leading-relaxed text-center">
          By continuing, you agree to Cartzy's{' '}
          <a href="#" className="text-orange-500 hover:underline">Terms</a> &amp;{' '}
          <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a>.
        </p>

        {/* Quick fill for demo */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5">
            ⚡ Quick Test Login (Click to auto-fill)
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => quickFill('admin')}
              className="p-2.5 bg-orange-50 hover:bg-orange-100/80 text-orange-900 border border-orange-200 rounded-xl text-left transition flex flex-col gap-0.5 group"
            >
              <div className="flex items-center gap-1 font-black text-xs text-orange-700">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
                <span>Admin Login</span>
              </div>
              <span className="text-[10px] text-orange-600/90 font-medium">admin@cartzy.com</span>
              <span className="text-[9px] text-slate-400">Pass: admin123</span>
            </button>

            <button
              type="button"
              onClick={() => quickFill('user')}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 rounded-xl text-left transition flex flex-col gap-0.5"
            >
              <div className="flex items-center gap-1 font-black text-xs text-slate-700">
                <span>Customer</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">user@cartzy.com</span>
              <span className="text-[9px] text-slate-400">Pass: user123</span>
            </button>
          </div>
        </div>
      </div>

      {/* New account */}
      <div className="mt-5 text-center">
        <div className="text-xs text-slate-500 mb-3">New to Cartzy?</div>
        <Link to={`/register?redirect=${encodeURIComponent(redirect)}`}
          className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-xl border border-slate-300 text-xs shadow-sm transition">
          Create your Cartzy account
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
