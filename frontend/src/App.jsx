import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import PredictorPage from './components/PredictorPage';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Switch to Predictor page
  const handleStartPredicting = () => {
    setSelectedRoute(null);
    setCurrentPage('predictor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch to Predictor page pre-filled with a chosen route
  const handleSelectRoute = (route) => {
    setSelectedRoute(route);
    setCurrentPage('predictor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch to Landing page
  const handleNavigateHome = () => {
    setCurrentPage('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans antialiased text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Sticky Top Navigation */}
      <Navbar 
        currentPage={currentPage}
        onNavigate={(page) => {
          if (page === 'landing') handleNavigateHome();
          else handleStartPredicting();
        }}
      />

      {/* Main Content Area */}
      <main>
        {currentPage === 'landing' ? (
          <LandingPage 
            onStartPredicting={handleStartPredicting}
            onSelectRoute={handleSelectRoute}
          />
        ) : (
          <PredictorPage 
            onBackToHome={handleNavigateHome}
            initialRoute={selectedRoute}
          />
        )}
      </main>
    </div>
  );
}

export default App;
