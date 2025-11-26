import { FileText, Calendar, Star, ArrowRight } from "lucide-react";
import { formatDate } from "~/lib/utils";
import type { CV } from "../../types"; // Changed to relative import
import { NavigationProps, View } from "../root";

interface CVCardProps extends NavigationProps {
  cv: CV;
}

const CVCard = ({ cv, navigateTo }: CVCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="cv-card shadow-lg hover:shadow-xl transition-shadow">
      <div className="cv-card-header">
        <div className="flex items-center gap-3">
          <FileText size={32} className="text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{cv.title}</h3>
            <p className="text-sm text-gray-500">{cv.fileName}</p>
          </div>
        </div>
        {cv.analysis && (
          <div className={`score-badge ${getScoreColor(cv.analysis.overallScore)}`}>
            <Star size={16} />
            <span className="font-semibold">{cv.analysis.overallScore}%</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} />
            <span>Uploaded {formatDate(cv.uploadDate)}</span>
          </div>
          
          {cv.analysis && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Analysis Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>ATS Score:</span>
                  <span className="font-medium">{cv.analysis.atsScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Experience:</span>
                  <span className="font-medium">{cv.analysis.sections.experience}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Skills:</span>
                  <span className="font-medium">{cv.analysis.sections.skills}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Education:</span>
                  <span className="font-medium">{cv.analysis.sections.education}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => navigateTo(View.CVDetail, cv.id)}
          className="primary-button flex items-center justify-center gap-2 mt-4"
        >
          View Details
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default CVCard;
