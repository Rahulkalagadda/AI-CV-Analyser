// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ai-cv-analyser-five.vercel.app';

// API Client
export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}

import type { UploadResponse, ScoreResponse, RewriteResponse, CoverLetterResponse, InterviewPrepResponse } from "~/types"; // Import necessary types

export const apiClient = new ApiClient();

// API Methods
export const uploadCv = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const getScore = async (cvId: string, cvText: string | undefined, jobDescription: string): Promise<ScoreResponse> => {
  return apiClient.post<ScoreResponse>('/score', {
    cv_id: cvId,
    job_description: jobDescription,
    cv_text: cvText,
  });
};

export const rewriteCv = async (cvId: string, cvText: string, jobDescription: string): Promise<RewriteResponse> => {
  return apiClient.post<RewriteResponse>('/rewrite', {
    cv_id: cvId,
    cv_text: cvText,
    job_description: jobDescription,
  });
};

export const generateCoverLetter = async (cvId: string, cvText: string, jobDescription: string): Promise<CoverLetterResponse> => {
  return apiClient.post<CoverLetterResponse>('/cover-letter', {
    cv_id: cvId,
    cv_text: cvText,
    job_description: jobDescription,
  });
};

export const generateInterviewQuestions = async (cvId: string, cvText: string, jobDescription: string): Promise<InterviewPrepResponse> => {
  return apiClient.post<InterviewPrepResponse>('/interview-questions', {
    cv_id: cvId,
    cv_text: cvText,
    job_description: jobDescription,
  });
};

export const getTemplates = async () => {
  return apiClient.get('/templates');
};

export const applyTemplate = async (templateName: string, cvText: string) => {
  return apiClient.post('/templates/apply', {
    template_name: templateName,
    cv_text: cvText,
  });
};
