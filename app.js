// Budget Calculator Code, there is an expense and budget class, along with a store and UI class.
// The store class manages localStorage and the UI manages updating the UI. At the bottom are the form functions to
// handle form inputs/submissions.

class Expense {
    constructor(amount, name) {
        this.amount = amount;
        this.name = name;
    }
}

class Budget {
    constructor(amount) {
        this.amount = amount;
    }
}

// UI Class to handle showing the budget and expenses to the user, along with alerts and updating info.
class UI {
    // get displayBudget from Store and add it
    static displayBudget() {
        let budget = Store.getBudget()

        if (budget !== undefined) {
            UI.addBudget(budget);
        }
    }

    // Loop through all expenses fetched from Store and add them via calling another function.
    static displayExpenses() {
        let expenses = Store.getExpenses();
        expenses.forEach(expense => {
            UI.addExpense(expense)
        });

    }

    // Take in budget object and insert into HTML code
    static addBudget(budget) {
        let list = document.querySelector("#row-budget");
        // Manipulating DOM to update budget
        list.firstElementChild.nextElementSibling.firstElementChild.textContent = `+$${budget.amount}`;
    }

    // Take in an expense object, make an HTML template and insert it
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

    // Shows alerts at top of screen that fade after 3 seconds. Content and alert type are passed in.
    static showAlert(message, color) {
        ohSnapX()
        ohSnap(message, {color: color, 'duration': '2500'});
    }

    // Calculate the total (budget - expenses) and update it in the DOM
    static displayResult() {
        let total = 0;
        let budget = Store.getBudget()
        if (budget !== undefined) {
            total = budget.amount;
        }
        let expenses = Store.getExpenses();
        expenses.forEach(expense => {
            total -= expense.amount;
            total = parseInt(total)
            console.log(total)
        });

        if (total >= 0) {
            document.querySelector("#total").textContent = `Total: +$${total}`;
        }
        else if (total < 0) {
            total = Math.abs(total);  // Absolute value so we can move the minus symbol out of the way
            document.querySelector("#total").textContent = `Total: -$${total}`;
        }

    }
}

// Store class sends/receives objects and takes them out or puts them into localStorage
class Store {
    // Creates undefined budget if there is none, and returns the budget object
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

    // put budget object into the localStorage
    static addBudget(budget) {
        localStorage.setItem('budget', JSON.stringify(budget));

    }

    // return list of expense objects (list empty if none)
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

    // gets expenses, loops through and removes from list, then stores back into localStorage
    static removeExpense(name) {
        const expenses = Store.getExpenses();

        expenses.forEach((expense, index) => {
            if (expense.name === name) {
                expenses.splice(index, 1);
            }
        });

        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    // gets expenses, adds expense and puts it back into localStorage
    static addExpense(expense) {
        const expenses = Store.getExpenses();
        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }
}

// Clear all input in the forms and set to ""
function clearInput () {
    document.querySelector("#budget-input").value = "";
    document.querySelector("#expense-input").value = "";
    document.querySelector("#expense-name-input").value = "";
}

// On load set up UI
document.addEventListener("DOMContentLoaded", UI.displayBudget);
document.addEventListener("DOMContentLoaded", UI.displayExpenses);
document.addEventListener("DOMContentLoaded", UI.displayResult);

// updates budget from form input
document.querySelector("#form-budget").addEventListener("submit", (e) => {
    e.preventDefault();
    const amount = document.querySelector("#budget-input").value;
    const budget = new Budget(amount);

    UI.addBudget(budget);
    Store.addBudget(budget);
    UI.displayResult();
    clearInput();

    UI.showAlert("Budget added", "green");
})

// Validates input and adds expense from form submission
document.querySelector("#form-expense").addEventListener("submit", (e) => {
    e.preventDefault();

    const amount = document.querySelector("#expense-input").value;
    const name = document.querySelector("#expense-name-input").value;

    // Check if expense already is named the same as existing expense
    let expenses = Store.getExpenses();
    let errorBool = false
    expenses.forEach(expense => {
        if (expense.name === name) {
            UI.showAlert("Expense must have different name", "red");
            errorBool = true
        }
    });

    // Passed, is valid input
    if (errorBool === false) {
        const expense = new Expense(amount, name);

        UI.addExpense(expense);
        Store.addExpense(expense);
        UI.displayResult();
        clearInput();

        UI.showAlert("Expense added", "green");
    }
})

// Check for deletion, if the target is the delete button, then delete that expense
document.querySelector("#content-right").firstElementChild.addEventListener('click', (e) => {
    if (e.target.className === "btn btn-danger btn-sm") {
        e.target.parentNode.parentNode.remove();
        // Traverse DOM to get the name of the expense (needed as input to Store.removeExpense)
        let expenseName = e.target.parentNode.parentNode.firstElementChild.firstElementChild.textContent;

        Store.removeExpense(expenseName);
        UI.displayResult();

        UI.showAlert("Removed Expense", "green");
    }
});