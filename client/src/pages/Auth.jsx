import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  CheckCircle2,
  Globe,
  LogIn,
  ArrowLeft,
} from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { login } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = (role) => {
    if (role === 'teacher') return '/teacher';
    if (role === 'student') return '/student';
    return '/';
  };

  // FORM DATA
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role,
    });
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      // FORGOT PASSWORD
      if (isForgot) {
        alert('Reset link sent to your email!');
        setIsForgot(false);
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        isLogin
          ? 'http://localhost:5000/api/auth/login'
          : 'http://localhost:5000/api/auth/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);

        if (data.token && data.user) {
          if (isLogin && data.user.role !== formData.role) {
            alert(`This account is registered as a ${data.user.role}. Please select ${data.user.role} to login.`);
            setIsLoading(false);
            return;
          }

          login(data.token, data.user);
          navigate(getDashboardPath(data.user?.role), { replace: true });
        }

        // CLEAR FORM
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'student',
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert('Server Error');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden font-sans bg-[#0a4a44]">
      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 z-0 opacity-120"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=2070')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a4a44] via-[#0a4a44]/90 to-black z-0" />

      {/* MOUSE GLOW */}
      <motion.div
        className="pointer-events-none absolute z-10 w-[400px] h-[400px] rounded-full opacity-30 blur-[100px]"
        animate={{
          x: mousePos.x - 200,
          y: mousePos.y - 200,
        }}
        style={{
          background:
            'radial-gradient(circle, #ff9f1c 0%, transparent 70%)',
        }}
      />

      {/* MAIN CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl lg:min-h-[700px] bg-white/95 backdrop-blur-xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col lg:flex-row relative z-20 border border-white/20"
      >
        {/* LEFT SIDE */}
        <div className="lg:w-[40%] bg-[#0a4a44] relative p-10 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff9f1c]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          {/* LOGO */}
          <div className="relative z-10 flex items-center gap-2">
            <div className="bg-[#ff9f1c] p-1.5 rounded-lg shadow-md">
              <GraduationCap className="text-white" size={20} />
            </div>

            <span className="text-xl font-black text-white italic">
              EduHub
              <span className="text-[#ff9f1c]">.</span>
            </span>
          </div>

          {/* TEXT */}
          <div className="relative z-10 py-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={
                  isForgot
                    ? 'forgot-txt'
                    : isLogin
                    ? 'login-txt'
                    : 'signup-txt'
                }
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-5xl font-black text-white leading-tight mb-6 whitespace-pre-line">
                  {isForgot
                    ? 'Reset \nPassword.'
                    : isLogin
                    ? 'Welcome \nBack.'
                    : 'Start Your \nJourney.'}
                </h2>

                <p className="text-teal-100/60 text-sm leading-relaxed max-w-[260px]">
                  {isForgot
                    ? "Don't worry, it happens to the best of us. Let's get you back in."
                    : isLogin
                    ? 'Access your saved notes and study roadmaps prepared by experts.'
                    : 'Join 50k+ students and get access to verified resources.'}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* BADGE */}
            <div className="mt-12 bg-white/5 border border-white/10 p-5 rounded-2xl inline-flex items-center gap-4">
              <div className="bg-[#ff9f1c] p-2 rounded-xl">
                <CheckCircle2 className="text-white" size={20} />
              </div>

              <div>
                <p className="text-white font-bold text-sm leading-none">
                  Topper Choice
                </p>

                <p className="text-teal-100/40 text-[9px] uppercase tracking-widest mt-1">
                  98% Success Rate
                </p>
              </div>
            </div>
          </div>

          <p className="text-teal-100/20 text-[9px] font-bold uppercase tracking-[0.2em] relative z-10">
            Infrastructure v3.1
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:w-[60%] p-8 md:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full">
            {/* HEADER */}
            <div className="mb-10">
              <h3 className="text-3xl font-black text-[#0a4a44]">
                {isForgot
                  ? 'Forgot Password'
                  : isLogin
                  ? 'Sign In'
                  : 'Create Account'}
              </h3>

              <p className="text-sm text-gray-400 font-medium mt-2">
                {isForgot ? (
                  <button
                    onClick={() => setIsForgot(false)}
                    className="flex items-center gap-1 text-[#ff9f1c] font-black hover:underline"
                  >
                    <ArrowLeft size={14} />
                    Back to Login
                  </button>
                ) : (
                  <>
                    {isLogin
                      ? 'New here?'
                      : 'Already a member?'}

                    <button
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setIsForgot(false);
                      }}
                      className="ml-1 text-[#ff9f1c] font-black hover:underline"
                    >
                      {isLogin
                        ? 'Sign up for free'
                        : 'Log in to account'}
                    </button>
                  </>
                )}
              </p>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <AnimatePresence mode="popLayout">
                {!isLogin && !isForgot && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="relative"
                  >
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                      size={16}
                    />

                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full py-4 pl-11 pr-4 bg-gray-50 border border-transparent rounded-xl outline-none focus:border-[#ff9f1c] focus:bg-white transition-all text-sm font-bold"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ROLE SELECTION */}
              {!isForgot && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <p className="text-sm font-bold text-gray-700">I am a:</p>
                  <div
                    role="radiogroup"
                    aria-label="Select account role"
                    className="grid grid-cols-2 gap-2 rounded-xl bg-gray-50 p-1 border border-gray-100"
                  >
                    {['student', 'teacher'].map((role) => {
                      const isSelected = formData.role === role;

                      return (
                        <button
                          key={role}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => handleRoleChange(role)}
                          className={`py-3 rounded-lg text-sm font-black capitalize transition-all ${
                            isSelected
                              ? 'bg-[#ff9f1c] text-white shadow-md shadow-[#ff9f1c]/20'
                              : 'text-gray-500 hover:text-[#0a4a44] hover:bg-white'
                          }`}
                        >
                          {role}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* EMAIL */}
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                  size={16}
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full py-4 pl-11 pr-4 bg-gray-50 border border-transparent rounded-xl outline-none focus:border-[#ff9f1c] focus:bg-white transition-all text-sm font-bold"
                />
              </div>

              {/* PASSWORD */}
              {!isForgot && (
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                    size={16}
                  />

                  <input
                    type={
                      showPassword ? 'text' : 'password'
                    }
                    name="password"
                    placeholder="Password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full py-4 pl-11 pr-11 bg-gray-50 border border-transparent rounded-xl outline-none focus:border-[#ff9f1c] focus:bg-white transition-all text-sm font-bold"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#0a4a44]"
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              )}

              {/* FORGOT PASSWORD */}
              {isLogin && !isForgot && (
                <div className="flex justify-end px-1">
                  <button
                    type="button"
                    onClick={() => setIsForgot(true)}
                    className="text-xs font-bold text-[#ff9f1c] hover:underline transition-all"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                disabled={isLoading}
                className="w-full bg-[#ff9f1c] text-white py-4 rounded-xl font-black text-sm shadow-lg hover:shadow-[#ff9f1c]/20 hover:bg-[#e68a00] transition-all flex items-center justify-center gap-2 mt-6"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isForgot
                      ? 'Send Reset Link'
                      : isLogin
                      ? 'Sign In'
                      : 'Get Started'}

                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* SOCIAL LOGIN */}
            {!isForgot && (
              <>
                <div className="relative my-10 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                  </div>

                  <span className="relative bg-white px-4 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                    Or continue with
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all font-bold text-xs text-[#0a4a44]">
                    <Globe
                      size={14}
                      className="text-blue-500"
                    />
                    Google
                  </button>

                  <button className="flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all font-bold text-xs text-[#0a4a44]">
                    <LogIn size={14} />
                    GitHub
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
