import React from 'react';
import { Link } from 'react-router-dom';

// Reusable inline styles
const cardStyle = {
  background: 'var(--surface-color)',
  border: '1px solid var(--border-color)',
  borderRadius: '16px',
  padding: '40px 30px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start'
};

const iconCircleStyle = {
  width: '50px',
  height: '50px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '24px'
};

const cardTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: '600',
  marginBottom: '12px',
  color: 'var(--text-primary)'
};

const cardDescStyle = {
  color: 'var(--text-secondary)',
  lineHeight: '1.6',
  fontSize: '0.95rem'
};

const stepStyle = {
  flex: '1',
  minWidth: '250px',
  textAlign: 'center',
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const stepNumberStyle = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'var(--bg-color)',
  border: '2px solid var(--border-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2rem',
  fontWeight: '800',
  color: 'var(--text-secondary)',
  marginBottom: '24px'
};

const stepTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: '600',
  marginBottom: '12px',
  color: 'var(--text-primary)'
};

const stepDescStyle = {
  color: 'var(--text-secondary)',
  lineHeight: '1.6',
  fontSize: '0.95rem',
  maxWidth: '280px'
};

const statBlockStyle = {
  textAlign: 'center'
};

const statValueStyle = {
  fontSize: '2.5rem',
  fontWeight: '800',
  color: 'var(--text-primary)',
  marginBottom: '8px',
  fontFamily: 'var(--font-mono)'
};

const statLabelStyle = {
  color: 'var(--text-secondary)',
  fontSize: '0.95rem',
  fontWeight: '500',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const HomePage = () => {
  return (
    <div style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
      
      {/* SECTION 1: HERO */}
      <section style={{ 
        background: 'var(--bg-color)',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: 'calc(100vh - 80px)', 
        textAlign: 'center',
        padding: '0 20px'
      }}>
        <div style={{
          background: 'rgba(99, 102, 241, 0.15)',
          color: 'var(--primary)',
          padding: '8px 16px',
          borderRadius: '9999px',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          fontSize: '0.875rem',
          fontWeight: '500',
          marginBottom: '2rem'
        }}>
          Powered by Random Forest & Gradient Boosting
        </div>
        
        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: '800', 
          lineHeight: '1.1', 
          marginBottom: '1.5rem',
          letterSpacing: '-0.02em'
        }}>
          Predict Income with<br/>
          <span style={{
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Precision
          </span>
        </h1>
        
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1.25rem',
          maxWidth: '800px',
          margin: '0 auto 3rem auto',
          lineHeight: '1.6'
        }}>
          AI-powered demographic analysis to forecast whether annual income exceeds $50,000 — trained on 48,842 real census records with 86.7% accuracy.
        </p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '3rem' }}>
          <Link to="/predict" style={{ textDecoration: 'none' }}>
            <button className="btn" style={{ 
              padding: '16px 32px', 
              fontSize: '1.1rem',
              borderRadius: '8px'
            }}>
              Start Predicting →
            </button>
          </Link>
          <Link to="/analytics" style={{ textDecoration: 'none' }}>
            <button className="btn" style={{ 
              padding: '16px 32px', 
              fontSize: '1.1rem', 
              background: 'transparent', 
              color: 'var(--primary)', 
              border: '1px solid var(--primary)',
              borderRadius: '8px'
            }}>
              View Analytics
            </button>
          </Link>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          fontWeight: '500'
        }}>
          <span>48,842 Records</span>
          <span style={{ color: 'var(--primary)', fontSize: '1.2rem', lineHeight: '0' }}>•</span>
          <span>86.7% Accuracy</span>
          <span style={{ color: 'var(--primary)', fontSize: '1.2rem', lineHeight: '0' }}>•</span>
          <span>4 ML Models</span>
        </div>
      </section>

      {/* SECTION 2: FEATURE CARDS */}
      <section style={{ background: 'var(--bg-color-alt)', padding: '80px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: '700', marginBottom: '60px' }}>
            Why SmartIncome?
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '30px' 
          }}>
            {/* Card 1 */}
            <div className="feature-card" style={cardStyle}>
              <div style={{...iconCircleStyle, background: 'rgba(99, 102, 241, 0.1)', color: '#6366F1'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>
              <h3 style={cardTitleStyle}>High Accuracy</h3>
              <p style={cardDescStyle}>Random Forest and Gradient Boosting trained on real US Census data deliver production-grade predictions.</p>
            </div>
            
            {/* Card 2 */}
            <div className="feature-card" style={cardStyle}>
              <div style={{...iconCircleStyle, background: 'rgba(16, 185, 129, 0.1)', color: '#10B981'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <h3 style={cardTitleStyle}>Instant Results</h3>
              <p style={cardDescStyle}>Get salary class predictions in milliseconds with confidence percentage scores.</p>
            </div>
            
            {/* Card 3 */}
            <div className="feature-card" style={cardStyle}>
              <div style={{...iconCircleStyle, background: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
              </div>
              <h3 style={cardTitleStyle}>Deep Insights</h3>
              <p style={cardDescStyle}>Explore 8 demographic features driving income — from education level to occupation type.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section style={{ background: 'var(--bg-color)', padding: '80px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: '700', marginBottom: '80px' }}>
            How it works
          </h2>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            position: 'relative',
            gap: '40px',
            flexWrap: 'wrap'
          }}>
            {/* Dashed Line */}
            <div style={{
              position: 'absolute',
              top: '40px',
              left: '10%',
              right: '10%',
              height: '2px',
              borderTop: '2px dashed var(--border-color)',
              zIndex: 0,
              display: 'block'
            }}></div>

            <div style={stepStyle}>
              <div style={stepNumberStyle}>01</div>
              <h3 style={stepTitleStyle}>Enter Profile</h3>
              <p style={stepDescStyle}>Fill in demographic details — age, education, occupation, hours worked.</p>
            </div>

            <div style={stepStyle}>
              <div style={stepNumberStyle}>02</div>
              <h3 style={stepTitleStyle}>AI Analyzes</h3>
              <p style={stepDescStyle}>Our trained model processes 12 features through the ML pipeline instantly.</p>
            </div>

            <div style={stepStyle}>
              <div style={stepNumberStyle}>03</div>
              <h3 style={stepTitleStyle}>Get Prediction</h3>
              <p style={stepDescStyle}>Receive income class prediction with confidence score and key factors.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: STATS BANNER */}
      <section style={{ background: 'var(--bg-color-alt)', padding: '60px 20px 80px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            background: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            borderTop: '4px solid var(--primary)',
            borderRadius: '16px',
            padding: '40px',
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: '40px',
            boxShadow: 'var(--card-shadow)'
          }}>
            <div style={statBlockStyle}>
              <div style={statValueStyle}>48,842</div>
              <div style={statLabelStyle}>Census records analyzed</div>
            </div>
            <div style={statBlockStyle}>
              <div style={statValueStyle}>86.7%</div>
              <div style={statLabelStyle}>Model accuracy</div>
            </div>
            <div style={statBlockStyle}>
              <div style={statValueStyle}>12</div>
              <div style={statLabelStyle}>Demographic features</div>
            </div>
            <div style={statBlockStyle}>
              <div style={statValueStyle}>&lt; 100ms</div>
              <div style={statLabelStyle}>Prediction time</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ 
        padding: '40px 20px', 
        textAlign: 'center', 
        borderTop: '1px solid var(--border-color)',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem'
      }}>
        © 2025 SmartIncome. Built with React, Flask & scikit-learn
      </footer>

      {/* Add hover styles via a quick style block since we're using inline styles mostly */}
      <style>{`
        .feature-card {
          transition: all 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.4) !important;
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.1);
        }
      `}</style>
    </div>
  );
};

export default HomePage;
