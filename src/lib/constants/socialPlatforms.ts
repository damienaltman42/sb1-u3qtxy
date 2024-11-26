import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Twitch,
  MessageCircle,
  Globe,
} from 'lucide-react';

export const SOCIAL_PLATFORMS = [
  { name: 'OnlyFans', icon: Globe, placeholder: 'https://onlyfans.com/username' },
  { name: 'Fansly', icon: Globe, placeholder: 'https://fansly.com/username' },
  { name: 'Twitter', icon: Twitter, placeholder: 'https://twitter.com/username' },
  { name: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/username' },
  { name: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/username' },
  { name: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/@username' },
  { name: 'Twitch', icon: Twitch, placeholder: 'https://twitch.tv/username' },
  { name: 'Reddit', icon: MessageCircle, placeholder: 'https://reddit.com/u/username' },
] as const;