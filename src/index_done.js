/* ДЗ 1 - Функции */

/*
 Задание 1:

 Функция должна принимать один аргумент и возвращать его
 */
function returnFirstArgument(arg) {
    return arg;
}

var firstRes = returnFirstArgument("Done");

console.log("Задание 1: " + firstRes);

/*
 Задание 2:

 Функция должна принимать два аргумента и возвращать сумму переданных значений
 Значение по умолчанию второго аргумента должно быть 100
 */
function defaultParameterValue(a, b) {
    if (!b) b = 100;
    return a + b;
}

console.log("Задание 2: " + defaultParameterValue(2));
console.log("Задание 2: " + defaultParameterValue(2, 10));
console.log("Задание 2: " + defaultParameterValue(2, 999));
console.log("Задание 2: " + defaultParameterValue(2, "300"));
console.log("Задание 2: " + defaultParameterValue("Два ", "рубля"));

/*
 Задание 3:

 Функция должна возвращать все переданные в нее аргументы в виде массива
 Количество переданных аргументов заранее неизвестно
 */
function returnArgumentsArray() {
    if (arguments.length > 0) {
        let mas = [];

        for (var i = 0; i < arguments.length; i++) {
            mas.push(arguments[i]);
        }

        return mas;
    }
}

console.log("Задание 3: " + returnArgumentsArray());
console.log("Задание 3: " + returnArgumentsArray(15, "рублей", 2017));

/*
 Задание 4:

 Функция должна принимать другую функцию и возвращать результат вызова переданной функции
 */
function returnFnResult(fn) {
    let res = fn();
    return res;
}

var ofn = function () {
    return 333;
}

var ofnResult = returnFnResult(ofn);

console.log("Задание 4: " + ofnResult);

/*
 Задание 5:

 Функция должна принимать число (значение по умолчанию - 0) и возвращать функцию (F)
 При вызове F, переданное число должно быть увеличено на единицу и возвращено из F
 */

var num;

function returnCounter(number) {
    (+number > 0) ? num = number : num = 0;
    
    return function F() {
        return num++;
    }
}

var countRes = returnCounter(44);
countRes();
countRes();
countRes();
countRes();

console.log("Задание 5: " + countRes);
console.log(num);

/*
 Задание 6 *:

 Функция должна принимать другую функцию (F) и некоторое количество дополнительных аргументов
 Функция должна привязать переданные аргументы к функции F и вернуть получившуюся функцию
 */
function bindFunction(fn) {
    var args = [];

    if (arguments.length > 1) {

        for (var i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

    }
    
    return fn(...args);
}

var bindF = function F(a, b) {
    return a + b;
}

bindRes = bindFunction(bindF, 100, 50);

console.log("Задание 6: " + bindRes);

bindRes = bindFunction(bindF, 2, " million", 199909, "Двадцать тысяч");

console.log("Задание 6: " + bindRes);

// export {
//     returnFirstArgument,
//     defaultParameterValue,
//     returnArgumentsArray,
//     returnFnResult,
//     returnCounter,
//     bindFunction
// }
