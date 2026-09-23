import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DocumentProvider } from './context/DocumentContext';
import { AuthProvider } from './context/AuthContext';
import { Background } from './components/Background';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CinematicTransition } from './components/CinematicTransition';
import { DownloadSuccessPopup } from './components/DownloadSuccessPopup';
import { AIRobotAssistant } from './components/AIRobotAssistant';
import { useDocument } from './context/DocumentContext';

// Pages
import { Dashboard } from './pages/Dashboard';
import { HowItWorks } from './pages/HowItWorks';
import { About } from './pages/About';
import { Upload } from './pages/Upload';
import { ChooseOptions } from './pages/ChooseOptions';
import { Processing } from './pages/Processing';
import { Preview } from './pages/Preview';
import { DownloadOptions } from './pages/DownloadOptions';
import { Downloading } from './pages/Downloading';
import { Success } from './pages/Success';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { Documents } from './pages/Documents';

const AppContent: React.FC = () => {
  const location = useLocation();
  const { showDownloadSuccess } = useDocument();

  return (
    <div className="min-h-screen flex flex-col relative text-[#2C2830] font-sans selection:bg-[#6B315E]/20 selection:text-[#24162F]">
      {/* Global Animated Document-Processing Background */}
      <Background />

      {/* Top Fixed Navigation */}
      <Navbar />

      {/* Temporary Download Success Micro-Animation Popup (Top Center) */}
      <DownloadSuccessPopup isVisible={showDownloadSuccess} />

      {/* Main App Content View with 3D Cinematic Transition */}
      <main className="flex-grow pt-[104px] sm:pt-[116px] pb-16 px-4 sm:px-8 max-w-[1440px] mx-auto w-full flex flex-col z-10">
        <CinematicTransition pageKey={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/choose-options" element={<ChooseOptions />} />
            <Route path="/processing" element={<Processing />} />
            <Route path="/preview" element={<Preview />} />
            <Route path="/download-options" element={<DownloadOptions />} />
            <Route path="/downloading" element={<Downloading />} />
            <Route path="/success" element={<Success />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CinematicTransition>
      </main>

      {/* Shared Footer */}
      <Footer />

      {/* Persistent Intelligent AI Robot Assistant */}
      <AIRobotAssistant />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DocumentProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </DocumentProvider>
    </AuthProvider>
  );
}
