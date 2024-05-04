function operate(exp) {
    let result,
        num1 = +exp.num1,
        num2 = +exp.num2;
    switch (exp.operator) {
        case `+`:
            result = add(num1, num2);
            break;
        case `-`:
            result = subtract(num1, num2);
            break;
        case `*`:
            result = multiply(num1, num2);
            break;
        case `/`:
            if (num2 == 0) {
                populate(`AC`);
                return error(`ERROR: You shouldn't divide by zero. Are you trying to break the fabric of spacetime?`)
            }
            result = divide(num1, num2);
            break;
    }
    let cleanedResult = result.toString().replace(`-`,``);
    if (cleanedResult.includes(`e`)) {
        return error(`ERROR: This calculator does not support numbers smaller than 0.0000001 or -0.0000001.`)
    }
    if (cleanedResult.indexOf(`.`) < 8 && cleanedResult.indexOf(`.`) !== -1) {
        return result.toString().slice(0,9)
    }
    if (cleanedResult.length <= 9) {
        return result.toString()
    }
    else {
        return error(`ERROR: Your result contains too many digits. This calculator only supports numbers up to 9 digits long, including decimal points (and will truncate decimal results to 9 digits if possible)`)
    }
}

function add(num1, num2) {
    return (num1) + (num2)
}

function subtract(num1, num2) {
    return (num1) - (num2)
}

function multiply(num1, num2) {
    return (num1) * (num2)
}

function divide(num1, num2) {
    return (num1) / (num2)
}

function populate(input) {
    if (errorOnDisplay && input !== `AC`) {
        return
    }
    if (`1234567890.`.includes(input)) {
        if (resultOnDisplay) {
            populate(`AC`);
        }
        if ([`0`,`-0`].includes(exp[workingNum]) && input !== `.`) {
            exp[workingNum] = exp[workingNum].replace(`0`,``);
        }
        if (exp[workingNum] == `` && input == `.`) {
            exp[workingNum] = `0`;
        }
        else if (exp[workingNum].replace(`-`,``).length == 9) {
            return alert(`ERROR: This calculator only supports numbers up to 9 digits long, including decimal points.`)
        }
        else if (input == `.` && exp[workingNum].includes(`.`)) {
            return error(`ERROR: Numbers can not contain more than one decimal point.`)
        }
        exp[workingNum] += input;
    }
    else if (input == `+/-` || input == `n`) {
        if (resultOnDisplay) {
            populate(`AC`);
        }
        if (exp[workingNum].includes(`-`)) {
            exp[workingNum] = exp[workingNum].replace(`-`,``);
        }
        else if (exp[workingNum] == ``) {
            exp[workingNum] = `-0`;
        }
        else {
            exp[workingNum] = `-` + exp[workingNum];
        }
    }
    else if (`+-*/`.includes(input)) {
        if (`operator` in exp && exp[`num2`] == ``) {
            return error(`ERROR: You have already entered the operator ${exp.operator} for the current calculation.`)
        }
        if (workingNum == `num2`) {
            populate(`=`);
            workingNum = `num2`;
            display.textContent = exp.num1;
        }
        else if (workingNum == `num1`) {
            workingNum = `num2`;
        }
        exp.operator = input;
        exp.num2 = ``;
        resultOnDisplay = false;
        return //prevent display from updating
    }
    else if (input == `=` || input == `Enter`) {
        if (workingNum == `num2` && exp.num2 !== ``) {
            result = operate(exp);
            if (typeof result !== `string`) {
                return //does nothing if operation results in error
            }
            exp = {};
            exp.num1 = result;
            workingNum = `num1`;
            resultOnDisplay = true;
        }
        else {return} //prevent display from udpating
    }
    else if (input == `AC` || input == `Delete`) {
        if (errorOnDisplay) {
            errorOnDisplay = false;
            display.style[`font-size`] = `80px`;
        }
        exp.num1 = `0`;
        delete exp.operator;
        delete exp.num2;
        resultOnDisplay = false;
        workingNum = `num1`;
    }
    else if (input == `Backspace`) {
        if (resultOnDisplay) {
            resultOnDisplay = false;
            return populate(`AC`);
        }
        if (exp[workingNum] == `-0` || exp[workingNum].length == 1) {
            exp[workingNum] = `0`;
        }
        else if (exp[workingNum].includes(`-`) && exp[workingNum].length == 2) {
            exp[workingNum] = `-0`;
        }
        else {
            exp[workingNum] = exp[workingNum].slice(0,-1);
        }
    }
    display.textContent = exp[workingNum];
}

function error(message) {
    populate(`AC`);
    alert(message);
    display.style[`font-size`] = `30px`;
    display.textContent = `Error - Press AC to clear`;
    errorOnDisplay = true;
}

let exp = {
    num1: `0`,
}
let errorOnDisplay = false;
let resultOnDisplay = false;
let workingNum = `num1`;

const display = document.querySelector(`.display`);
display.textContent = exp.num1;

const buttons = document.querySelectorAll(`button`);
buttons.forEach((button) => 
    button.addEventListener(`click`, clickHandler)
)
function clickHandler(event) {
    populate(event.target.textContent);
}

const doc = document.querySelector(`body`);
doc.addEventListener(`keydown`, keyHandler);
function keyHandler(event) {
    populate(event.key);
}