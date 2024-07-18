// json-server --watch db.json --port 5000

document.addEventListener("DOMContentLoaded", () => {
  const customerFilterInput = document.getElementById("customerFilter");
  const transactionFilterInput = document.getElementById("transactionFilter");
  const customerTableBody = document.getElementById("customerTableBody");
  const transactionChartCtx = document.getElementById("transactionChart").getContext("2d");

  let customers = [];
  let transactions = [];
  let mergedData = [];
  let transactionChart;

  // Get Data From API
  async function fetchData() {
    try {
      const customersResponse = await fetch("http://localhost:5000/customers");
      const transactionsResponse = await fetch(
        "http://localhost:5000/transactions"
      );
      customers = await customersResponse.json();
      transactions = await transactionsResponse.json();
      mergeData();
      displayCustomers(mergedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Merge Data
  function mergeData() {
    mergedData = transactions.map((transaction) => {
      const customer = customers.find(
        (cust) => cust.id == transaction.customer_id
      );
      return {
        ...transaction,
        customerName: customer ? customer.name : "Unknown",
      };
    });
  }

  // Display Customers
  function displayCustomers(data) {
    console.log(data);
    customerTableBody.innerHTML = "";
    data.forEach((item) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${item.customerName}</td>
        <td>${item.amount}</td>
        <td>${item.date}</td>
      `;

      row.addEventListener("click", () => {
        displayChart(item.customer_id);
        let secOff = $("#transactionChart").offset().top;
        $("html").animate({ scrollTop: secOff }, 1000);
      });

      customerTableBody.appendChild(row);
    });
  }

  customerFilterInput.addEventListener("input", () => {
    const filterValue = customerFilterInput.value.toLowerCase();
    const filteredData = mergedData.filter((item) =>
      item.customerName.toLowerCase().includes(filterValue)
    );
    displayCustomers(filteredData);
  });

  transactionFilterInput.addEventListener("input", () => {
    const filterValue = transactionFilterInput.value;
    const filteredData = mergedData.filter(
      (item) => item.amount == filterValue
    );
    displayCustomers(filteredData);
  });

  // Chart JS
  function displayChart(customerId) {
    const customerTransactions = transactions.filter(
      (transaction) => transaction.customer_id === customerId
    );
    const transactionData = customerTransactions.reduce((acc, transaction) => {
      acc[transaction.date] = (acc[transaction.date] || 0) + transaction.amount;
      return acc;
    }, {});

    const labels = Object.keys(transactionData);
    const data = Object.values(transactionData);

    if (transactionChart) {
      transactionChart.destroy();
    }

    transactionChart = new Chart(transactionChartCtx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Total Transaction Amount per Day",
            data: data,
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            fill: false,
          },
        ],
      },
    });
  }

  fetchData();
});
