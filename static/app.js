const form = document.getElementById("finance-form");
const errorEl = document.getElementById("error");
const resultsEl = document.getElementById("results");
let chart;

const inr = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

function getPayload() {
  return {
    income: Number(document.getElementById("income").value || 0),
    rent: Number(document.getElementById("rent").value || 0),
    food: Number(document.getElementById("food").value || 0),
    transport: Number(document.getElementById("transport").value || 0),
    subscriptions: Number(document.getElementById("subscriptions").value || 0),
    shopping: Number(document.getElementById("shopping").value || 0),
    others: Number(document.getElementById("others").value || 0),
  };
}

function renderChart(labels, data) {
  const ctx = document.getElementById("expenseChart");
  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            "#2F6DF6",
            "#00A3A3",
            "#9C6ADE",
            "#F29900",
            "#E24E9D",
            "#5F6F82",
          ],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
}

function scoreLabel(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs Attention";
  return "Critical";
}

function renderResult(data) {
  document.getElementById("incomeOut").textContent = inr(data.income);
  document.getElementById("expensesOut").textContent = inr(data.total_expenses);
  document.getElementById("savingsOut").textContent = inr(data.savings);
  document.getElementById("savingsRateOut").textContent = `${data.savings_rate}%`;

  const badge = document.getElementById("scoreBadge");
  badge.textContent = `${data.health_score} / 100`;

  const status = document.getElementById("statusOut");
  status.textContent = `Status: ${scoreLabel(data.health_score)}`;

  const list = document.getElementById("suggestions");
  list.innerHTML = "";
  data.suggestions.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });

  renderChart(
    data.breakdown.map((x) => x.label),
    data.breakdown.map((x) => x.amount)
  );

  resultsEl.classList.remove("hidden");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorEl.textContent = "";

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(getPayload()),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to analyze finances.");
    }

    renderResult(data);
  } catch (error) {
    resultsEl.classList.add("hidden");
    errorEl.textContent = error.message;
  }
});
