import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const AnalyticsPage = () => {
  // Chart refs
  const distChartRef = useRef(null);
  const perfChartRef = useRef(null);
  const eduChartRef = useRef(null);
  const occChartRef = useRef(null);
  const ageChartRef = useRef(null);
  const featChartRef = useRef(null);

  // Global Chart Defaults
  useEffect(() => {
    Chart.defaults.font.family = 'Inter, sans-serif';
    Chart.defaults.color = '#64748B';
    Chart.defaults.scale.grid.color = 'rgba(0,0,0,0.05)';
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.9)';
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
  }, []);

  // Initialize Charts
  useEffect(() => {
    // 1. Income Distribution (Doughnut)
    let distChart;
    if (distChartRef.current) {
      distChart = new Chart(distChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['≤50K', '>50K'],
          datasets: [{
            data: [75.2, 24.8],
            backgroundColor: ['#F43F5E', '#10B981'],
            borderWidth: 0,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 800 },
          cutout: '70%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { usePointStyle: true, padding: 20, font: { size: 13 } }
            }
          }
        },
        plugins: [{
          id: 'centerText',
          beforeDraw: function(chart) {
            var width = chart.width, height = chart.height, ctx = chart.ctx;
            ctx.restore();
            var fontSize = (height / 114).toFixed(2);
            ctx.font = "bold " + fontSize + "em Inter";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#0F172A";
            var text = "48,842", textX = Math.round((width - ctx.measureText(text).width) / 2), textY = height / 2 - 10;
            ctx.fillText(text, textX, textY);
            
            ctx.font = "500 " + (fontSize * 0.4).toFixed(2) + "em Inter";
            ctx.fillStyle = "#64748B";
            var text2 = "Records", text2X = Math.round((width - ctx.measureText(text2).width) / 2), text2Y = height / 2 + 15;
            ctx.fillText(text2, text2X, text2Y);
            ctx.save();
          }
        }]
      });
    }

    // 2. Model Performance (Horizontal Bar)
    let perfChart;
    if (perfChartRef.current) {
      perfChart = new Chart(perfChartRef.current, {
        type: 'bar',
        data: {
          labels: ['Accuracy', 'F1-Score', 'ROC-AUC'],
          datasets: [{
            data: [86.7, 72.4, 91.2],
            backgroundColor: ['#6366F1', '#7C3AED', '#10B981'],
            borderRadius: 6,
            barThickness: 32
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 800 },
          scales: {
            x: { min: 0, max: 100, ticks: { callback: (v) => v + '%' } },
            y: { grid: { display: false } }
          },
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => ctx.raw + '%' } }
          }
        }
      });
    }

    // 3. Income by Education (Vertical Bar with Gradient)
    let eduChart;
    if (eduChartRef.current) {
      const eduColors = [
        '#C7D2FE','#C7D2FE','#C7D2FE','#C7D2FE','#C7D2FE','#A5B4FC','#A5B4FC','#A5B4FC',
        '#818CF8','#818CF8','#6366F1','#6366F1','#4F46E5','#4F46E5','#4338CA','#4338CA'
      ];
      eduChart = new Chart(eduChartRef.current, {
        type: 'bar',
        data: {
          labels: ['Preschool', '1st-4th', '5th-6th', '7th-8th', '9th', '10th', '11th', '12th', 'HS-grad', 'Some-college', 'Assoc-voc', 'Assoc-acdm', 'Bachelors', 'Masters', 'Prof-school', 'Doctorate'],
          datasets: [{
            data: [0, 2, 4, 5, 7, 9, 9, 10, 16, 20, 25, 27, 41, 56, 72, 74],
            backgroundColor: eduColors,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 800 },
          scales: {
            y: { ticks: { callback: (v) => v + '%' } },
            x: { grid: { display: false } }
          },
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => ctx.raw + '% earning >50K' } }
          }
        }
      });
    }

    // 4. Income by Occupation (Horizontal Bar)
    let occChart;
    if (occChartRef.current) {
      occChart = new Chart(occChartRef.current, {
        type: 'bar',
        data: {
          labels: ['Exec-managerial', 'Prof-specialty', 'Protective-serv', 'Tech-support', 'Sales', 'Craft-repair', 'Transport-moving', 'Adm-clerical', 'Machine-op-inspct', 'Other-service', 'Farming-fishing', 'Handlers-cleaners', 'Priv-house-serv'],
          datasets: [{
            data: [48, 45, 33, 30, 27, 21, 17, 13, 11, 8, 7, 6, 1],
            backgroundColor: '#6366F1',
            borderRadius: 6
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 800 },
          scales: {
            x: { ticks: { callback: (v) => v + '%' } },
            y: { grid: { display: false } }
          },
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => ctx.raw + '% earning >50K' } }
          }
        }
      });
    }

    // 5. Income by Age Group (Grouped Bar)
    let ageChart;
    if (ageChartRef.current) {
      ageChart = new Chart(ageChartRef.current, {
        type: 'bar',
        data: {
          labels: ['18-25', '26-35', '36-45', '46-55', '56-65', '65+'],
          datasets: [
            {
              label: '≤50K',
              data: [95, 72, 62, 58, 65, 80],
              backgroundColor: '#F43F5E',
              borderRadius: 6
            },
            {
              label: '>50K',
              data: [5, 28, 38, 42, 35, 20],
              backgroundColor: '#10B981',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 800 },
          scales: {
            y: { ticks: { callback: (v) => v + '%' }, stacked: false },
            x: { grid: { display: false }, stacked: false }
          },
          plugins: {
            legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } },
            tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}%` } }
          }
        }
      });
    }

    // 6. Feature Importance (Horizontal Bar Multi-color)
    let featChart;
    if (featChartRef.current) {
      featChart = new Chart(featChartRef.current, {
        type: 'bar',
        data: {
          labels: ['relationship', 'marital-status', 'capital-gain', 'educational-num', 'age', 'hours-per-week', 'occupation', 'gender'],
          datasets: [{
            data: [0.31, 0.29, 0.21, 0.18, 0.15, 0.12, 0.09, 0.04],
            backgroundColor: ['#6366F1', '#6366F1', '#6366F1', '#7C3AED', '#7C3AED', '#7C3AED', '#A5B4FC', '#A5B4FC'],
            borderRadius: 6
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 800 },
          scales: {
            x: { min: 0, max: 0.35 },
            y: { grid: { display: false } }
          },
          plugins: {
            legend: { display: false }
          }
        }
      });
    }

    // Cleanup
    return () => {
      if (distChart) distChart.destroy();
      if (perfChart) perfChart.destroy();
      if (eduChart) eduChart.destroy();
      if (occChart) occChart.destroy();
      if (ageChart) ageChart.destroy();
      if (featChart) featChart.destroy();
    };
  }, []);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* PAGE HEADER */}
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0F172A', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              Dataset Analytics
            </h1>
            <p style={{ color: '#64748B', fontSize: '15px' }}>
              Visual Exploratory Data Analysis of the Adult Census Income dataset — 48,842 records
            </p>
          </div>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            color: '#0F172A',
            padding: '8px 16px',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: '600',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></span>
            Last trained: Today
          </div>
        </div>
      </div>

      {/* ROW 1: STATS ROW */}
      <section style={{ background: '#F0F4FF', padding: '40px 20px', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          
          {/* Card 1 */}
          <div className="stat-card" style={{ ...statCardBase, borderLeftColor: '#6366F1' }}>
            <div style={{ ...statIconBase, background: 'rgba(99,102,241,0.1)', color: '#6366F1' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#6366F1', lineHeight: '1.2' }}>48,842</div>
              <div style={{ fontSize: '13px', color: '#64748B', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Records</div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="stat-card" style={{ ...statCardBase, borderLeftColor: '#10B981' }}>
            <div style={{ ...statIconBase, background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#10B981', lineHeight: '1.2' }}>24.8%</div>
              <div style={{ fontSize: '13px', color: '#64748B', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Earn &gt;50K</div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="stat-card" style={{ ...statCardBase, borderLeftColor: '#7C3AED' }}>
            <div style={{ ...statIconBase, background: 'rgba(124,58,237,0.1)', color: '#7C3AED' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#7C3AED', lineHeight: '1.2' }}>86.7%</div>
              <div style={{ fontSize: '13px', color: '#64748B', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Model Accuracy</div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="stat-card" style={{ ...statCardBase, borderLeftColor: '#F59E0B' }}>
            <div style={{ ...statIconBase, background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#F59E0B', lineHeight: '1.2' }}>12</div>
              <div style={{ fontSize: '13px', color: '#64748B', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Features Used</div>
            </div>
          </div>

        </div>
      </section>

      {/* CHARTS CONTAINER */}
      <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* ROW 2: PIE & HORIZONTAL BAR */}
        <div className="chart-grid-2">
          <div style={chartCardStyle}>
            <div style={chartHeaderStyle}>
              <h3 style={chartTitleStyle}>Income Distribution</h3>
              <p style={chartSubStyle}>Overall dataset split</p>
            </div>
            <div style={{ height: '300px', position: 'relative' }}>
              <canvas ref={distChartRef}></canvas>
            </div>
          </div>
          
          <div style={chartCardStyle}>
            <div style={chartHeaderStyle}>
              <h3 style={chartTitleStyle}>Model Performance</h3>
              <p style={chartSubStyle}>Evaluation metrics on test set</p>
            </div>
            <div style={{ height: '300px', position: 'relative' }}>
              <canvas ref={perfChartRef}></canvas>
            </div>
          </div>
        </div>

        {/* ROW 3: FULL WIDTH BAR */}
        <div style={chartCardStyle}>
          <div style={chartHeaderStyle}>
            <h3 style={chartTitleStyle}>Income by Education Level</h3>
            <p style={chartSubStyle}>Percentage earning &gt;50K per education category</p>
          </div>
          <div style={{ height: '280px', position: 'relative' }}>
            <canvas ref={eduChartRef}></canvas>
          </div>
        </div>

        {/* ROW 4: TWO CHARTS SIDE BY SIDE */}
        <div className="chart-grid-2">
          <div style={chartCardStyle}>
            <div style={chartHeaderStyle}>
              <h3 style={chartTitleStyle}>Income by Occupation</h3>
              <p style={chartSubStyle}>% earning &gt;50K per job type</p>
            </div>
            <div style={{ height: '340px', position: 'relative' }}>
              <canvas ref={occChartRef}></canvas>
            </div>
          </div>
          
          <div style={chartCardStyle}>
            <div style={chartHeaderStyle}>
              <h3 style={chartTitleStyle}>Income by Age Group</h3>
              <p style={chartSubStyle}>Distribution across age brackets</p>
            </div>
            <div style={{ height: '340px', position: 'relative' }}>
              <canvas ref={ageChartRef}></canvas>
            </div>
          </div>
        </div>

        {/* ROW 5: FULL WIDTH HORIZONTAL BAR */}
        <div style={chartCardStyle}>
          <div style={chartHeaderStyle}>
            <h3 style={chartTitleStyle}>Feature Importance</h3>
            <p style={chartSubStyle}>Top predictors from Random Forest model — higher score = stronger influence on prediction</p>
          </div>
          <div style={{ height: '280px', position: 'relative' }}>
            <canvas ref={featChartRef}></canvas>
          </div>
        </div>

        {/* ROW 6: INSIGHT CARDS */}
        <div style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#0F172A', marginBottom: '24px' }}>Key Insights</h2>
          <div className="chart-grid-3">
            
            <div style={{ ...insightCardStyle, borderLeftColor: '#6366F1' }}>
              <div style={{ color: '#6366F1', marginBottom: '12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <p style={{ color: '#0F172A', fontSize: '14.5px', lineHeight: '1.6', fontWeight: '500' }}>
                Education is the strongest controllable factor — moving from HS-grad to Bachelors nearly triples the probability of earning &gt;50K.
              </p>
            </div>

            <div style={{ ...insightCardStyle, borderLeftColor: '#10B981' }}>
              <div style={{ color: '#10B981', marginBottom: '12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              </div>
              <p style={{ color: '#0F172A', fontSize: '14.5px', lineHeight: '1.6', fontWeight: '500' }}>
                Exec-managerial and Prof-specialty roles show the highest income rates at 48% and 45% respectively.
              </p>
            </div>

            <div style={{ ...insightCardStyle, borderLeftColor: '#F59E0B' }}>
              <div style={{ color: '#F59E0B', marginBottom: '12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <p style={{ color: '#0F172A', fontSize: '14.5px', lineHeight: '1.6', fontWeight: '500' }}>
                Peak earning years are 46-55, where 42% of individuals earn above $50K — nearly 8x the rate of the 18-25 group.
              </p>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        .chart-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }
        .chart-grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 24px;
        }
        @media (max-width: 900px) {
          .chart-grid-2, .chart-grid-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

// Reusable inline styles
const statCardBase = {
  background: '#FFFFFF',
  border: '1px solid #E2E8F0',
  borderLeft: '4px solid',
  borderRadius: '16px',
  padding: '20px 24px',
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)'
};

const statIconBase = {
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const chartCardStyle = {
  background: '#FFFFFF',
  border: '1px solid #E2E8F0',
  borderRadius: '16px',
  padding: '28px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)'
};

const chartHeaderStyle = {
  marginBottom: '24px'
};

const chartTitleStyle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#0F172A',
  marginBottom: '4px'
};

const chartSubStyle = {
  fontSize: '14px',
  color: '#64748B'
};

const insightCardStyle = {
  background: '#FFFFFF',
  border: '1px solid #E2E8F0',
  borderLeft: '4px solid',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
};

export default AnalyticsPage;
