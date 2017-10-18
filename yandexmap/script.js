// принимает адрес и отдает координаты
function geocode(address) {
    return ymaps.geocode(address).then(result => {
        const points = result.geoObjects.toArray();

        if (points.length) {
            return points[0].geometry.getCoordinates();
        }
    });
}

// Определяем адрес по координатам (обратное геокодирование)
function getAddress(coords) {
    let curaddress = '';

    ymaps.geocode(coords).then(function (res) {
        var firstGeoObject = res.geoObjects.get(0);

        // Получаем страну
        curaddress += firstGeoObject.getCountry();

        curaddress +=', '

        // Название населенного пункта или вышестоящее административно-территориальное образование.
        curaddress += firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas();

        curaddress +=', '

        // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
        if (firstGeoObject.getThoroughfare()) {
            curaddress += firstGeoObject.getThoroughfare();
        } else if (firstGeoObject.getPremise()) {
            curaddress += firstGeoObject.getPremise();
        }
    });

    let timerId = setTimeout(function tick() {
        if (curaddress !== '') {
            clearTimeout(timerId);
            addressAdd.textContent = curaddress;
        } else {
            timerId = setTimeout(tick, 200);
        }
    }, 200);

}

// Создание метки.
function createPlacemark(coords) {
    return new ymaps.Placemark(coords, {
        iconCaption: ''
    }, {
        preset: 'islands#violetIcon',
        draggable: true
    });
}

// Функция для вывода текущего времени в формате 30.10.17
function formatDate(date) {
      var dd = date.getDate();
      if (dd < 10) dd = '0' + dd;

      var mm = date.getMonth() + 1;
      if (mm < 10) mm = '0' + mm;

      var yy = date.getFullYear() % 100;
      if (yy < 10) yy = '0' + yy;

      return dd + '.' + mm + '.' + yy;
}

// Функция получает полные координаты и определяет короткие
function setShortCoords() {
    let nowCoord = currentCoords.map(function(name) {
        let newName = name.toString().split('', 5);
        return newName[0] + newName[1] + newName[2] + newName[3] + newName[4];
    });
    shortCoords = nowCoord.join(',');
}

// Функция создает блоки с отзывами по текущим координатам и прикрепляет к revList
function placeRevs() {
    console.log(currentCoords, shortCoords);
    revList.innerHTML='';

    for (var x = 0; x < reviews[shortCoords].length; x++) {
        let newRev = document.createElement('div');
        let newRevName = document.createElement('h6');
        let newRevPlace = document.createElement('span');
        let newRevDate = document.createElement('span');
        let newRevCom = document.createElement('p');
        newRevName.textContent = reviews[shortCoords][x][0];
        newRevPlace.textContent = reviews[shortCoords][x][1];
        newRevDate.textContent = reviews[shortCoords][x][2];
        newRevCom.textContent = reviews[shortCoords][x][3];
        newRev.appendChild(newRevName);
        newRev.appendChild(newRevPlace);
        newRev.appendChild(newRevDate);
        newRev.appendChild(newRevCom);
        revList.appendChild(newRev);
    }
}

let myMap;
let clusterer;
let currentCoords;
let shortCoords;
let addRev = document.querySelector('#addrev');
let addressAdd = document.querySelector('#adress');
let revClose = document.querySelector('#revclose');
let revAddBut = document.querySelector('#add');
let inputName = document.querySelector('#name');
let inputMesto = document.querySelector('#mesto');
let addRevTxt = document.querySelector('#revtxt');
let revList = document.querySelector('#revlist');

// Создаем событие закрытия addrev
let closeEvent = new CustomEvent('closeEvent');

addRev.addEventListener('closeEvent', () => {
    addRev.style.display = 'none';
});

revClose.addEventListener('click', () => {
    addRev.dispatchEvent(closeEvent);
});

// Создаем объект под отзывы
let reviews = {};


var placemarkBodies;
function getContentBody (num) {
    if (!placemarkBodies) {
        placemarkBodies = [
            ['Слово скажу -', 'Леденеют губы.', 'Осенний вихрь!'].join('<br/>'),
            ['Вновь встают с земли', 'Опущенные дождем', 'Хризантем цветы.'].join('<br/>'),
            ['Ты свечу зажег.', 'Словно молнии проблеск,', 'В ладонях возник.'].join('<br/>')
        ];
    }
    return '<br>' + placemarkBodies[num % placemarkBodies.length];
}


new Promise((resolve) => {
    ymaps.ready(resolve);
})
    .then(() => {

        myMap = new ymaps.Map("map", {
            center: [59.93, 30.31],
            zoom: 11
        }, {
            searchControlProvider: 'yandex#search'
        });

        // Создаем собственный макет с информацией о выбранном геообъекте.
        var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
            // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
            '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
                '<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>' +
                '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
        );

        clusterer = new ymaps.Clusterer({
            preset: 'islands#invertedVioletClusterIcons',
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: true,
            // Устанавливаем стандартный макет балуна кластера "Карусель".
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            // Устанавливаем собственный макет.
            clusterBalloonItemContentLayout: customItemContentLayout,
            // Устанавливаем режим открытия балуна. 
            // В данном примере балун никогда не будет открываться в режиме панели.
            clusterBalloonPanelMaxMapArea: 0,
            // Устанавливаем размеры макета контента балуна (в пикселях).
            clusterBalloonContentLayoutWidth: 300,
            clusterBalloonContentLayoutHeight: 230,
            // Устанавливаем максимальное количество элементов в нижней панели на одной странице
            clusterBalloonPagerSize: 5
            // Настройка внешего вида нижней панели.
            // Режим marker рекомендуется использовать с небольшим количеством элементов.
            // clusterBalloonPagerType: 'marker',
            // Можно отключить зацикливание списка при навигации при помощи боковых стрелок.
            // clusterBalloonCycling: false,
            // Можно отключить отображение меню навигации.
            // clusterBalloonPagerVisible: false
        });

        myMap.geoObjects.add(clusterer);

        // Событие клика по карте
        myMap.events.add('click', function (e) {
            currentCoords = e.get('coords');
            addRev.dispatchEvent(closeEvent);

            getAddress(currentCoords);

            setShortCoords();

            // Проверяем нет ли в объекте reviews координат
            if (reviews.hasOwnProperty(shortCoords)) {
                // Если есть вывоводим окно добавления отзыва с текущими отзывами
                placeRevs();
            } else {
                // Если нет очищаем содержимое revList
                revlist.innerHTML = 'Отзывов пока нет...';
            }
            
            let curPosAddRev = e.get('pagePixels');

            addRev.style.top = curPosAddRev[1] + 'px';
            addRev.style.left = curPosAddRev[0] + 'px';
            addRev.style.display = 'block';

        });



    })
    .catch(e => alert('Ошибка: ' + e.message));


// Добавляем отзыв
revAddBut.addEventListener('click', () => {
    if (inputName.value !== '' && inputMesto.value !== '' && addRevTxt.value !== '') {

        // Если в объекте нет таких координат, то создаем
        if (!reviews[shortCoords]) {
            reviews[shortCoords] = [];
        }

        // Создаем метку
        myPlacemark = createPlacemark(currentCoords);
        clusterer.add(myPlacemark);

        // Добавляем событие клика по метке
        myPlacemark.events.add('click', function (e) {
            currentCoords = myPlacemark.geometry.getCoordinates();
            console.log('placemark coords',currentCoords);

            setShortCoords();

            let curPos = e.get('pagePixels');

            placeRevs();

            addRev.style.top = curPos[1] + 'px';
            addRev.style.left = curPos[0] + 'px';
            addRev.style.display = 'block';
        });

        // Добавляем отзыв в массив
        reviews[shortCoords].push([
            inputName.value,
            inputMesto.value,
            formatDate(new Date()),
            addRevTxt.value
        ]);

        placeRevs();

    } else {
        alert('Заполните все поля, чтобы добавить отзыв!');
    }
});