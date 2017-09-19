/**
 * ДЗ 7.2 - Создать редактор cookie с возможностью фильтрации
 *
 * На странице должна быть таблица со списком имеющихся cookie:
 * - имя
 * - значение
 * - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
 *
 * На странице должна быть форма для добавления новой cookie:
 * - имя
 * - значение
 * - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)
 *
 * На странице должно быть текстовое поле для фильтрации cookie
 * В таблице должны быть только те cookie, в имени или значении которых есть введенное значение
 * Если в поле фильтра пусто, то должны выводиться все доступные cookie
*
 * Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено
 * Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 * то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена
* Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 *
 * Для более подробной информации можно изучить код тестов
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации куки
let filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// имя добавляемой куки
let addNameInput = homeworkContainer.querySelector('#add-name-input');
// значение добавляемой куки
let addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка добавить куки
let addButton = homeworkContainer.querySelector('#add-button');
// тело таблицы со строкой (tr), где 3 клетки (td) с именем, значением и кнопкой удалить куки
let listTable = homeworkContainer.querySelector('#list-table tbody'); 

// поле фильтрации: при вводе отображает только те куки, где совпадают имя или значение с этим полем
filterNameInput.addEventListener('keyup', function() {
    let curFilName = filterNameInput.value;

   if ( curFilName !== '' ) {

        // проходим по всем элементам tr и сравниваем с фильтром td с именем и значением 
        for (var i = 0; i < listTable.childNodes.length; i++) {
            if ( listTable.childNodes[i].tagName == 'TR' ) {

                let curCName = listTable.childNodes[i].firstElementChild.textContent;
                let curCValue = listTable.childNodes[i].firstElementChild.nextElementSibling.textContent;

                if ( isMatching(curCName, curFilName) || isMatching(curCValue, curFilName) ) {
                    console.log('+1');
                } else {
                    // если не подходит, то выставляем style.display = 'none'
                    listTable.childNodes[i].style.display = 'none';
                }

            }
        }

   } else {

        // если пустое, то всем элементам tr выставляем style.display = 'table-row'
        for (var i = 0; i < listTable.childNodes.length; i++) {
            if ( listTable.childNodes[i].tagName == 'TR' ) {
                listTable.childNodes[i].style.display = 'table-row';
            }
        }

   }

});

// событие добавления куки в таблицу
addButton.addEventListener('click', () => {
    let newCName = addNameInput.value;
    let newCValue = addValueInput.value;
    let curFilName = filterNameInput.value;

    if ( newCName.match(/^\d/) ) {
        alert('Имя куки должно начинаться с буквенного символа');
    } else {
        if ( getCookie(newCName) === undefined ) {

            if ( isMatching(newCName, curFilName) || isMatching(newCValue, curFilName) || curFilName === '' ) {
                // если имя новой куки или её значение совпадает с фильтром или фильтр пуст
                // добавляем новую куки в браузер и таблицу
                document.cookie = `${newCName}=${newCValue};expires=37000`;

                let newTr = document.createElement('tr');
                newTr.id=newCName;

                let newTdName = document.createElement('td');
                newTdName.textContent = newCName;
                newTr.appendChild(newTdName);

                let newTdValue = document.createElement('td');
                newTdValue.textContent = newCValue;
                newTr.appendChild(newTdValue);

                let newButton = document.createElement('button');
                newButton.textContent = 'Удалить';
                newButton.addEventListener('click', () => {
                    document.cookie = `${newCName}=${newCValue};expires=-1`;
                    let forDelete = document.querySelector('#'+newCName);
                    listTable.removeChild(forDelete);
                });
                newTr.appendChild(newButton);

                listTable.appendChild(newTr);
            } else {
                // имя новой куки не совпадает с фильтром
                // добавляем новую куки только в браузер
                document.cookie = `${newCName}=${newCValue};expires=37000`;
            }

        } else {

            // берем обновляем значение куки в браузере
            document.cookie = `${newCName}=${newCValue};expires=37000`;

            // проверяем есть ли куки в таблице
            if (document.querySelector('#'+newCName)) {

                // если есть, то проверяем соответствие значения фильтру
                if ( isMatching(newCValue, curFilName) || curFilName === '' ) {
                    // если фильтру соотвествует, то заменяем значение куки в таблице
                    let curElValue = document.querySelector('#'+newCName).firstElementChild.nextElementSibling;
                    curElValue.value = newCValue;
                } else {
                    // если фильтру не соответствует, то удаляем
                    listTable.removeChild(document.querySelector('#'+newCName));
                }

            } else {
                // тут по идеи должно быть добавление в таблицу, но об этом не сказано в задании
            }

        }
    }
});



// проверка на соответствие без учета регистра
function isMatching(full, chunk) {
    return full.toUpperCase().includes(chunk.toUpperCase());
}

// возвращает cookie с именем name, если есть, если нет, то undefined
function getCookie(name) {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}