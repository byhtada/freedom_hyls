
$( window ).on( "load", function() {
    console.log( "window loaded" );
});
$( document ).ready(function() {
    console.log( "document ready" );
    $('body').tooltip({ selector: '[data-toggle="tooltip"]' });


    var api_url      = "https://hyls-api.ru:443/";

    var cookie_name_token = "freedom_token";
    var cookie_name_id    = "freedom_id";
    var cookie_token = getCookie(cookie_name_token);

    var interval_white_page;

    var alert_recovery_finish = "Пароль выслан на вашу почту";
    var alert_recovery_error  = "Учетная запись с такой почтой не обнаружена";
    var alert_login_error  = "Вход не выполнен. Проверьте корректность введенных данных";

    var info_rating_1 = "Выполняя ежедневные практики, вы улучшаете свои позиции в рейтинге марафонцев вашего потока. Сейчас Вы на ";
    var info_rating_2 = " месте из ";
    var info_rating_3 = " участников";

    var day_b = "День";
    var day_s = "день";
    var text_plan_b = "План";
    var text_plan_s = "план";

    var headerTitle = "Выберите день";
    var setButton   = "Перейти";
    var clearButton = "Очистить";
    var nowButton   = "Сейчас";
    var closeButton = "Закрыть";


    var text_rating_place    = "Место";
    var text_rating_progress = "Прогресс";
    var text_rating_name     = "Имя";


    var alert_bonus_finish = "Бонус Активирован!";
    var alert_bonus_error  = "Недостаточно HYLScoins для активации бонуса";

    var text_bonus_open = "Открыть";
    var text_bonus_chat = "Присоединиться";
    var text_bonus_asana_active = "Бонус 'Асана-класс' активирован";

    var text_info_1 = "Добавьте этот сайт в закладки браузера — так вы сможете быстрее ";
    var text_info_2 = "подключаться к личному дневнику и отмечать выполненные практики.";
    var text_info_3 = "Сохраните свои данные в заметки или другое удобное вам место, чтобы не потерять:<br /><br />";
    var text_info_4 = "1. Сайт дневника: marafon.hyls.ru<br />";
    var text_info_5 = "2. Логин: ";
    var text_info_6 = "3. Пароль: ";
    var text_info_7 = "Оставайтесь на волне HYLS и не забывайте отмечать выполненные практики ;)";


    var text_marathon_start = "Cтарт марафона ";



    $.ajaxSetup({
        error: function (data, textStatus, jqXHR) {
            console.log(data);

            if (data.status == 401) {
                console.log("Error 401");
                $('#page_login').show();
                $("#page_main") .hide();

                if (data.responseText.includes("Incorrect credentials")) {
                    alert(alert_login_error);
                }
                if (data.responseText.includes("Bad Token")) {
                    cookie_token = getCookie(cookie_name_token);
                }
            }

            if (data.status == 500) {
                console.log("Error 500 ");
                $('#error_500').show();
                sendError();
            }
        }
    });
    if (!navigator.cookieEnabled) {
        alert('Включите cookie для комфортной работы');
    }

    function sendError(){
        $.ajax({
            type: "POST",
            url:  api_url + "send_error",
            headers: {
                'Authorization':'Token token=' + cookie_token,
                'Content-Type':'application/x-www-form-urlencoded'
            },
            success: function(data){
            },
            failure: function(errMsg) {
                alert(errMsg.toString());
            }
        });
    }
    function no_access() {
        alert("У Вас не достаточно прав, для выполнения этого действия")
    }
    function getOS() {
        var userAgent = window.navigator.userAgent,
            platform = window.navigator.platform,
            macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
            windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
            iosPlatforms = ['iPhone', 'iPad', 'iPod'],
            os = null;

        if (macosPlatforms.indexOf(platform) !== -1) {
            os = 'Mac OS';
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            os = 'iOS';
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = 'Windows';
        } else if (/Android/.test(userAgent)) {
            os = 'Android';
        } else if (!os && /Linux/.test(platform)) {
            os = 'Linux';
        }

        return os;
    }

    function openInNewTab(url) {
        var win = window.open(url, '_blank');
        win.focus();
    }


    function ifLogin()  {
        console.log("ifLogin");
        if (typeof cookie_token !== 'undefined' && cookie_token !== 'undefined') {
            start("init");
        } else {
            console.log("no cookie");
            hide_all();
            var params = parse_query_string();
            if (typeof params.access_token == 'undefined') {
                if (typeof params.login_from !== 'undefined' && params.login_from === "email") {
                    $('#page_user_main').show();
                    $('#page_marafon_reg').show();
                    login_user(params.email, params.pass);
                } else {
                    console.log("no 21 da");
                    $("#page_login").show();
                }
            }
        }
    }

    function parse_query_string() {
        var hashParams = {};
        var e,
            a = /\+/g,  // Regex for replacing addition symbol with a space
            r = /([^&;=]+)=?([^&;]*)/g,
            d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
            q = window.location.hash.substring(1);

        while (e = r.exec(q))
            hashParams[d(e[1])] = d(e[2]);

        return hashParams;

        // if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )){
//
        //     var key = false, res = {}, itm = null;
        //     // get the query string without the ?
        //     var qs = location.search.substring(1);
        //     // check for the key as an argument
        //     if (arguments.length > 0 && arguments[0].length > 1)
        //         key = arguments[0];
        //     // make a regex pattern to grab key/value
        //     var pattern = /([^&=]+)=([^&]*)/g;
        //     // loop the items in the query string, either
        //     // find a match to the argument, or build an object
        //     // with key/value pairs
        //     while (itm = pattern.exec(qs)) {
        //         if (key !== false && decodeURIComponent(itm[1]) === key)
        //             return decodeURIComponent(itm[2]);
        //         else if (key === false)
        //             res[decodeURIComponent(itm[1])] = decodeURIComponent(itm[2]);
        //     }
//
        //     return key === false ? res : null;
        // } else {
//
        //     var url_string = window.location.href; //window.location.href
        //     var url = new URL(url_string);
        //     var query = url.hash.replace('#', '');
        //     var vars = query.split("&");
        //     var query_string = {};
        //     for (var i = 0; i < vars.length; i++) {
        //         var pair = vars[i].split("=");
        //         var key = decodeURIComponent(pair[0]);
        //         var value = decodeURIComponent(pair[1]);
        //         // If first entry with this name
        //         if (typeof query_string[key] === "undefined") {
        //             query_string[key] = decodeURIComponent(value);
        //             // If second entry with this name
        //         } else if (typeof query_string[key] === "string") {
        //             var arr = [query_string[key], decodeURIComponent(value)];
        //             query_string[key] = arr;
        //             // If third or later entry with this name
        //         } else {
        //             query_string[key].push(decodeURIComponent(value));
        //         }
        //     }
        //     return query_string;
        // }


    }

    function login_user(phone, pass){
        var token_web = $.base64.encode(phone + ":" + pass);

        $.ajax({
            type: "GET",
            url: api_url + "token",
            headers: {
                'Authorization': 'Basic ' + token_web,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (data) {
                // console.log("try get token");
                //  console.log(JSON.stringify(data));
                if (data.token.length == 32) {
                    //console.log("success get token");
                    setCookie(cookie_name_token, data.token, {expires: 36000000000000});
                    setCookie(cookie_name_id,    data.user_id, {expires: 36000000000000});
                    cookie_token = getCookie(cookie_name_token);
                    ifLogin();}
                else {
                    //   console.log("fail get token");
                }},
            failure: function (errMsg) {
                console.log(errMsg.toString());
            }});
    }
    ifLogin();
    $('#btn_login').click(function () {
        var token_web = $.base64.encode($('#login_login').val() + ":" + $('#login_password').val());
        //  console.log(token_web);
        try {
            $.ajax({
                type: "GET",
                url: api_url + "token",
                headers: {
                    'Authorization': 'Basic ' + token_web,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: function (data) {
                    // console.log("try get token");
                    console.log(JSON.stringify(data));

                    if (data.token.length == 32) {
                        //console.log("success get token");
                        setCookie(cookie_name_token, data.token, {expires: 36000000000000});
                        setCookie(cookie_name_id,    data.user_id, {expires: 36000000000000});
                        cookie_token = getCookie(cookie_name_token);
                        ifLogin();
                    } else {
                        //   console.log("fail get token");
                    }
                },
                failure: function (errMsg) {
                    //    console.log(errMsg.toString());
                }
            });
        }
        catch (err) {
            //  console.log(err);
        }

    });



    function showWaitPage(data){
        $('#page_main').show();
        $('#marathon_wait').show();
        $('#marathon_coming').hide();

        if (!data.user.base_info_save){
            $('#base_info').html(
                text_info_1 +
                text_info_2 +
                text_info_3 +
                text_info_4 +
                text_info_5 + data.user.email + "<br />" +
                text_info_6 + data.user.password + "<br /><br />" +
                text_info_7
            );
            $('#modal_base_info').modal("show");
        }
    }


    var has_practise_today;
    var has_practise_total;
    function showComingPage(data){
        //setDayDetox(data.marafon_info_today, data.marafon_day);
        $('#page_main').show();
        $('#marathon_coming').show();

        var progress = 0;
        $('#user_progress_bar').css('width', progress+'%').attr('aria-valuenow', progress);
        $('#user_progress_bar').text(progress+'%');

        has_practise_today = data.day_info.day_practises.length > 0;
        has_practise_total = data.practises.practises.length > 0;

    }


    var group_link;
    function setGroupInfo(group_info){
        $('#marathon_wait_text').text(text_marathon_start + group_info.start_day);
        group_link = group_info.group_link;
        //group_link = group_info.current_day;

        $('#user_current_day')    .text("Сегодня " + group_info.current_day + " день");
        $('#modal_label_curator_contact').show().text("Имя вашего куратора - " + group_info.curator.name);
        $('#btn_curactor_wa').show().attr("href", group_info.curator.curator_wa);
        $('#btn_curactor_vk').show().attr("href", group_info.curator.curator_vk);
    }



    function start(status) {
        try {
            $.ajax({
                type: "GET",
                url:   api_url + "get_freedom_info",
                data: { user_time: new Date(), os: getOS()},
                headers: {
                    'Authorization': 'Token token=' + cookie_token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: function (data) {
                    if (status === "init") {
                        hide_all();
                    }

                    $('.lotos_have').text("У вас есть " + data.user.lotos);

                    console.log(data);
                    $('#page_main').show();
                    $('#marathon_wait')  .hide();
                    $('#marathon_coming').hide();
                    setGroupInfo(data.group_info);
                    setCourses(data.courses);

                    if  (data.group_info.current_day < 1 || data.courses.active_courses == 0){
                        showWaitPage(data);
                        $('#marathon_wait').show();

                    } else {
                        showComingPage(data);
                        setUserPractises(data.practises.practises);
                        setTodayPractise(data.day_info.day_practises);
                        setDayInfo(data);
                        $('#marathon_coming').show();

                        if (status === "init") {
                            $('.courses_save').hide();

                            if (data.day_info.day_practises.length == 0){
                                $('#page_courses').show();
                            } else {
                                $('#page_diary').show();
                            }
                        }



                    }
                },
                failure: function (errMsg) {
                    alert(errMsg);
                }
            });
        }
        catch (err) {
            console.log(err);
        }
    }


    function setDayInfo(data){
        $('#news_text').text(data.day_info.news);

        var progress = data.day_info.progress;
        $('#user_progress_bar').css('width', progress+'%').attr('aria-valuenow', progress);
        $('#user_progress_bar').text(progress+'%');
        $('#field_day_comment').text(data.day_info.comment).attr("data-id", data.day_info.day_id);


        $("#day_progress").rateYo({
            rating: progress / 20,
            readOnly: true
        });
        $("#day_progress").rateYo("rating", progress / 20);

    }

    function setTodayPractise(practises){
        $('.diary_rows').hide();
        var day7_practise = 0;

        $.each(practises, function (i, item) {
            if (item.logic.indexOf("day_seven_") !== -1 &&  parseInt(item.logic.replace(/\D/g, "")) >= 7) {
                day7_practise = item;
            }

            switch (item.code){
                case "meditation":
                    $('#row_meditation').show();
                    $('#field_meditation_plan').text("План: " + item.target + " мин");

                    var facts = ["","","",""];
                    if (item.fact !== null) {
                        facts = item.fact.split(",");
                    }

                    $('.practise_meditation').hide().attr("data-id", item.id);
                    if (item.logic.split("/")[2] >= 1){ $('#field_meditation_fact_1').val(facts[0]).show();  }
                    if (item.logic.split("/")[2] >= 2){ $('#field_meditation_fact_2').val(facts[1]).show();  }
                    if (item.logic.split("/")[2] >= 3){ $('#field_meditation_fact_3').val(facts[2]).show();  }
                    if (item.logic.split("/")[2] >= 4){ $('#field_meditation_fact_4').val(facts[4]).show();  }

                    break;
                case "halfbath":
                    $('#row_halfbath').show();
                    $('#field_halfbath_fact').prop("checked", item.fact === "true").attr("data-id", item.id);
                    break;

                case "asana":
                    $('#row_asana').show();
                    $('#field_asana').prop("checked", item.fact === "true").attr("data-id", item.id);
                    break;

                case "kaoshiki":
                    $('#row_kaoshiki').show();
                    $('#field_kaoshiki_plan').text("План: " + item.target + " мин");
                    $('#field_kaoshiki_fact').val(item.fact).attr("data-id", item.id);
                    break;

                case "tongue_clean":
                    $('#row_tongue_clean').show();

                    $('#field_tongue_clean_0').prop("checked", item.fact.split(",")[0] === "true").attr("data-id", item.id);
                    $('#field_tongue_clean_1').prop("checked", item.fact.split(",")[1] === "true").attr("data-id", item.id);
                    break;

                case "wakeup":
                    $('#row_wakeup').show();

                    $('#wakeup_today')     .text('Время для отхода ко сну ' + item.logic.split(",")[0]);
                    $('#wakeup_tomorrow')  .text('Время подъема на завтра ' + item.logic.split(",")[1]);

                    $('#field_wakeup_plan')        .text("План: " + item.target);
                    $('#field_wake_up_fact_hour')  .val(item.fact.split(":")[0]).attr("data-id", item.id);
                    $('#field_wake_up_fact_minute').val(item.fact.split(":")[1]).attr("data-id", item.id);

                    var date_today = new Date();
                    console.log("setTodayPractise");
                    var month = date_today.getMonth() + 1;
                    month = month < 10 ? "0" + month : month;
                    var day = date_today.getDate() ;
                    day = day < 10 ? "0" + day : day;

                    var today_string = date_today.getFullYear() + "-" + month + "-" + day;
                    console.log(today_string);
                    console.log(item.last_update);

                    if (item.last_update === today_string){
                        $('#wakeup_fact_div')        .hide();
                    }


                    break;

                case "vegetarian":
                    $('#row_vegetarian').show();
                    $('#row_vegetarian_text').text(item.name);
                    $('#field_vegetarian').prop("checked", item.fact === "true").attr("data-id", item.id);
                    break;
                case "yoga_diet":
                    $('#row_yoga_diet').show();
                    $('#row_yoga_diet_text').text(item.name);
                    $('#field_yoga_diet').prop("checked", item.fact === "true").attr("data-id", item.id);
                    break;
                case "no_snacking":
                    $('#row_no_snacking').show();
                    $('#field_no_snacking').prop("checked", item.fact === "true").attr("data-id", item.id);
                    break;

                case "water":
                    $('#row_water').show();
                    $('#field_water_plan').text("План: " + item.target + " мл");
                    $('#field_water_fact').val(item.fact).attr("data-id", item.id);
                    break;
                case "no_sugar":
                    $('#row_no_sugar').show();
                    $('#field_no_sugar').prop("checked", item.fact === "true").attr("data-id", item.id);
                    break;
                case "no_fries":
                    $('#row_no_fries').show();
                    $('#field_no_fries').prop("checked", item.fact === "true").attr("data-id", item.id);
                    break;
                case "yoga_diet":
                    $('#row_yoga_diet').show();
                    $('#field_yoga_diet').prop("checked", item.fact === "true").attr("data-id", item.id);
                    break;
                case "no_coffe":
                    $('#row_no_coffe').show();
                    $('#field_no_coffe').prop("checked", item.fact === "true").attr("data-id", item.id);
                    break;

                case "ten_ahimsa":
                    $('#row_ahimsa').show();
                    $('#field_ahimsa').prop("checked", item.fact === "true").attr("data-id", item.id);
                    break;
                case "ten_asteya":
                    $('#row_asteya').show();
                    $('#field_asteya').prop("checked", item.fact === "true").attr("data-id", item.id);
                    break;
                case "ten_satya":
                    $('#row_satya').show();
                    $('#field_satya').prop("checked", item.fact === "true").attr("data-id", item.id);
                    break;
                case "ten_aparigraha":
                    $('#row_aparigraha').show();
                    $('#field_aparigraha').prop("checked", item.fact === "true").attr("data-id", item.id);
                    break;
                case "ten_brahma":
                    $('#row_brahma').show();
                    $('#field_brahma').prop("checked", item.fact === "true").attr("data-id", item.id);
                    break;
                case "ten_santosha":
                    $('#row_santosha').show();
                    $('#field_santosha').prop("checked", item.fact === "true").attr("data-id", item.id);
                    break;
                case "ten_shaocha":
                    $('#row_shaocha').show();
                    $('#field_shaocha').prop("checked", item.fact === "true").attr("data-id", item.id);
                    break;
                case "ten_tapah":
                    $('#row_tapah').show();
                    $('#field_tapah').prop("checked", item.fact === "true").attr("data-id", item.id);
                    break;
                case "ten_svadhyaya":
                    $('#row_svadhyaya').show();
                    $('#field_svadhyaya').prop("checked", item.fact === "true").attr("data-id", item.id);
                    break;
                case "ten_ishvara":
                    $('#row_ishvara').show();
                    $('#field_ishvara').prop("checked", item.fact === "true").attr("data-id", item.id);
                    break;


                case "psy_gratitude":
                    $('#row_gratitude').show();
                    $('#field_gratitude').prop("checked", item.fact === "true").attr("data-id", item.id);
                    break;
                case "psy_value":
                    $('#row_value').show();
                    $('#field_value').prop("checked", item.fact === "true").attr("data-id", item.id);
                    break;
                case "psy_square":
                    $('#row_square').show();
                    $('#field_square').prop("checked", item.fact === "true").attr("data-id", item.id);
                    break;
                case "psy_targets":
                    $('#row_targets').show();
                    $('#field_targets').prop("checked", item.fact === "true").attr("data-id", item.id);
                    break;
                case "psy_prioritets":
                    $('#row_prioritets').show();
                    $('#field_prioritets').prop("checked", item.fact === "true").attr("data-id", item.id);
                    break;
                case "psy_moments":
                    $('#row_moments').show();
                    $('#field_moments').prop("checked", item.fact === "true").attr("data-id", item.id);
                    break;


                case "therapy":
                    $('#row_therapy').show();
                    $('#field_therapy').prop("checked", item.fact === "true").attr("data-id", item.id);
                    break;

            }



        });


        if (day7_practise !== 0) {
            $('#modal_label_practise_continue').text("Продолжить практику " + day7_practise.name + "?");
            $('.btn_practise_continue').attr("data-id", day7_practise.id);
            $('#modal_practise_continue').modal("show");
        }
    }

    $('#day_up').click(function () {
        $.ajax({
            type: "POST",
            url:   api_url + "day_up",
            data: {
            },
            headers: {
                'Authorization': 'Token token=' + cookie_token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (data) {
                console.log("save_comment");
                start("update");
            },
            failure: function (errMsg) {
                alert(errMsg);
            }
        });

    });
    $('#field_day_comment').on('change keyup paste', function () {
        $.ajax({
            type: "POST",
            url:   api_url + "save_comment",
            data: {
                day_id:  $(this).attr("data-id"),
                comment: $(this).val()
            },
            headers: {
                'Authorization': 'Token token=' + cookie_token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (data) {
                console.log("save_comment");

            },
            failure: function (errMsg) {
                alert(errMsg);
            }
        });

    });
    $('.practise_meditation').on('change keyup paste', function () {
       var fact = "";
       fact += $('#field_meditation_fact_1').val() + ",";
       fact += $('#field_meditation_fact_2').val() + ",";
       fact += $('#field_meditation_fact_3').val() + ",";
       fact += $('#field_meditation_fact_4').val();

       console.log(fact);
        sendFact($(this).attr("data-id"), fact);
    });
    $('#field_kaoshiki_fact, #field_water_fact').on('change keyup paste', function () {
       sendFact($(this).attr("data-id"), $(this).val());
    });
    $('#field_tongue_clean_0, #field_tongue_clean_1').on('change keyup paste', function () {
        var fact = $('#field_tongue_clean_0').is(':checked') + "," + $('#field_tongue_clean_1').is(':checked');
        console.log(fact);
        sendFact($(this).attr("data-id"),fact);
    });
    $('#field_wake_up_fact_hour, #field_wake_up_fact_minute').on('change keyup paste', function () {
        var fact = $('#field_wake_up_fact_hour').val() + ":" + $('#field_wake_up_fact_minute').val();
        console.log(fact);
        sendFact($(this).attr("data-id"), fact);
    });

    $('.day_practises_cb').click(function (){

        sendFact($(this).attr("data-id"), $(this).is(':checked'));
    });

    function sendFact(practise_id, fact){
        $.ajax({
            type: "POST",
            url:   api_url + "set_practise_fact",
            data: {
                practise_id: practise_id,
                fact:        fact
            },
            headers: {
                'Authorization': 'Token token=' + cookie_token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (data) {
                $("#day_progress").rateYo("rating", data.progress / 20);
            },
            failure: function (errMsg) {
                alert(errMsg);
            }
        });
    }


    function setUserPractises(practises){
        var content = "";
        var show_base_question = "";

        $.each(practises, function (i, item) {

            if (item.logic === "") {
                show_base_question = item.id;
            } else {
                content += '<div class="div_practise">';
                content += '<p class="practise_name">' + item.name + '</p>';

                if (hard_questions.includes(item.code)){
                    content += '<img src="img/settings.png" class="practise_settings" data-id="' + item.id + '" data-code="' + item.code + '" data-name="' + item.name + '"/>';
                }

                if (item.logic !== "0"){
                    var switch_id = "practise_switch_" + item.code;
                    var checked   = item.active ? "checked" : "";
                    content += '<div class="material-switch practise_switch">';
                    content += '<input ' + checked + ' id="' + switch_id + '" class="btn_practise_switch" type="checkbox"  data-id="' + item.id + '"/>';
                    content += '<label for="' + switch_id + '" class="label-success"></label>';
                    content += '</div>';
                }

                content += '</div>';

            }

        });

        $("#user_practises").empty().append(content);


        if (show_base_question !== ""){
            showPractiseSettings(show_base_question);
        }
    }
    $(document).on('click','.btn_practise_continue',function(){

        $.ajax({
            type: "POST",
            url:   api_url + "practise_continue",
            data: {
                practise_id: $(this).attr("data-id"),
                status:      $(this).attr("data-logic")
            },
            headers: {
                'Authorization': 'Token token=' + cookie_token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (data) {
                console.log(data);
                alert("Сохранили");
                $('#modal_practise_continue').modal("hide");
                start("update");
            },
            failure: function (errMsg) {
                alert(errMsg);
            }
        });
    });

    $('.button-checkbox').each(function () {

        // Settings
        var $widget = $(this),
            $button = $widget.find('button'),
            $checkbox = $widget.find('input:checkbox'),
            color = $button.data('color'),
            settings = {
                on: {
                    icon: 'glyphicon glyphicon-check'
                },
                off: {
                    icon: 'glyphicon glyphicon-unchecked'
                }
            };

        // Event Handlers
        $button.on('click', function () {
            $checkbox.prop('checked', !$checkbox.is(':checked'));
            $checkbox.triggerHandler('change');
            updateDisplay();
        });
        $checkbox.on('change', function () {
            updateDisplay();
        });

        // Actions
        function updateDisplay() {
            var isChecked = $checkbox.is(':checked');

            // Set the button's state
            $button.data('state', (isChecked) ? "on" : "off");

            // Set the button's icon
            $button.find('.state-icon')
                .removeClass()
                .addClass('state-icon ' + settings[$button.data('state')].icon);

            // Update the button's color
            if (isChecked) {
                $button
                    .removeClass('btn-default')
                    .addClass('btn-' + color + ' active');
            }
            else {
                $button
                    .removeClass('btn-' + color + ' active')
                    .addClass('btn-default');
            }
        }

        // Initialization
        function init() {

            updateDisplay();

            // Inject the icon if applicable
            if ($button.find('.state-icon').length == 0) {
                $button.prepend('<i class="state-icon ' + settings[$button.data('state')].icon + '"></i> ');
            }
        }
        init();
    });


    function activePractise(practise_id, status){
        $.ajax({
            type: "POST",
            url:   api_url + "practise_switch",
            data: {
                practise_id: practise_id,
                status:      status
            },
            headers: {
                'Authorization': 'Token token=' + cookie_token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (data) {
                console.log(data);
                if (data.error === 0) {
                    start("update");
                } else {

                    alert("Сначала задайте логику практике");
                }
            },
            failure: function (errMsg) {
                alert(errMsg);
            }
        });
    }
    $(document).on('click','.btn_practise_switch',function(){

        activePractise($(this).attr("data-id"), $(this).is(':checked'))

    });





    var settings_practise = {}; //Объект практики для настройки
    function showPractiseSettings(id){

        $.ajax({
            type: "GET",
            url:   api_url + "get_practise_info",
            data: {
                practise_id: id
            },
            headers: {
                'Authorization': 'Token token=' + cookie_token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (data) {
                console.log(data);
                $('#btn_practise_save').attr('data-id', data.practise.id);
                $('#modal_practise_settings').modal('show');
                $('#modal_label_practise_settings').text('Настройка практики \"' + data.practise.name + '\"');
                settings_practise = data.practise;

                $('.settings_practise_div').hide();
                if (data.practise.logic === ""){
                    $('#settings_question').show();
                } else {
                    $('#settings_question').hide();
                    showSettingForm(data.practise.code);
                    setValueSettingForm(data.practise.code, data.practise.logic);
                }
            },
            failure: function (errMsg) {
                alert(errMsg);
            }
        });
    }



    $(document).on('click','.settings_question',function(){
        if ($(this).val() == "no") {
            $.ajax({
                type: "POST",
                url:   api_url + "set_practise_logic",
                data: {
                    practise_id:     $('#btn_practise_save').attr('data-id'),
                    logic: "no"
                },
                headers: {
                    'Authorization': 'Token token=' + cookie_token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: function (data) {
                    console.log(data);
                    $('#modal_practise_settings').modal('hide');
                    alert("Вы всегда сможете активировать и настроить практику когда и как вам будет комфортно");
                },
                failure: function (errMsg) {
                    alert(errMsg);
                }
            });
        } else {
            showSettingForm(settings_practise.code);
            setValueSettingForm(settings_practise.code, "");
        }
    });

    $(document).on('click','.settings_therapy',function(){
        $('#btn_practise_save').attr("data-logic", $(this).val());
    });

    var hard_questions = ["meditation", "asana", "kaoshiki", "wakeup", "water", "therapy", "yoga_diet", "vegetarian"];

    function showSettingForm(code){

        if (hard_questions.includes(code)) {

            switch (code){
            case "meditation":
                $('#settings_day_of_weeks').show();
                $('#settings_day_count').show();
                $('#settings_numbers').show();

                break;
            case "asana":
                $('#settings_day_of_weeks').show();
                break;
            case "kaoshiki":
                $('#settings_day_of_weeks').show();
                $('#settings_numbers').show();
                break;
            case "wakeup":
                $('#settings_wakeup').show();
                break;
            case "water":
                $('#settings_water').show();
                break;
            case "therapy":
                $('#settings_therapy').show();
                break;
            case "yoga_diet":
                $('#settings_start_date').show();
                $('#settings_yoga_diet').show();
                break;
            case "vegetarian":
                $('#settings_start_date').show();
                $('#settings_vegetarian').show();
                break;
        }
        } else {

            $('#btn_practise_save').click();

        }
    }
    function setValueSettingForm(code, logic1){

        var logic = logic1.split("/");

        if (logic1 == "") {



            $('.weekday').prop('checked', true);


            $('#field_settings_numbers_start') .val();
            $('#field_settings_numbers_finish').val();
            $('#field_settings_numbers_step')  .val();
            $('#field_settings_times')         .val(logic[2]);

            $('#field_question_wake_up_fact_hour')    .val(values[0].split(":")[0]);
            $('#field_question_wake_up_fact_minute')  .val(values[0].split(":")[1]);
            $('#field_question_wake_up_target_hour')  .val(values[1].split(":")[0]);
            $('#field_question_wake_up_target_minute').val(values[1].split(":")[1]);
            $('#field_question_wake_up_step')         .val(values[2]);

            $('#field_settings_water_start') .val(numbers[0]);
            $('#field_settings_water_finish').val(numbers[1]);
            $('#field_settings_water_step')  .val(numbers[2]);

            $('.settings_therapy').removeClass('active');

            $('#field_settings_yoga_diet_tamas') .val(logic[0].split(",")[0]);
            $('#field_settings_yoga_diet_radjas').val(logic[0].split(",")[1]);

            $('#field_settings_start_date').val(logic[1]);

            $('#field_settings_vegetarian_0').val(logic[0].split(",")[0]);
            $('#field_settings_vegetarian_1').val(logic[0].split(",")[1]);
            $('#field_settings_vegetarian_2').val(logic[0].split(",")[2]);

            $('#field_settings_start_date').val(logic[1]);

        } else {
            switch (code){
                case "meditation":
                    setCheckedDays(logic[0]);
                    setPractiseNumbers(logic[1]);
                    $('#field_settings_times').val(logic[2]);
                    break;
                case "asana":
                    setCheckedDays(logic[0]);
                    break;
                case "kaoshiki":
                    setCheckedDays(logic[0]);
                    setPractiseNumbers(logic[1]);
                    break;
                case "wakeup":
                    var values = logic[0].split(",");
                    $('#field_question_wake_up_fact_hour')    .val(values[0].split(":")[0]);
                    $('#field_question_wake_up_fact_minute')  .val(values[0].split(":")[1]);
                    $('#field_question_wake_up_target_hour')  .val(values[1].split(":")[0]);
                    $('#field_question_wake_up_target_minute').val(values[1].split(":")[1]);
                    $('#field_question_wake_up_step')         .val(values[2]);

                    break;
                case "water":
                    var numbers = logic[0].split(",");
                    $('#field_settings_water_start') .val(numbers[0]);
                    $('#field_settings_water_finish').val(numbers[1]);
                    $('#field_settings_water_step')  .val(numbers[2]);
                    break;
                case "therapy":
                    $('.settings_therapy').removeClass('active');
                    if (logic[0].split(",")[0] == "1"){
                        $('#settings_therapy_1').addClass("active");
                    } else {
                        $('#settings_therapy_0').addClass("active");}


                    break;
                case "yoga_diet":
                    $('#field_settings_yoga_diet_tamas') .val(logic[0].split(",")[0]);
                    $('#field_settings_yoga_diet_radjas').val(logic[0].split(",")[1]);

                    $('#field_settings_start_date').val(logic[1]);
                    break;
                case "vegetarian":
                    $('#field_settings_vegetarian_0').val(logic[0].split(",")[0]);
                    $('#field_settings_vegetarian_1').val(logic[0].split(",")[1]);
                    $('#field_settings_vegetarian_2').val(logic[0].split(",")[2]);

                    $('#field_settings_start_date').val(logic[1]);
                    break;
            }

        }
    }

    function getCheckedDays(){
        var massive = [];
        massive.push($('#settings_days_1').is(':checked') ? "1" : "0");
        massive.push($('#settings_days_2').is(':checked') ? "1" : "0");
        massive.push($('#settings_days_3').is(':checked') ? "1" : "0");
        massive.push($('#settings_days_4').is(':checked') ? "1" : "0");
        massive.push($('#settings_days_5').is(':checked') ? "1" : "0");
        massive.push($('#settings_days_6').is(':checked') ? "1" : "0");
        massive.push($('#settings_days_7').is(':checked') ? "1" : "0");

        console.log("massive.toString()  ", massive.toString());
        return massive.toString();
    }
    function setCheckedDays(d){
        var days = d.split(",");
        $('#settings_days_1').prop('checked', days[0] == "1") ;
        $('#settings_days_2').prop('checked', days[1] == "1") ;
        $('#settings_days_3').prop('checked', days[2] == "1") ;
        $('#settings_days_4').prop('checked', days[3] == "1") ;
        $('#settings_days_5').prop('checked', days[4] == "1") ;
        $('#settings_days_6').prop('checked', days[5] == "1");
        $('#settings_days_7').prop('checked', days[6] == "1") ;


    }
    function setPractiseNumbers(num){
        var numbers = num.split(",");
        $('#field_settings_numbers_start') .val(numbers[0]);
        $('#field_settings_numbers_finish').val(numbers[1]);
        $('#field_settings_numbers_step')  .val(numbers[2]);
    }


    $('#btn_practise_save').click(function (){
        var logic = "";

        var message = "";
        var start  = 0;
        var finish = 0;
        var step   = 0;
        switch (settings_practise.code){
            case "meditation":
                start  = $('#field_settings_numbers_start').val();
                finish = $('#field_settings_numbers_finish').val();
                step   = $('#field_settings_numbers_step').val();
                var times = $('#field_settings_times').val();

                if (start == "") {
                    message = "Укажите стартовое время медитации. ";
                }
                if (finish == "") {
                    message = "Укажите планируемое время медитации. ";
                }
                if (step == "") {
                    message = "Укажите планируемый шаг. ";
                }
                if (finish < 5) {
                    message = "Планируемое время медитации должно быть больше 5 минут. ";
                }
                if (finish < start) {
                    message = "Планируемое время медитации не может быть меньше стартового ";
                }
                if (step < 1) {
                    message = "Шаг должен быть больше 0. ";
                }
                if (times == "") {
                    message = "Укажите кол-во медитаций";
                }
                if (times < 1 || times > 4) {
                    message = "Допустимое кол-во медитаций от 1 до 4";
                }

                logic += getCheckedDays() + "/";
                logic += start  + ",";
                logic += finish + ",";
                logic += step   + "/";
                logic += times;
                break;
            case "asana":
                logic += getCheckedDays();
                break;
            case "kaoshiki":

                start  = $('#field_settings_numbers_start').val();
                finish = $('#field_settings_numbers_finish').val();
                step   = $('#field_settings_numbers_step').val();

                if (start == "") {
                    message = "Укажите стартовое время каошики. ";
                }
                if (finish == "") {
                    message = "Укажите планируемое время каошики. ";
                }
                if (step == "") {
                    message = "Укажите планируемый шаг. ";
                }
                if (finish < 5) {
                    message = "Планируемое время каошики должно быть больше 5 минут. ";
                }
                if (finish < start) {
                    message = "Планируемое время каошики не может быть меньше стартового ";
                }
                if (step < 1) {
                    message = "Шаг должен быть больше 0. ";
                }
                if (times == "") {
                    message = "Укажите кол-во медитаций";
                }
                if (times < 1 || times > 4) {
                    message = "Допустимое кол-во медитаций от 1 до 4";
                }

                logic += getCheckedDays() + "/";
                logic += start  + ",";
                logic += finish + ",";
                logic += step ;
                break;

            case "wakeup":
                var fact_hour     = $('#field_question_wake_up_fact_hour').val();
                var fact_minute   = $('#field_question_wake_up_fact_minute').val();
                var target_hour   = $('#field_question_wake_up_target_hour').val()  ;
                var target_minute = $('#field_question_wake_up_target_minute').val();
                var step          = $('#field_question_wake_up_step').val();

                if (fact_hour == "" || fact_minute == "" || target_hour == "" || target_minute == "" ) {
                    message = "Заполните все поля";
                }

                if (step < 1) {
                    message = "Шаг должен быть больше 0. ";
                }

                if (fact_hour * 60 + fact_minute < target_hour * 60 + target_minute ) {
                    message = "Фактическое время не может быть раньше целевого.";
                }

                logic += $('#field_question_wake_up_fact_hour').val()   + ":";
                logic += $('#field_question_wake_up_fact_minute').val() + ",";
                logic += $('#field_question_wake_up_target_hour').val()   + ":";
                logic += $('#field_question_wake_up_target_minute').val() + ",";
                logic += $('#field_question_wake_up_step').val();
                break;

            case "water":
                start  = $('#field_settings_water_start').val();
                finish = $('#field_settings_water_finish').val();
                step   = $('#field_settings_water_step').val();

                if (start == "") {
                    message = "Укажите стартовое время медитации. ";
                }
                if (finish == "") {
                    message = "Укажите планируемое время медитации. ";
                }
                if (step == "") {
                    message = "Укажите планируемый шаг. ";
                }
                if (finish < 5) {
                    message = "Планируемое время медитации должно быть больше 5 минут. ";
                }
                if (step < 1) {
                    message = "Шаг должен быть больше 0. ";
                }

                logic += start  + ",";
                logic += finish + ",";
                logic += step ;

                break;

            case "therapy":
                if ($('#btn_practise_save').attr("data-logic") !== "0") {
                    logic = $('#btn_practise_save').attr("data-logic");
                } else {
                    alert("Сначала выберите дни");
                    return;
                }
                break;

            case "yoga_diet":

                var stage_0 = $('#field_settings_yoga_diet_tamas').val();
                var stage_1 = $('#field_settings_yoga_diet_radjas').val();
                var start   = $('#field_settings_start_date').val() ;
                console.log("yoga_diet");
                console.log(start);
                console.log(typeof start);

                if (stage_0 < 5 || stage_0 > 14 || stage_0 === ""){
                    message = "Все этапы должны быть в диапазоне от 5 до 14 дней"}
                if (stage_1 < 5 || stage_1 > 14 || stage_1 === ""){
                    message = "Все этапы должны быть в диапазоне от 5 до 14 дней"}
                if (start === ""){
                    message = "Заполните дату старта"}

                logic += stage_0 + ",";
                logic += stage_1 + "/";
                logic += start;
                break;
            case "vegetarian":
                var stage_0 = $('#field_settings_vegetarian_0').val();
                var stage_1 = $('#field_settings_vegetarian_1').val();
                var stage_2 = $('#field_settings_vegetarian_2').val();
                var start   = $('#field_settings_start_date').val() ;

                if (stage_0 < 5 || stage_0 > 14 || stage_0 == ""){
                    message = "Все этапы должны быть в диапазоне от 5 до 14 дней"}
                if (stage_1 < 5 || stage_1 > 14 || stage_1 == ""){
                    message = "Все этапы должны быть в диапазоне от 5 до 14 дней"}
                if (stage_2 < 5 || stage_2 > 14 || stage_2 == ""){
                    message = "Все этапы должны быть в диапазоне от 5 до 14 дней"}
                if (start === ""){
                    message = "Заполните дату старта"}

                logic += stage_0 + ",";
                logic += stage_1 + ",";
                logic += stage_2 + "/";
                logic += start;

                break;


            default:
                logic = "1";
                break;
        }



        if (message !== ""){
            alert(message);
            return;
        }

        $.ajax({
            type: "POST",
            url:   api_url + "set_practise_logic",
            data: {
                practise_id: settings_practise.id,
                logic:       logic
            },
            headers: {
                'Authorization': 'Token token=' + cookie_token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (data) {
                console.log(data);
                alert("Изменения сохранены");
                $('#modal_practise_settings').modal('hide');
                functionStart();
            },


            failure: function (errMsg) {
                alert(errMsg);
            }
        });
    });

    function functionStart(){
        start("update");
    }



    $(document).on('click','.settings_days',function(){
        console.log("settings_days " + $(this).is(':checked'));
        console.log("$('input.settings_days').attr('data-day') " + $('input.settings_days[data-day="' + $(this).attr('data-day') + '"]'  ).is(':checked'));

        $('input.settings_days[data-day="' + $(this).attr('data-day') + '"]'  ).is(':checked');
    });

    $(document).on('click','.practise_settings',function(){
        console.log("practise_settings " + $(this).attr("data-id"));
        $('#settings_question').hide();

        showPractiseSettings($(this).attr("data-id"));
    });


    $('#link_intro_freedom').click(function (){
        $.ajax({
            type: "POST",
            url:   api_url + "read_intro_freedom",
            data: {},
            headers: {
                'Authorization': 'Token token=' + cookie_token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (data) {
                console.log(data);
            },
            failure: function (errMsg) {
                alert(errMsg);
            }
        });
    });
    $('#btn_base_info').click(function (){
        $.ajax({
            type: "POST",
            url:   api_url + "base_info_save",
            data: {},
            headers: {
                'Authorization': 'Token token=' + cookie_token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (data) {
                $('#modal_base_info').modal("hide");
                console.log(data);
            },
            failure: function (errMsg) {
                alert(errMsg);
            }
        });
    });






    var selected_courses = [];



    function changeCourses(course_code){
        console.log(selected_courses);

        var course_unselected = true;
        $.each(selected_courses, function (i, item) {
            if (item.code === course_code && item.priority !== 999) {
                course_unselected = false;
            }
        });

        console.log("course_unselected " + course_unselected);

        if (course_unselected){
            selected_courses.push({
                priority: selected_courses.length,
                code: course_code
            });
            $('.select_courses[data-code="' + course_code + '"]').css('background-color', '#c3ebc5');
            $('.select_course_prio[data-code="' + course_code + '"]').text(selected_courses.length).css('background-color', '#f99040');
        } else {

            var unselected_course = 0;
            $.each(selected_courses, function (i, item) {
                console.log(item.priority);
                if (item.code === course_code && item.priority !== 999) {
                    unselected_course = i;
                }
            });

            selected_courses.splice(unselected_course, 1);
            $('.select_courses[data-code="' + course_code + '"]').css('background-color', '#ffffff');
            $('.select_course_prio[data-code="' + course_code + '"]').text("").css('background-color', 'white');


            $.each(selected_courses, function (i, item) {
                console.log(item.priority);
                if (i != item.priority) {
                    item.priority = i;
                    var priority = i + 1;
                    $('.select_course_prio[data-code="' + item.code + '"]').text(priority).css('background-color', '#f99040');

                }
            });
        }
    }
    $(document).on('click','.select_courses',function(){
        changeCourses($(this).attr("data-code"));
        $('.courses_save').show();
        $('.show_course_materials ').removeClass("show_course_materials").addClass("select_courses");

    });


    $(document).on('click','.show_course_materials',function(){
        $('#modal_label_course_materials').text('Материалы курса \"' + $(this).attr("data-name") + '\"');


        $.ajax({
            type: "GET",
            url:  api_url + "get_course_materials",
            data: { course_code: $(this).attr("data-code")},
            headers: {
                'Authorization':'Token token=' + cookie_token,
                'Content-Type':'application/x-www-form-urlencoded'
                },
            success: function(data){
                console.log(data);
                console.log(Object.keys(data.materials).length);



                var blocks = Object.keys(data.materials).length;
                var width = 100 / blocks + "%";
                var btns = "";
                var divs = "";

                Object.keys(data.materials).forEach(function (value, i) {

                    var tab_id = "material_tab_" + i;
                    divs += '<div id="' + tab_id + '" class="materials_blocks" hidden></div>';

                    if (i === 0){
                        btns += '<button value="' + tab_id + '" type="button" class="active btns_materials_switcher btn btn-default" style="width: ' + width + '">' + value + '</button>';
                    } else {
                        btns += '<button value="' + tab_id + '" type="button" class="btns_materials_switcher btn btn-default" style="width: ' + width + '">' + value + '</button>';                        }
                });

                $('#materials_switcher').empty().append(btns);
                if (blocks <= 1) {
                    $('#materials_switcher').empty();
                }

                $('#materials_tables').empty().append(divs);
                showMaterialsBlock("material_tab_0");

                var i = 0;
                for (const [key, value] of Object.entries(data.materials)) {
                    setCourseMaterials("material_tab_" + i, value);
                    i += 1;
                }

                $('#page_course_materials').show();
                $('#page_courses').hide();
            },
            failure: function(errMsg) {
                alert(errMsg.toString());
            }
        });
    });
    function setCourseMaterials(id, materials){
        console.log("setCourseMaterials ", materials);
        var content = "";
        $.each(materials, function (i, item) {
            var row_class = "";
            var action_class = "";
            switch (item.status) {
                case 0:
                    row_class = "material_readed";
                    break;
                case 1:
                    row_class = "material_unread";
                    break;
                case 2:
                    row_class = "material_unbuy";
                    action_class = "material_buy";
                    break;
                case 3:
                    row_class = "material_unactive";
                    break;
            }

            var row_class_status = "";
            if (item.status === 3){
                row_class_status = "material_next_level";
            }

            var material_name = item.name;
            content += '<div class="' + row_class + ' ' + row_class_status + ' ' + action_class + ' div_materials" data-id="'+ item.id +'">';

            if (item.status > 1){
                content += '<a class="material_name" href="#"                >' + material_name + '</a>';
            } else {
                content += '<a class="material_name" href="' + item.link + '" target="_blank">' + material_name + '</a>';
            }

            if (item.practise_id !== 0) {
                content += '<img src="img/practise.png" class="material_practise"  data-toggle="tooltip" data-placement="top" title="После изучения этого материала вам станет доступна новая практика" />';
            }



            content += '</div>';
        });

        $('#' + id).empty().append(content);
    }
    $(document).on('click','.material_next_level',function(){
        alert("Материалы этого уровня недоступны. Сначала изучите все материалы из прошлого уровня");
    });

    $(document).on('click','.btns_materials_switcher',function(){
        $('.btns_materials_switcher').removeClass("active");
        $(this).addClass("active");

        showMaterialsBlock($(this).val());
    });
    function showMaterialsBlock(id){
        $('.materials_blocks').hide();
        $('#' + id).show();
    }

    $(document).on('click','.material_buy',function(){
        console.log("material_buy " + $(this).attr("data-id"));
        $.ajax({
            type: "POST",
            url:  api_url + "buy_material",
            data: { material_id:  $(this).attr("data-id")},
            headers: {
                'Authorization':'Token token=' + cookie_token,
                'Content-Type':'application/x-www-form-urlencoded'
            },
            success: function(data){
                if (data.error === 1) {
                    alert("Недостаточно лотосов");
                } else {
                    openInNewTab(data.link);
                    $("#page_course_materials").hide();
                    $("#page_courses").show();
                    start("update");
                }
            },
            failure: function(errMsg) {
                alert(errMsg.toString());
            }
        });
    });

    $('#btn_courses_edit').click(function (){
        $('.courses_save').show();
        $('.show_course_materials ').removeClass("show_course_materials").addClass("select_courses");

    });
    $('.courses_save').click(function (){
        if (selected_courses.length < 3 ){
            alert("Выберите хотя бы 3 курса")
        } else {
            $.ajax({
                type: "POST",
                url:  api_url + "add_courses",
                data: { courses:  JSON.stringify(selected_courses)},
                headers: {
                    'Authorization':'Token token=' + cookie_token,
                    'Content-Type':'application/x-www-form-urlencoded'
                },
                success: function(data){
                    alert("Сохранили!");
                    start("init");
                },
                failure: function(errMsg) {
                    alert(errMsg.toString());
                }
            });
        }
    });
    $('.btn_back').click(function() {
        $('#page_courses').show();
        $('#page_course_materials').hide();
    });

    function setCourses(courses){
        var content = "";

        $.each(courses.courses, function (i, item) {
            if (item.priority != 999) {
                content += '<div data-code="' + item.code + '"  data-name="' + item.name + '"   class="show_course_materials diary_body">';
            } else {
                content += '<div data-code="' + item.code + '"  data-name="' + item.name + '"   class="select_courses diary_body">';
            }

            content += '<h4 align="center"  data-action="show_material" >' + item.name + '</h4>';
            content += '<h5>' + item.description + '</h5>';
            content += '<div data-code="' + item.code + '" class="select_course_prio show_course_prio"></div></div>';
        });
        $("#actual_curses, #all_curses ").empty().append(content);

        selected_courses = [];
        $.each(courses.courses, function (i, item) {
            if (item.priority != 999) {
                var prio = item.priority + 1;
                selected_courses.push({
                    priority: item.priority,
                    code:     item.code
                });
                $('.select_courses[data-code="'   +  item.code + '"]').css('background-color', '#c3ebc5');
                $('.select_course_prio[data-code="'    +  item.code + '"]').text(prio).css('background-color', '#f99040');
                $('.show_course_materials[data-code="' +  item.code + '"]').css('background-color', '#c3ebc5');
                $('.show_course_prio[data-code="'  +  item.code + '"]').text(prio).css('background-color', '#f99040');
            }
        });
    }




    function setBaseInfoFreedom(data){

    }










//Navigation

    function hide_all() {
        $('#page_load').hide();
        $('#page_login').hide();

        $('#page_diary').hide();
        $('#page_practises').hide();
        $('#page_courses').hide();
        $('#page_course_materials').hide();
        $('#page_bonuses').hide();
        $('#page_settings').hide();
    }


    $(document).on('click', '.nav-link-user',       function () {



        switch ($(this).attr("name")){
            case "nav_user_header":

                start("init");
                break;

            case "nav_user_diary":
                if (has_practise_today){
                    hide_all();
                    $('#page_diary').show();
                    break;
                } else {
                    alert("На сегодня нет практик. Изучите в курсе или активируйте на вкладке 'Практики' ");
                    return;
                }

            case "nav_user_courses":
                hide_all();
                $('#page_courses').show();
                break;
            case "nav_user_practises":
                if (has_practise_total){
                    hide_all();
                    $('#page_practises').show();
                    break;
                } else {
                    alert("У Вас еще нет практик. Изучите одну из в материалах ваших курсов");
                    return;
                }



            //case "nav_user_bonus":
            //    console.log("nav_user_bonus");
            //    $('#page_user_main').show();
            //    $('#page_user_bonus').show();
            //    break;
            case "nav_user_menu":
                hide_all();
                $('#btn_navbar_menu').click();
                break;

            case "nav_user_settings":
                hide_all();
                $('#page_user_settings').show();
                break;

            case "nav_user_support":
                openInNewTab("https://hyls.ru/donate");
                break;

            case "nav_faq":
                window.open("https://hyls.ru");
                break;
        }


    });

    $('#btn_forget_pass').click(function(){
        $.ajax({
            type: "POST",
            url: api_url + "forget_pass",
            data: {email: $('#field_forget_email').val()},
            headers: {
                'Authorization': 'Token token=' + cookie_token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (data) {
                if (data.error == 0){
                    $('#modal_forget_pass').modal('hide');
                    alert(alert_recovery_finish);
                } else {
                    alert(alert_recovery_error);
                }
            }
        });
    });


    $('.btn_footer_chat').click(function() {

        if (bonus_chat_active) {
            console.log(".btn_footer_chat");

            var win = window.open(chat_url, '_blank');
            win.focus();
        } else {
            hide_all();
            alert("Что бы получить доступ к чату, активируйте соответсвующий Бонус");
            $('#page_user_bonus').show();
        }

    });
    $('#btn_footer_diary').click(function() {
        hide_all();
        $('#page_user_materials').show();
    });
    $('#btn_footer_support').click(function() {
        hide_all();

    });
    $('#btn_footer_settings').click(function() {
        hide_all();

    });


    $('#btn_exit').click(function () {
        setCookie(cookie_name_token);
        cookie_token = getCookie(cookie_name_token);
        ifLogin();
        hide_all();
        $("#page_login").show();
    });
    $('#wait_logo').click(function (){
            $('#hidden_info_wait').show();
        });









    $('.navbar-collapse a').click(function(){
        if ($(this)[0].name != "select_marafon") {
            $(".navbar-collapse").collapse('hide');
        }
    });


    function setCookie(name, value, options) {
        options = options || {};
        var expires = options.expires;

        if (typeof expires == "number" && expires) {
            var d = new Date();
            d.setTime(d.getTime() + expires * 1000);
            expires = options.expires = d;
        }
        if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
        }

        value = encodeURIComponent(value);
        var updatedCookie = name + "=" + value;
        for (var propName in options) {
            updatedCookie += "; " + propName;
            var propValue = options[propName];
            if (propValue !== true) {
                updatedCookie += "=" + propValue;
            }
        }
        document.cookie = updatedCookie;
    }
    function getCookie(name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
});
