// To get Charts data
// https://stocksapi-uhe1.onrender.com/api/stocks/getstocksdata
// To get book value and profits
// https://stocksapi-uhe1.onrender.com/api/stocks/getstockstatsdata
// To get stock summary
// https://stocksapi-uhe1.onrender.com/api/stocks/getstocksprofiledata

// Variable to keep track of the chart instance
let stockChart;

// Function to fetch data for the chart
export async function fetchChartsFromApi(range, symbol) {
  try {
    const response = await fetch(
      "https://stocksapi-uhe1.onrender.com/api/stocks/getstocksdata"
    );
    const stockData = await response.json();

    let chartData = stockData.stocksData[0][symbol][range].value;
    let labels = stockData.stocksData[0][symbol][range].timeStamp;

    labels = labels.map((timestamp) =>
      new Date(timestamp * 1000).toLocaleDateString()
    );

    // Find the peak and low prices
    const maxPrice = Math.max(...chartData);
    const minPrice = Math.min(...chartData);

    const ctx = document.getElementById("chart").getContext("2d");

    // Destroy the previous chart instance if it exists
    if (stockChart) {
      stockChart.destroy();
    }

    // Create a new chart instance
    stockChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            // Dynamically update the label to include max and min prices
            label: `Stock Price (Max: $${maxPrice.toFixed(
              2
            )}, Min: $${minPrice.toFixed(2)})`,
            data: chartData,
            borderColor: "rgba(75, 192, 192, 1)",
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "Date",
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: "Price",
            },
          },
        },
        plugins: {
          tooltip: {
            mode: "nearest",
            intersect: false,
            callbacks: {
              title: function (context) {
                return "Date: " + context[0].label;
              },
              label: function (context) {
                return `${symbol}: $${context.raw.toFixed(2)}`;
              },
            },
          },
        },
        hover: {
          mode: "nearest",
          intersect: false,
        },
      },
    });

    fetchStockSummary(symbol);
    updateSummaryStockValue(symbol);
  } catch (error) {
    console.error(error);
  }
}

// Variable to keep track of the stock user wants to show and change it dynamically
export let stock = "AAPL";
// Initail load of chart data
fetchChartsFromApi("5y", stock);

// Function to fetch book value and profit to update the list
export async function fetchValueAndProfit(stockSymbol) {
  let bookValue;
  let profit;
  try {
    const request = await fetch(
      "https://stocksapi-uhe1.onrender.com/api/stocks/getstockstatsdata"
    );
    const stockData = await request.json();

    bookValue = stockData.stocksStatsData[0][stockSymbol].bookValue.toFixed(2);
    profit = stockData.stocksStatsData[0][stockSymbol].profit.toFixed(3);
  } catch (error) {
    console.log(error);
  }
  return { bookValue, profit };
}

// Function to update the stock values in the summary section
export async function updateSummaryStockValue(stockSymbol) {
  try {
    const { bookValue, profit } = await fetchValueAndProfit(stockSymbol);
    document.getElementById("stock-symbol").textContent = stockSymbol;
    document.getElementById("stock-value").textContent = `$${bookValue}`;
    const profitEl = document.getElementById("stock-profit");
    profitEl.textContent = `${profit}%`;

    if (profit > 0) {
      profitEl.style.color = "green";
    } else {
      profitEl.style.color = "red";
    }
  } catch (error) {
    console.log(error);
  }
}

// Function to fetch stock summary
async function fetchStockSummary(stockSymbol) {
  try {
    const request = await fetch(
      "https://stocksapi-uhe1.onrender.com/api/stocks/getstocksprofiledata"
    );
    const stockData = await request.json();
    document.getElementById("summary-text").textContent =
      stockData.stocksProfileData[0][stockSymbol].summary;
  } catch (error) {
    console.log(error);
  }
}
