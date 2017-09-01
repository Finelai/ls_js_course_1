/* ДЗ 2 - работа с исключениями и отладчиком */

/*
 Задача 1:
 Функция принимает массив и фильтрующую фукнцию и должна вернуть true или false
 Функция должна вернуть true только если fn вернула true для всех элементов массива
 Необходимо выбрасывать исключение в случаях:
 - array не массив или пустой массив (с текстом "empty array")
 - fn не является функцией (с текстом "fn is not a function")
 Зарпещено использовать встроенные методы для работы с массивами
 */
function isAllTrue(array, fn) {
    if (!typeof fn === 'function') {

        throw new Error('fn is not a function');

    } else if ( array.constructor.toString().indexOf("Array") > -1 && array.length > 0 ) {

        var res = true;

        for (var i = 0; i < array.length; i++) {
            if (!fn(array[i])) {
                res = false;
            }
        }

        if (res) {
            return true;
        } else {
            return false;
        }

    } else {

        throw new Error('empty array');

    }
}

/*
 Задача 2:
 Функция принимает массив и фильтрующую фукнцию и должна вернуть true или false
 Функция должна вернуть true если fn вернула true хотя бы для одного из элементов массива
 Необходимо выбрасывать исключение в случаях:
 - array не массив или пустой массив (с текстом "empty array")
 - fn не является функцией (с текстом "fn is not a function")
 Зарпещено использовать встроенные методы для работы с массивами
 */
function isSomeTrue(array, fn) {
    if (!typeof fn === 'function') {

        throw new Error('fn is not a function');

    } else if ( array.constructor.toString().indexOf("Array") > -1 && array.length > 0 ) {

        var res = false;

        for (var i = 0; i < array.length; i++) {
            if (fn(array[i])) {
                res = true;
            }
        }

        if (res) {
            return true;
        } else {
            return false;
        }

    } else {

        throw new Error('empty array');

    }
}

/*
 Задача 3:
 Функция принимает заранее неизветсное количество аргументов, первым из которых является функция fn
 Функция должна поочередно запусти fn для каждого переданного аргумента (кроме самой fn)
 Функция должна вернуть массив аргументов, для которых fn выбросила исключение
 Необходимо выбрасывать исключение в случаях:
 - fn не является функцией (с текстом "fn is not a function")
 */
function returnBadArguments(fn) {
    if (typeof fn !== 'function') {

        throw new Error('fn is not a function');

    } else {

        var errArgs = [];

        if (arguments.length > 1) {

            for (var i = 1; i < arguments.length; i++) {
                try {
                    fn(arguments[i]);
                } catch(e) {
                    errArgs.push(arguments[i]);
                }
            }

        }

        return errArgs;

    }
}

/*
 Задача 4:
 Функция имеет параметр number (по умолчанию - 0)
 Функция должна вернуть объект, у которого должно быть несколько методов:
 - sum - складывает number с переданными аргументами
 - dif - вычитает из number переданные аргументы
 - div - делит number на первый аргумент. Результат делится на следующий аргумент (если передан) и так далее
 - mul - умножает number на первый аргумент. Результат умножается на следующий аргумент (если передан) и так далее

 Количество передаваемых в методы аргументов заранее неизвестно
 Необходимо выбрасывать исключение в случаях:
 - number не является числом (с текстом "number is not a number")
 - какой-либо из аргументов div является нулем (с текстом "division by 0")
 */
function calculator() {
        var number = 0;
        
        if (typeof arguments[0] === 'number') {
            var number = arguments[0];
        } else if (arguments[0] !== undefined) {
            throw new Error('number is not a number');
        }

    return {
        sum: function() {

            let summa = number;

            for (var s = 0; s < arguments.length; s++) {
                summa += arguments[s];
            }

            return summa;
        },

        dif: function() {

            let diff = number;

            for (var n = 0; n < arguments.length; n++) {
                diff -= arguments[n];
            }

            return diff;
        },

        div: function() {

            let division = number;

            if (division === 0) {

                throw new Error('division by 0');

            } else {

                for (var d = 0; d < arguments.length; d++) {
                    division = division / arguments[d];
                }

            }
        },

        mul: function() {

            let mu = number;

            for (var l = 0; l < arguments.length; l++) {
                mu *= arguments[l];
            }

            return mu;
        }
    }

}

export {
    isAllTrue,
    isSomeTrue,
    returnBadArguments,
    calculator
};
