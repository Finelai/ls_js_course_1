/**
 * ДЗ 6.2 - Создать страницу с текстовым полем для фильтрации городов
 *
 * Страница должна предварительно загрузить список городов из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * и отсортировать в алфавитном порядке.
 *
 * При вводе в текстовое поле, под ним должен появляться список тех городов,
 * в названии которых, хотя бы частично, есть введенное значение.
 * Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.
 *
 * Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 * После окончания загрузки городов, надпись исчезает и появляется текстовое поле.
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 *
 * *** Часть со звездочкой ***
 * Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 * то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 * При клике на кнопку, процесс загруки повторяется заново
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');

let loadblock = document.createElement('div');
loadblock.id = '#loading-block';
homeworkContainer.appendChild(loadblock);

let filterblock = document.createElement('div');
filterblock.id = '#filter-block';
homeworkContainer.appendChild(filterblock);

let filterinput = document.createElement('input');
filterinput.id = '#filter-input';
homeworkContainer.appendChild(filterinput);

let filterresult = document.createElement('div');
filterresult.id = '#filter-result';
homeworkContainer.appendChild(filterresult);

/**
 * Функция должна загружать список городов из https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * И возвращать Promise, которой должен разрешиться массивом загруженных городов
 *
 * @return {Promise<Array<{name: string}>>}
 */
function loadTowns() {
    return new Promise(function(resolve, reject) {

        let xhr = new XMLHttpRequest();
        let url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';

        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.send();

        xhr.addEventListener('load', () => {

            if ( xhr.status < 400 ) {

                let resArray = xhr.response;
                
                resArray.sort(function(a, b) {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    return 0;
                });

                resolve(resArray);

            } else {

                reject();

            }

        });

    });
}

/**
 * Функция должна проверять встречается ли подстрока chunk в строке full
 * Проверка должна происходить без учета регистра символов
 *
 * @example
 * isMatching('Moscow', 'moscow') // true
 * isMatching('Moscow', 'mosc') // true
 * isMatching('Moscow', 'cow') // true
 * isMatching('Moscow', 'SCO') // true
 * isMatching('Moscow', 'Moscov') // false
 *
 * @return {boolean}
 */
function isMatching(full, chunk) {
    return full.toUpperCase().includes(chunk.toUpperCase());
}

let loadingBlock = homeworkContainer.querySelector('#loading-block');
let filterBlock = homeworkContainer.querySelector('#filter-block');
let filterInput = homeworkContainer.querySelector('#filter-input');
let filterResult = homeworkContainer.querySelector('#filter-result');
let townsPromise;

var getCities = function () {
    let curVal = filterInput.value;
    
        if (curVal !== undefined && curVal !== null) {

            loadingBlock.textContent = 'Загрузка...';
    
            loadTowns()
                .then(function(cities) {
    
                    loadingBlock.textContent = '';
    
                    for ( var i = 0; i < cities.length; i++) {
                        if (isMatching(cities[i], curVal)) {
                            var el = document.createElement('li');
    
                            el.textContent = cities[i];
                            filterResult.appendChild(el);
                        }
                    }
    
                })
                .catch(function() {

                    var warn = document.createElement('p');
    
                    warn.textContent = 'Не удалось загрузить города';
                    warn.style.color = 'red';
                    filterBlock.appendChild(warn);
    
                    var repeatButton = document.createElement('button');
                    
                    repeatButton.textContent = 'Повторить';
                    repeatButton.addEventListener('click', function() {
                        getCities(filterInput.value);
                    });
                    filterBlock.appendChild(repeatButton);

                });

        }
}

filterInput.addEventListener('keyup', getCities);

export {
    loadTowns,
    isMatching
};
