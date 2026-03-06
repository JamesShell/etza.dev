import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.ogg', '.avi', '.m4v'];

export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase().split('?')[0];
  return VIDEO_EXTENSIONS.some(ext => lower.endsWith(ext));
}
