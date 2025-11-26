import { Upload, User, BarChart3 } from "lucide-react";
import { NavigationProps, View } from "../root";

const Navbar = ({ navigateTo }: NavigationProps) => {
  // Ensure navigateTo is a function before use
  if (typeof navigateTo !== 'function') {
    console.error('Navbar: navigateTo prop is not a function', navigateTo);
    // Provide a fallback or throw an error if navigateTo is critical
    return null; // Or render a degraded UI
  }
  return (
    <nav className="navbar">
      <button onClick={() => navigateTo(View.Home)}>
        <p className="text-2xl font-bold text-gradient">AI CV ANALYZER</p>
      </button>
      <div className="flex items-center gap-4">
        <button onClick={() => navigateTo(View.Dashboard)} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <BarChart3 size={20} />
          Dashboard
        </button>
        <button onClick={() => navigateTo(View.Upload)} className="primary-button w-fit flex items-center gap-2">
          <Upload size={20} />
          Upload CV
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
