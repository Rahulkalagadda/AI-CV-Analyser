import Navbar from "~/components/Navbar";
import Accordion from "~/components/Accordion";
import ScoreBadge from "~/components/ScoreBadge";
import { useState, useEffect } from "react";
import { ArrowLeft, FileText, Calendar, Star, TrendingUp, Sparkles, Edit, CheckCircle } from "lucide-react";
import { apiClient, getScore, rewriteCv, generateCoverLetter, generateInterviewQuestions } from "~/lib/api";
import { formatDate } from "~/lib/utils";
import type { CV, ScoreResponse, RewriteResponse, CoverLetterResponse, InterviewPrepResponse } from "~/types";
import { NavigationProps, View } from "../root"; // Import NavigationProps and View

interface CVDetailsProps extends NavigationProps {
  cvId: string;
}

export default function CVDetails({ cvId, navigateTo }: CVDetailsProps) {
  const [cv, setCv] = useState<CV | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobDescription, setJobDescription] = useState("");
  const [scoring, setScoring] = useState(false);
  const [rewriting, setRewriting] = useState(false);
  const [generatingCoverLetter, setGeneratingCoverLetter] = useState(false);
  const [generatingInterviewPrep, setGeneratingInterviewPrep] = useState(false);

  // Mock CV data for now, replace with actual API call
  useEffect(() => {
    if (cvId) {
      // In a real app, you'd fetch the CV details from your backend
      // For now, we'll use a mock CV based on the extracted text from upload
      // This assumes the upload route passes the extracted text or stores it
      // and we can retrieve it here.
      // For this example, we'll just create a dummy CV.
      setCv({
        id: cvId,
        title: "Uploaded CV",
        fileName: "uploaded_cv.pdf",
        fileSize: 0,
        uploadDate: new Date().toISOString(),
        content: "This is a placeholder for the actual CV content.", // This should come from the backend
        userId: "mock-user",
        extracted_text: "This is a placeholder for the actual CV content that was extracted during upload. It should be much longer in a real scenario.",
      });
      setLoading(false);
    }
  }, [cvId]);

  const handleScoreCV = async () => {
    if (!cvId || !jobDescription || !cv?.extracted_text) return;

    try {
      setScoring(true);
      const response: ScoreResponse = await getScore(cvId, cv.extracted_text, jobDescription);
      setCv((prevCv: CV | null) => prevCv ? {
        ...prevCv,
        ats_score: response.ats_score,
        matched_keywords: response.matched_keywords,
        missing_keywords: response.missing_keywords,
      } : null);
    } catch (error) {
      console.error("Failed to score CV:", error);
    } finally {
      setScoring(false);
    }
  };

  const handleRewriteCV = async () => {
    if (!cvId || !jobDescription || !cv?.extracted_text) return;

    try {
      setRewriting(true);
      const response: RewriteResponse = await rewriteCv(cvId, cv.extracted_text, jobDescription);
      setCv((prevCv: CV | null) => prevCv ? { ...prevCv, rewritten_cv: response.rewritten_cv } : null);
    } catch (error) {
      console.error("Failed to rewrite CV:", error);
    } finally {
      setRewriting(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!cvId || !jobDescription || !cv?.extracted_text) return;

    try {
      setGeneratingCoverLetter(true);
      const response: CoverLetterResponse = await generateCoverLetter(cvId, cv.extracted_text, jobDescription);
      setCv((prevCv: CV | null) => prevCv ? { ...prevCv, cover_letter: response.cover_letter } : null);
    } catch (error) {
      console.error("Failed to generate cover letter:", error);
    } finally {
      setGeneratingCoverLetter(false);
    }
  };

  const handleGenerateInterviewPrep = async () => {
    if (!cvId || !jobDescription || !cv?.extracted_text) return;

    try {
      setGeneratingInterviewPrep(true);
      const response: InterviewPrepResponse = await generateInterviewQuestions(cvId, cv.extracted_text, jobDescription);
      setCv((prevCv: CV | null) => prevCv ? {
        ...prevCv,
        interview_prep: {
          technical_questions: response.technical_questions,
          behavioral_questions: response.behavioral_questions,
          tips: response.tips
        }
      } : null);
    } catch (error) {
      console.error("Failed to generate interview prep:", error);
    } finally {
      setGeneratingInterviewPrep(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-gradient min-h-screen">
        <Navbar navigateTo={navigateTo} />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </main>
    );
  }

  if (!cv) {
    return (
      <main className="bg-gradient min-h-screen">
        <Navbar navigateTo={navigateTo} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">CV Not Found</h1>
            <p className="text-gray-600 mb-4">The requested CV could not be found.</p>
            <button onClick={() => navigateTo(View.Home)} className="primary-button w-fit">Back to Home</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gradient min-h-screen">
      <Navbar navigateTo={navigateTo} />

      <section className="main-section">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigateTo(View.Upload)} className="back-button">
              <ArrowLeft size={20} />
              Upload New CV
            </button>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <FileText size={32} className="text-blue-600" />
                <div>
                  <h1 className="text-2xl font-semibold text-gray-800">{cv.title}</h1>
                  <p className="text-gray-600">{cv.fileName}</p>
                </div>
              </div>
              {cv.ats_score !== undefined && (
                <ScoreBadge score={cv.ats_score} size="lg" />
              )}
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Uploaded {formatDate(cv.uploadDate)}</span>
              </div>
              {cv.ats_score !== undefined && (
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} />
                  <span>ATS Score: {cv.ats_score}%</span>
                </div>
              )}
            </div>
          </div>

          {/* Job Description Input and Actions */}
          <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Analyze & Rewrite</h2>
            <div className="form-div mb-6">
              <label htmlFor="job-description" className="text-sm font-medium text-gray-700">
                Job Description
              </label>
              <textarea
                id="job-description"
                rows={8}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here to get an ATS score and rewrite your CV."
                className="mt-1"
              ></textarea>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleScoreCV}
                disabled={!jobDescription || scoring}
                className="primary-button flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {scoring ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Analyzing with Gemini AI...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Get ATS Score
                  </>
                )}
              </button>
              <button
                onClick={handleRewriteCV}
                disabled={!jobDescription || rewriting}
                className="secondary-button flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {rewriting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    Optimizing for ATS...
                  </>
                ) : (
                  <>
                    <Edit size={20} />
                    Rewrite CV
                  </>
                )}
              </button>
              <button
                onClick={handleGenerateCoverLetter}
                disabled={!jobDescription || generatingCoverLetter}
                className="secondary-button flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingCoverLetter ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    Writing...
                  </>
                ) : (
                  <>
                    <FileText size={20} />
                    Cover Letter
                  </>
                )}
              </button>
              <button
                onClick={handleGenerateInterviewPrep}
                disabled={!jobDescription || generatingInterviewPrep}
                className="secondary-button flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingInterviewPrep ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    Prepping...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Interview Prep
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ATS Score Details */}
          {cv.ats_score !== undefined && (
            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">ATS Score Details</h2>
              <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} />
                  <span className="font-medium text-gray-900">Overall ATS Score: {cv.ats_score}%</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  <Star size={14} />
                  <span className="font-medium">Target: 90%+</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                We strictly match <strong>critical hard skills</strong> and <strong>tools</strong> found in the Job Description. Generic soft skills are ignored to ensure high relevance.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Accordion title="Matched Keywords" defaultOpen={true}>
                  {cv.matched_keywords && cv.matched_keywords.length > 0 ? (
                    <ul className="space-y-2">
                      {cv.matched_keywords.map((keyword: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{keyword}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No matched keywords found.</p>
                  )}
                </Accordion>
                <Accordion title="Missing Keywords">
                  {cv.missing_keywords && cv.missing_keywords.length > 0 ? (
                    <ul className="space-y-2">
                      {cv.missing_keywords.map((keyword: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full bg-red-500 mt-1 flex-shrink-0"></div>
                          <span className="text-gray-700">{keyword}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No missing keywords identified.</p>
                  )}
                </Accordion>
              </div>
            </div>
          )}

          {/* Rewritten CV */}
          {cv.rewritten_cv && (
            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Rewritten CV (ATS Optimized)</h2>
                <button
                  onClick={() => {
                    if (cv.rewritten_cv) {
                      navigator.clipboard.writeText(cv.rewritten_cv);
                      alert("Copied to clipboard!");
                    }
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                >
                  <FileText size={16} />
                  Copy to Clipboard
                </button>
              </div>
              <div className="prose max-w-none bg-gray-50 p-6 rounded-xl border border-gray-100">
                <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{cv.rewritten_cv}</p>
              </div>
            </div>
          )}

          {/* Cover Letter */}
          {cv.cover_letter && (
            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Cover Letter</h2>
                <button
                  onClick={() => {
                    if (cv.cover_letter) {
                      navigator.clipboard.writeText(cv.cover_letter);
                      alert("Copied to clipboard!");
                    }
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                >
                  <FileText size={16} />
                  Copy to Clipboard
                </button>
              </div>
              <div className="prose max-w-none bg-gray-50 p-6 rounded-xl border border-gray-100">
                <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{cv.cover_letter}</p>
              </div>
            </div>
          )}

          {/* Interview Prep */}
          {cv.interview_prep && (
            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Interview Preparation</h2>
              <div className="grid grid-cols-1 gap-6">
                <Accordion title="Technical Questions" defaultOpen={true}>
                  <ul className="space-y-3">
                    {cv.interview_prep.technical_questions.map((q, i) => (
                      <li key={i} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-xs font-bold">{i + 1}</span>
                        <span className="text-gray-700">{q}</span>
                      </li>
                    ))}
                  </ul>
                </Accordion>
                <Accordion title="Behavioral Questions">
                  <ul className="space-y-3">
                    {cv.interview_prep.behavioral_questions.map((q, i) => (
                      <li key={i} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full text-xs font-bold">{i + 1}</span>
                        <span className="text-gray-700">{q}</span>
                      </li>
                    ))}
                  </ul>
                </Accordion>
                <Accordion title="Preparation Tips">
                  <ul className="space-y-3">
                    {cv.interview_prep.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-3 bg-yellow-50 p-3 rounded-lg">
                        <Sparkles size={16} className="text-yellow-600 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </Accordion>
              </div>
            </div>
          )}

          {/* Original CV Content */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Original CV Content</h2>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{cv.extracted_text}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
