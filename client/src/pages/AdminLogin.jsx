import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Unable to login');
        setIsLoading(false);
        return;
      }

      if (data.user?.role !== 'admin') {
        alert('This login is only for admins.');
        setIsLoading(false);
        return;
      }

      login(data.token, data.user);
      navigate('/admin', { replace: true });
    } catch (error) {
      console.error(error);
      alert('Server Error');
    }

    setIsLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a4a44] p-4 font-sans">
      <div
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=2070')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0a4a44] via-[#0a4a44]/95 to-black" />

      <motion.div
        className="pointer-events-none absolute z-10 h-[420px] w-[420px] rounded-full opacity-30 blur-[110px]"
        animate={{ x: mousePos.x - 210, y: mousePos.y - 210 }}
        style={{ background: 'radial-gradient(circle, #ff9f1c 0%, transparent 70%)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-20 w-full max-w-md overflow-hidden rounded-[40px] border border-white/20 bg-white shadow-2xl"
      >
        <div className="bg-[#0a4a44] p-8 text-white">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-[#ff9f1c] p-3 shadow-xl shadow-orange-950/20">
              <ShieldCheck size={26} />
            </div>
            <span className="text-2xl font-black tracking-tighter">
              EduAdmin<span className="text-[#ff9f1c]">.</span>
            </span>
          </div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#ff9f1c]">
            Admin Access
          </p>
          <h1 className="text-4xl font-black tracking-tighter">Secure Login</h1>
          <p className="mt-3 text-sm font-medium leading-relaxed text-teal-100/60">
            Use your admin credentials to manage the academic dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-8">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input
              type="email"
              placeholder="Admin Email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-xl border border-transparent bg-gray-50 py-4 pl-11 pr-4 text-sm font-bold outline-none transition-all focus:border-[#ff9f1c] focus:bg-white"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-xl border border-transparent bg-gray-50 py-4 pl-11 pr-12 text-sm font-bold outline-none transition-all focus:border-[#ff9f1c] focus:bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 transition hover:text-[#0a4a44]"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff9f1c] py-4 text-sm font-black text-white shadow-lg transition hover:bg-[#e68a00] disabled:bg-gray-300"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              'Enter Admin Dashboard'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
