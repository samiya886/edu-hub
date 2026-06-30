import { API_BASE_URL } from '../constants';

const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return '';
  }
})();

const EXTENSION_BY_MIME: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'text/plain': 'txt',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
};

const PREVIEWABLE_EXTENSIONS = new Set(['pdf', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'webp']);

export function resolveFileUrl(fileUrl?: string) {
  if (!fileUrl) return '';
  const trimmed = fileUrl.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('/')) return `${API_ORIGIN}${trimmed}`;
  return `${API_ORIGIN}/uploads/${encodeURIComponent(trimmed)}`;
}

export function getFileExtension(fileUrl?: string, mimeType?: string) {
  if (mimeType && EXTENSION_BY_MIME[mimeType]) return EXTENSION_BY_MIME[mimeType];

  const cleanUrl = (fileUrl || '').split('?')[0].split('#')[0];
  const match = cleanUrl.match(/\.([a-z0-9]+)$/i);
  return match ? match[1].toLowerCase() : '';
}

export function canPreviewInApp(fileUrl?: string, mimeType?: string) {
  const extension = getFileExtension(fileUrl, mimeType);
  return PREVIEWABLE_EXTENSIONS.has(extension);
}

export function getDocumentKind(fileUrl?: string, mimeType?: string) {
  const extension = getFileExtension(fileUrl, mimeType);
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'Image';
  if (extension === 'txt') return 'Text file';
  if (extension === 'pdf') return 'PDF';
  if (['doc', 'docx'].includes(extension)) return 'Word document';
  if (['ppt', 'pptx'].includes(extension)) return 'Presentation';
  if (['xls', 'xlsx'].includes(extension)) return 'Spreadsheet';
  return 'Document';
}

export function sanitizeFileName(name: string) {
  return name.trim().replace(/[^a-z0-9._-]+/gi, '_').replace(/^_+|_+$/g, '') || 'eduhub-file';
}

export function getDownloadFileName(title: string, fileUrl?: string, mimeType?: string) {
  const extension = getFileExtension(fileUrl, mimeType);
  const base = sanitizeFileName(title || 'eduhub-file');
  if (!extension || base.toLowerCase().endsWith(`.${extension}`)) return base;
  return `${base}.${extension}`;
}

export function getDownloadUrl(fileUrl: string, fileName: string) {
  const url = new URL(fileUrl);
  url.searchParams.set('download', '1');
  url.searchParams.set('filename', fileName);
  return url.toString();
}

export async function assertReachableFile(fileUrl: string) {
  if (!fileUrl) {
    throw new Error('No file URL was provided for this resource.');
  }

  const response = await fetch(fileUrl, { method: 'HEAD' });
  if (!response.ok) {
    throw new Error('The file is missing or the URL is invalid.');
  }
}
