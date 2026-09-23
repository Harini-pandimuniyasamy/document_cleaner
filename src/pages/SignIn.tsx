import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ScanText,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';

export const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});

  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Check if routed with a success message or prefilled email from signup
  useEffect(() => {
    if (location.state?.prefillEmail) {
      setEmail(location.state.prefillEmail);
    }
    if (location.state?.successNotice) {
      setSuccessNotice(location.state.successNotice);
    }
  }, [location.state]);

  const validateEmailFormat = (val: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleValidation = (): boolean => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!validateEmailFormat(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Please enter your password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessNotice(null);

    if (!handleValidation()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      setIsSubmitting(false);

      if (!res.success) {
        setErrors({ form: res.error || 'Login failed. Please check your credentials.' });
      } else {
        setLoginSuccess(true);
        setTimeout(() => {
          const destination = location.state?.from || '/upload';
          navigate(destination);
        }, 600);
      }
    } catch {
      setIsSubmitting(false);
      setErrors({ form: 'An unexpected error occurred during sign in.' });
    }
  };

  const fillDemoAccount = () => {
    setEmail('priyanka@example.com');
    setPassword('password123');
    setErrors({});
    setSuccessNotice(null);
  };

  return (
    <div className="w-full max-w-md mx-auto my-auto py-6 sm:py-10 animate-in fade-in duration-300">
      {/* Header Badge */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF8ED] border border-[#6B315E]/20 shadow-xs mb-3">
          <Sparkles className="w-4 h-4 text-[#C65D45]" />
          <span className="text-xs font-semibold tracking-wider text-[#6B315E] uppercase font-mono">
            Secure Access
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24162F] font-heading tracking-tight">
          Welcome Back
        </h1>
        <p className="text-xs sm:text-sm text-[#6F6670] mt-1.5 font-body">
          Sign in to access your document restoration workspace.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-[#FFF8ED]/95 backdrop-blur-xl border border-[#6B315E]/20 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle Decorative Ambient Beam */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-gradient-to-br from-[#E98268]/20 via-[#6B315E]/15 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-gradient-to-tr from-[#3C8D87]/20 via-[#D9A441]/15 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Notice from Sign Up */}
        {successNotice && (
          <div className="mb-5 p-3.5 rounded-2xl bg-[#A8D5C2]/35 border border-[#3C8D87]/40 flex items-center gap-2.5 text-[#24162F] text-xs sm:text-sm font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#3C8D87] flex-shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Global Error Alert */}
        {errors.form && (
          <div className="mb-5 p-3.5 rounded-2xl bg-[#E98268]/15 border border-[#E98268]/50 flex items-center gap-2.5 text-[#C65D45] text-xs sm:text-sm font-semibold animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        {/* Success Banner */}
        {loginSuccess && (
          <div className="mb-5 p-3.5 rounded-2xl bg-[#A8D5C2]/30 border border-[#3C8D87]/40 flex items-center gap-2.5 text-[#24162F] text-xs sm:text-sm font-bold animate-in zoom-in-95">
            <CheckCircle2 className="w-4 h-4 text-[#3C8D87] flex-shrink-0" />
            <span>Login successful! Returning to workspace...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email Address */}
          <div>
            <label
              htmlFor="signin-email"
              className="block text-xs font-bold text-[#24162F] uppercase font-mono tracking-wider mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B315E]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="signin-email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-[#FFF8ED] border text-xs sm:text-sm text-[#2C2830] placeholder:text-[#978D91] transition-all focus:outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-[#C65D45] focus:border-[#C65D45] focus:ring-[#C65D45]/20'
                    : 'border-[#6B315E]/20 focus:border-[#6B315E] focus:ring-[#6B315E]/20'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-[11px] font-semibold text-[#C65D45] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="signin-password"
                className="block text-xs font-bold text-[#24162F] uppercase font-mono tracking-wider"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B315E]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="signin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                className={`w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl bg-[#FFF8ED] border text-xs sm:text-sm text-[#2C2830] placeholder:text-[#978D91] transition-all focus:outline-none focus:ring-2 ${
                  errors.password
                    ? 'border-[#C65D45] focus:border-[#C65D45] focus:ring-[#C65D45]/20'
                    : 'border-[#6B315E]/20 focus:border-[#6B315E] focus:ring-[#6B315E]/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6F6670] hover:text-[#24162F] transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-[11px] font-semibold text-[#C65D45] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.password}</span>
              </p>
            )}
          </div>

          {/* Quick Demo Pre-fill Pill */}
          <div className="pt-1">
            <button
              type="button"
              onClick={fillDemoAccount}
              className="text-[11px] font-mono text-[#6B315E] hover:text-[#C65D45] flex items-center gap-1.5 bg-[#EADCC8]/40 hover:bg-[#EADCC8]/70 px-2.5 py-1 rounded-lg border border-[#6B315E]/15 transition-colors cursor-pointer"
            >
              <KeyRound className="w-3 h-3 text-[#D9A441]" />
              <span>Use demo account: priyanka@example.com</span>
            </button>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              disabled={loginSuccess}
              rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
              className="w-full h-12"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </div>
        </form>

        {/* Security / Privacy Indicator */}
        <div className="mt-5 pt-4 border-t border-[#EADCC8] flex items-center justify-between text-[11px] text-[#6F6670]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3C8D87]" />
            <span>Local Session Security</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[#6B315E]">
            <ScanText className="w-3.5 h-3.5" />
            <span>OCR 2.0 Ready</span>
          </div>
        </div>
      </div>

      {/* Switch to Sign Up Link */}
      <div className="text-center mt-6">
        <p className="text-xs sm:text-sm text-[#6F6670]">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            state={{ from: location.state?.from || '/upload' }}
            className="font-bold text-[#6B315E] hover:text-[#C65D45] transition-colors underline underline-offset-4"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};
