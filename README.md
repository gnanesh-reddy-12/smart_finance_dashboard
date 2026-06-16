# Smart Finance Dashboard
**Live Demo:** [smart-finance-dashboard-seven.vercel.app](https://smart-finance-dashboard-seven.vercel.app/)

A full-stack machine learning application that predicts whether an individual's annual income exceeds $50K based on census demographic data.

## 🛠 Tech Stack
* **Frontend:** React, Vite, Chart.js
* **Backend:** Python, Flask, Flask-Limiter
* **ML Pipeline:** Scikit-Learn, XGBoost, Pandas
* **Deployment:** Vercel

## 📊 Model Performance
Trained on 48,842 records. Evaluated using Stratified K-Fold and optimized for F1-Score to handle class imbalance.

| Model | Accuracy | F1-Score | ROC-AUC |
|---|---|---|---|
| **GradientBoosting** (Active) | 87.5% | 71.3% | 92.8% |
| XGBoost | 87.5% | 71.1% | 92.9% |
| RandomForest | 81.5% | 69.2% | 91.7% |

## 🚀 Local Setup

**1. Train the ML Model**
```bash
pip install -r backend/requirements.txt
python ml_pipeline/train_model.py
```
*(Generates the serialized `best_model.pkl` and `model_metrics.json`)*

**2. Start the API (Terminal 1)**
```bash
python backend/app.py
```
*(Runs on localhost:5000)*

**3. Start the UI (Terminal 2)**
```bash
cd frontend
npm install
npm run dev
```
*(Runs on localhost:5173)*
