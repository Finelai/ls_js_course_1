var curResults;
var curFiltered = {
    items: []
};

// если в localStorage нет сохраненных списков, то берем из друзей
if (localStorage.hasResults || localStorage.hasFiltered) {

    curResults = JSON.parse(localStorage.hasResults);
    curFiltered = JSON.parse(localStorage.hasFiltered);

    const templateElement = document.querySelector('#user-template');
    const source = templateElement.innerHTML,
    render = Handlebars.compile(source),
    template = render({ list: curResults.items });

    const templateElement2 = document.querySelector('#user-template2');
    const source2 = templateElement2.innerHTML,
    render2 = Handlebars.compile(source2),
    template2 = render2({ list: curFiltered.items });

    results_array.innerHTML = template;
    filtered_array.innerHTML = template2;

} else {

    function api(method, params) {
        return new Promise((resolve, reject) => {
            VK.api(method, params, data => {
                if (data.error) {
                    reject(new Error(data.error.error_msg));
                } else {
                    resolve(data.response);
                }
            });
        });
    }

    const promise = new Promise((resolve, reject) => {
        VK.init({
            apiId: 5267932
        });

        VK.Auth.login(data => {
            if (data.session) {
                resolve(data);
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 16);
    });

    promise
        .then(() => {
            return api('users.get', { v: 5.68, name_case: 'gen' });
        })
        .then(data => {
            const [user] = data;
            headerInfo.innerText += ` ${user.first_name} ${user.last_name}`;

            return api('friends.get', { v: 5.68, fields: 'first_name, last_name, photo_100' })
        })
        .then(data => {
            curResults = data;
            const templateElement = document.querySelector('#user-template');
            const source = templateElement.innerHTML,
                render = Handlebars.compile(source),
                template = render({ list: data.items });

            results_array.innerHTML = template;
        })
        .catch(function (e) {
            alert('Ошибка: ' + e.message);
    });

}

// перенос по клику

var resArr = document.querySelector('#results_array');
var filArr = document.querySelector('#filtered_array');

let changeEvent = (event) => {
    if (event.target.className === 'add') {

        event.target.className = 'remove';

        let user_name = event.target.parentNode.firstElementChild.nextElementSibling.innerHTML.split(' ');

        resArr.removeChild(event.target.parentNode);
        // находим и убираем элемент из объекта curResults
        for (var i = 0; i < curResults.items.length; i++) {
            if (curResults.items[i].first_name == user_name[0]) {
                let cutInd = curResults.items.indexOf(curResults.items[i]);
                curResults.items.splice(cutInd, 1);
            }
        }

        filArr.appendChild(event.target.parentNode);
        // создаем и добавляем элемент к объекту curFiltered
       let item = {
            first_name: user_name[0],
            last_name: user_name[1],
            photo_100: event.target.parentNode.firstElementChild.src
        };
        curFiltered.items.push(item);

    } else if (event.target.className === 'remove') {

        event.target.className = 'add';

        let user_name = event.target.parentNode.firstElementChild.nextElementSibling.innerHTML.split(' ');

        filArr.removeChild(event.target.parentNode);
        // находим и убираем элемент из объекта curFiltered
        for (var i = 0; i < curFiltered.items.length; i++) {
            if (curFiltered.items[i].first_name == user_name[0]) {
                let cutInd = curFiltered.items.indexOf(curFiltered.items[i]);
                curFiltered.items.splice(cutInd, 1);
            }
        }

        resArr.appendChild(event.target.parentNode);
        // создаем и добавляем элемент к объекту curResults
       let item = {
            first_name: user_name[0],
            last_name: user_name[1],
            photo_100: event.target.parentNode.firstElementChild.src
        };
        curResults.items.push(item);

    }
}

resArr.addEventListener('click', changeEvent);
filArr.addEventListener('click', changeEvent);


// поиск по имени

function isMatching(full, chunk) {
    return full.toUpperCase().includes(chunk.toUpperCase());
}

let getRes = (event) => {
    let curVal = event.target.value;

    for (var i = 0; i < resArr.childNodes.length; i++) {
        if (resArr.childNodes[i].className === 'item') {
            let curEl = resArr.childNodes[i].firstElementChild.nextElementSibling.innerHTML;

            if ( isMatching(curEl, curVal) ) {
                resArr.childNodes[i].style.display = 'block';
            } else {
                resArr.childNodes[i].style.display = 'none';
            }
        }
    }
}

let getFil = (event) => {
    let curVal = event.target.value;

    for (var i = 0; i < filArr.childNodes.length; i++) {
        if (filArr.childNodes[i].className === 'item') {
            let curEl = filArr.childNodes[i].firstElementChild.nextElementSibling.innerHTML;

            if ( isMatching(curEl, curVal) ) {
                filArr.childNodes[i].style.display = 'block';
            } else {
                filArr.childNodes[i].style.display = 'none';
            }
        }
    }
}

results_filter.addEventListener('keyup', getRes);
filtered_filter.addEventListener('keyup', getFil);


// перенос мышью

// resArr.addEventListener('mousedown', function(event) {

//     if (event.target.parentNode.className === 'item') {
//         var curTar = event.target.parentNode;
//     } else if (event.target.className === 'item') {
//         var curTar = event.target;
//     }

//     curTar.ondragstart = function() {
//       return false;
//     };

//     curTar.style.position = 'absolute';
//     moveAt(event, curTar);

//     document.onmousemove = function(e) {
//         moveAt(e, curTar);
//     }

//     curTar.onmouseup = function() {
//         document.onmousemove = null;
//         curTar.onmouseup = null;
//     }

//     function moveAt(e, target) {
//         target.style.left = e.pageX - target.offsetWidth / 2 + 'px';
//         target.style.top = e.pageY - target.offsetHeight / 2 + 'px';
//     }

// });


// сохранение результата в списке

save.addEventListener('click', function() {
    localStorage.hasResults = JSON.stringify(curResults);
    localStorage.hasFiltered = JSON.stringify(curFiltered);
});