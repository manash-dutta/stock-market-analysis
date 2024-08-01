import { fetchChartsFromApi, fetchValueAndProfit, stock } from "./fetch.js";

// Function to render stock list
async function renderList() {
  const companies = [
    "AAPL",
    "MSFT",
    "GOOGL",
    "AMZN",
    "PYPL",
    "TSLA",
    "JPM",
    "NVDA",
    "NFLX",
    "DIS",
  ];

  const stockListEl = document.getElementById("stock-list");

  for (const company of companies) {
    // Get the bookValue and profit from API for each stock
    const { bookValue, profit } = await fetchValueAndProfit(company);
    // Create div for adding stock to the list
    const divEl = document.createElement("div");
    divEl.classList.add("stock-item");
    // Create button to add company symbol
    const btn = document.createElement("button");
    btn.textContent = company;
    // Add span to show profit percent
    const profitEl = document.createElement("span");
    profitEl.classList.add("stock-profit");
    profitEl.textContent = `${profit}%`;
    // Checking for profit/loss and changing the color of the text
    if (profit > 0) {
      profitEl.style.color = "green";
    } else {
      profitEl.style.color = "red";
    }
    // Add span to show book value
    const bookValueEl = document.createElement("span");
    bookValueEl.classList.add("stock-value");
    bookValueEl.textContent = `$${bookValue}`;
    // Append the new elements to the DOM
    divEl.append(btn, profitEl, bookValueEl);
    stockListEl.appendChild(divEl);
    // Adding click enent on the btn elements to change the content dynamically
    btn.addEventListener("click", () => fetchChartsFromApi("5y", company));
  }
}

renderList();

// Event Listeners for the Timeframe buttons on the Canvas.
document
  .getElementById("btn-1month")
  .addEventListener("click", () => fetchChartsFromApi("1mo", stock));
document
  .getElementById("btn-3months")
  .addEventListener("click", () => fetchChartsFromApi("3mo", stock));
document
  .getElementById("btn-1year")
  .addEventListener("click", () => fetchChartsFromApi("1y", stock));
document
  .getElementById("btn-5years")
  .addEventListener("click", () => fetchChartsFromApi("5y", stock));
