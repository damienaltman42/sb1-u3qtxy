import React, { useState, useRef } from 'react';
import { Camera, Upload } from 'lucide-react';
import SocialLinkEditor from './SocialLinkEditor';
import type { User, SocialLink } from '../../types';

interface ProfileEditorProps {
  user: User;
  onSave: (data: Partial<User>) => Promise<void>;
  onCancel: () => void;
}

const AVATAR_PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const ProfileEditor: React.FC<ProfileEditorProps> = ({ user, onSave, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    avatar: user.avatar || AVATAR_PLACEHOLDERS[0],
    description: user.description || '',
    socialLinks: user.socialLinks || []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onSave(formData);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 5MB');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          avatar: reader.result as string
        });
      };
      reader.readAsDataURL(file);
      
      setShowAvatarMenu(false);
      setError('');
    } catch (err) {
      setError('Failed to process image');
    }
  };

  const handleSocialLinksUpdate = (socialLinks: SocialLink[]) => {
    setFormData({ ...formData, socialLinks });
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Selection */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <img
              src={formData.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-purple-200"
            />
            <button
              type="button"
              onClick={() => setShowAvatarMenu(!showAvatarMenu)}
              className="absolute bottom-0 right-0 bg-purple-500 p-2 rounded-full text-white hover:bg-purple-600 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>

            {showAvatarMenu && (
              <div className="absolute top-full mt-2 p-3 bg-white rounded-lg shadow-xl z-10 w-64">
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded-md"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </button>
                  
                  <div className="border-t pt-3">
                    <p className="text-xs text-gray-500 mb-2">Preset Avatars</p>
                    <div className="grid grid-cols-2 gap-2">
                      {AVATAR_PLACEHOLDERS.map((avatar) => (
                        <button
                          key={avatar}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, avatar });
                            setShowAvatarMenu(false);
                          }}
                          className="aspect-square rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all"
                        >
                          <img
                            src={avatar}
                            alt="Preset avatar"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {/* Username */}
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
        </div>

        {/* Email */}
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
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell your fans about yourself..."
          />
        </div>

        {/* Social Links */}
        <SocialLinkEditor
          links={formData.socialLinks}
          onUpdate={handleSocialLinksUpdate}
        />

        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-md hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditor;