let customerFilter = document.querySelector("#customerFilter");
let transactionFilter = document.querySelector("#transactionFilter");
let customerTableBody = document.querySelector("#customerTableBody");

let customers = [];
let transactions = [];
let mergedData = [];
let customerFiltered = [];

getCustomerTransactions();

async function getCustomerTransactions() {
  let customerResponce = await fetch("http://localhost:5000/customers");
  let transactionResponce = await fetch("http://localhost:5000/transactions");

  customers = await customerResponce.json();
  transactions = await transactionResponce.json();

  mergeData();
  displayCustomerTransactions();
}

function mergeData() {
  mergedData = transactions.map(function (item) {
    let customer = customers.find(function (cust) {
      return cust.id == item.customer_id;
    });
    return {
      ...item,
      customerName: customer ? customer.name : "Unknown",
    };
  });
}

function displayCustomerTransactions() {
  let customerVal = customerFilter.value.toLocaleLowerCase();

  let cartona = "";
  mergedData.forEach((element) => {
    if (element.customerName.toLocaleLowerCase().includes(customerVal)) {
      cartona += `
            <tr>
                <td>${element.customerName}</td>
                <td>${element.amount}</td>
                <td>${element.date}</td>
            </tr>`;
    }
  });
  customerTableBody.innerHTML = cartona;
}

function amountFilter() {
  let transactionVal = transactionFilter.value;

  customerFiltered = mergedData.filter(function (element) {
    return transactionVal == element.amount;
  });

  let cartona = "";
  customerFiltered.forEach((element) => {
    if (element.amount == transactionVal) {
      cartona += `
            <tr>
                <td>${element.customerName}</td>
                <td>${element.amount}</td>
                <td>${element.date}</td>
            </tr>`;
    }
  });
  customerTableBody.innerHTML = cartona;
}

customerFilter.addEventListener("input", displayCustomerTransactions);
customerFilter.addEventListener("blur", function () {
  customerFilter.value = "";
});

transactionFilter.addEventListener("input", amountFilter);
transactionFilter.addEventListener("blur", function () {
  transactionFilter.value = "";
});

