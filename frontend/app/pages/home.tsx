import Navbar from "~/components/Navbar";
import CVCard from "~/components/CVCard";
import SearchBar from "~/components/SearchBar";
import { useState, useEffect } from "react";
import { apiClient } from "~/lib/api";
import type { CV } from "~/types";
import { NavigationProps, View } from "../root"; // Import NavigationProps and View

export default function Home({ navigateTo }: NavigationProps) {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadCVs = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<{ cvs: CV[] }>('/api/cvs');
        setCvs(response.cvs);
      } catch (error) {
        console.error('Failed to load CVs:', error);
        // For demo purposes, using mock data
        setCvs([
          {
            id: '1',
            title: 'Software Engineer CV',
            fileName: 'john_doe_cv.pdf',
            fileSize: 1024000,
            uploadDate: new Date().toISOString(),
            content: 'Mock CV content...',
            userId: 'user1',
            extracted_text: 'Mock extracted text...', // Added missing property
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
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadCVs();
  }, []);

  const filteredCVs = cvs.filter(cv => {
    const title = cv.title || '';
    const fileName = cv.fileName || '';
    return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           fileName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <main className="bg-gradient min-h-screen">
      <Navbar navigateTo={navigateTo} />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>AI-Powered CV Analysis</h1>
          <h2>Upload your CV and get instant feedback, ATS scores, and job matching insights.</h2>
        </div>

        <div className="w-full max-w-4xl mb-8">
          <SearchBar 
            onSearch={setSearchQuery}
            placeholder="Search your CVs..."
            showFilters={true}
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading your CVs...</p>
          </div>
        ) : filteredCVs.length > 0 ? (
          <div className="cvs-section">
            {filteredCVs.map((cv) => (
              <CVCard key={cv.id} cv={cv} navigateTo={navigateTo} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchQuery ? 'No CVs found matching your search' : 'No CVs uploaded yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery ? 'Try adjusting your search terms' : 'Upload your first CV to get started with AI analysis'}
              </p>
              <button 
                onClick={() => navigateTo(View.Upload)}
                className="primary-button w-fit text-lg font-semibold"
              >
                Upload CV
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
