import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ResultsPage from './components/ResultsPage';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [userData, setUserData] = useState(null);

  const handleWizardComplete = (data) => {
    setUserData(data);
  };

  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={<LandingPage onComplete={handleWizardComplete} />}
          />
          <Route
            path="/results"
            element={<ResultsPage userData={userData} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


