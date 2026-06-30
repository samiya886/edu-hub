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
  ArrowLeft,
  X,
  ShieldCheck,
} from 'lucide-react';

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { login } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = (role) => {
    const normalizedRole = String(role || '').trim().toLowerCase();

    if (normalizedRole === 'teacher') return '/teacher';
    if (normalizedRole === 'student') return '/student';
    if (normalizedRole === 'admin') return '/admin';

    return '/auth';
  };

  const decodeAuthPayload = (payload) => {
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + (4 - (normalizedPayload.length % 4)) % 4,
      '='
    );

    return JSON.parse(window.atob(paddedPayload));
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthStatus = params.get('oauth');

    if (!oauthStatus) return;

    window.history.replaceState({}, document.title, window.location.pathname);

    if (oauthStatus === 'success') {
      try {
        const payload = decodeAuthPayload(params.get('payload') || '');

        if (!payload.token || !payload.user) {
          throw new Error('Google login response was incomplete.');
        }

        login(payload.token, payload.user);
        setSuccessMessage(`Welcome back, ${payload.user?.name?.split(' ')[0] || 'there'}.`);
        window.setTimeout(() => {
          navigate(getDashboardPath(payload.user?.role), { replace: true });
        }, 700);
      } catch (error) {
        setErrorMessage(error.message || 'Google login failed.');
      }
      return;
    }

    setErrorMessage(params.get('message') || 'Google login failed.');
  }, [login, navigate]);

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

  const handleGoogleLogin = () => {
    setErrorMessage('');
    setSuccessMessage('');
    window.location.href = `/api/auth/google?role=${encodeURIComponent(formData.role)}`;
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // FORGOT PASSWORD
      if (isForgot) {
        setSuccessMessage('Reset link sent to your email!');
        setIsForgot(false);
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        isLogin
          ? '/api/auth/login'
          : '/api/auth/signup',
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
        if (data.token && data.user) {
          if (isLogin && data.user.role !== formData.role) {
            setErrorMessage(`This account is registered as a ${data.user.role}. Please select ${data.user.role} to login.`);
            setIsLoading(false);
            return;
          }

          const firstName = data.user?.name?.split(' ')[0] || 'there';
          setSuccessMessage(isLogin ? `Welcome back, ${firstName}.` : `Welcome to EduHub, ${firstName}.`);
          login(data.token, data.user);
          setIsLoading(false);
          window.setTimeout(() => {
            navigate(getDashboardPath(data.user?.role), { replace: true });
          }, 1200);
          return;
        }

        setSuccessMessage(data.message || 'Done successfully.');

        // CLEAR FORM
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'student',
        });
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage('Server Error');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative flex w-full items-center justify-center p-3 overflow-hidden font-sans bg-[#0a4a44] sm:p-4">
      <AnimatePresence>
        {(errorMessage || successMessage) && (
          <motion.div
            key="popup"
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/35 p-4 pt-10 sm:pt-16"
          >
            <div className="flex w-full max-w-sm items-center gap-4 rounded-2xl border border-white/10 bg-[#061826]/95 px-5 py-4 text-white shadow-2xl shadow-black/30 backdrop-blur-xl sm:min-w-[350px]">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-teal-200/30 bg-[#0a4a44]/70">
                {errorMessage ? (
                  <X className="text-[#ff9f1c]" size={18} />
                ) : (
                  <span className="h-4 w-4 rounded-full border-2 border-teal-200/40 border-t-teal-200 animate-spin" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black">
                  {errorMessage || successMessage}
                </p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-teal-100/45">
                  {errorMessage ? 'Action needed' : isLogin ? 'Student portal' : 'Account ready'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-teal-100/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Close notification"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="absolute inset-0 z-0 opacity-35"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2070')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a4a44] via-[#0a4a44]/90 to-black z-0" />

      {/* MOUSE GLOW */}
      <motion.div
        className="pointer-events-none absolute z-10 h-[260px] w-[260px] rounded-full opacity-30 blur-[90px] sm:h-[400px] sm:w-[400px] sm:blur-[100px]"
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
        className="relative z-20 flex w-full max-w-md flex-col overflow-hidden rounded-[24px] border border-white/20 bg-white/95 shadow-2xl backdrop-blur-xl sm:max-w-xl sm:rounded-[26px] lg:min-h-[700px] lg:max-w-5xl lg:flex-row lg:rounded-[40px]"
      >
        {/* LEFT SIDE */}
        <div className="relative flex flex-col justify-between overflow-hidden bg-[#0a4a44] p-5 sm:p-8 lg:w-[40%] lg:p-10">
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
          <div className="relative z-10 py-8 lg:py-12">
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
                <h2 className="mb-4 whitespace-pre-line text-3xl font-black leading-tight text-white sm:text-4xl lg:mb-6 lg:text-5xl">
                  {isForgot
                    ? 'Reset \nPassword.'
                    : isLogin
                    ? 'Welcome \nBack.'
                    : 'Start Your \nJourney.'}
                </h2>

                <p className="max-w-[280px] text-sm leading-relaxed text-teal-100/70">
                  {isForgot
                    ? "Don't worry, it happens to the best of us. Let's get you back in."
                    : isLogin
                    ? 'Access your saved notes and study roadmaps prepared by experts.'
                    : 'Join 50k+ students and get access to verified resources.'}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* BADGE */}
            <div className="mt-6 bg-white/5 border border-white/10 p-4 rounded-2xl inline-flex items-center gap-3 sm:mt-12 sm:p-5 sm:gap-4">
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
        <div className="flex flex-col justify-center bg-white p-5 sm:p-8 md:p-16 lg:w-[60%]">
          <div className="max-w-sm mx-auto w-full">
            {/* HEADER */}
            <div className="mb-7 sm:mb-10">
              <h3 className="text-2xl font-black text-[#0a4a44] sm:text-3xl">
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
                    className="grid grid-cols-2 gap-2 rounded-xl border border-gray-100 bg-gray-50 p-1"
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
                          className={`rounded-lg px-2 py-3 text-sm font-black capitalize transition-all ${
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

              {isLogin && !isForgot && (
                <button
                  type="button"
                  onClick={() => navigate('/admin-login')}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#0a4a44]/10 bg-[#0a4a44]/5 px-4 py-3 text-sm font-black text-[#0a4a44] transition-all hover:border-[#ff9f1c]/40 hover:bg-orange-50 hover:text-[#ff9f1c]"
                >
                  <ShieldCheck size={16} />
                  Admin Login
                </button>
              )}
              {/* SUBMIT BUTTON */}
              <button
                disabled={isLoading}
                className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ff9f1c] px-4 py-4 text-center text-sm font-black text-white shadow-lg transition-all hover:bg-[#e68a00] hover:shadow-[#ff9f1c]/20"
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

                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all font-bold text-xs text-[#0a4a44]"
                  >
                    <Globe
                      size={14}
                      className="text-blue-500"
                    />
                    Google
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
