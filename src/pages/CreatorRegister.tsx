import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Camera, Link as LinkIcon } from 'lucide-react';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
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

const CreatorRegister: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PLACEHOLDERS[0]);
  
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    socialLink: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Social link validation (optional)
    if (formData.socialLink && !formData.socialLink.startsWith('https://')) {
      newErrors.socialLink = 'Social link must be a valid HTTPS URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await signUp({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        socialLink: formData.socialLink,
        avatar: selectedAvatar,
      });
      navigate('/creator/dashboard');
    } catch (err: any) {
      setErrors({ email: err.message || 'Failed to create account' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (
    name: keyof FormData,
    label: string,
    type: string = 'text',
    placeholder: string = '',
    icon?: React.ReactNode
  ) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className={`mt-1 ${icon ? 'relative rounded-md shadow-sm' : ''}`}>
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          className={`block w-full ${icon ? 'pl-10' : ''} px-3 py-2 border ${
            errors[name] ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
          value={formData[name]}
          onChange={handleChange}
        />
      </div>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create Creator Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Start sharing exclusive content with your fans
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

            {renderInput('username', 'Username')}
            {renderInput('email', 'Email', 'email')}
            {renderInput('password', 'Password', 'password')}
            {renderInput('confirmPassword', 'Confirm Password', 'password')}
            {renderInput(
              'socialLink',
              'Social Link (Optional)',
              'url',
              'https://onlyfans.com/your-profile',
              <LinkIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <UserPlus className="h-5 w-5 text-purple-300 group-hover:text-purple-200" />
              </span>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/creator/login')}
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

export default CreatorRegister;