function findGetParameter(parameterName) {
    //Получение параметров из адресной строки браузера
    var result = null,
    tmp = [];
    location.search.substr(1).split("&").forEach(function(item) {
        tmp = item.split("=");
        if(tmp[0] === parameterName) {
            result = decodeURIComponent(tmp[1]);
        }
    });
    return result;
}
function authUser() {
    //Демонстрация, данный тип не подойдет для авторизации, нужно использовать функцию testAjax
    if(!sessionStorage.getItem("auth")) {
        var email    = findGetParameter("email"),
            password = findGetParameter("password");
        if(email === "admin@auth.com" && password === "root") {
            sessionStorage.setItem("auth", "Александр Баранов");
        }
    }
    if(sessionStorage.getItem("auth")) {
        var user   = sessionStorage.getItem("auth"),
            target = document.getElementById("auth"),
            button = document.createElement("button");
        button.innerHTML = "Выход";
        button.id = "exit";
        target.innerHTML = "<p>Ва вошли как: " + user + "!</p>";
        target.appendChild(button);
        button.addEventListener("click", function(event) {
            var url = document.location.href.split("?")[0].split("&")[0];
            event.preventDefault();
            sessionStorage.removeItem("auth");
            document.location.href = url;
        });
    }
}
function testAjax() {
    //Тестовый запрос через AJAX, в случаее успеха, создаем на сервере cookie или сессию
    var auth   = $("auth"),
        data   = auth.children("form").serialize(),
        button = auth.find("[type='submit']"),
        action = document.location.href;
    if(auth.length > 0) {
        $.ajax({
            method: "POST",
            url: action,
            data: data,
            cache: false,
            beforeSend: function() {
                button.text("Загрузка...").css({
                    pointerEvents: "none"
                });
            },
            success: function(respone) {
                respone = jQuery.parseJSON(respone);
                if(respone.status === "OK") {
                    auth.html(respone.html);
                } else {
                    alert(respone.messsage);
                    button.text("Войти").css({
                        pointerEvents: "unset"
                    });
                }
            },
            error: function(jqXHR, exception) {
                console.log(jqXHR.responseText);
                button.text("Войти").css({
                    pointerEvents: "unset"
                });
            }
        });
    }
}
function createNav() {
    //Создаем элементы панели навигации
    var nav   = $("nav").children("ul"),
        items = [
        {
            name: "Навигация",
            url:  "#"
        }, 
        {
            name: "Главная",
            url:  "index.html"
        },
        {
            name: "Музыка",
            url:  "index.html#music"
        },
        {
            name: "Видео",
            url:  "index.html#video"
        },
        {
            name: "Таблица",
            url:  "index.html#table"
        }
    ];
    if(nav.length > 0) {
        $.each(items, function(key, value) {
            nav.append("<li class='nav-link'><a href='" + value.url + "'>" + value.name + "</a></li>");
        });
    }
}
function initApp() {
    //Инициалиация приложения
    console.log("Тестовый сайт успешно запущен!");
    createNav();
    authUser();
}
$(document).on("click", "nav > ul > li:not(:first-of-type) > a", function(event) {
    //Анимация скрола страницы к объекту при взаимодействии с элементами навигации
    var html   = $("html"),
        id     = $(this).attr("href").split("#")[1],
        target = html.find("#" + id);
    event.preventDefault();
    if(id && target.length > 0) {
        html.stop().animate({scrollTop: target.offset().top}, 255);
    } else {
        html.stop().animate({scrollTop: 0}, 255);
    }
});
/*$("#auth").children("form").on("submit", function(event) {
    //Событие формы авторизации (для работы нужно подключение к серверу)
    event.preventDefault();
    testAjax();
});*/
$(document).on("click", ".nav-link:first-of-type > a", function(event) {
    //Анимация развертывания элементов навигации в мобильной версии
    var items = $(this).closest("ul").children("li");
    event.preventDefault();
    items.not(":first-of-type").toggle(255);
});
$(window).resize(function(event) {
    //Адаптаптация элементов панели навигвции при изменении размера экрана
    var width = $(this).width(),
        items = $(".nav-link").not(":first-of-type");
    if(width > 768) {
        items.show();
    } else {
        items.hide();
    }
});
$(document).ready(function(event) {
    initApp();
});