import Navbar from "~/components/Navbar";
import DashboardStats from "~/components/DashboardStats";
import CVCard from "~/components/CVCard";
import { useState, useEffect } from "react";
import { apiClient } from "~/lib/api";
import type { CV, CVAnalysis } from "~/types";
import { NavigationProps, View } from "../root"; // Import NavigationProps and View

export default function Dashboard({ navigateTo }: NavigationProps) {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<{ cvs: CV[] }>('/api/cvs');
        setCvs(response.cvs);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Mock data for demo
        setCvs([
          {
            id: '1',
            title: 'Software Engineer CV',
            fileName: 'john_doe_cv.pdf',
            fileSize: 1024000,
            uploadDate: new Date().toISOString(),
            content: 'Mock CV content...',
            userId: 'user1',
            extracted_text: 'Mock extracted text...',
            ats_score: 78,
            matched_keywords: ['software', 'engineer'],
            missing_keywords: ['leadership'],
            rewritten_cv: 'Rewritten mock CV content...',
            analysis: {
              id: '1',
              cvId: '1',
              overallScore: 85,
              sections: {
                personalInfo: 90,
                experience: 85,
                education: 80,
                skills: 88,
                achievements: 82
              },
              feedback: {
                strengths: ['Strong technical skills', 'Good project experience'],
                improvements: ['Add more quantifiable achievements'],
                suggestions: ['Include more relevant keywords']
              },
              atsScore: 78,
              createdAt: new Date().toISOString()
            }
          },
          {
            id: '2',
            title: 'Marketing Manager CV',
            fileName: 'jane_smith_cv.pdf',
            fileSize: 856000,
            uploadDate: new Date(Date.now() - 86400000).toISOString(),
            content: 'Mock CV content...',
            userId: 'user1',
            extracted_text: 'Mock extracted text...',
            ats_score: 65,
            matched_keywords: ['marketing', 'manager'],
            missing_keywords: ['metrics'],
            rewritten_cv: 'Rewritten mock CV content...',
            analysis: {
              id: '2',
              cvId: '2',
              overallScore: 72,
              sections: {
                personalInfo: 85,
                experience: 70,
                education: 75,
                skills: 68,
                achievements: 70
              },
              feedback: {
                strengths: ['Good leadership experience', 'Strong communication skills'],
                improvements: ['Add more metrics and results'],
                suggestions: ['Include industry-specific keywords']
              },
              atsScore: 65,
              createdAt: new Date(Date.now() - 86400000).toISOString()
            }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const stats = {
    totalCVs: cvs.length,
    analyzedCVs: cvs.filter(cv => cv.analysis).length,
    averageScore: cvs.length > 0 
      ? Math.round(cvs.reduce((sum, cv) => sum + (cv.analysis?.overallScore || 0), 0) / cvs.length)
      : 0,
    jobMatches: cvs.length * 3 // Mock job matches
  };

  const recentCVs = cvs.slice(0, 3);

  return (
    <main className="bg-gradient min-h-screen">
      <Navbar navigateTo={navigateTo} />

      <section className="main-section">
        <div className="page-heading">
          <h1>Dashboard</h1>
          <h2>Track your CV performance and analysis insights</h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        ) : (
          <div className="w-full max-w-7xl space-y-8">
            {/* Stats Cards */}
            <DashboardStats {...stats} />

            {/* Recent CVs */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Recent CVs</h3>
                <button onClick={() => navigateTo(View.Home)} className="text-blue-600 hover:text-blue-800 font-medium">
                  View All
                </button>
              </div>
              
              {recentCVs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentCVs.map((cv) => (
                  <CVCard key={cv.id} cv={cv} navigateTo={navigateTo} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No CVs uploaded yet</p>
                  <button onClick={() => navigateTo(View.Upload)} className="primary-button w-fit">
                    Upload Your First CV
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h4>
                <div className="space-y-3">
                  <button onClick={() => navigateTo(View.Upload)} className="block w-full primary-button text-center">
                    Upload New CV
                  </button>
                  <button onClick={() => navigateTo(View.Home)} className="block w-full border border-gray-300 text-gray-700 rounded-full px-4 py-2 text-center hover:bg-gray-50">
                    View All CVs
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Analysis Tips</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Use action verbs to describe achievements</li>
                  <li>• Include quantifiable results and metrics</li>
                  <li>• Tailor keywords to job descriptions</li>
                  <li>• Keep formatting clean and ATS-friendly</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
