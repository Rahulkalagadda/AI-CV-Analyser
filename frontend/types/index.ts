// Types for CV/Resume related data
export interface CV {
  id: string;
  title: string;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  content: string;
  userId: string;
  extracted_text: string;
  ats_score?: number;
  matched_keywords?: string[];
  missing_keywords?: string[];
  rewritten_cv?: string;
  cover_letter?: string;
  interview_prep?: {
    technical_questions: string[];
    behavioral_questions: string[];
    tips: string[];
  };
  analysis?: CVAnalysis; // Add analysis property
}

export interface CVAnalysis {
  id: string;
  cvId: string;
  overallScore: number;
  sections: {
    personalInfo: number;
    experience: number;
    education: number;
    skills: number;
    achievements: number;
  };
  feedback: {
    strengths: string[];
    improvements: string[];
    suggestions: string[];
  };
  atsScore: number;
  createdAt: string;
}

export interface ScoreResponse {
  ats_score: number;
  matched_keywords: string[];
  missing_keywords: string[];
}

export interface RewriteResponse {
  rewritten_cv: string;
}

export interface CoverLetterResponse {
  cover_letter: string;
}

export interface InterviewPrepResponse {
  technical_questions: string[];
  behavioral_questions: string[];
  tips: string[];
}

export interface TemplateResponse {
  formatted_cv: string;
}




// API Response types


export interface UploadResponse {
  cv_id: string;
  extracted_text: string;
}
