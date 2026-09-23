import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  User,
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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    form?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Email validation regex
  const validateEmailFormat = (val: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleValidation = (): boolean => {
    const newErrors: typeof errors = {};

    // Full Name
    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    }

    // Email Address
    if (!email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!validateEmailFormat(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password
    if (!password) {
      newErrors.password = 'Password cannot be empty';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm Password
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!handleValidation()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await signup(fullName, email, password);
      setIsSubmitting(false);

      if (!res.success) {
        setErrors({ form: res.error || 'Registration failed. Please try again.' });
      } else {
        setSignupSuccess(true);
        setTimeout(() => {
          const destination = location.state?.from || '/upload';
          navigate(destination);
        }, 1000);
      }
    } catch {
      setIsSubmitting(false);
      setErrors({ form: 'An unexpected error occurred during account creation.' });
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto my-auto py-6 sm:py-10 animate-in fade-in duration-300">
      {/* Header Badge */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF8ED] border border-[#6B315E]/20 shadow-xs mb-3">
          <Sparkles className="w-4 h-4 text-[#C65D45]" />
          <span className="text-xs font-semibold tracking-wider text-[#6B315E] uppercase font-mono">
            New Account Registration
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24162F] font-heading tracking-tight">
          Create Your Account
        </h1>
        <p className="text-xs sm:text-sm text-[#6F6670] mt-1.5 font-body">
          Enter your details to register for AI Document Cleaner.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-[#FFF8ED]/95 backdrop-blur-xl border border-[#6B315E]/20 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle Decorative Ambient Beam */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-gradient-to-br from-[#E98268]/20 via-[#6B315E]/15 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-gradient-to-tr from-[#3C8D87]/20 via-[#D9A441]/15 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Global Error Alert */}
        {errors.form && (
          <div className="mb-5 p-3.5 rounded-2xl bg-[#E98268]/15 border border-[#E98268]/50 flex items-center gap-2.5 text-[#C65D45] text-xs sm:text-sm font-semibold animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        {/* Success Banner */}
        {signupSuccess && (
          <div className="mb-5 p-3.5 rounded-2xl bg-[#A8D5C2]/30 border border-[#3C8D87]/40 flex items-center gap-2.5 text-[#24162F] text-xs sm:text-sm font-bold animate-in zoom-in-95">
            <CheckCircle2 className="w-4 h-4 text-[#3C8D87] flex-shrink-0" />
            <span>Account created successfully! Taking you to Sign In...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Full Name */}
          <div>
            <label
              htmlFor="signup-fullname"
              className="block text-xs font-bold text-[#24162F] uppercase font-mono tracking-wider mb-1.5"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B315E]">
                <User className="w-4 h-4" />
              </div>
              <input
                id="signup-fullname"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                }}
                className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-[#FFF8ED] border text-xs sm:text-sm text-[#2C2830] placeholder:text-[#978D91] transition-all focus:outline-none focus:ring-2 ${
                  errors.fullName
                    ? 'border-[#C65D45] focus:border-[#C65D45] focus:ring-[#C65D45]/20'
                    : 'border-[#6B315E]/20 focus:border-[#6B315E] focus:ring-[#6B315E]/20'
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-[11px] font-semibold text-[#C65D45] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label
              htmlFor="signup-email"
              className="block text-xs font-bold text-[#24162F] uppercase font-mono tracking-wider mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B315E]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email address"
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
            <label
              htmlFor="signup-password"
              className="block text-xs font-bold text-[#24162F] uppercase font-mono tracking-wider mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B315E]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Create a password"
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

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="signup-confirm-password"
              className="block text-xs font-bold text-[#24162F] uppercase font-mono tracking-wider mb-1.5"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B315E]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                }}
                className={`w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl bg-[#FFF8ED] border text-xs sm:text-sm text-[#2C2830] placeholder:text-[#978D91] transition-all focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? 'border-[#C65D45] focus:border-[#C65D45] focus:ring-[#C65D45]/20'
                    : 'border-[#6B315E]/20 focus:border-[#6B315E] focus:ring-[#6B315E]/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6F6670] hover:text-[#24162F] transition-colors cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-[11px] font-semibold text-[#C65D45] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.confirmPassword}</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              disabled={signupSuccess}
              rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
              className="w-full h-12"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
        </form>

        {/* Existing Security Guarantee */}
        <div className="mt-5 pt-4 border-t border-[#EADCC8] flex items-center justify-between text-[11px] text-[#6F6670]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3C8D87]" />
            <span>Zero-Retention Processing</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[#6B315E]">
            <ScanText className="w-3.5 h-3.5" />
            <span>OCR 2.0 Ready</span>
          </div>
        </div>
      </div>

      {/* Switch to Sign In Link */}
      <div className="text-center mt-6">
        <p className="text-xs sm:text-sm text-[#6F6670]">
          Already have an account?{' '}
          <Link
            to="/signin"
            className="font-bold text-[#6B315E] hover:text-[#C65D45] transition-colors underline underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
