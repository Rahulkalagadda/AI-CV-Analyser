import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface ScoreBadgeProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ScoreBadge = ({ score, label, size = 'md' }: ScoreBadgeProps) => {
  const getScoreConfig = (score: number) => {
    if (score >= 80) {
      return {
        color: "text-green-600 bg-green-100",
        icon: CheckCircle,
        text: "Excellent"
      };
    }
    if (score >= 60) {
      return {
        color: "text-yellow-600 bg-yellow-100",
        icon: AlertCircle,
        text: "Good"
      };
    }
    return {
      color: "text-red-600 bg-red-100",
      icon: XCircle,
      text: "Needs Improvement"
    };
  };

  const config = getScoreConfig(score);
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2"
  };

  return (
    <div className={`score-badge ${config.color} ${sizeClasses[size]}`}>
      <Icon size={size === 'sm' ? 12 : size === 'md' ? 16 : 20} />
      <span className="font-semibold">{score}%</span>
      {label && <span className="text-xs opacity-75">{label}</span>}
    </div>
  );
};

export default ScoreBadge;
