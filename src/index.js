/* ДЗ 3 - работа с массивами и объектами */

/*
 Задача 1:
 Напишите аналог встроенного метода forEach для работы с массивами
 */
function forEach(array, fn) {
    for (var i = 0; i < array.length; i++) {
        fn(array[i], array.indexOf(array[i]), array);
    }
}

/*
 Задача 2:
 Напишите аналог встроенного метода map для работы с массивами
 */
function map(array, fn) {
    let newArr = [];

    for (var i = 0; i < array.length; i++) {
        let newP = fn(array[i], array.indexOf(array[i]), array);
        newArr.push(newP);
    }

    return newArr;
}

/*
 Задача 3:
 Напишите аналог встроенного метода reduce для работы с массивами
 */
function reduce(array, fn, initial) {
    var prev, ini;

    if (initial !== undefined) {
        prev = array[initial];
        ini = initial;
    } else {
        prev = array[0];
        ini = 0;
    }

    for (var i = ini; i < array.length; i++) {
        fn(prev, array[i], array.indexOf(array[i]), array);
        prev = array[i];
    }
}

/*
 Задача 4:
 Функция принимает объект и имя свойства, которое необходиом удалить из объекта
 Функция должна удалить указанное свойство из указанного объекта
 */
function deleteProperty(obj, prop) {
    delete obj[prop];
}

/*
 Задача 5:
 Функция принимает объект и имя свойства и возвращает true или false
 Функция должна проверить существует ли укзаанное свойство в указанном объекте
 */
function hasProperty(obj, prop) {
    return (obj.hasOwnProperty(prop)) ? true : false;
}

/*
 Задача 6:
 Функция должна получить все перечисляемые свойства объекта и вернуть их в виде массива
 */
function getEnumProps(obj) {
    var keys = Object.keys(obj);

    var mas = [];

    for ( var i = 0; i < keys.length; i++) {
        let propName = keys[i];
        mas.push(propName);
    }

    return mas;
}

/*
 Задача 7:
 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистра и вернуть в виде массива
 */
function upperProps(obj) {
    var keys = Object.keys(obj);

    var arr = [];

    for ( var i = 0; i < keys.length; i++) {
        let newName = keys[i].toUpperCase();
        arr.push(newName);
    }

    return arr;
}

/*
 Задача 8 *:
 Напишите аналог встроенного метода slice для работы с массивами
 */
function slice(array, from, to) {
    return array.slice(from, to);
}

/*
 Задача 9 *:
 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {
    let proxy = new Proxy (obj, {
        set(target, prop, value) {
            target[prop] = Math.pow(value, 2);
            return true;
        }
    });

    return proxy;
}

export {
    forEach,
    map,
    reduce,
    deleteProperty,
    hasProperty,
    getEnumProps,
    upperProps,
    slice,
    createProxy
};
