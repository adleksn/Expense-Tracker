//  1. Добавление операции ✅
//  2. Удалении операции ✅
//  3. Фильтр по категории ✅
//  4. Подсчет общей суммы через reduce ✅
//  5. Сохранение в localStorage ✅
"use strict";

let operations = [];
loadOperations();

let nameOperations = document.getElementById("name");
let amountOperations = document.getElementById("amount");
let categoryOperations = document.getElementById("category");
let typeIncomeOperations = document.getElementById("income");
let typeExpenseOperations = document.getElementById("expense");
let dateOperations = document.getElementById("date");
let addButtonOperation = document.getElementById("add-button");

let tbodyOperations = document.getElementById("operations-tbody");
let filterOperations = document.getElementById("filter-type");
let filterCategory = document.getElementById("filter-category");
let filterDate = document.getElementById("filter-date");

function renderOperations(operationsToRender) {
  tbodyOperations.replaceChildren();

  let itemsForRender;

  if (operationsToRender !== undefined) {
    itemsForRender = operationsToRender;
  } else {
    itemsForRender = operations;
  }

  if (itemsForRender.length === 0) {
    let row = document.createElement("tr");
    let cell = document.createElement("td");

    cell.colSpan = 6;
    cell.textContent = "Нет операций";
    row.appendChild(cell);

    tbodyOperations.appendChild(row);
    return;
  }

  for (let i = 0; i < itemsForRender.length; i++) {
    let line = document.createElement("tr");
    let name = document.createElement("td");
    let amount = document.createElement("td");
    let category = document.createElement("td");
    let type = document.createElement("td");
    let date = document.createElement("td");
    let remove = document.createElement("td");
    let deleteBtn = document.createElement("button");

    deleteBtn.classList.add("action-btn", "action-btn--delete");
    deleteBtn.textContent = "Удалить";
    deleteBtn.dataset.id = itemsForRender[i].id;
    deleteBtn.addEventListener("click", function (event) {
      deleteOperations(event.target.dataset.id);
    });

    const categoryNames = {
      products: "Продукты",
      cafe: "Кафе и Рестораны",
      transport: "Транспорт",
      fuel: "Топливо",
    };

    name.textContent = itemsForRender[i].name;
    category.textContent = categoryNames[itemsForRender[i].category];
    amount.textContent = itemsForRender[i].amount;
    type.textContent = itemsForRender[i].type;
    date.textContent = itemsForRender[i].date;
    remove.appendChild(deleteBtn);

    if (itemsForRender[i].type === "income") {
      type.textContent = "Доход";
      type.classList.add("amount-income");
    } else {
      type.textContent = "Расход";
      type.classList.add("amount-expense");
    }

    line.appendChild(name);
    line.appendChild(category);
    line.appendChild(amount);
    line.appendChild(type);
    line.appendChild(date);
    line.appendChild(remove);

    tbodyOperations.appendChild(line);
  }
}
renderOperations();

addButtonOperation.addEventListener("click", addNewOperations);

function addNewOperations() {
  let name = nameOperations.value;
  let category = categoryOperations.value;
  let amount = Number(amountOperations.value);
  let type;
  let date = dateOperations.value;

  name = name.trim();

  if (name.length === 0) {
    return console.error("Введите название");
  }

  if (category === "") {
    return console.error("Выберете ктегорию");
  }

  if (amount === isNaN(amount)) {
    return console.error("Введите число");
  }

  if (amount <= 0) {
    return console.error("Введите значение больше 0");
  }

  if (date === "") {
    return console.error("Введите дату");
  }

  if (typeIncomeOperations.checked === true) {
    type = typeIncomeOperations.value;
  } else {
    type = typeExpenseOperations.value;
  }

  let linesOperations = {
    name,
    amount,
    category,
    type,
    date,
    id: Date.now(),
  };

  operations.push(linesOperations);

  renderOperations();
  updateBalance();
  saveOperations();
}

function deleteOperations(id) {
  let idDelete = Number(id);
  operations = operations.filter((op) => {
    return op.id !== idDelete;
  });
  renderOperations();
  updateBalance();
  saveOperations();
}

function updateBalance() {
  let incomeFilter = operations.filter((op) => op.type === "income");
  let expenseFilter = operations.filter((op) => op.type === "expense");

  let incomeOperations = incomeFilter.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.amount;
  }, 0);

  let expenseOperations = expenseFilter.reduce(
    (expenseAccumulator, expenseCurrtValue) => {
      return expenseAccumulator + expenseCurrtValue.amount;
    },
    0,
  );

  let balanceOperations = incomeOperations - expenseOperations;

  let balanceElement = document.querySelector(".balance-amount__text.balance");
  let incomeElement = document.querySelector(".balance-amount__text.income");
  let expenseElement = document.querySelector(".balance-amount__text.expenses");

  balanceElement.textContent = balanceOperations.toLocaleString() + " P";
  incomeElement.textContent = incomeOperations.toLocaleString() + " P";
  expenseElement.textContent = expenseOperations.toLocaleString() + " P";
}

function saveOperations() {
  let operations__save = JSON.stringify(operations);
  localStorage.setItem("operations", operations__save);
}

function loadOperations() {
  let load = localStorage.getItem("operations");
  if (load !== null) {
    load = JSON.parse(load);
    operations = load;
  }
  updateBalance();
}

function applyFilters() {
  let category = filterCategory.value;
  let date = filterDate.value;
  let operationsFilter = filterOperations.value;
  let copyOperations = [...operations];

  if (category !== "all") {
    copyOperations = copyOperations.filter((op) => op.category === category);
  }

  if (date !== "") {
    copyOperations = copyOperations.filter((op) => op.date === date);
  }

  if (operationsFilter !== "all") {
    copyOperations = copyOperations.filter((op) => op.type === operationsFilter);
  }

  renderOperations(copyOperations);
}

filterCategory.addEventListener("change", applyFilters);
filterDate.addEventListener("change", applyFilters);
filterOperations.addEventListener("change", applyFilters);
