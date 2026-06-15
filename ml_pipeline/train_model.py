import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score, classification_report
import joblib
import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = ROOT / "backend" / "data" / "adult 3.csv"
MODEL_PATH = ROOT / "ml_pipeline" / "best_model.pkl"
METRICS_PATH = ROOT / "ml_pipeline" / "model_metrics.json"

def main():
    if not DATA_PATH.exists():
        print(f"Error: {DATA_PATH} not found.")
        return

    print("Loading data...")
    df = pd.read_csv(DATA_PATH)
    df.columns = df.columns.str.strip()
    df = df.dropna()
    df['income'] = df['income'].str.strip()

    # Drop fnlwgt — census sampling weight, not a real feature
    df = df.drop(columns=['fnlwgt'], errors='ignore')

    X = df.drop("income", axis=1)
    y = df["income"]

    categorical_cols = [
        'workclass', 'education', 'marital-status', 'occupation',
        'relationship', 'race', 'gender', 'native-country'
    ]
    numerical_cols = [
        'age', 'educational-num', 'capital-gain',
        'capital-loss', 'hours-per-week'
    ]

    preprocessor = ColumnTransformer(transformers=[
        ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_cols),
        ('num', StandardScaler(), numerical_cols)
    ])

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y  # stratify preserves class ratio
    )

    models = {
        "RandomForest": RandomForestClassifier(
            n_estimators=200,
            class_weight='balanced',  # handles class imbalance
            random_state=42,
            n_jobs=-1
        ),
        "GradientBoosting": GradientBoostingClassifier(
            n_estimators=200,
            random_state=42
        ),
        "LogisticRegression": LogisticRegression(
            max_iter=1000,
            class_weight='balanced',
            random_state=42
        ),
        "KNN": KNeighborsClassifier(n_jobs=-1),
    }

    results = {}
    pipelines = {}
    all_metrics = {}

    print("Training models...")
    for name, clf in models.items():
        print(f"\nTraining {name}...")
        pipe = Pipeline([
            ('preprocessor', preprocessor),
            ('classifier', clf)
        ])
        pipe.fit(X_train, y_train)
        y_pred = pipe.predict(X_test)
        y_proba = pipe.predict_proba(X_test)[:, 1] if hasattr(clf, 'predict_proba') else None

        acc = accuracy_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred, pos_label='>50K')
        auc = roc_auc_score(y_test, y_proba) if y_proba is not None else None

        results[name] = f1  # rank by F1, not accuracy
        pipelines[name] = pipe
        all_metrics[name] = {
            "accuracy": round(acc, 4),
            "f1_score": round(f1, 4),
            "roc_auc": round(auc, 4) if auc else None,
        }

        print(f"  Accuracy : {acc:.4f}")
        print(f"  F1 Score : {f1:.4f}")
        if auc:
            print(f"  ROC-AUC  : {auc:.4f}")
        print(classification_report(y_test, y_pred))

    best_model_name = max(results, key=results.get)
    best_pipeline = pipelines[best_model_name]

    joblib.dump(best_pipeline, MODEL_PATH)

    # Save metrics so Flask API can serve them
    metrics_output = {
        "best_model": best_model_name,
        "all_models": all_metrics,
        "best_metrics": all_metrics[best_model_name]
    }
    with open(METRICS_PATH, 'w') as f:
        json.dump(metrics_output, f, indent=2)

    print(f"\n✅ Best Model: {best_model_name}")
    print(f"   F1: {all_metrics[best_model_name]['f1_score']} | AUC: {all_metrics[best_model_name]['roc_auc']}")
    print(f"   Saved to {MODEL_PATH}")
    print(f"   Metrics saved to {METRICS_PATH}")

if __name__ == "__main__":
    main()