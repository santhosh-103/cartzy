import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const onChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setErrorMsg(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!form.name.trim()) return setErrorMsg('Please enter your full name.');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setErrorMsg('Please enter a valid email address.');
    if (form.password.length < 6) return setErrorMsg('Password must be at least 6 characters.');
    if (form.password !== form.confirmPassword) return setErrorMsg('Passwords do not match.');
    const res = await register({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), password: form.password });
    if (res.success) navigate(redirect);
    else setErrorMsg(res.error || 'Registration failed.');
  };

  const pwStrength = form.password.length === 0 ? null : form.password.length < 6 ? 'weak' : form.password.length < 10 ? 'fair' : 'strong';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mb-7">
        <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-md">
          <ShoppingCart className="w-5 h-5 text-white" />
        </div>
        <span className="text-2xl font-black tracking-tight text-slate-900">
          Cart<span className="text-orange-500">zy</span>
        </span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-card p-7">
        <h1 className="text-2xl font-black text-slate-900 mb-1">Create Account</h1>
        <p className="text-xs text-slate-400 mb-5">Join Cartzy and start shopping smarter.</p>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div><p className="font-bold">Registration error</p><p>{errorMsg}</p></div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {[
            { name: 'name', label: 'Full Name *', type: 'text', placeholder: 'First and last name', required: true },
            { name: 'phone', label: 'Mobile Number (optional)', type: 'tel', placeholder: '10-digit mobile', required: false },
            { name: 'email', label: 'Email Address *', type: 'email', placeholder: 'name@example.com', required: true },
          ].map(({ name, label, type, placeholder, required }) => (
            <div key={name}>
              <label className="block font-bold text-slate-700 mb-1.5">{label}</label>
              <input type={type} name={name} required={required} value={form[name]} onChange={onChange}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs bg-white placeholder-slate-400 transition"
                placeholder={placeholder} />
            </div>
          ))}

          {/* Password with strength */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Password *</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} name="password" required value={form.password} onChange={onChange}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs bg-white placeholder-slate-400 pr-10 transition"
                placeholder="At least 6 characters" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {pwStrength && (
              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex gap-1 flex-1">
                  {['weak', 'fair', 'strong'].map((s, i) => (
                    <div key={s} className={`h-1 flex-1 rounded-full transition-all ${
                      pwStrength === 'weak' && i === 0 ? 'bg-red-400' :
                      pwStrength === 'fair' && i <= 1 ? 'bg-amber-400' :
                      pwStrength === 'strong' ? 'bg-emerald-500' : 'bg-slate-200'
                    }`} />
                  ))}
                </div>
                <span className={`text-[10px] font-bold ${pwStrength === 'weak' ? 'text-red-500' : pwStrength === 'fair' ? 'text-amber-500' : 'text-emerald-600'}`}>
                  {pwStrength}
                </span>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Re-enter Password *</label>
            <div className="relative">
              <input type="password" name="confirmPassword" required value={form.confirmPassword} onChange={onChange}
                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs bg-white placeholder-slate-400 pr-10 transition ${
                  form.confirmPassword && form.confirmPassword !== form.password ? 'border-red-300' : 'border-slate-300'
                }`}
                placeholder="Confirm your password" />
              {form.confirmPassword && form.confirmPassword === form.password && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
              )}
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm shadow-sm transition active:scale-95 flex items-center justify-center gap-2 mt-1">
            {loading
              ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              : 'Create Cartzy Account'}
          </button>
        </form>

        <p className="text-[11px] text-slate-400 mt-4 leading-relaxed text-center">
          By creating an account, you agree to Cartzy's{' '}
          <a href="#" className="text-orange-500 hover:underline">Terms</a> &amp;{' '}
          <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a>.
        </p>

        <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 text-center">
          Already have an account?{' '}
          <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-orange-500 hover:underline font-bold">
            Sign in →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
