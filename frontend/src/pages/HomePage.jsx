import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
      
      {/* SECTION 1: HERO */}
      <section className="hero-section">
        <div className="hero-badge">
          Powered by Random Forest & Gradient Boosting
        </div>
        
        <h1 className="hero-title">
          Predict Income with<br/>
          <span className="hero-gradient-text">
            Precision
          </span>
        </h1>
        
        <p className="hero-desc">
          AI-powered demographic analysis to forecast whether annual income exceeds $50,000 — trained on 48,842 real census records with 86.7% accuracy.
        </p>
        
        <div className="hero-btn-row">
          <Link to="/predict" style={{ textDecoration: 'none', width: '100%' }}>
            <button className="btn hero-btn-primary">
              Start Predicting →
            </button>
          </Link>
          <Link to="/analytics" style={{ textDecoration: 'none', width: '100%' }}>
            <button className="btn hero-btn-secondary">
              View Analytics
            </button>
          </Link>
        </div>

        <div className="hero-stats-row">
          <span>48,842 Records</span>
          <span className="hero-dot">•</span>
          <span>86.7% Accuracy</span>
          <span className="hero-dot">•</span>
          <span>4 ML Models</span>
        </div>
      </section>

      {/* SECTION 2: FEATURE CARDS */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why SmartIncome?</h2>
          
          <div className="feature-grid">
            {/* Card 1 */}
            <div className="feature-card">
              <div className="icon-circle icon-indigo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>
              <h3 className="card-title">High Accuracy</h3>
              <p className="card-desc">Random Forest and Gradient Boosting trained on real US Census data deliver production-grade predictions.</p>
            </div>
            
            {/* Card 2 */}
            <div className="feature-card">
              <div className="icon-circle icon-emerald">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <h3 className="card-title">Instant Results</h3>
              <p className="card-desc">Get salary class predictions in milliseconds with confidence percentage scores.</p>
            </div>
            
            {/* Card 3 */}
            <div className="feature-card">
              <div className="icon-circle icon-violet">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
              </div>
              <h3 className="card-title">Deep Insights</h3>
              <p className="card-desc">Explore 8 demographic features driving income — from education level to occupation type.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section className="steps-section">
        <div className="container">
          <h2 className="section-title">How it works</h2>
          
          <div className="steps-container">
            <div className="dashed-line"></div>

            <div className="step-item">
              <div className="step-number">01</div>
              <h3 className="card-title">Enter Profile</h3>
              <p className="card-desc">Fill in demographic details — age, education, occupation, hours worked.</p>
            </div>

            <div className="step-item">
              <div className="step-number">02</div>
              <h3 className="card-title">AI Analyzes</h3>
              <p className="card-desc">Our trained model processes 12 features through the ML pipeline instantly.</p>
            </div>

            <div className="step-item">
              <div className="step-number">03</div>
              <h3 className="card-title">Get Prediction</h3>
              <p className="card-desc">Receive income class prediction with confidence score and key factors.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: STATS BANNER */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-banner">
            <div className="stat-block">
              <div className="stat-value">48,842</div>
              <div className="stat-label">Census records analyzed</div>
            </div>
            <div className="stat-block">
              <div className="stat-value">86.7%</div>
              <div className="stat-label">Model accuracy</div>
            </div>
            <div className="stat-block">
              <div className="stat-value">12</div>
              <div className="stat-label">Demographic features</div>
            </div>
            <div className="stat-block">
              <div className="stat-value">&lt; 100ms</div>
              <div className="stat-label">Prediction time</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        © 2025 SmartIncome. Built with React, Flask & scikit-learn
      </footer>

      {/* MOBILE RESPONSIVE STYLES */}
      <style>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .hero-section {
          background: var(--bg-color);
          display: flex;
          flex-direction: column;
          alignItems: center;
          justify-content: center;
          min-height: calc(100vh - 80px);
          text-align: center;
          padding: 60px 20px;
        }
        .hero-badge {
          background: rgba(99, 102, 241, 0.15);
          color: var(--primary);
          padding: 8px 16px;
          border-radius: 9999px;
          border: 1px solid rgba(99, 102, 241, 0.3);
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 2rem;
        }
        .hero-title {
          font-size: 4rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }
        .hero-gradient-text {
          background: linear-gradient(135deg, #4F46E5, #7C3AED);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-desc {
          color: var(--text-secondary);
          font-size: 1.25rem;
          max-width: 800px;
          margin: 0 auto 3rem auto;
          line-height: 1.6;
        }
        .hero-btn-row {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-bottom: 3rem;
          width: 100%;
          max-width: 500px;
        }
        .hero-btn-primary {
          padding: 16px 32px;
          font-size: 1.1rem;
          border-radius: 8px;
          width: 100%;
        }
        .hero-btn-secondary {
          padding: 16px 32px;
          font-size: 1.1rem;
          background: transparent;
          color: var(--primary);
          border: 1px solid var(--primary);
          border-radius: 8px;
          width: 100%;
        }
        .hero-stats-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
          flex-wrap: wrap;
        }
        .hero-dot {
          color: var(--primary);
          font-size: 1.2rem;
          line-height: 0;
        }
        
        .features-section { background: var(--bg-color-alt); padding: 80px 20px; }
        .section-title { text-align: center; font-size: 2.5rem; font-weight: 700; margin-bottom: 60px; }
        
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }
        .feature-card {
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 40px 30px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: all 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.4);
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.1);
        }
        
        .icon-circle {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }
        .icon-indigo { background: rgba(99, 102, 241, 0.1); color: #6366F1; }
        .icon-emerald { background: rgba(16, 185, 129, 0.1); color: #10B981; }
        .icon-violet { background: rgba(124, 58, 237, 0.1); color: #7C3AED; }
        
        .card-title { font-size: 1.25rem; font-weight: 600; margin-bottom: 12px; color: var(--text-primary); }
        .card-desc { color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem; }

        .steps-section { background: var(--bg-color); padding: 80px 20px; }
        .steps-container {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          position: relative;
          gap: 40px;
        }
        .dashed-line {
          position: absolute;
          top: 40px;
          left: 10%;
          right: 10%;
          height: 2px;
          border-top: 2px dashed var(--border-color);
          z-index: 0;
        }
        .step-item {
          flex: 1;
          min-width: 250px;
          text-align: center;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .step-number {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--bg-color);
          border: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-secondary);
          margin-bottom: 24px;
        }
        
        .stats-section { background: var(--bg-color-alt); padding: 60px 20px 80px 20px; }
        .stats-banner {
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          border-top: 4px solid var(--primary);
          border-radius: 16px;
          padding: 40px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
          box-shadow: var(--card-shadow);
        }
        .stat-block { text-align: center; }
        .stat-value { font-size: 2.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px; font-family: var(--font-mono); }
        .stat-label { color: var(--text-secondary); font-size: 0.95rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
        
        .footer { padding: 40px 20px; text-align: center; border-top: 1px solid var(--border-color); color: var(--text-secondary); font-size: 0.9rem; }

        @media (max-width: 900px) {
          .hero-title { font-size: 2.5rem; }
          .hero-desc { font-size: 1.1rem; }
          .hero-btn-row { flex-direction: column; }
          
          .feature-grid { grid-template-columns: 1fr; }
          
          .steps-container { flex-direction: column; align-items: center; gap: 60px; }
          .dashed-line { display: none; }
          
          .stats-banner { grid-template-columns: 1fr; gap: 30px; }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
