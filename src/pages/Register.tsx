import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Camera, Link as LinkIcon, User, Palette } from 'lucide-react';
import type { UserRole } from '../types';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  socialLink?: string;
  avatar?: string;
}

interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  socialLink?: string;
}

const AVATAR_PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PLACEHOLDERS[0]);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    socialLink: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.role === 'creator' && formData.socialLink && !formData.socialLink.startsWith('https://')) {
      newErrors.socialLink = 'Social link must be a valid HTTPS URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !selectedRole) {
      return;
    }

    setIsLoading(true);
    try {
      await signUp({
        ...formData,
        role: selectedRole,
        avatar: selectedAvatar,
      });
      navigate(selectedRole === 'creator' ? '/creator/dashboard' : '/user/dashboard');
    } catch (err: any) {
      setErrors({ email: err.message || 'Failed to create account' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Choose Account Type</h2>
            <p className="mt-2 text-gray-600">Select how you want to use OnlyFans Roulette</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedRole('creator')}
              className="p-6 border-2 border-purple-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all"
            >
              <Palette className="w-12 h-12 mx-auto text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Creator</h3>
              <p className="text-sm text-gray-600 mt-2">Create and manage prize wheels</p>
            </button>

            <button
              onClick={() => setSelectedRole('user')}
              className="p-6 border-2 border-purple-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all"
            >
              <User className="w-12 h-12 mx-auto text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">User</h3>
              <p className="text-sm text-gray-600 mt-2">Play and win prizes</p>
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create {selectedRole === 'creator' ? 'Creator' : 'User'} Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {selectedRole === 'creator' 
              ? 'Start sharing exclusive content with your fans'
              : 'Join and start winning prizes'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Avatar Selection */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <img
                  src={selectedAvatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-purple-200"
                />
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-purple-500 p-2 rounded-full text-white hover:bg-purple-600 transition-colors"
                  onClick={() => {
                    const currentIndex = AVATAR_PLACEHOLDERS.indexOf(selectedAvatar);
                    const nextIndex = (currentIndex + 1) % AVATAR_PLACEHOLDERS.length;
                    setSelectedAvatar(AVATAR_PLACEHOLDERS[nextIndex]);
                  }}
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-500">Click the camera to change avatar</p>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {selectedRole === 'creator' && (
              <div>
                <label htmlFor="socialLink" className="block text-sm font-medium text-gray-700">
                  Social Link (Optional)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="socialLink"
                    name="socialLink"
                    type="url"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="https://onlyfans.com/your-profile"
                    value={formData.socialLink}
                    onChange={handleChange}
                  />
                </div>
                {errors.socialLink && (
                  <p className="mt-1 text-sm text-red-600">{errors.socialLink}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setSelectedRole(null)}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;