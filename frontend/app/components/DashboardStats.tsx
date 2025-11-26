import { BarChart3, TrendingUp, Users, FileText } from "lucide-react";

interface DashboardStatsProps {
  totalCVs: number;
  analyzedCVs: number;
  averageScore: number;
  jobMatches: number;
}

const DashboardStats = ({ 
  totalCVs, 
  analyzedCVs, 
  averageScore, 
  jobMatches 
}: DashboardStatsProps) => {
  const stats = [
    {
      label: "Total CVs",
      value: totalCVs,
      icon: FileText,
      color: "text-blue-600 bg-blue-100"
    },
    {
      label: "Analyzed",
      value: analyzedCVs,
      icon: BarChart3,
      color: "text-green-600 bg-green-100"
    },
    {
      label: "Avg Score",
      value: `${averageScore}%`,
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-100"
    },
    {
      label: "Job Matches",
      value: jobMatches,
      icon: Users,
      color: "text-orange-600 bg-orange-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
