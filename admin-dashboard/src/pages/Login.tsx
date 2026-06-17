import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Lock, Mail, User, AlertCircle, CheckCircle } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const { login, register, resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(email, password);
        if (!result.success) {
          setError(result.error);
        }
      } else {
        // Registration validation
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password should be at least 6 characters');
          setLoading(false);
          return;
        }

        const result = await register(email, password, name);
        if (result.success) {
          setSuccess('Account created successfully! You can now log in.');
          setIsLogin(true);
          setEmail('');
          setPassword('');
          setName('');
          setConfirmPassword('');
        } else {
          setError(result.error);
        }
      }
    } catch (error) {
      setError('An unexpected error occurred');
    }

    setLoading(false);
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await resetPassword(email);
      if (result.success) {
        setSuccess('Password reset email sent! Check your inbox.');
        setResetMode(false);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to send reset email');
    }

    setLoading(false);
  };

  if (resetMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ghana-secondary-800 via-ghana-secondary-700 to-ghana-secondary-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-ghana-gold-400/20 rounded-full mix-blend-overlay filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-ghana-gold-300/20 rounded-full mix-blend-overlay filter blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
          <div className="absolute -bottom-20 left-40 w-96 h-96 bg-ghana-gold-500/20 rounded-full mix-blend-overlay filter blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ghana-secondary-500/10 rounded-full mix-blend-overlay filter blur-3xl animate-pulse-slow" style={{animationDelay: '1.5s'}}></div>
        </div>

        <div className="max-w-md w-full space-y-6 relative z-10">
          <div className="text-center animate-fade-in">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-ghana-gold-400/30 blur-xl rounded-full animate-pulse-slow"></div>
                <img
                  src="/Logo.jpeg"
                  alt="Ghana School Feeding Programme Logo"
                  className="h-16 w-auto relative z-10 object-contain drop-shadow-2xl"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <h2 className="text-3xl font-bold text-ghana-gold-100 animate-slide-down tracking-tight">
                GSFP Admin Dashboard
              </h2>
            </div>
            <p className="text-base text-ghana-gold-300 font-medium animate-slide-down" style={{animationDelay: '0.15s'}}>
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); handlePasswordReset(); }}>
            <div className="bg-white/90 backdrop-blur-2xl py-8 px-8 shadow-2xl rounded-2xl space-y-5 border border-white/30 animate-slide-up relative overflow-hidden" style={{animationDelay: '0.3s'}}>
              {/* Glass shine effect */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-ghana-gold-400 to-transparent opacity-50"></div>

              {error && (
                <div className="bg-error-50/90 backdrop-blur border-2 border-error-200 text-error-700 px-4 py-3 rounded-xl text-sm flex items-center animate-slide-up shadow-soft">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-success-50/90 backdrop-blur border-2 border-success-200 text-success-700 px-4 py-3 rounded-xl text-sm flex items-center animate-slide-up shadow-soft">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {success}
                </div>
              )}

              <div className="animate-fade-in" style={{animationDelay: '0.4s'}}>
                <label htmlFor="reset-email" className="block text-sm font-semibold text-ghana-neutral-700 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-ghana-neutral-400 group-focus-within:text-ghana-primary-500 transition-colors duration-300" />
                  </div>
                  <input
                    id="reset-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10 pr-4 py-3 rounded-xl border-2 border-ghana-neutral-200 focus:border-ghana-primary-400 focus:ring-2 focus:ring-ghana-primary-100 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="flex space-x-3 animate-fade-in" style={{animationDelay: '0.5s'}}>
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="flex-1 btn-primary py-3.5 text-sm font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-ghana-primary-600 to-ghana-primary-700 hover:from-ghana-primary-700 hover:to-ghana-primary-800 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <button
                  type="button"
                  onClick={() => setResetMode(false)}
                  className="flex-1 btn-secondary py-3.5 text-sm font-semibold rounded-xl hover:scale-[1.02] transition-all duration-300"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ghana-secondary-800 via-ghana-secondary-700 to-ghana-secondary-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-ghana-gold-400/20 rounded-full mix-blend-overlay filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-ghana-gold-300/20 rounded-full mix-blend-overlay filter blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute -bottom-20 left-40 w-96 h-96 bg-ghana-gold-500/20 rounded-full mix-blend-overlay filter blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ghana-secondary-500/10 rounded-full mix-blend-overlay filter blur-3xl animate-pulse-slow" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="max-w-md w-full space-y-6 relative z-10">
        <div className="text-center animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-ghana-gold-400/30 blur-xl rounded-full animate-pulse-slow"></div>
              <img
                src="/Logo.jpeg"
                alt="Ghana School Feeding Programme Logo"
                className="h-16 w-auto relative z-10 object-contain drop-shadow-2xl"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <h2 className="text-3xl font-bold text-ghana-gold-100 animate-slide-down tracking-tight">
              GSFP Admin Dashboard
            </h2>
          </div>
          <p className="text-base text-ghana-gold-300 font-medium animate-slide-down" style={{animationDelay: '0.15s'}}>
            {isLogin
              ? 'Sign in to manage GSFP content'
              : 'Create your admin account'
            }
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="bg-white/90 backdrop-blur-2xl py-8 px-8 shadow-2xl rounded-2xl space-y-5 border border-white/30 animate-slide-up relative overflow-hidden" style={{animationDelay: '0.3s'}}>
            {/* Glass shine effect */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-ghana-gold-400 to-transparent opacity-50"></div>
            
            {error && (
              <div className="bg-error-50/90 backdrop-blur border-2 border-error-200 text-error-700 px-4 py-3 rounded-xl text-sm flex items-center animate-slide-up shadow-soft">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="bg-success-50/90 backdrop-blur border-2 border-success-200 text-success-700 px-4 py-3 rounded-xl text-sm flex items-center animate-slide-up shadow-soft">
                <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                {success}
              </div>
            )}

            {!isLogin && (
              <div className="animate-fade-in" style={{animationDelay: '0.4s'}}>
                <label htmlFor="name" className="block text-sm font-semibold text-ghana-neutral-700 mb-2">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-ghana-neutral-400 group-focus-within:text-ghana-primary-500 transition-colors duration-300" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required={!isLogin}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field pl-10 pr-4 py-3 rounded-xl border-2 border-ghana-neutral-200 focus:border-ghana-primary-400 focus:ring-2 focus:ring-ghana-primary-100 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            <div className="animate-fade-in" style={{animationDelay: '0.5s'}}>
              <label htmlFor="email" className="block text-sm font-semibold text-ghana-neutral-700 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-ghana-neutral-400 group-focus-within:text-ghana-primary-500 transition-colors duration-300" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10 pr-4 py-3 rounded-xl border-2 border-ghana-neutral-200 focus:border-ghana-primary-400 focus:ring-2 focus:ring-ghana-primary-100 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="animate-fade-in" style={{animationDelay: '0.6s'}}>
              <label htmlFor="password" className="block text-sm font-semibold text-ghana-neutral-700 mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-ghana-neutral-400 group-focus-within:text-ghana-primary-500 transition-colors duration-300" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-12 py-3 rounded-xl border-2 border-ghana-neutral-200 focus:border-ghana-primary-400 focus:ring-2 focus:ring-ghana-primary-100 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-ghana-neutral-400 hover:text-ghana-neutral-600 focus:outline-none transition-colors duration-300 p-1 hover:scale-110 transform"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {!isLogin && (
              <div className="animate-fade-in" style={{animationDelay: '0.7s'}}>
                <label htmlFor="confirm-password" className="block text-sm font-semibold text-ghana-neutral-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-ghana-neutral-400 group-focus-within:text-ghana-primary-500 transition-colors duration-300" />
                  </div>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required={!isLogin}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field pl-10 pr-12 py-3 rounded-xl border-2 border-ghana-neutral-200 focus:border-ghana-primary-400 focus:ring-2 focus:ring-ghana-primary-100 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="Confirm your password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-ghana-neutral-400 hover:text-ghana-neutral-600 focus:outline-none transition-colors duration-300 p-1 hover:scale-110 transform"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="animate-fade-in" style={{animationDelay: '0.8s'}}>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-base font-semibold py-3.5 rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ghana-primary-100 bg-gradient-to-r from-ghana-primary-600 to-ghana-primary-700 hover:from-ghana-primary-700 hover:to-ghana-primary-800"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="loading-spinner"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <span>{isLogin ? 'Sign In to GSFP Admin' : 'Create Admin Account'}</span>
                )}
              </button>
            </div>

            <div className="mt-5 text-center animate-fade-in" style={{animationDelay: '0.9s'}}>
              <p className="text-ghana-gold-300 text-sm font-medium">
                {isLogin ? "Don't have an admin account?" : "Already have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-semibold text-ghana-gold-100 hover:text-white transition-colors duration-300 underline underline-offset-2 hover:scale-105 transform inline-block"
                >
                  {isLogin ? 'Create Account' : 'Sign In'}
                </button>
              </p>
            </div>

            {isLogin && (
              <div className="mt-4 text-center animate-fade-in" style={{animationDelay: '1s'}}>
                <button
                  type="button"
                  onClick={() => setResetMode(true)}
                  className="text-sm text-ghana-gold-300 hover:text-ghana-gold-100 transition-colors duration-300 underline underline-offset-2 hover:scale-105 transform inline-block"
                >
                  Forgot password?
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
