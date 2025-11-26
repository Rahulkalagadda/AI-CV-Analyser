// Application Constants
export const APP_NAME = 'AI CV Analyzer';
export const APP_VERSION = '1.0.0';

// File Upload Constants
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.doc', '.docx'];

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile'
  },
  CVS: {
    LIST: '/api/cvs',
    UPLOAD: '/api/cvs/upload',
    GET: (id: string) => `/api/cvs/${id}`,
    UPDATE: (id: string) => `/api/cvs/${id}`,
    DELETE: (id: string) => `/api/cvs/${id}`,
    ANALYZE: (id: string) => `/api/cvs/${id}/analyze`
  },
  JOBS: {
    LIST: '/api/jobs',
    GET: (id: string) => `/api/jobs/${id}`,
    MATCH: (cvId: string) => `/api/jobs/match/${cvId}`
  }
} as const;

// Score Thresholds
export const SCORE_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD: 60,
  NEEDS_IMPROVEMENT: 40
} as const;

// UI Constants
export const ANIMATION_DURATION = 300;
export const DEBOUNCE_DELAY = 500;

// Error Messages
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File size exceeds the maximum limit of 5MB',
  INVALID_FILE_TYPE: 'Please upload a PDF, DOC, or DOCX file',
  UPLOAD_FAILED: 'Failed to upload file. Please try again.',
  ANALYSIS_FAILED: 'Failed to analyze CV. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  FILE_UPLOADED: 'CV uploaded successfully!',
  ANALYSIS_COMPLETE: 'CV analysis completed!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  CV_DELETED: 'CV deleted successfully!'
} as const;
