// Expense Class

class Expense {
    constructor(amount, name) {
        this.amount = amount;
        this.name = name;
    }
}
// Budget Class (just 1 thing)
class Budget {
    constructor(amount) {
        this.amount = amount;
    }
}

// UI Class
class UI {
    static displayBudget() {
        let budget = Store.getBudget()

        if (budget !== undefined) {
            UI.addBudget(budget);
        }
    }

    static displayExpenses() {
        let expenses = Store.getExpenses();
        expenses.forEach(expense => {
            UI.addExpense(expense)
        });

    }

    static addBudget(budget) {
        let list = document.querySelector("#row-budget");
        list.firstElementChild.nextElementSibling.firstElementChild.textContent = `+$${budget.amount}`;
    }

    static addExpense(expense) {
        let list = document.querySelector("#row-budget").parentNode;
        const budgetRow = document.createElement('div');
        budgetRow.className = "row";
        budgetRow.innerHTML = `
        <div class="col">
            <h6>${expense.name}</h6>
        </div>
        <div class="col">
            <h6>-$${expense.amount}</h6>
        </div>
        <div class="col">
            <button type="submit" class="btn btn-danger btn-sm">Delete</button>
        </div>
        `
        list.appendChild(budgetRow);

    }

    static showAlert(message, alertType) {
        const div = document.createElement('div')
        div.className = `alert alert-${alertType}`;
        div.appendChild(document.createTextNode(message));
        const warningBox = document.querySelector("#warning-box");
        warningBox.appendChild(div);
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static displayResult() {
        let total = 0;
        let budget = Store.getBudget()
        if (budget !== undefined) {
            total += budget.amount;
            let expenses = Store.getExpenses();
            expenses.forEach(expense => {
                total -= expense.amount;
            });

            if (total >= 0) {
                document.querySelector("#total").textContent = `Total: +$${total}`;

            } else if (total < 0) {
                total = Math.abs(total);
                document.querySelector("#total").textContent = `Total: -$${total}`;

            }

        }


    }
}

class Store {
    static getBudget() {
        let budget;
        if (localStorage.getItem('budget') === null) {
            budget = undefined;
        }
        else {
            budget = JSON.parse(localStorage.getItem('budget'));
        }
        return budget;
    }

    static addBudget(budget) {
        localStorage.setItem('budget', JSON.stringify(budget));

    }

    static getExpenses() {
        let expenses;
        if (localStorage.getItem('expenses') === null) {
            expenses = [];
        }
        else {
            expenses = JSON.parse(localStorage.getItem('expenses'));
        }
        return expenses;
    }

    static removeExpense(name) {
        const expenses = Store.getExpenses();

        expenses.forEach((expense, index) => {
            if (expense.name === name) {
                expenses.splice(index, 1);
            }
        });

        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    static addExpense(expense) {
        const expenses = Store.getExpenses();
        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }


}

function clearInput () {
    document.querySelector("#budget-input").value = "";
    document.querySelector("#expense-input").value = "";
    document.querySelector("#expense-name-input").value = "";
}

document.addEventListener("DOMContentLoaded", UI.displayBudget);
document.addEventListener("DOMContentLoaded", UI.displayExpenses);
document.addEventListener("DOMContentLoaded", UI.displayResult);

document.querySelector("#form-budget").addEventListener("submit", (e) => {
    e.preventDefault();
    const amount = document.querySelector("#budget-input").value;

    const budget = new Budget(amount);

    UI.addBudget(budget);


    Store.addBudget(budget);

    UI.displayResult();

    clearInput();
    UI.showAlert("Budget added", "success");

})

document.querySelector("#form-expense").addEventListener("submit", (e) => {
    e.preventDefault();

    const amount = document.querySelector("#expense-input").value;
    const name = document.querySelector("#expense-name-input").value;

    let expenses = Store.getExpenses();
    let errorBool = false
    expenses.forEach(expense => {
        if (expense.name === name) {
            UI.showAlert("Expense must have different name", "danger");
            errorBool = true
        }
    });
    if (errorBool === false) {
        const expense = new Expense(amount, name);

        UI.addExpense(expense);


        Store.addExpense(expense);

        UI.displayResult();

        clearInput();
        UI.showAlert("Expense added", "success");
    }


})


document.querySelector("#content-right").firstElementChild.addEventListener('click', (e) => {
    if (e.target.className === "btn btn-danger btn-sm") {
        e.target.parentNode.parentNode.remove();
        let expenseName = e.target.parentNode.parentNode.firstElementChild.firstElementChild.textContent;
        Store.removeExpense(expenseName);
        UI.displayResult();
        UI.showAlert("Removed Expense", "success");

    }

});


// const ex_expense = new Expense(500, "Food");
// const ex_budget = new Budget(1000);
// UI.addBudget(ex_budget);
// UI.addExpense(ex_expense);

// displayResult (displays expenses + budget) by calling localStorage
// addBudget (if there is already a budget just replace it)
// addExpense
// deleteExpense
// deleteBudget (optional)
// showAlert (for form validation and also success)

// Store Class (localStorage)
// getResult load results from local storage
// addResult (save expense or budget into localStorage)
// removeResult (remove expense or budget)

// Events
// Display result
// Add result
// Remove result

