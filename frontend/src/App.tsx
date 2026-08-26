import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { StudentSignupPage } from './pages/StudentSignupPage';
import { ShopkeeperSignupPage } from './pages/ShopkeeperSignupPage';
import { DashboardPage } from './pages/DashboardPage';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-paper-100 selection:bg-marigold-200 selection:text-marigold-900">
          <Navbar />
          
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/student-signup" element={<StudentSignupPage />} />
              <Route path="/shopkeeper-signup" element={<ShopkeeperSignupPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>

          <footer className="border-t border-paper-border bg-white/70 py-6 text-center text-xs text-ink-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-ink-800">CampusConnect</span>
                <span>• Hyperlocal Student & Shopkeeper Platform</span>
              </div>
              <p className="text-ink-400">
                Frontend MVP • In-memory state
              </p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
