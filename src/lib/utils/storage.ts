import { 
  FileIcon, 
  Image, 
  Link as LinkIcon, 
  ExternalLink,
  Github,
  Cloud,
  Disc,
  Play,
  FileCode,
  Archive
} from 'lucide-react';

export type Provider = 
  | 'Google Drive' 
  | 'MediaFire' 
  | 'Dropbox' 
  | 'GitHub' 
  | 'Imgur' 
  | 'Discord' 
  | 'OneDrive' 
  | 'Cloudinary' 
  | 'Custom';

export interface ProviderInfo {
  name: Provider;
  icon: any;
  color: string;
}

export const detectProvider = (url: string): ProviderInfo => {
  const lowercaseUrl = url.toLowerCase();
  
  if (lowercaseUrl.includes('drive.google.com')) {
    return { name: 'Google Drive', icon: Cloud, color: '#34A853' };
  }
  if (lowercaseUrl.includes('mediafire.com')) {
    return { name: 'MediaFire', icon: Archive, color: '#007FFF' };
  }
  if (lowercaseUrl.includes('dropbox.com')) {
    return { name: 'Dropbox', icon: Archive, color: '#0061FF' };
  }
  if (lowercaseUrl.includes('github.com')) {
    return { name: 'GitHub', icon: Github, color: '#333333' };
  }
  if (lowercaseUrl.includes('imgur.com')) {
    return { name: 'Imgur', icon: Image, color: '#1BB76E' };
  }
  if (lowercaseUrl.includes('discordapp.com') || lowercaseUrl.includes('cdn.discordapp.com') || lowercaseUrl.includes('discord.com')) {
    return { name: 'Discord', icon: Disc, color: '#5865F2' };
  }
  if (lowercaseUrl.includes('onedrive.live.com') || lowercaseUrl.includes('1drv.ms')) {
    return { name: 'OneDrive', icon: Cloud, color: '#0078D4' };
  }
  if (lowercaseUrl.includes('cloudinary.com')) {
    return { name: 'Cloudinary', icon: Cloud, color: '#3448C5' };
  }
  
  return { name: 'Custom', icon: LinkIcon, color: '#6366F1' };
};

export const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

export const getFileExtension = (url: string): string => {
  try {
    const path = new URL(url).pathname;
    const parts = path.split('.');
    return parts.length > 1 ? parts.pop()?.toUpperCase() || '' : 'FILE';
  } catch {
    return 'FILE';
  }
};
