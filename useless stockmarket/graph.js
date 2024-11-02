// Function to initialize the stock graph
function initGraph(stockName) {
    const ctx = document.getElementById('stockGraph').getContext('2d');
    const initialPrice = parseInt(localStorage.getItem(`${stockName.toLowerCase()}-price`)) || 100; // Default to 100 if not set

    const data = {
        labels: Array.from({ length: 10 }, (_, i) => `T-${i}`), // Time labels for the graph
        datasets: [{
            label: `${stockName} Price`,
            data: Array(10).fill(initialPrice), // Placeholder data
            borderColor: 'green', // Default color to green
            borderWidth: 2, // Line width
            fill: false,
        }]
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: false, // Allow prices to go below zero
                title: {
                    display: true,
                    text: 'Price ($)',
                },
                ticks: {
                    stepSize: 3, // Increase the scale to 3
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Time',
                },
            }
        }
    };

    const chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options,
    });

    // Store current price in variable for reference
    let currentPrice = initialPrice;

    // Simulate price updates every second
    setInterval(() => {
        const fluctuation = Math.floor(Math.random() * 11) - 5; // Random fluctuation between -5 and +5
        const previousPrice = currentPrice; // Store previous price for color change logic
        currentPrice += fluctuation;

        // Ensure price does not drop below zero
        if (currentPrice < 0) {
            currentPrice = 0;
        }

        // Update local storage with new price
        localStorage.setItem(`${stockName.toLowerCase()}-price`, currentPrice);

        // Update graph data
        data.datasets[0].data.shift(); // Remove the first data point
        data.datasets[0].data.push(currentPrice); // Add new price to the end
        
        // Change line color based on price movement
        if (currentPrice > previousPrice) {
            data.datasets[0].borderColor = 'green'; // Set line to green if price increased
        } else if (currentPrice < previousPrice) {
            data.datasets[0].borderColor = 'red'; // Set line to red if price decreased
        }

        chart.update(); // Update the chart to reflect new data
    }, 1000); // Update every second
}

// Load the graph when the page is ready
document.addEventListener("DOMContentLoaded", () => {
    const stockName = document.querySelector('h1.header-title').textContent; // Get stock name from header
    initGraph(stockName); // Initialize the graph
});
