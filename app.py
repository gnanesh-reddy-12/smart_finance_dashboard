from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

CATEGORIES = [
    ("rent", "Rent"),
    ("food", "Food"),
    ("transport", "Transport"),
    ("subscriptions", "Subscriptions"),
    ("shopping", "Shopping"),
    ("others", "Others"),
]


def _safe_percent(amount: float, income: float) -> float:
    if income <= 0:
        return 0.0
    return round((amount / income) * 100, 2)


def _financial_status(score: int) -> str:
    if score >= 85:
        return "Excellent"
    if score >= 70:
        return "Good"
    if score >= 50:
        return "Needs Attention"
    return "Critical"


def analyze_finances(income: float, expenses: dict) -> dict:
    total_expenses = round(sum(expenses.values()), 2)
    savings = round(income - total_expenses, 2)
    savings_rate = _safe_percent(savings, income)

    score = 0
    if income > 0 and savings >= 0.2 * income:
        score += 30
    elif savings >= 0:
        score += 15

    if income > 0 and expenses["rent"] <= 0.4 * income:
        score += 25
    else:
        score -= 10

    if income > 0 and expenses["food"] <= 0.3 * income:
        score += 25
    else:
        score -= 10

    if income > 0 and expenses["shopping"] <= 0.15 * income:
        score += 20
    else:
        score -= 10

    score = max(0, min(100, score))
    suggestions = []

    if income <= 0:
        suggestions.append("Add a valid monthly income to get accurate recommendations.")
    if savings < 0:
        suggestions.append("You are overspending. Reduce non-essential categories immediately.")
    elif savings_rate < 20:
        suggestions.append("Target at least 20% savings by trimming subscriptions or shopping.")
    else:
        suggestions.append("Great savings discipline. Keep your emergency fund growing.")

    if _safe_percent(expenses["rent"], income) > 40:
        suggestions.append("Rent is high (>40% of income). Consider shared housing or renegotiation.")
    if _safe_percent(expenses["food"], income) > 30:
        suggestions.append("Food spending is elevated. Weekly meal planning can help lower costs.")
    if _safe_percent(expenses["shopping"], income) > 15:
        suggestions.append("Shopping is above healthy range. Set a fixed monthly shopping cap.")
    if _safe_percent(expenses["subscriptions"], income) > 10:
        suggestions.append("Review subscriptions and cancel services you barely use.")

    breakdown = []
    for key, label in CATEGORIES:
        amount = round(expenses[key], 2)
        breakdown.append(
            {
                "key": key,
                "label": label,
                "amount": amount,
                "percent_of_income": _safe_percent(amount, income),
            }
        )

    return {
        "income": round(income, 2),
        "total_expenses": total_expenses,
        "savings": savings,
        "savings_rate": savings_rate,
        "health_score": score,
        "status": _financial_status(score),
        "breakdown": breakdown,
        "suggestions": suggestions,
    }


@app.get("/")
def home():
    return render_template("index.html")


@app.post("/api/analyze")
def analyze():
    payload = request.get_json(silent=True) or {}
    income = float(payload.get("income", 0) or 0)
    if income < 0:
        return jsonify({"error": "Income cannot be negative."}), 400

    expenses = {}
    for key, _ in CATEGORIES:
        value = float(payload.get(key, 0) or 0)
        if value < 0:
            return jsonify({"error": f"{key.title()} cannot be negative."}), 400
        expenses[key] = value

    return jsonify(analyze_finances(income, expenses))


if __name__ == "__main__":
    app.run(debug=True)
