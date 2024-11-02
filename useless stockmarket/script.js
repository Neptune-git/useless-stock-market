// Initialize stock IDs and initial price
const stockIds = ["stock1-price", "stock2-price", "stock3-price", "stock4-price", "stock5-price"];
const initialPrice = 100;

// Initialize portfolio object to track bought stocks
let portfolio = {};

// Initialize stock prices in localStorage if not already set
stockIds.forEach(stockId => {
    if (!localStorage.getItem(stockId)) {
        localStorage.setItem(stockId, initialPrice);
    }
});

// Function to load stock prices from localStorage and update the display
function loadStockPrices() {
    stockIds.forEach(stockId => {
        const storedPrice = localStorage.getItem(stockId);
        const stockPriceElement = document.getElementById(stockId);

        if (stockPriceElement && storedPrice) {
            stockPriceElement.textContent = `$${storedPrice}`;
        }
    });
}

// Function to update stock prices randomly, store them in localStorage, and update the display
function updateStockPrices() {
    stockIds.forEach(stockId => {
        let currentPrice = parseInt(localStorage.getItem(stockId));
        let change = Math.random() > 0.5 ? 1 : -1;
        currentPrice += change;

        // Store updated price in localStorage
        localStorage.setItem(stockId, currentPrice);

        // Update the display
        const stockPriceElement = document.getElementById(stockId);
        if (stockPriceElement) {
            stockPriceElement.textContent = `$${currentPrice}`;
            stockPriceElement.classList.toggle("positive", change > 0);
            stockPriceElement.classList.toggle("negative", change < 0);
        }
    });
}

// Function to buy stock and update portfolio
function buyStock(stockName) {
    const stockId = stockIds.find(id => document.getElementById(id).textContent.includes(stockName));
    if (!stockId) return;

    // Get the current stock price
    const currentPrice = parseInt(localStorage.getItem(stockId));
    
    // Add to portfolio (in this example, we'll just increment the quantity)
    if (!portfolio[stockName]) {
        portfolio[stockName] = { quantity: 1, price: currentPrice };
    } else {
        portfolio[stockName].quantity += 1;
    }

    // Update portfolio display
    updatePortfolioDisplay();
}

// Function to update the portfolio display
function updatePortfolioDisplay() {
    const portfolioContainer = document.getElementById("portfolio-container");
    portfolioContainer.innerHTML = ""; // Clear existing items

    for (const stockName in portfolio) {
        const stockData = portfolio[stockName];
        const stockPrice = parseInt(localStorage.getItem(`${stockName.toLowerCase()}-price`)) || stockData.price;
        
        const portfolioItem = document.createElement("div");
        portfolioItem.className = "portfolio-item";
        portfolioItem.innerHTML = `
            <div>${stockName}</div>
            <div>Quantity: ${stockData.quantity}</div>
            <div>Price: $${stockPrice}</div>
        `;
        portfolioContainer.appendChild(portfolioItem);
    }
}

// Load prices when the page loads
loadStockPrices();

// Set up interval to update stock prices every second
setInterval(updateStockPrices, 1000);

// Reset button functionality to clear localStorage and reload the page
document.getElementById("reset-button").addEventListener("click", () => {
    localStorage.clear();
    portfolio = {}; // Clear the portfolio
    window.location.reload();
});
