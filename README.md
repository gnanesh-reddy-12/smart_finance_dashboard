# Smart Income Predictor

A state-of-the-art machine learning web application that predicts whether an individual earns more than $50K per year or less, based on their demographic profile (Adult Census dataset). 

Built with **React (Vite)** for the frontend and **Flask** for the backend API, utilizing **Scikit-Learn** for the Machine Learning pipeline.

## Project Structure

```text
smart finance/
├── adult 3.csv          # The raw Adult Census Dataset
├── backend/             # Flask API backend
│   ├── app.py           # Core backend handling prediction API
│   └── requirements.txt # Python dependencies
├── frontend/            # React + Vite frontend
│   └── src/
│       ├── pages/       # Modern Dashboard UI (Home, Predictor, Analytics)
│       └── App.jsx      # Main React application with Toast alerts
└── ml_pipeline/         # Machine learning training scripts
    └── train_model.py   # Script to train Random Forest and save best_model.pkl
```

## Setup Instructions

### 1. Train the Machine Learning Model
Before starting the servers, you must train the model using the provided CSV dataset.
```bash
pip install -r backend/requirements.txt
python ml_pipeline/train_model.py
```
This will read `adult 3.csv`, train multiple classifiers, and output a `best_model.pkl` file in the `ml_pipeline` directory.

### 2. Start the Backend API (Flask)
```bash
python backend/app.py
```
This starts the local server on `http://127.0.0.1:5000` which hosts the `/api/predict_income` endpoint.

### 3. Start the Frontend (React)
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open your browser to `http://localhost:5173` to view the modern dashboard!
