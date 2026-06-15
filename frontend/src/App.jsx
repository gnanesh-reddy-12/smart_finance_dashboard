import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PredictorPage from './pages/PredictorPage';
import AnalyticsPage from './pages/AnalyticsPage';

// Toast Context
const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className="toast" 
            style={{ borderLeft: `4px solid ${toast.type === 'success' ? 'var(--success)' : toast.type === 'error' ? 'var(--danger)' : 'var(--primary)'}` }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Navigation Component
const Navigation = () => {
  const location = useLocation();
  
  return (
    <header className="app-header">
      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
        Smart<span style={{ color: 'var(--primary)' }}>Income</span>
      </div>
      <nav className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
        <Link to="/predict" className={location.pathname === '/predict' ? 'active' : ''}>Predictor</Link>
        <Link to="/analytics" className={location.pathname === '/analytics' ? 'active' : ''}>Analytics</Link>
      </nav>
    </header>
  );
};

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Navigation />
        <main className="page-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/predict" element={<PredictorPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
