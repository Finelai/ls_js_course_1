/** Со звездочкой */
/**
 * Создать страницу с кнопкой
 * При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией
 * Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 * Запрощено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');

/**
 * Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 * Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 * Функция НЕ должна добавлять элемент на страницу
 *
 * @return {Element}
 */
function createDiv() {
    var newDiv = document.createElement('div');

    newDiv.classList.add('draggable-div');

    newDiv.style.backgroundColor = '#'+getRandomInt(1, 10, 6).toString(16);

    newDiv.style.position = 'absolute';
    newDiv.style.top = getRandomInt(1, 200) + '';
    newDiv.style.left = getRandomInt(1, 200) + '';

    newDiv.style.width = getRandomInt(1, 200) + 'px';
    newDiv.style.height = getRandomInt(1, 200) + 'px';

    return newDiv;
}

function getRandomInt(min, max, num = 1) {
    let result = '';

    for ( var i = 0; i < num; i++ ) {
        result += Math.floor(Math.random() * (max - min)) + min;
    }

    return result;
}

/**
 * Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop
 *
 * @param {Element} target
 */
function addListeners(target) {
    target.addEventListener('mousemove', function(ev) {
        if (this.parentElement.querySelector(':active') === this) {
            this.style.top = ev.clientY-25 + 'px';
            this.style.left = ev.clientX-25 + 'px';
        }
    });
}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function() {
    // создать новый div
    let div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);

    // назначить обработчики событий мыши для реализации d&d
    addListeners(div);

    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

export {
    createDiv
};
