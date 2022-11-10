"use strict";

// КНОПКА ВЫХОДА

const userLogout = new LogoutButton();

userLogout.action = () => {
    ApiConnector.logout(response => {
        if (response.success) {
            document.location.reload();
        } else {
            alert(response.error);
        }
    });
};

// ПОЛУЧЕНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ

ApiConnector.current(response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

// ЗАГРУЗКА ТЕКУЩИХ КУРСОВ ВАЛЮТ

const userRatesBoard = new RatesBoard();
const xhr = new XMLHttpRequest();
xhr.onload = processFinish;

function processFinish() {
    const valutes = JSON.parse(xhr.response).Valute;
    const valutesShort = {};
    Object.keys(valutes).forEach((key) => {
      valutesShort[key] = valutes[key].Value;
    });
    userRatesBoard.clearTable();
    userRatesBoard.fillTable(valutesShort);
}

xhr.open("GET", "https://www.cbr-xml-daily.ru/daily_json.js");
xhr.send();

setInterval(() => {
    xhr.open("GET", "https://www.cbr-xml-daily.ru/daily_json.js");
    xhr.send();
}, 60000);

// ОПЕРАЦИИ С ДЕНЬГАМИ

const userMoney = new MoneyManager();

userMoney.addMoneyCallback = data => {
    ApiConnector.addMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            userMoney.setMessage(true, "Денежные средства успешно добавлены!");
        } else {
            userMoney.setMessage(false, response.error);
        }
    });
};

userMoney.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            userMoney.setMessage(true, "Конвертация денежных средств осуществлена успешно!");
        } else {
            userMoney.setMessage(false, response.error);
        }
    });
};

userMoney.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            userMoney.setMessage(true, "Перевод денежных средств осуществлён успешно!");
        } else {
            userMoney.setMessage(false, response.error);
        }
    });
};

// АДРЕСНАЯ КНИГА

const userFavorites = new FavoritesWidget();
updateFavorites();

function updateFavorites() {
    ApiConnector.getFavorites(response => {
        if (response.success) {
            userFavorites.clearTable();
            userFavorites.fillTable(response.data);
            userMoney.updateUsersList(response.data);
        }
    });
}

userFavorites.addUserCallback = data => {
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success) {
            updateFavorites();
            userFavorites.setMessage(true, "Пользователь успешно добавлен!");
        } else {
            userFavorites.setMessage(false, response.error);
        }

    });
};

userFavorites.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if (response.success) {
            updateFavorites();
            userFavorites.setMessage(true, "Пользователь успешно удалён!");
        } else {
            userFavorites.setMessage(false, response.error);
        }

    });
};
