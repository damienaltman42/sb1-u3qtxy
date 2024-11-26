import React from 'react';
import { X } from 'lucide-react';
import { SOCIAL_PLATFORMS } from '../../lib/constants/socialPlatforms';
import type { SocialLink } from '../../types';

interface SocialLinkEditorProps {
  links: SocialLink[];
  onUpdate: (links: SocialLink[]) => void;
}

const SocialLinkEditor: React.FC<SocialLinkEditorProps> = ({ links, onUpdate }) => {
  const addLink = () => {
    const platform = SOCIAL_PLATFORMS[0];
    onUpdate([
      ...links,
      {
        id: Date.now().toString(),
        platform: platform.name,
        url: '',
        icon: platform.icon
      }
    ]);
  };

  const updateLink = (id: string, updates: Partial<SocialLink>) => {
    onUpdate(links.map(link => {
      if (link.id === id) {
        if (updates.platform) {
          const platform = SOCIAL_PLATFORMS.find(p => p.name === updates.platform);
          if (platform) {
            return { ...link, ...updates, icon: platform.icon };
          }
        }
        return { ...link, ...updates };
      }
      return link;
    }));
  };

  const removeLink = (id: string) => {
    onUpdate(links.filter(link => link.id !== id));
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Social Links
      </label>

      <div className="space-y-3">
        {links.map((link) => (
          <div key={link.id} className="flex items-center space-x-3">
            <select
              value={link.platform}
              onChange={(e) => updateLink(link.id, { platform: e.target.value })}
              className="w-1/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              {SOCIAL_PLATFORMS.map((platform) => (
                <option key={platform.name} value={platform.name}>
                  {platform.name}
                </option>
              ))}
            </select>

            <input
              type="url"
              value={link.url}
              onChange={(e) => updateLink(link.id, { url: e.target.value })}
              placeholder={`Enter your ${link.platform} URL`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />

            <button
              type="button"
              onClick={() => removeLink(link.id)}
              className="p-2 text-gray-400 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addLink}
        className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
      >
        Add Social Link
      </button>
    </div>
  );
};

export default SocialLinkEditor;