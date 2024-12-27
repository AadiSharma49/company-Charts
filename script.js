// Fetch and parse data from the CSV file
async function fetchData() {
    const response = await fetch("https://raw.githubusercontent.com/shaktids/stock_app_test/refs/heads/main/dump.csv");
    const data = await response.text();
    const rows = data.split("\n").slice(1); // Skip header row
    const companies = {};
  
    rows.forEach(row => {
      const [name, date, value] = row.split(",");
      if (!companies[name]) {
        companies[name] = [];
      }
      companies[name].push({ date, value: parseFloat(value) });
    });
  
    return companies;
  }
  
  // Populate sidebar with company names
  async function populateCompanies() {
    const companies = await fetchData();
    const companyList = document.getElementById("company-list");
  
    Object.keys(companies).forEach(company => {
      const li = document.createElement("li");
      li.textContent = company;
      li.addEventListener("click", () => displayChart(company, companies[company]));
      companyList.appendChild(li);
    });
  }
  
  // Display chart for selected company
  function displayChart(company, data) {
    const ctx = document.getElementById("company-chart").getContext("2d");
    const dates = data.map(entry => entry.date);
    const values = data.map(entry => entry.value);
  
    // Destroy existing chart instance
    if (window.myChart) {
      window.myChart.destroy();
    }
  
    // Create a new chart
    window.myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: `${company} Stock Prices`,
            data: values,
            borderColor: "#3498db",
            backgroundColor: "rgba(52, 152, 219, 0.2)",
            fill: true,
            tension: 0.4, // Smooth lines
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: "Date",
              color: "#333"
            },
            grid: {
              color: "#ddd"
            }
          },
          y: {
            title: {
              display: true,
              text: "Stock Price",
              color: "#333"
            },
            grid: {
              color: "#ddd"
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: "#333"
            }
          }
        }
      }
    });
  }
  
  // Initialize the application
  populateCompanies();
  