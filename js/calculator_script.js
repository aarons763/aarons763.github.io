/*script.js for calculator project */
//operator functions
function add(num1, num2) {
    return num1 + num2;
}

function subtract(num1, num2) {
    return num1 - num2;
}

function multiply(num1, num2) {
    return num1 * num2;
}

function divide(num1, num2) {
    return num1 / num2;
}

let num1 = null;
let num2 = null;
let operator = null;
let answer;
let newNum = false;

//operate function
function operate(num1, num2, operator) {
    if (operator === "+") {
        return add(num1, num2);
    }
    else if (operator === "-") {
        return subtract(num1, num2);
    }
    else if (operator === "*") {
        return multiply(num1, num2);
    }
    else if (operator === "/") {
        return divide(num1, num2);
    }
}

//number buttons
const numbers = document.querySelectorAll(".number");
const current = document.querySelector(".current");
numbers.forEach((number) => {
    number.addEventListener("click", () => {
        if (newNum === false) {
            current.innerText = number.innerText;
            newNum = true;
        } else if (current.innerText.length === 7) {
        }
        else {
            current.innerText += number.innerText;
        }
    });
});

const zero = document.querySelector(".zero");
zero.addEventListener("click", () => {
    if ((Number(current.innerText) !== 0 || current.innerText.includes(".")) && current.innerText.length < 7 && newNum === true) {
        current.innerText += zero.innerText;
    }
    else if (newNum === false) {
        current.innerText = zero.innerText;
        newNum = true;
    }
});

//operator buttons
const operators = document.querySelectorAll(".operator");
operators.forEach((op) => {
    op.addEventListener("click", () => {
        if (num1 === null) {
            num1 = Number(current.innerText);
            newNum = false;
            operator = op.innerText;
        }
        else if (newNum === true) {
            num2 = Number(current.innerText);
            answer = operate(num1, num2, operator);
            current.innerText = answer;
            num1 = answer;
            newNum = false;
        }
    })
})

//equal button
const equals = document.querySelector(".equals");
equals.addEventListener("click", () => {
    if (num1 !== null) {
        num2 = Number(current.innerText);
        answer = operate(num1, num2, operator);

        let answerStr = answer.toString();

        if (Math.abs(answer) >= 1e7 || Math.abs(answer) < 1e-6) {
            // Use scientific notation if too large or too small
            current.innerText = answer.toExponential(2);
        } else if (answerStr.includes(".")) {
            // Limit total length to 7 including decimal point
            let [intPart, decPart] = answerStr.split(".");
            let maxDecimals = Math.max(0, 6 - intPart.length); // Ensure total length is at most 7
            current.innerText = Number(answer).toFixed(maxDecimals);
        } else {
            // No decimal, just ensure it's not too long
            current.innerText = answer.toString().slice(0, 7);
        }

        num1 = null;
    }
});

//decimal button
const decimal = document.querySelector(".decimal");
decimal.addEventListener("click", () => {
    if (current.innerText.includes(".") === false && current.innerText.length <= 6) {
        current.innerText += ".";
    }
})

//delete button
const deleter = document.querySelector(".delete");
deleter.addEventListener("click", () => {
    if (current.innerText.length > 1) {
        current.innerText = current.innerText.slice(0, -1);
    }
    else {
        current.innerText = 0;
        newNum = false;
    }
})

//clear button
const clear = document.querySelector(".clear");
clear.addEventListener("click", () => {
    num1 = null;
    num2 = null;
    operator = null;
    answer = null;
    current.innerText = 0;
    newNum = false;
})

const posneg = document.querySelector(".posneg");
posneg.addEventListener("click", () => {
    if (current.innerText.includes("-")) {
        current.innerText = current.innerText.replace("-", "");
    }
    else if (current.innerText !== "0") {
        current.innerText = "-" + current.innerText;
    }
})