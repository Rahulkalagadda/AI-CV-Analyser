import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./app.css";
import Home from "./pages/home"; // Assuming home.tsx is now in pages
import Upload from "./pages/upload";
import Auth from "./pages/auth";
import Dashboard from "./pages/dashboard";
import CVDetail from "./pages/cv"; // Renamed from cv.tsx to avoid conflict with type CV

export interface NavigationProps {
  navigateTo: (view: View, id?: string | null) => void;
}

export enum View {
  Home = "home",
  Upload = "upload",
  Auth = "auth",
  Dashboard = "dashboard",
  CVDetail = "cv-detail",
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState(View.Home);
  const [cvId, setCvId] = useState<string | null>(null); // For CVDetail view

  const navigateTo = (view: View, id: string | null = null) => {
    setCurrentView(view);
    setCvId(id);
  };

  let content;
  switch (currentView) {
    case View.Home:
      content = <Home navigateTo={navigateTo} />;
      break;
    case View.Upload:
      content = <Upload navigateTo={navigateTo} />;
      break;
    case View.Auth:
      content = <Auth navigateTo={navigateTo} />;
      break;
    case View.Dashboard:
      content = <Dashboard navigateTo={navigateTo} />;
      break;
    case View.CVDetail:
      content = cvId ? <CVDetail cvId={cvId} navigateTo={navigateTo} /> : <Home navigateTo={navigateTo} />;
      break;
    default:
      content = <Home navigateTo={navigateTo} />;
  }

  return (
    <Layout>
      {content}
    </Layout>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
