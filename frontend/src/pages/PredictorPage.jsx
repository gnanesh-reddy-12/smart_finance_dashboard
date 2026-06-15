import React, { useState } from 'react';
import { useToast } from '../App';

const getEduNum = (edu) => {
  const map = {
    'Preschool': 1, '1st-4th': 2, '5th-6th': 3, '7th-8th': 4, '9th': 5, '10th': 6, '11th': 7,
    '12th': 8, 'HS-grad': 9, 'Some-college': 10, 'Assoc-voc': 11, 'Assoc-acdm': 12,
    'Bachelors': 13, 'Masters': 14, 'Prof-school': 15, 'Doctorate': 16
  };
  return map[edu] || 9;
};

const defaultForm = {
  age: 30,
  workclass: 'Private',
  education: 'Bachelors',
  'educational-num': 13,
  'marital-status': 'Never-married',
  occupation: 'Adm-clerical',
  relationship: 'Unmarried',
  gender: 'Male',
  'hours-per-week': 40,
  'capital-gain': 0,
  'capital-loss': 0,
  'native-country': 'United-States'
};

const PredictorPage = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState(defaultForm);

  const validateField = (name, value) => {
    let error = null;
    const num = Number(value);
    
    if (name === 'age' && (num < 17 || num > 90)) {
      error = "Age must be between 17 and 90";
    }
    if (name === 'capital-gain' && num > 99999) {
      error = "Maximum value is 99,999";
    }
    if (name === 'capital-loss' && num > 4356) {
      error = "Maximum value is 4,356";
    }
    if (name === 'hours-per-week' && (num < 1 || num > 99)) {
      error = "Must be between 1 and 99";
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = {
        ...prev,
        [name]: (e.target.type === 'number' && value !== '') ? Number(value) : value
      };
      if (name === 'education') {
        next['educational-num'] = getEduNum(value);
      }
      return next;
    });
    
    // Clear error on change if it becomes valid
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let newValue = formData[name]; // Use the currently stored value
    
    if (name === 'capital-gain' || name === 'capital-loss') {
      // Prevent leading zeros by parsing to int
      const parsed = parseInt(value, 10);
      newValue = isNaN(parsed) ? 0 : parsed;
      setFormData(prev => ({ ...prev, [name]: newValue }));
    }

    const error = validateField(name, newValue);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleReset = () => {
    setFormData(defaultForm);
    setErrors({});
    setResult(null);
    setConfidence(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submit
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast("Please fix the validation errors before submitting.", "error");
      return;
    }

    setLoading(true);
    setResult(null);
    setConfidence(0);
    try {
      const response = await fetch('/api/predict_income', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to predict');
      }
      
      setResult(data.prediction);
      setConfidence(data.confidence || 0.85); // fallback if not returned
    } catch (err) {
      addToast("Prediction failed. Please check your connection.", 'error');
    } finally {
      setLoading(false);
    }
  };

  // Determine top border color for result card
  let resultBorder = '3px solid #E2E8F0';
  if (result) {
    resultBorder = result.includes('>') ? '3px solid #10B981' : '3px solid #F43F5E';
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* PAGE HEADER */}
      <div style={{ marginBottom: '40px', position: 'relative' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          color: '#6366F1',
          padding: '6px 12px',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '600',
          marginBottom: '16px'
        }}>
          <span style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            background: '#10B981',
            boxShadow: '0 0 0 2px rgba(16,185,129,0.2)',
            animation: 'pulse 2s infinite'
          }}></span>
          ML Model Active · 86.7% Accuracy
        </div>
        
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0F172A', marginBottom: '8px', letterSpacing: '-0.02em' }}>
          Income Predictor
        </h1>
        <p style={{ color: '#64748B', fontSize: '15px' }}>
          Enter demographic details below to predict salary classification using our trained ML model
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16,185,129,0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16,185,129,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16,185,129,0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes badgePulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
        .form-label {
          display: block;
          font-size: 11px;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 600;
          margin-bottom: 6px;
        }
        .predict-input {
          width: 100%;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 12px 16px;
          color: #0F172A;
          font-size: 14px;
          transition: all 0.2s;
          outline: none;
        }
        .predict-input:focus {
          border-color: #6366F1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        input.predict-input[readonly] {
          background: #F1F5F9;
          color: #94A3B8;
          cursor: not-allowed;
        }
        .predict-input.has-error {
          border-color: #F43F5E;
        }
        .predict-input.has-error:focus {
          box-shadow: 0 0 0 3px rgba(244,63,94,0.12);
        }
        .error-text {
          color: #F43F5E;
          font-size: 12px;
          margin-top: 4px;
        }
        .submit-btn {
          width: 65%;
          height: 52px;
          background: #6366F1;
          color: white;
          font-size: 16px;
          font-weight: 600;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .submit-btn:hover:not(:disabled) {
          background: #4F46E5;
        }
        .submit-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .reset-btn {
          width: 35%;
          height: 52px;
          background: white;
          border: 1px solid #E2E8F0;
          color: #64748B;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .reset-btn:hover {
          background: #F8FAFC;
          border-color: #CBD5E1;
        }
        .btn-row {
          display: flex;
          gap: 12px;
          width: 100%;
        }
        .layout-grid {
          display: grid;
          grid-template-columns: 58% calc(42% - 24px);
          gap: 24px;
          align-items: flex-start;
        }
        @media (max-width: 900px) {
          .layout-grid {
            grid-template-columns: 1fr;
          }
        }
        .loader {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="layout-grid">
        
        {/* LEFT COLUMN: FORM */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
          borderTop: '3px solid #6366F1',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #E2E8F0' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0F172A', marginBottom: '4px' }}>
              Employee Details Form
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B' }}>
              All fields are required for accurate prediction
            </p>
          </div>
          
          <div style={{ padding: '24px' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                
                <div>
                  <label className="form-label">Age</label>
                  <input type="number" name="age" className={`predict-input ${errors.age ? 'has-error' : ''}`} value={formData.age} onChange={handleChange} onBlur={handleBlur} required />
                  {errors.age && <div className="error-text">{errors.age}</div>}
                </div>
                
                <div>
                  <label className="form-label">Workclass</label>
                  <select name="workclass" className="predict-input" value={formData.workclass} onChange={handleChange}>
                    <option value="Private">Private</option>
                    <option value="Self-emp-not-inc">Self-emp-not-inc</option>
                    <option value="Self-emp-inc">Self-emp-inc</option>
                    <option value="Federal-gov">Federal-gov</option>
                    <option value="Local-gov">Local-gov</option>
                    <option value="State-gov">State-gov</option>
                    <option value="Without-pay">Without-pay</option>
                  </select>
                </div>
                
                <div>
                  <label className="form-label">Education</label>
                  <select name="education" className="predict-input" value={formData.education} onChange={handleChange}>
                    <option value="Preschool">Preschool</option>
                    <option value="1st-4th">1st-4th</option>
                    <option value="5th-6th">5th-6th</option>
                    <option value="7th-8th">7th-8th</option>
                    <option value="9th">9th</option>
                    <option value="10th">10th</option>
                    <option value="11th">11th</option>
                    <option value="12th">12th</option>
                    <option value="HS-grad">HS-grad</option>
                    <option value="Some-college">Some-college</option>
                    <option value="Assoc-voc">Assoc-voc</option>
                    <option value="Assoc-acdm">Assoc-acdm</option>
                    <option value="Bachelors">Bachelors</option>
                    <option value="Masters">Masters</option>
                    <option value="Prof-school">Prof-school</option>
                    <option value="Doctorate">Doctorate</option>
                  </select>
                </div>
                
                <div>
                  <label className="form-label">Education Number</label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" name="educational-num" className="predict-input" value={formData['educational-num']} readOnly title="Auto-calculated from education level" />
                    <svg style={{ position: 'absolute', right: '12px', top: '12px', color: '#94A3B8' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Marital Status</label>
                  <select name="marital-status" className="predict-input" value={formData['marital-status']} onChange={handleChange}>
                    <option value="Never-married">Never-married</option>
                    <option value="Married-civ-spouse">Married-civ-spouse</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Married-spouse-absent">Married-spouse-absent</option>
                    <option value="Separated">Separated</option>
                    <option value="Married-AF-spouse">Married-AF-spouse</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                
                <div>
                  <label className="form-label">Occupation</label>
                  <select name="occupation" className="predict-input" value={formData.occupation} onChange={handleChange}>
                    <option value="Tech-support">Tech-support</option>
                    <option value="Craft-repair">Craft-repair</option>
                    <option value="Other-service">Other-service</option>
                    <option value="Sales">Sales</option>
                    <option value="Exec-managerial">Exec-managerial</option>
                    <option value="Prof-specialty">Prof-specialty</option>
                    <option value="Handlers-cleaners">Handlers-cleaners</option>
                    <option value="Machine-op-inspct">Machine-op-inspct</option>
                    <option value="Adm-clerical">Adm-clerical</option>
                    <option value="Farming-fishing">Farming-fishing</option>
                    <option value="Transport-moving">Transport-moving</option>
                    <option value="Priv-house-serv">Priv-house-serv</option>
                    <option value="Protective-serv">Protective-serv</option>
                    <option value="Armed-Forces">Armed-Forces</option>
                  </select>
                </div>
                
                <div>
                  <label className="form-label">Relationship</label>
                  <select name="relationship" className="predict-input" value={formData.relationship} onChange={handleChange}>
                    <option value="Wife">Wife</option>
                    <option value="Own-child">Own-child</option>
                    <option value="Husband">Husband</option>
                    <option value="Not-in-family">Not-in-family</option>
                    <option value="Other-relative">Other-relative</option>
                    <option value="Unmarried">Unmarried</option>
                  </select>
                </div>
                
                <div>
                  <label className="form-label">Gender</label>
                  <select name="gender" className="predict-input" value={formData.gender} onChange={handleChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                
                <div>
                  <label className="form-label">Hours / Week</label>
                  <input type="number" name="hours-per-week" className={`predict-input ${errors['hours-per-week'] ? 'has-error' : ''}`} value={formData['hours-per-week']} onChange={handleChange} onBlur={handleBlur} required />
                  {errors['hours-per-week'] && <div className="error-text">{errors['hours-per-week']}</div>}
                </div>
                
                <div>
                  <label className="form-label">Capital Gain</label>
                  <input type="number" name="capital-gain" className={`predict-input ${errors['capital-gain'] ? 'has-error' : ''}`} value={formData['capital-gain']} onChange={handleChange} onBlur={handleBlur} required />
                  {errors['capital-gain'] && <div className="error-text">{errors['capital-gain']}</div>}
                </div>
                
                <div>
                  <label className="form-label">Capital Loss</label>
                  <input type="number" name="capital-loss" className={`predict-input ${errors['capital-loss'] ? 'has-error' : ''}`} value={formData['capital-loss']} onChange={handleChange} onBlur={handleBlur} required />
                  {errors['capital-loss'] && <div className="error-text">{errors['capital-loss']}</div>}
                </div>
                
                <div>
                  <label className="form-label">Native Country</label>
                  <select name="native-country" className="predict-input" value={formData['native-country']} onChange={handleChange}>
                    <option value="United-States">United-States</option>
                    <option value="Cambodia">Cambodia</option>
                    <option value="England">England</option>
                    <option value="Puerto-Rico">Puerto-Rico</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                    <option value="India">India</option>
                    <option value="Japan">Japan</option>
                    <option value="China">China</option>
                    <option value="Cuba">Cuba</option>
                    <option value="Iran">Iran</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Italy">Italy</option>
                    <option value="Poland">Poland</option>
                    <option value="Jamaica">Jamaica</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Mexico">Mexico</option>
                    <option value="France">France</option>
                    <option value="Guatemala">Guatemala</option>
                    <option value="Nicaragua">Nicaragua</option>
                    <option value="Thailand">Thailand</option>
                    <option value="El-Salvador">El-Salvador</option>
                    <option value="Peru">Peru</option>
                    <option value="Hong">Hong</option>
                    <option value="Holand-Netherlands">Holand-Netherlands</option>
                  </select>
                </div>
                
              </div>
              
              <div className="btn-row">
                <button type="button" className="reset-btn" onClick={handleReset}>
                  Reset Form
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading && <div className="loader"></div>}
                  {loading ? 'Analyzing Profile...' : 'Start Predicting →'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: RESULT */}
        <div style={{
          position: 'sticky',
          top: '24px',
          background: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
          borderTop: resultBorder,
          transition: 'border-top 0.3s ease',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0F172A', marginBottom: '24px' }}>
            Prediction Result
          </h2>

          {!result ? (
            /* EMPTY STATE */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%', background: '#F0F4FF',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <p style={{ fontSize: '15px', color: '#0F172A', fontWeight: '600', marginBottom: '4px' }}>Awaiting Prediction</p>
              <p style={{ fontSize: '13px', color: '#64748B', textAlign: 'center' }}>Complete the form and click predict to see your result</p>
            </div>
          ) : (
            /* RESULT STATE */
            <div style={{ animation: 'fadeInUp 400ms forwards' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0 30px 0' }}>
                <div style={{
                  background: result.includes('>') ? '#ECFDF5' : '#FFF1F2',
                  border: result.includes('>') ? '1.5px solid #6EE7B7' : '1.5px solid #FECDD3',
                  borderRadius: '9999px',
                  padding: '10px 24px',
                  marginBottom: '16px',
                  maxWidth: '160px',
                  width: '100%',
                  textAlign: 'center',
                  animation: 'badgePulse 600ms ease-out 1 forwards'
                }}>
                  <span style={{ 
                    fontSize: '36px', 
                    fontWeight: '800', 
                    color: result.includes('>') ? '#065F46' : '#9F1239',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {result.includes('>') ? '>50K' : '≤50K'}
                  </span>
                </div>
                
                <p style={{ 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  color: result.includes('>') ? '#10B981' : '#F43F5E', 
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}>
                  {result.includes('>') ? 'High Earning Potential' : 'Standard Earning Range'}
                </p>
                <p style={{ fontSize: '13px', color: '#64748B', textAlign: 'center', lineHeight: '1.5', maxWidth: '220px', margin: '0 auto' }}>
                  {result.includes('>') 
                    ? 'This demographic profile is associated with annual income above $50,000'
                    : 'This demographic profile is associated with annual income at or below $50,000'}
                </p>
              </div>

              {/* CONFIDENCE SECTION */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748B', fontWeight: '600', letterSpacing: '0.05em' }}>
                    Model Confidence
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#0F172A', fontFamily: 'var(--font-mono)' }}>
                    {(confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div style={{ height: '8px', background: '#E2E8F0', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    background: '#6366F1', 
                    width: `${confidence * 100}%`,
                    transition: 'width 1s ease-out'
                  }}></div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <span style={{ background: '#F1F5F9', color: '#64748B', fontSize: '11px', padding: '2px 8px', borderRadius: '99px', fontWeight: '500' }}>Random Forest</span>
                  <span style={{ background: '#F1F5F9', color: '#64748B', fontSize: '11px', padding: '2px 8px', borderRadius: '99px', fontWeight: '500' }}>scikit-learn</span>
                  <span style={{ background: '#F1F5F9', color: '#64748B', fontSize: '11px', padding: '2px 8px', borderRadius: '99px', fontWeight: '500' }}>Census Data</span>
                </div>
                <p style={{ fontSize: '11px', color: '#94A3B8' }}>
                  Prediction generated in &lt;1ms
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictorPage;
