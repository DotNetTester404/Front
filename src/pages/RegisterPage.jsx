import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, ShoppingBag, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      await authRegister(data);
      toast.success('Account created! Welcome to ShopLux!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    }
  };

  const perks = [
    'Free shipping on orders over $100',
    'Exclusive member discounts',
    'Order tracking & history',
    'Easy returns & refunds',
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left */}
      <div className="hidden lg:flex flex-1 bg-primary-950 items-center justify-center relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Shop"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="relative z-10 text-white px-12 max-w-md">
          <ShoppingBag className="w-14 h-14 mb-6 opacity-90" />
          <h1 className="text-4xl font-bold mb-4 leading-tight">Join ShopLux today</h1>
          <p className="text-primary-300 text-lg mb-8 leading-relaxed">Create your account and unlock a world of premium products.</p>
          <ul className="space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-sm text-primary-200">
                <div className="w-5 h-5 rounded-full bg-success-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-success-500" />
                </div>
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md animate-fade-up">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-primary-900 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-primary-900">ShopLux</span>
          </div>

          <h2 className="text-3xl font-bold text-primary-900 mb-1">Create account</h2>
          <p className="text-primary-500 mb-8">Fill in the details below to get started</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First name</label>
                <input
                  type="text"
                  placeholder="Alex"
                  className={`input ${errors.firstName ? 'input-error' : ''}`}
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: { value: 2, message: 'Min 2 characters' },
                  })}
                />
                {errors.firstName && <p className="mt-1 text-xs text-error-500">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="label">Last name</label>
                <input
                  type="text"
                  placeholder="Johnson"
                  className={`input ${errors.lastName ? 'input-error' : ''}`}
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: { value: 2, message: 'Min 2 characters' },
                  })}
                />
                {errors.lastName && <p className="mt-1 text-xs text-error-500">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className={`input ${errors.email ? 'input-error' : ''}`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
                })}
              />
              {errors.email && <p className="mt-1 text-xs text-error-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  className={`input pr-11 ${errors.password ? 'input-error' : ''}`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                    pattern: {
                      value: /^(?=.*[a-zA-Z])(?=.*[0-9])/,
                      message: 'Must include letters and numbers',
                    },
                  })}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-700">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-error-500">{errors.password.message}</p>}
            </div>

            <div>
              <label className="label">Confirm password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  className={`input pr-11 ${errors.confirmPassword ? 'input-error' : ''}`}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (v) => v === password || 'Passwords do not match',
                  })}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-700">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-error-500">{errors.confirmPassword.message}</p>}
            </div>

            <label className="flex items-start gap-3 cursor-pointer mt-2">
              <input
                type="checkbox"
                className="w-4 h-4 mt-0.5 rounded border-primary-300 text-primary-900 focus:ring-primary-900"
                {...register('terms', { required: 'You must accept the terms' })}
              />
              <span className="text-sm text-primary-600">
                I agree to the <a href="#" className="link">Terms of Service</a> and <a href="#" className="link">Privacy Policy</a>
              </span>
            </label>
            {errors.terms && <p className="text-xs text-error-500">{errors.terms.message}</p>}

            <button type="submit" disabled={isSubmitting} className="btn-primary btn w-full btn-lg">
              {isSubmitting ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              ) : null}
              {isSubmitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-primary-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
