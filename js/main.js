$(document).ready(function () {
  var api_url      = "https://hyls-api.ru:443/";

    var cookie_name_token = "freedom_token";
    var cookie_name_id    = "freedom_id";
    var cookie_token      = getCookie(cookie_name_token);

    var alert_recovery_finish = "Пароль выслан на вашу почту";
    var alert_recovery_error  = "Учетная запись с такой почтой не обнаружена";
    var alert_login_error  = "Вход не выполнен. Проверьте корректность введенных данных";

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

    function ifLogin()  {
     //   var ProgressBar = require('progressbar.js');

// Assuming we have an empty <div id="container"></div> in
// HTML




        if (typeof cookie_token !== 'undefined' && cookie_token !== 'undefined') {
            start();
        } else {
            //hide_all();
            var params = parse_query_string();
            if (typeof params.access_token == 'undefined') {
                if (typeof params.login_from !== 'undefined' && params.login_from === "email") {
                    $('#wrapper_main').show();
                    login_user(params.email, params.pass);
                } else {
                    console.log("no 21 da");
                    $("#wrapper_login").show();
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
    }

    function login_user(phone, pass){
        var token_web = Base64.encode(phone + ":" + pass);

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


    $('#btn_login').click(function () {

        console.log("btn_login");
       // var token_web = Base64.encode(phone + ":" + pass);

        var token_web = Base64.encode($('#login').val() + ":" + $('#password').val());
        console.log("token_web " + token_web);
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



    var courses_real= [];
    var courses_initial= [];
    var course_more_3   = false;



    function setUserInfo(info){
        $('.lotos_have').text("У вас есть " + info.lotos);

        $('.user_name')    .text(info.first_name);
        $('#user_name')     .val(info.first_name);
        $('#user_email')    .val(info.email);
        $('#user_password') .val(info.password);
    }
    $('#btn_update_profile').click(function(){

        if ($('#user_email').val() === "" || $('#user_email').val() === "" || $('#user_password').val() === "" ) {
            alert("Заполните все поля");
            return;
        }

        $.ajax({
            type: "POST",
            url:  api_url + "update_profile",
            data: {
                user_name:     $('#user_name')    .val(),
                user_email:    $('#user_email')   .val(),
                user_password: $('#user_password').val()
            },
            headers: {
                'Authorization':'Token token=' + cookie_token,
                'Content-Type':'application/x-www-form-urlencoded'
            },
            success: function(data){
                if (data.error === 0) {
                    setUserInfo(data.user);
                    alert("Обновили!");
                } else {
                    alert("Эта почта используется другим человеком");
                }
            },
            failure: function(errMsg) {
                alert(errMsg.toString());
            }
        });
    });

    function setCommonInfo(info){



        $('#diary_date').empty().append(info.diary_day + '<span class="icon-check"></span>');



        $('.statistics_common_days')       .css('width', info.common_days_p);
        $('.statistics_common_days_text')       .text(info.common_days_t);

        $('.statistics_common_materials')  .css('width', info.common_materials_p);
        $('.statistics_common_materials_text')  .text(info.common_materials_t);

        $('.statistics_common_percents')   .css('width', info.common_percents_p);
        $('.statistics_common_percents_text')   .text(info.common_percents_t);

        $('.statistics_common_days_in_row').css('width', info.common_days_in_row_p);
        $('.statistics_common_days_in_row_text').text(info.common_days_in_row_t);




        $('.statistics_week_percents')     .css('width', info.week_percents_p);
        $('.statistics_week_percents_text').text(info.week_percents_t);

        $('.statistics_week_days_in_row')     .css('width', info.week_days_in_row_p);
        $('.statistics_week_days_in_row_text').text(info.week_days_in_row_t);
    }

    function setDayInfo(day_info){
     //

        $('#progress_days')    .empty();
        $('#progress_progress').empty();
        $('.progress_title_progress').text(day_info.progress + "%");

        var days_progress = parseInt(100 * day_info.days_in_row / 7);
        var text = "";
        if ([0,5,6,7].includes(day_info.days_in_row)){
            text = day_info.days_in_row + " дней";
        } else if (day_info.days_in_row === 1) {
            text = "1 день"
        } else if ([2,3,4].includes(day_info.days_in_row)) {
            text = day_info.days_in_row + " дня"
        } else {
            text = "7+ дней";
            days_progress = 100;
        }
        $('.progress_title_days')    .text(text);

        text = "";
        switch (day_info.lotos) {
            case 0:
                text = "0 материалов";
                break;
            case 1:
                text = "1 материал";
                break;
            case 2:
                text = "2 материала";
                break;
            case 3:
                text = "3 материала";
                break;
            default:
                text = day_info.lotos + " материалов";
                break;
        }
        $('.progress_title_lotos')     .text(text);
        $('#available_materials_text') .text("Вам доступно " + text);


        var days_color    = "#334856";
        var bar_days = new ProgressBar.Circle(progress_days, {
            color: days_color,
            // This has to be the same size as the maximum width to
            // prevent clipping
            strokeWidth: 6,
            trailWidth:  6,
            trailColor:  '#fff',
            easing: 'easeInOut',
            duration: 1400,
            text: {
                autoStyleContainer: false
            },
            from: { color: '#fff', width: 6 },
            to: { color: days_color, width: 6 },
            // Set default step function for all animate calls
            step: function(state, circle) {
                circle.path.setAttribute('stroke', days_color);
                circle.path.setAttribute('stroke-width', state.width);

                var value = Math.round(circle.value() * 100);
                circle.setText(value + '%');
            }
        });
        bar_days.text.style.position = 'center';
        bar_days.text.style.fontFamily = 'SF UI Display';
        bar_days.text.style.fontSize   = '16px';
        bar_days.text.style.fontWeight = 'bold';
        bar_days.animate(days_progress / 100);  // Number from 0.0 to 1.0


        var progress_color = "#46d344";
        var day_progress = day_info.progress;
        var bar_progress = new ProgressBar.Circle(progress_progress, {
            color: progress_color,
            // This has to be the same size as the maximum width to
            // prevent clipping
            strokeWidth: 6,
            trailWidth:  6,
            trailColor:  '#fff',

            easing: 'easeInOut',
            duration: 1400,
            text: {
                autoStyleContainer: false
            },
            from: { color: '#fff', width: 6 },
            to: { color: progress_color, width: 6 },
            // Set default step function for all animate calls
            step: function(state, circle) {
                circle.path.setAttribute('stroke', progress_color);
                circle.path.setAttribute('stroke-width', state.width);

                var value = Math.round(circle.value() * 100);
                circle.setText(value + "%");
            }
        });
        bar_progress.text.style.fontFamily = 'SF UI Display';
        bar_progress.text.style.fontSize   = '16px';
        bar_progress.text.style.fontWeight = 'bold';
        bar_progress.animate(day_progress / 100);  // Number from 0.0 to 1.0
        $('.progress_title_progress').text(day_progress + "%");


    }

    function start(){

        $.ajax({
            type: "GET",
            url:   api_url + "get_freedom_info",
            data: { user_time: new Date(), os: getOS()},
            headers: {
                'Authorization': 'Token token=' + cookie_token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (data) {
                console.log(data);

                if (data.courses.active_courses == 0) {
                    $('#wrapper_login')         .show();
                    $('#page_welcome')         .hide();
                    $('#page_login')         .hide();
                    $('#page_courses_select').show();
                    courses_initial= data.courses.courses;
                    setInitialCourses();
                } else {
                    $('#wrapper_login').hide();
                    $('#wrapper_main') .show();

                    setDayInfo(data.day_info);
                    setTodayPractise(data.day_info.day_practises);
                    $('#page_diary')   .show();

                    courses_real= data.courses.courses;
                    setRealCourses();
                    setMaterials(data.materials);

                    setUserPractises(data.practises.practises);
                    setUserInfo(data.user);
                    getSetCommonInfo();

                }

            },
            failure: function (errMsg) {
                alert(errMsg);
            }
        });
    }

    function getSetCommonInfo(){
        $.ajax({
            type: "GET",
            url:   api_url + "get_common_info",
            headers: {
                'Authorization': 'Token token=' + cookie_token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (data) {
                setCommonInfo(data.common_info);
            },
            failure: function (errMsg) {
                alert(errMsg);
            }
        });
    }


    function setInitialCourses(){
        var doc = document.documentElement;
        var y = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

        var row    = "";


        $.each(courses_initial, function (i, item) {
            if (item.priority === 0) {
                //courses_active += '<div data-code="' + item.code + '"  data-name="' + item.name + '"   class="show_course_materials diary_body">';
                row += '<a class="select_initial_courses one_material with_progress" data-code="' + item.code + '" href="#">';
                row += '<div class="one_material__img"><img src="img/courses_covers/small/' + item.code + '.jpg" alt=""></div>';
                row += '<div class="one_material__content">';
                row += '<div class="one_material__name">' + item.name        + '</div>';
                row += '<div class="one_material__text">' + item.description + '</div>';
                row += '</div>';
                row += '</a>';
            } else {
                row += '<a class="select_initial_courses one_material with_progress" data-code="' + item.code + '" href="#">';
                row += '<div class="one_material__img"><img src="img/courses_covers/small/' + item.code + '.jpg" alt=""></div>';
                row += '<div class="one_material__content">';
                row += '<div class="one_material__name">' + item.name        + '</div>';
                row += '<div class="one_material__text">' + item.description + '</div>';
                row += '</div>';
                row += '<div class="one_material__sticker number">' + item.priority + '</div>';
                row += '</a>';
            }

            //content += '<h4 align="center"  data-action="show_material" >' + item.name + '</h4>';
            //content += '<h5>' + item.description + '</h5>';
            //content += '<div data-code="' + item.code + '" class="select_course_prio show_course_prio"></div></div>';
        });
        $("#div_initial_courses").empty().append(row);

        setTimeout(function () {
            window.scrollTo(0, y);
        },2);

    }


    function getCourseTextCounts(code){
        var text = "";
        switch (code){
            case 'eating':
                text = "4 курса";
                break;
            case 'philosofy':
                text = "4 курса";
                break;
            default:
                text = "курс";
                break;
        }

        return text;
    }

    $('#btn_setting_course').click(function(){
        courses_initial = courses_real;
        course_more_3 = true;


        $('#wrapper_login').show();
        $('#wrapper_main') .hide();
        $('#page_welcome') .hide();
        $('#page_courses_select').show();

        setInitialCourses();

    });

    $(document).on('click','.select_initial_courses',function(){
        var clicked_course = $(this).attr("data-code");

        var new_select_initial_courses = [];
        var all_priorities = [];
        $.each(courses_initial, function (i, item) {
            if (item.code === clicked_course){
                var new_course_priority;
                if (item.priority === 0){
                    var maximum_priority = 0;
                    $.each(courses_initial, function (i, item) {
                        if (item.priority > maximum_priority) { maximum_priority = item.priority; }
                    });

                    if (maximum_priority === 3 && !course_more_3) {
                        alert("Предупреждаем, исходя из опыта, что осваивать более 3-ех курсов за раз требует немало свободного времени");
                        course_more_3 = true;
                    }

                    new_course_priority = maximum_priority + 1;
                } else {
                    new_course_priority = 0;
                }
                item.priority = new_course_priority;
            }

            new_select_initial_courses.push(item);
            all_priorities.push(parseInt(item.priority));
        });

        console.log(all_priorities.sort(function(a, b){return a-b}));

        var last_num = 1;
        $.each(all_priorities.sort(function(a, b){return a-b}) , function (i, item) {
           if (item > 0 && last_num == item){
               last_num = item;
               last_num += 1;
           }
        });

        console.log(last_num);
        courses_initial= [];
        $.each(new_select_initial_courses, function (i, item) {
            if (item.priority >= last_num){ item.priority -= 1; }
            courses_initial.push(item);
        });

        setInitialCourses();
    });
    $('#initial_courses_save').click(function (){
        var selected_courses = 0;
        $.each(courses_initial, function (i, item) {
            if (item.priority > 0) { selected_courses += 1 };
        });


        if (selected_courses < 1 ){
            alert("Выберите хотя бы 1 курс");
        } else {
            $.ajax({
                type: "POST",
                url:  api_url + "add_courses",
                data: { courses:  JSON.stringify(courses_initial)},
                headers: {
                    'Authorization':'Token token=' + cookie_token,
                    'Content-Type':'application/x-www-form-urlencoded'
                },
                success: function(data){
                    alert("Сохранили!");
                    window.location.reload();
                },
                failure: function(errMsg) {
                    alert(errMsg.toString());
                }
            });
        }
    });




    ifLogin();

    $('.welcome_carousel').owlCarousel({
        loop:true,
        margin:0,
        nav:false,
        dots:true,
        items:1
    });
    $('#btn_welcome_login').click(function(){
        $('.pages').hide();
        $('#page_login').show();

        $('#login')   .val("byhtada@gmail.com");
        $('#password').val("5200");
        $('#btn_login').click();
        $('#page_login').hide();
       // $('#wrapper_main').show();
       // $('#page_courses_inside').show();
    });

    $('.create_account').click(function(){
        openInNewTab("https://hyls.ru/freedom");
    });

    $('.btn_navigation').click(function(){
        $('.pages').hide();
        var page_id = $(this).attr('data-target');
        console.log(page_id);
        $('#' + page_id).show();
    });

    $('#nav_progress').click(function(){
        $('.pages').hide();
        $('#page_progress').show();

    });





    function setRealCourses(){
        var row    = "";
        var row_no    = "";

        $.each(courses_real, function (i, item) {

            var course_text = getCourseTextCounts(item.code);
            var big_shadow = course_text != "курс" ? "triple" : "";
            if (item.priority === 0) {
                //courses_active += '<div data-code="' + item.code + '"  data-name="' + item.name + '"   class="show_course_materials diary_body">';

                row_no += '<a class="show_course_materials one_material with_progress ' + big_shadow + '" data-code="' + item.code + '" data-priority="' + item.priority + '" href="#">';
                row_no += '<div class="one_material__img"><img src="img/courses_covers/small/' + item.code + '.jpg" alt=""></div>';
                row_no += '<div class="one_material__content">';
                row_no += '<div class="one_material__name">' + item.name        + '</div>';
                row_no += '<div class="one_material__text">' + item.description + '</div>';
                row_no += ' <div class="one_material__progress">';
                row_no += '     <div class="one_material__progress-bg"></div>';
                row_no += '     <div class="one_material__progress-percent" style="width: ' +item.progress + '%;"></div>';
                row_no += ' </div>';
                row_no += '</div>';
                row_no += '<div class="one_material__sticker number">' + course_text + '</div>';
                row_no += '<div class="course_no_active"></div>';

                row_no += '</a>';
            } else {
                row += '<a class="show_course_materials one_material with_progress ' + big_shadow + '" data-code="' + item.code + '" data-priority="' + item.priority + '"  href="#">';
                row += '<div class="one_material__img"><img src="img/courses_covers/small/' + item.code + '.jpg" alt=""></div>';
                row += '<div class="one_material__content">';
                row += '<div class="one_material__name">' + item.name        + '</div>';
                row += '<div class="one_material__text">' + item.description + '</div>';

                row += ' <div class="one_material__progress">';
                row += '     <div class="one_material__progress-bg"></div>';
                row += '     <div class="one_material__progress-percent" style="width: ' +item.progress + '%;"></div>';
                row += ' </div>';

                row += '</div>';
                row += '<div class="one_material__sticker number">' + course_text + '</div>';
                row += '</a>';
            }
        });

        $("#courses_active").empty().append(row);
        $("#courses_no_active").empty();

        if (row_no !== "") {
            $("#courses_no_active").append('<div class="block_material__header">ТАКЖЕ ДОСТУПНЫЕ МНЕ</div>');
            $("#courses_no_active").append('<div  class="block_material__content ">');
            $("#courses_no_active").append(row_no);
            $("#courses_no_active").append('</div>');
        }
    }




    $(document).on('click','.show_course_materials',function(){

        var materials_type = $(this).attr("data-type");
        console.log(materials_type );
        console.log(materials_type === undefined);
        $.ajax({
            type: "GET",
            url:  api_url + "get_course_materials",
            data: {
                course_code:     $(this).attr("data-code"),
                materials_type:  materials_type,
                course_priority: $(this).attr("data-priority"),
            },
            headers: {
                'Authorization':'Token token=' + cookie_token,
                'Content-Type':'application/x-www-form-urlencoded'
            },
            success: function(data){
                console.log(data);

                //
                $('#page_courses').hide();
                $('#page_courses_inside').show();

                var course_code = data.course.code;
                var image_src = "url(img/courses_covers/big/" + course_code + ".png)";
                $('#course_inside_img') .css("background-image", image_src);
                $('#course_inside_text').empty().append(data.course.name);
                $('#course_inside_desc').empty().append(data.course.description_inside);

                $('#courses_divider_header').empty().text("открытые материалы");
                $('#list_course_materials_available').empty();
                $('#list_course_materials_closed')   .empty();
                $('#div_course_materials_open').show();

                if (course_code === "philosofy" || course_code === "eating" ) {
                    $('#courses_divider_header').empty().text("курсы");
                    setCoursesInCourse(course_code);
                } else if (course_code === "asana" || course_code === "kaoshiki" ) {
                    if (materials_type === undefined) {
                        $('#courses_divider_header').empty().text("разделы");
                        setSectionInCourse(course_code);
                    } else {
                        setCourseMaterials(data.materials);
                    }
                } else {
                    setCourseMaterials(data.materials);
                }


                /*
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
                */
            },
            failure: function(errMsg) {
                alert(errMsg.toString());
            }
        });
    });


    function setSectionInCourse(code){
        var sections = [
            {code: code, name: "Теория",   name_code: "theory"},
            {code: code, name: "Практика", name_code: "practise"},
        ];

        var row    = "";
        $.each(sections, function (i, item) {
            row += '<a class="show_course_materials one_material with_progress" data-code="' + item.code + '" data-type="' + item.name_code + '" href="#">';
            row += '<div class="one_material__img"><img src="img/courses_covers/small/' + item.code + '.jpg" alt=""></div>';
            row += '<div class="one_material__content">';
            row += '<div class="one_material__name">' + item.name        + '</div>';
            row += '</div></a>';
        });

        $("#list_course_materials_open").empty().append(row);
    }

    function setCoursesInCourse(code){
        $("#list_course_materials_open").empty();
        $.ajax({
            type: "GET",
            url:  api_url + "get_courses_in_course",
            data: {
                code:     code
            },
            headers: {
                'Authorization':'Token token=' + cookie_token,
                'Content-Type':'application/x-www-form-urlencoded'
            },
            success: function(data){
                console.log(data);
                var row    = "";
                $.each(data.courses, function (i, item) {
                    row += '<a class="show_course_materials one_material with_progress" data-code="' + item.code + '" href="#">';
                    row += '<div class="one_material__img"><img src="img/courses_covers/small/' + item.code + '.jpg" alt=""></div>';
                    row += '<div class="one_material__content">';
                    row += '<div class="one_material__name">' + item.name        + '</div>';
                    row += '<div class="one_material__text">' + item.description + '</div>';
                    row += ' <div class="one_material__progress">';
                    row += '     <div class="one_material__progress-bg"></div>';
                    row += '     <div class="one_material__progress-percent" style="width: ' +item.progress + '%;"></div>';
                    row += ' </div>';
                    row += '</div>';
                    row += '</a>';
                });

                $("#list_course_materials_open").append(row);
            },
            failure: function(errMsg) {
                alert(errMsg.toString());
            }
        });
    }

    function setCourseMaterials(materials){
        var materials_open      = "";
        var materials_available = '<div class="block_material__header">доступные к изучению</div>';
        var materials_closed    = '<div class="block_material__header">закрытые, изучите все доступные</div>';

        $.each(materials, function (i, item) {
            switch (item.status) {
                case 0:
                case 1:
                    materials_open += '<a class="one_material" href="' + item.link + '" target="_blank">';
                    materials_open += '  <div class="one_material__img"><img src="img/courses_covers/small/' + item.code+  '.jpg" alt=""></div>';
                    materials_open += '  <div class="one_material__name">' + item.name + '</div>';
                    materials_open += '</a>';
                    break;
                case 2:
                    materials_available += '<a class="one_material material_buy" data-id="' + item.id + '" href="#">';
                    materials_available += '  <div class="one_material__img"><img src="img/courses_covers/small/' + item.code+  '.jpg" alt=""></div>';
                    materials_available += '  <div class="one_material__name">' + item.name + '</div>';
                    materials_available += '</a>';
                    break;
                case 3:
                    materials_closed += '<a class="one_material material_next_level" href="#">';
                    materials_closed += '  <div class="one_material__img"><img src="img/courses_covers/small/' + item.code+  '.jpg" alt=""></div>';
                    materials_closed += '  <div class="one_material__name">' + item.name + '</div>';
                    materials_closed += '  <div class="one_material__sticker gray"><img src="img/open-padlock.svg" alt=""></div>';
                    materials_closed += '</a>';
                    break;
            }
        });


        if (materials_open === '') {
            $('#div_course_materials_open').hide();
        } else {
            $('#div_course_materials_open').show();
            $('#list_course_materials_open')     .empty().append(materials_open);
        }

        $('#list_course_materials_available').empty();
        if (materials_available !== '<div class="block_material__header">доступные к изучению</div>') {
            $('#list_course_materials_available').append(materials_available);
        }

        $('#list_course_materials_closed')   .empty();
        if (materials_closed !== '<div class="block_material__header">закрытые, изучите все доступные</div>') {
            $('#list_course_materials_closed').append(materials_closed);
        }
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
                    alert("Невозможно. Подождите до завтра");
                } else {
                    openInNewTab(data.link);

                    setTimeout(function () {
                        courses_real= data.courses.courses;
                        setRealCourses();
                        setCourseMaterials(data.course_materials);
                        setMaterials(data.materials);
                        setUserPractises(data.practises.practises);
                        setDayInfo(data.day_info);

                        $('.lotos_have').text("У вас есть " + data.lotos);
                        getSetCommonInfo();
                    },1000);
                }
            },
            failure: function(errMsg) {
                alert(errMsg.toString());
            }
        });
    });

    $(document).on('click','.material_next_level',function(){
        alert("Материалы этого уровня недоступны. Сначала изучите все материалы из прошлого уровня");
    });


    $('#btn_back_to_courses').click(function(){
        $('#page_courses_inside').hide();
        $('#page_courses').show();
    });


    function setMaterials(materials){
        var materials_active         = '';
        var list_materials_no_active = '';

        $.each(materials.active, function (i, item) {
            materials_active += ' <a class="one_material" href="' + item.link + '" target="_blank">';
            materials_active += '     <div class="one_material__img"><img src="img/courses_covers/small/' + item.code + '.jpg" alt=""></div>';
            materials_active += '     <div class="one_material__name">' + item.name + '</div>';
            materials_active += '     <div class="one_material__sticker category">' + item.course_name + '</div>';
            materials_active += '     <div class="one_material__sticker right_left check"><span class="icon-check"></span></div>';
            materials_active += ' </a>';
        });
        $.each(materials.no_active, function (i, item) {
            list_materials_no_active += '<a class="one_material material_buy" data-id="' + item.id + '"  href="#">';
            list_materials_no_active += '    <div class="one_material__img"><img src="img/courses_covers/small/' + item.code + '.jpg" alt=""></div>';
            list_materials_no_active += '    <div class="one_material__name">' + item.name + '</div>';
            list_materials_no_active += '    <div class="one_material__sticker red"><img src="img/lotos_white.svg" alt=""></div>';
            list_materials_no_active += '</a>';
        });


   // <div class="block_material__header">открытые материалы</div>';
   //     <div class="block_material__header">открыть случайный материал</div>';

        $('#list_materials_active')   .empty();
        $('#list_materials_no_active').empty();

        if (materials_active !== '') {
            $('#list_materials_active').append('<div class="block_material__header">открытые материалы</div>');
            $('#list_materials_active').append('<div class="block_material__content">');
            $('#list_materials_active').append(materials_active);
            $('#list_materials_active').append('</div>');
        }

        if (list_materials_no_active !== '') {
            $('#list_materials_no_active').append('<div class="block_material__header">открыть случайный материал</div>');
            $('#list_materials_no_active').append('<div class="block_material__content">');
            $('#list_materials_no_active').append(list_materials_no_active);
            $('#list_materials_no_active').append('</div>');
        }

    }













    function getPractiseBlock(practise){

        var block = '<a class="one_my_practice" href="#">';
        switch (practise.code){

            case "detox":

                //var total_fact = isNaN(parseInt(practise.fact))   ? 0 : parseInt(practise.fact)  ;
                //var total_plan = isNaN(parseInt(practise.target)) ? 0 : parseInt(practise.target);
//
                //var plan_string = "План " + total_plan + " мин.";
                var fact_string = "0 из 3"; // total_fact + " мин.";

                var completed = false; // total_fact >= total_plan;


                if (completed){
                    block += '<span class="tick_practise_detox one_my_practice__icon" data-code="' + practise.code + '"  style="background-color: #ffffff;">';
                    block += '  <span class="one_my_practice__icon-img"><img src="img/practises/completed/' + practise.code + '.png" alt=""></span>';
                } else {
                    block += '<span class="tick_practise_detox one_my_practice__icon" data-code="' + practise.code + '" >';
                    block += '  <span class="one_my_practice__icon-img"><img src="img/practises/no_completed/' + practise.code + '.png" alt=""></span>';
                }

                block += '  <span class="one_my_practice__icon-info">';

                if (completed){
                    block += '    <span class="one_my_practice__icon-info-sticker-left completed">';
                } else {
                    block += '    <span class="one_my_practice__icon-info-sticker-left no_completed">';
                }
                block += '      <span>' + fact_string + '</span>';
                block += '    </span>';
               // block += '    <span class="one_my_practice__icon-info-sticker-right">';
               // block += '      <span>' + plan_string + '</span>';
               // block += '    </span>';
                block += '  </span>';
                block += '</span>';
                block += '<span class="one_my_practice__name">' + practise.name + '</span>';
                //   block += '<span class="one_my_practice__description">Утро</span>';

                break;
            case "kaoshiki":

                var total_fact = isNaN(parseInt(practise.fact))   ? 0 : parseInt(practise.fact)  ;
                var total_plan = isNaN(parseInt(practise.target)) ? 0 : parseInt(practise.target);

                var plan_string = "План " + total_plan + " мин.";
                var fact_string = total_fact + " мин.";

                var completed = total_fact >= total_plan;


                if (completed){
                    block += '<span class="tick_practise_int one_my_practice__icon" data-code="' + practise.code + '"  style="background-color: #ffffff;">';
                    block += '  <span class="one_my_practice__icon-img"><img src="img/practises/completed/' + practise.code + '.png" alt=""></span>';
                } else {
                    block += '<span class="tick_practise_int one_my_practice__icon" data-code="' + practise.code + '" >';
                    block += '  <span class="one_my_practice__icon-img"><img src="img/practises/no_completed/' + practise.code + '.png" alt=""></span>';
                }

                block += '  <span class="one_my_practice__icon-info">';

                if (completed){
                    block += '    <span class="one_my_practice__icon-info-sticker-left completed">';
                } else {
                    block += '    <span class="one_my_practice__icon-info-sticker-left no_completed">';
                }
                block += '      <span>' + fact_string + '</span>';
                block += '    </span>';
                block += '    <span class="one_my_practice__icon-info-sticker-right">';
                block += '      <span>' + plan_string + '</span>';
                block += '    </span>';
                block += '  </span>';
                block += '</span>';
                block += '<span class="one_my_practice__name">' + practise.name + '</span>';
                //   block += '<span class="one_my_practice__description">Утро</span>';

                break;

            case "water":

                var total_fact = isNaN(parseInt(practise.fact))   ? 0 : (parseInt(practise.fact)   / 1000).toFixed(1);
                var total_plan = isNaN(parseInt(practise.target)) ? 0 : (parseInt(practise.target) / 1000).toFixed(1);

                var plan_string = "План " + total_plan + " л.";
                var fact_string = total_fact + " л.";

                var completed = total_fact >= total_plan;


                if (completed){
                    block += '<span class="tick_practise_int one_my_practice__icon" data-code="' + practise.code + '"  style="background-color: #ffffff;">';
                    block += '  <span class="one_my_practice__icon-img"><img src="img/practises/completed/' + practise.code + '.png" alt=""></span>';
                } else {
                    block += '<span class="tick_practise_int one_my_practice__icon" data-code="' + practise.code + '" >';
                    block += '  <span class="one_my_practice__icon-img"><img src="img/practises/no_completed/' + practise.code + '.png" alt=""></span>';
                }

                block += '  <span class="one_my_practice__icon-info">';

                if (completed){
                    block += '    <span class="one_my_practice__icon-info-sticker-left completed">';
                } else {
                    block += '    <span class="one_my_practice__icon-info-sticker-left no_completed">';
                }
                block += '      <span>' + fact_string + '</span>';
                block += '    </span>';
                block += '    <span class="one_my_practice__icon-info-sticker-right">';
                block += '      <span>' + plan_string + '</span>';
                block += '    </span>';
                block += '  </span>';
                block += '</span>';
                block += '<span class="one_my_practice__name">' + practise.name + '</span>';
                //   block += '<span class="one_my_practice__description">Утро</span>';

                break;

            case "tongue":
                var completed_both = practise.fact.split(",");

                var completed = completed_both[0] === "true" && completed_both[1] === "true";

                if (completed){
                    block += '<span class="tick_practise_cb one_my_practice__icon" data-code="' + practise.code + '"  style="background-color: #ffffff;">';
                    block += '  <span class="one_my_practice__icon-img"><img src="img/practises/completed/' + practise.code + '.png" alt=""></span>';
                } else {
                    block += '<span class="tick_practise_cb one_my_practice__icon" data-code="' + practise.code + '" >';
                    block += '  <span class="one_my_practice__icon-img"><img src="img/practises/no_completed/' + practise.code + '.png" alt=""></span>';
                }

                block += '  <span class="one_my_practice__icon-info">';


                if (completed){
                    block += '    <span class="one_my_practice__icon-info-sticker-left completed">';
                } else {
                    block += '    <span class="one_my_practice__icon-info-sticker-left no_completed">';
                }


                if (completed_both[0] === "true"){
                    block += '    <span class="icon-check"></span>';
                } else {
                    block += '    <span class="icon-slash"></span>';
                }
                block += '    <span class="icon-divider"></span>';
                if (completed_both[1] === "true"){
                    block += '    <span class="icon-check"></span>';
                } else {
                    block += '    <span class="icon-slash"></span>';
                }




                block += '    </span>';
                block += '  </span>';
                block += '</span>';
                block += '<span class="one_my_practice__name">' + practise.name + '</span>';
                break;


            case "wakeup":

                var detail_plan = practise.target.split(":");
                var fact_string = "";
                var detail_fact = [23, 59];
                var plan_string = "План " + practise.target ;


                if (practise.fact !== ":") {
                    fact_string = practise.fact;
                    detail_fact = practise.fact.split(":");
                }

                var completed = parseInt(detail_fact[0]) * 60 + parseInt(detail_fact[1]) <= parseInt(detail_plan[0]) * 60 + parseInt(detail_plan[1]);


                if (completed){
                    block += '<span class="time_drop one_my_practice__icon" data-type="diary" data-code="' + practise.code + '"  style="background-color: #ffffff;">';
                    block += '  <span class="one_my_practice__icon-img"><img src="img/practises/completed/' + practise.code + '.png" alt=""></span>';
                } else {
                    block += '<span class="time_drop one_my_practice__icon" data-type="diary" data-code="' + practise.code + '" >';
                    block += '  <span class="one_my_practice__icon-img"><img src="img/practises/no_completed/' + practise.code + '.png" alt=""></span>';
                }
                block += '  <span class="one_my_practice__icon-info">';


                if (fact_string !== "") {

                    if (completed){
                        block += '    <span class="one_my_practice__icon-info-sticker-left completed">';
                    } else {
                        block += '    <span class="one_my_practice__icon-info-sticker-left no_completed">';
                    }

                    block += '      <span>' + fact_string + '</span>';
                    block += '    </span>';

                }

                block += '    <span class="one_my_practice__icon-info-sticker-right">';
                block += '      <span>' + plan_string + '</span>';
                block += '    </span>';

                block += '  </span>';
                block += '</span>';
                block += '<span class="one_my_practice__name">' + practise.name + '</span>';
                block += '<span class="one_my_practice__description">' + practise.logic + '</span>';
                //   block += '<span class="one_my_practice__description">Утро</span>';

                break;


            case "meditation":


                var facts = [];
                $.each(practise.fact.split(","), function (i, item) {
                    var medi_fact = parseInt(item);

                    if (isNaN(medi_fact)) {
                        medi_fact = 0;}

                    facts.push(medi_fact);
                });
                console.log("facts " + facts);
                console.log("sum facts " + facts.reduce((a, b) => a + b, 0));

                var medi_count  = parseInt(practise.logic.split("/")[2]);
                var total_fact  = facts.reduce((a, b) => a + b, 0);
                var total_plan  = medi_count * practise.target;
                var plan_string = "План " + total_plan + " мин.";
                var fact_string = total_fact + " мин.";


                var completed = total_fact >= total_plan;




                if (completed){
                    block += '<span class="tick_practise_int one_my_practice__icon" data-facts="' + facts + '" data-count="' + medi_count + '" data-code="' + practise.code + '" style="background-color: #ffffff;">';
                    block += '  <span class="one_my_practice__icon-img"><img src="img/practises/completed/' + practise.code + '.png" alt=""></span>';
                } else {
                    block += '<span class="tick_practise_int one_my_practice__icon" data-facts="' + facts + '" data-count="' + medi_count + '" data-code="' + practise.code + '">';
                    block += '  <span class="one_my_practice__icon-img"><img src="img/practises/no_completed/' + practise.code + '.png" alt=""></span>';
                }

                block += '  <span class="one_my_practice__icon-info">';

                if (completed){
                    block += '    <span class="one_my_practice__icon-info-sticker-left completed">';
                } else {
                    block += '    <span class="one_my_practice__icon-info-sticker-left no_completed">';
                }
                block += '      <span>' + fact_string + '</span>';
                block += '    </span>';
                block += '    <span class="one_my_practice__icon-info-sticker-right">';
                block += '      <span>' + plan_string + '</span>';
                block += '    </span>';
                block += '  </span>';
                block += '</span>';
                block += '<span class="one_my_practice__name">' + practise.name + '</span>';
                //   block += '<span class="one_my_practice__description">Утро</span>';

                break;


            case "halfbath":
            case "vegetarian":
            case "yoga_diet":
            case "no_snacking":
            case "no_sugar":
            case "no_fries":
            case "no_coffe":
            case "ten_ahimsa":
            case "ten_asteya":
            case "ten_satya":
            case "ten_aparigraha":
            case "ten_brahma":
            case "ten_santosha":
            case "ten_shaocha":
            case "ten_tapah":
            case "ten_svadhyaya":
            case "ten_ishvara":
            case "psy_gratitude":
            case "psy_value":
            case "psy_square":
            case "psy_targets":
            case "psy_prioritets":
            case "psy_moments":
            case "therapy":
            case "asana":
                var completed = practise.fact === "true";

                if (completed){
                    block += '<span class="tick_practise_cb one_my_practice__icon" data-code="' + practise.code + '"  style="background-color: #ffffff;">';
                    block += '  <span class="one_my_practice__icon-img"><img src="img/practises/completed/' + practise.code + '.png" alt=""></span>';
                } else {
                    block += '<span class="tick_practise_cb one_my_practice__icon" data-code="' + practise.code + '" >';
                    block += '  <span class="one_my_practice__icon-img"><img src="img/practises/no_completed/' + practise.code + '.png" alt=""></span>';
                }

                block += '  <span class="one_my_practice__icon-info">';

                if (completed){
                    block += '    <span class="one_my_practice__icon-info-sticker-left small completed">';
                    block += '    <span class="icon-check"></span>';

                } else {
                    block += '    <span class="one_my_practice__icon-info-sticker-left small no_completed">';
                    block += '    <span class="icon-slash"></span>';
                }
                block += '    </span>';
                block += '  </span>';
                block += '</span>';
                block += '<span class="one_my_practice__name">' + practise.name + '</span>';
                break;




        }

        block += '</a>';

        return block;
    }

    function setTodayPractise(practises){
        $('.diary_rows').hide();
        var day7_practise = 0;


       // $('.wrapper_my_practice').empty().hide();
        $('.available_materials').hide();

        $('#diary_read_material').show();
        $('#diary_comment')      .show();

        var block_contents = [];

        $.each(practises, function (i, item) {

            if (item.logic.indexOf("day_seven_") !== -1 &&  parseInt(item.logic.replace(/\D/g, "")) >= 7) {
                day7_practise = item;}


            if (item.code === "read_material"){
                $('#available_materials_sticker').removeClass("completed");
                if (item.fact === "true") {
                    $('#available_materials_sticker').addClass("completed");
                    $('#available_materials_sticker').empty().append('<span class="icon-check"></span>');
                } else {
                    $('#available_materials_sticker').empty().append('<span class="icon-slash"></span>');
                }
            } else {
                block_contents.push(getPractiseBlock(item));
            }

        });


        $('#diary_practises_1').empty();
        $('#diary_practises_2').empty();


        var new_blocks = chunkArrayInGroups(block_contents, 3);
        console.log(new_blocks);

        $.each(new_blocks, function (i, massive) {
            if (i === 0) {
                $.each(massive, function (i, item) {
                    $('#diary_practises_1').show().append(item);
                });
            } else {
                $('#diary_practises_2').show();
                var block_3 = '<div class="wrapper_my_practice">';
                $.each(massive, function (i, item) {
                    block_3 += item;
                });
                block_3 += '</div>';
                $('#diary_practises_2').append(block_3);
            }
        });




        if (day7_practise !== 0) {
            $('#modal_label_practise_continue').text("Продолжить практику " + day7_practise.name + "?");
            $('.btn_practise_continue').attr("data-id", day7_practise.id);
            $('#modal_practise_continue').modal("show");
        }
    }

    function chunkArrayInGroups(arr, size) {
        var myArray = [];
        for(var i = 0; i < arr.length; i += size) {
            myArray.push(arr.slice(i, i+size));
        }
        return myArray;
    }



    function tickWakeup(value){
        console.log("tickWakeup " + value);
        tickPractise("wakeup", value, 0)
    }


    $(document).on('click','.tick_practise_cb',function(){
        console.log($(this).attr("data-code"));
        tickPractise($(this).attr("data-code"), 0, 0);
    });

    var current_int_practise;
    $(document).on('click','.tick_practise_int',function(){
        console.log($(this).attr("data-code"));
        var code = $(this).attr("data-code");
        current_int_practise = $(this).attr("data-code");
        $('#number_picker_small').hide();
        $('#number_picker_big')  .hide();
        $('#meditation_selector')  .hide();
        $('#numbers_selector')  .show();

        if (code === "kaoshiki") {
            $('#number_picker_small').show();
        } else if (code === "water"){
            $('#number_picker_big').show();
        } else if (code === "meditation"){
            $('#numbers_selector')  .hide();
            $('#number_picker_small').show();
            $('#meditation_selector').show();
            $('.btn_meditation_selector').hide();
            $('.btn_meditation_selector').removeClass('btn-default');
            $('.btn_meditation_selector').removeClass('btn-success');

            var count = parseInt($(this).attr("data-count"));
            var facts = $(this).attr("data-facts").split(",");
            if (count > 0){
                $('#btn_meditation_selector_0').show().text("1ая: " + facts[0] + " мин");}
            if (count > 1){
                $('#btn_meditation_selector_1').show().text("2ая: " + facts[1] + " мин");}
            if (count > 2){
                $('#btn_meditation_selector_2').show().text("3яя: " + facts[2] + " мин");}
            if (count > 3){
                $('#btn_meditation_selector_3').show().text("4ая: " + facts[3] + " мин");}

        }

        $('#wrapper_picker').show();


    });

    var selected_meditation = 0;
    $(document).on('click','.btn_meditation_selector',function(){

        $('.btn_meditation_selector').removeClass('btn-default');
        $('.btn_meditation_selector').removeClass('btn-success');
        $(this).addClass("btn-success");
        selected_meditation = $(this).attr("data-num");
        $('#numbers_selector')  .show();
    });
    $('#save_number_picker').click(function(){
        console.log("current_int_practise " + current_int_practise);

        var value = 0;
        if (current_int_practise === "water") {
            value = $('#big_input').val();
        } else {
            value = $('#small_input').val();
        }
        console.log("current_int_practise  value " + value);
        console.log("current_int_practise  selected_meditation " + selected_meditation);
        tickPractise(current_int_practise, value, selected_meditation);
        $('#wrapper_picker').hide();
    });
    $('#btn_close_picker').click(function(){
        $('#wrapper_picker').hide();
    });



    function tickPractise(code, result, position){
        $.ajax({
            type: "POST",
            url:  api_url + "set_practise_fact",
            data: {
                code:     code,
                result:   result,
                position: position
            },
            headers: {
                'Authorization':'Token token=' + cookie_token,
                'Content-Type':'application/x-www-form-urlencoded'
            },
            success: function(data){
                setDayInfo(data.day_info);
                setTodayPractise(data.day_info.day_practises);
                getSetCommonInfo();
            },
            failure: function(errMsg) {
                alert(errMsg.toString());
            }
        });
    }







    //ДЛЯ НАСТРОЕК И ВОПРОСОВ
    function setUserPractises(practises){
        var content = "";
        var show_base_question = "";



        $.each(practises, function (i, item) {

            if (item.logic === "") {
                show_base_question = item.id;
            } else {
                var practise_id = "id_" + item.code;
                var checked   = item.active ? "checked" : "";
                var disabled  = item.logic === "0" ? "disabled" : "";

                content += '<div class="form_group checkbox">';
                content += '<input class="btn_practise_switch" data-id="' + item.id + '" type="checkbox" id="' + practise_id + '" ' + checked + ' ' + disabled + '>';
                content += '<label for="' + practise_id + '">' + item.name + '</label>';

                if (hard_questions.includes(item.code)){
                    content += '<a href="#"  class="add_time practise_settings" data-id="' + item.id + '"><span class="icon-settings"></span></a>';
                }

                content += '</div>';
            }
        });

        $("#list_settings_practices").empty().append(content);


        if (show_base_question !== ""){
            showPractiseSettings(show_base_question);
        }
    }

    $(document).on('click','.btn_practise_switch',function(){

        activePractise($(this).attr("data-id"), $(this).is(':checked'))

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
                    setDayInfo(data.day_info);
                    setTodayPractise(data.day_info.day_practises);
                    getSetCommonInfo();
                } else {

                    alert("Сначала задайте логику практике");
                }
            },
            failure: function (errMsg) {
                alert(errMsg);
            }
        });
    }


    $(document).on('click','.practise_settings',function(){
        $('#btn_practise_save').attr("data-type", "settings");
        showPractiseSettings($(this).attr("data-id"));
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
                settings_practise = data.practise;

                $('.pages').hide();
                $('#page_practise_settings').show();
                $('#practise_settings_header').empty().append(data.practise.name +  " — Настройка практики");

                $('.question_practise_active')  .attr("data-id", data.practise.id);
                $('#btn_practise_settings_save').attr("data-id", data.practise.id);



                if (data.practise.logic === ""){
                    $('#div_field_activate').show();
                    $('#div_field_settings').hide();
                } else {
                    $('#div_field_activate').hide();
                    $('#div_field_settings').show();
                    showSettingForm(data.practise.code);
                    setValueSettingForm(data.practise.code, data.practise.logic);
                }

            },
            failure: function (errMsg) {
                alert(errMsg);
            }
        });
    }


    $(document).on('click','.question_practise_activate',function(){


        if ($(this).attr("data-answer") === "no") {
            $.ajax({
                type: "POST",
                url:   api_url + "set_practise_logic",
                data: {
                    practise_id: settings_practise.id,
                    logic: "no"
                },
                headers: {
                    'Authorization': 'Token token=' + cookie_token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: function (data) {
                    console.log(data);
                    $('#page_diary').show();
                    $('#page_practise_settings').hide();
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

    var hard_questions = ["detox", "meditation", "asana", "kaoshiki", "wakeup", "water", "therapy", "yoga_diet", "vegetarian"];

    function showSettingForm(code){
        $('.settings_practise_div').hide();
        $('#div_field_activate').hide();
        $('#div_field_settings').show();

        console.log("showSettingForm code " + code);
        if (hard_questions.includes(code)) {

            switch (code){
                case "detox":
                    $('#settings_detox').show();

                    break;
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
            $('#field_settings_times')         .val();

            $('#field_question_wake_up_fact_hour')    .val();
            $('#field_question_wake_up_fact_minute')  .val();
            $('#field_question_wake_up_target_hour')  .val();
            $('#field_question_wake_up_target_minute').val();
            $('#field_question_wake_up_step')         .val();

            $('#field_settings_wakeup_now')    .val("7:00");
            $('#field_settings_wakeup_target') .val("4:30");
            $('#field_settings_wakeup_step') .val("5");
            $('#field_settings_water_start') .val();
            $('#field_settings_water_finish').val();
            $('#field_settings_water_step')  .val();

            $('.settings_therapy').removeClass('active');

            $('#field_settings_yoga_diet_tamas') .val();
            $('#field_settings_yoga_diet_radjas').val();

            $('#field_settings_start_date').val();

            $('#field_settings_vegetarian_0').val();
            $('#field_settings_vegetarian_1').val();
            $('#field_settings_vegetarian_2').val();

            $('#field_settings_start_date').val();

        } else {
            switch (code){
                case "meditation":
                    setCheckedDays(logic[0]);
                    setPractiseNumbers(logic[1]);
                    $('#field_settings_times').val(logic[2]);

                    var all_days = getCheckedDays().split(",");
                    var active_days = 0;
                    $.each(all_days, function (i, item) {
                        active_days += parseInt(item);
                    });

                    console.log("active_days " + active_days);
                    $('#settings_days_every_day').prop('checked', active_days === 7);

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
                    $('#field_settings_wakeup_now')    .val(values[0]);
                    $('#field_settings_wakeup_target')  .val(values[1]);
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

    $(document).on('click','.settings_therapy',function(){
        $('#btn_practise_save').attr("data-logic", $(this).val());

        $('.settings_therapy').removeClass('btn-default');
        $('.settings_therapy').removeClass('btn-success');
        $(this).addClass("btn-success");

    });

    $(document).on('click','.weekday',function(){
        var all_days = getCheckedDays().split(",");
        var active_days = 0;
        $.each(all_days, function (i, item) {
            active_days += parseInt(item);
        });

        console.log("active_days " + active_days);
        $('#settings_days_every_day').prop('checked', active_days === 7)
    });

    $(document).on('click','#settings_days_every_day',function(){

        setTimeout(function () {
            $('.weekday').prop('checked', $('#settings_days_every_day').is(':checked'));

        },2);

    });


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


    tippy('#tooltip_not_meat',  {content: "Питаюсь преимущественно растительной пищей без мясных продуктов. Употребляю рыбу и морепродукты.",});
    tippy('#tooltip_yoga_diet', {content: "Питаюсь растительной пищей - без любого вида мяса, яиц, рыбы и морепродуктов, без грибов, лука и чеснока, а также без кофеиносодержащих напитков",});
    tippy('#tooltip_not_sugar', {content: "Не употребляю сахар в чистом виде, сладости или блюда с использованием сахара — лишь изредка (например, по праздником) или вообще без них.",});
    tippy('#tooltip_not_fries', {content: "Предпочитаю еду варить, тушить, запекать и готовить другими способами, жарить — в редких случаях и чаще всего без использования масла. Изредка могу себе позволить съесть что-то, обжаренное на масле.",});

    var detox_type = "juice";
    $(document).on('click','.cb_detox_type',function(){
        $('.cb_detox_type').prop('checked', false);
        $(this).prop('checked', true);

        var text = "";
        detox_type = $(this).attr("name");
        switch ($(this).attr("name")){
            case "juice":
                text = "до 5";
                break;
            case "fruit":
                text = "до 15";
                break;
            case "plant":
                text = "до 30";
                break;
            case "fruit_and_vegetables":
                text = "до 20";
                break;
        }

        $('#detox_days').attr('placeholder', text);

    });




    $('#btn_practise_save').click(function (){
        var logic = "";

        var message = "";
        var start  = 0;
        var finish = 0;
        var step   = 0;
        switch (settings_practise.code){
            case "meditation":
                start     = parseInt($('#field_settings_numbers_start').val());
                finish    = parseInt($('#field_settings_numbers_finish').val());
                step      = parseInt($('#field_settings_numbers_step').val());
                var times = parseInt($('#field_settings_times').val());

                if (isNaN(start)) {
                    message = "Укажите стартовое время медитации. ";
                }
                if (isNaN(finish)) {
                    message = "Укажите планируемое время медитации. ";
                }
                if (isNaN(step) ) {
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
                if (isNaN(times) ) {
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

                start  = parseInt($('#field_settings_numbers_start').val());
                finish = parseInt($('#field_settings_numbers_finish').val());
                step   = parseInt($('#field_settings_numbers_step').val());

                if (isNaN(start)) {
                    message = "Укажите стартовое время каошики. ";
                }
                if (isNaN(finish)) {
                    message = "Укажите планируемое время каошики. ";
                }
                if (isNaN(step)) {
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


                logic += getCheckedDays() + "/";
                logic += start  + ",";
                logic += finish + ",";
                logic += step ;
                break;

            case "wakeup":
                var wakeup_now    = $('#field_settings_wakeup_now').val();
                var wakeup_target = $('#field_settings_wakeup_target').val();
                var step          = $('#field_settings_wakeup_step').val();

                console.log("wakeup_now " + wakeup_now);
                if (wakeup_now == "" || wakeup_target == ""|| step == "" ) {
                    message = "Заполните все поля";
                }


                var fact_hour     = parseInt(wakeup_now.split(":")[0]);
                var fact_minute   = parseInt(wakeup_now.split(":")[1]);
                var target_hour   = parseInt(wakeup_target.split(":")[0]);
                var target_minute = parseInt(wakeup_target.split(":")[1]);




                if (isNaN(step) || step < 1) {
                    message = "Шаг должен быть больше 0. ";
                }

                if (fact_hour * 60 + fact_minute < target_hour * 60 + target_minute ) {
                    message = "Фактическое время не может быть раньше целевого.";
                }

                logic += $('#field_settings_wakeup_now').val() + ",";
                logic += $('#field_settings_wakeup_target').val() + ",";
                logic += $('#field_settings_wakeup_step').val();

                console.log("wakeup logic " + logic);
                break;

            case "water":
                start  = parseInt($('#field_settings_water_start').val());
                finish = parseInt($('#field_settings_water_finish').val());
                step   = parseInt($('#field_settings_water_step').val());

                if (isNaN(start)) {
                    message = "Укажите стартовое время медитации. ";
                }
                if (isNaN(finish)) {
                    message = "Укажите планируемое время медитации. ";
                }
                if (isNaN(step)) {
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

                var stage_0 = parseInt($('#field_settings_yoga_diet_tamas').val());
                var stage_1 = parseInt($('#field_settings_yoga_diet_radjas').val());
                var start   = $('#field_settings_start_date').val() ;

                console.log("yoga_diet");
                console.log(start);
                console.log(typeof start);

                if (isNaN(stage_0)) {
                    message = "Укажите кол-во дней для всех этапов";
                }
                if (isNaN(stage_1)) {
                    message = "Укажите кол-во дней для всех этапов";
                }

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
                var stage_0 = parseInt($('#field_settings_vegetarian_0').val());
                var stage_1 = parseInt($('#field_settings_vegetarian_1').val());
                var stage_2 = parseInt($('#field_settings_vegetarian_2').val());
                var start   = $('#field_settings_start_date').val() ;

                if (isNaN(stage_0)) {
                    message = "Укажите кол-во дней для всех этапов";}
                if (isNaN(stage_1)) {
                    message = "Укажите кол-во дней для всех этапов";}
                if (isNaN(stage_2)) {
                    message = "Укажите кол-во дней для всех этапов";}

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

            case "detox":


                var start   = $('#detox_start_date').val() ;
                if (start === ""){
                    message = "Укажите дату старта детокса"}


                var detox_days = parseInt($('#detox_days').val());
                if (isNaN(detox_days)){
                    alert("Укажите кол-во дней");
                    return;
                }

                switch (detox_type){
                    case "juice":
                        if (detox_days < 1 || detox_days > 5){
                            message = "Кол-во дней детокса должно быть от 1 до 5";}
                        break;
                    case "fruit":
                        if (detox_days < 1 || detox_days > 15){
                            message = "Кол-во дней детокса должно быть от 1 до 15";}
                        break;
                    case "fruit_and_vegetables":
                        if (detox_days < 1 || detox_days > 20){
                            message = "Кол-во дней детокса должно быть от 1 до 20";}
                        break;
                    case "plant":
                        if (detox_days < 1 || detox_days > 30){
                            message = "Кол-во дней детокса должно быть от 1 до 30";}
                        break;

                }
                logic += detox_type + "/" + detox_days + "/" ;

                logic += $('#detox_no_snacking').is(':checked') ? "true," : "false,";
                logic += $('#detox_water')      .is(':checked') ? "true," : "false,";
                logic += $('#detox_no_meat')    .is(':checked') ? "true," : "false,";
                logic += $('#detox_yoga')       .is(':checked') ? "true," : "false,";
                logic += $('#detox_no_sugar')   .is(':checked') ? "true," : "false,";
                logic += $('#detox_no_fries')   .is(':checked') ? "true/" : "false/";

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

        console.log(logic);
        //return;

        var this_type = $(this).attr("data-type");

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

                $('#page_practise_settings').hide();

                functionStart();
            },


            failure: function (errMsg) {
                alert(errMsg);
            }
        });
    });


    function functionStart(){
        start();
    }



























    $('body').on('click', '[data-block]', function (e) {
        e.preventDefault();
        if($(this).hasClass('open')){
            $(this).removeClass('open');
            $($(this).data('block')).slideUp(300);
        } else {
            $(this).addClass('open');
            $($(this).data('block')).slideDown(300);
        }
    });
    $('body').on('click', '[data-plugin="tabs"]', function (e) {
        e.preventDefault();
        $(this).addClass('active').siblings().removeClass('active');
        $($(this).data('target')).addClass('active').siblings().removeClass('active');
    });
    $('body').on('click', '[data-modal="modal"]', function (e) {
        e.preventDefault();
        $($(this).data('target')).addClass('open');
    });
    $('body').on('click', '.close_popup', function (e) {
        e.preventDefault();
        $(this).parent().removeClass('open');
    });
    var thisTimeDrop;

    var time_dropper_type  = "";
    var time_dropper_value = "";
    $('body').on('click', '.time_drop', function (e) {
        e.preventDefault();
        time_dropper_type = $(this).attr("data-type");
        var title = "";
        switch ($(this).attr("data-type")) {
            case "question_now":
                title = "Во сколько Вы <br>обычно просыпаетесь?";
                break;
            case "question_target":
                title = "Установите цель <br>по времени подъема";
                break;
            case "diary":
                title = "Укажите фактическое <br>время подъема сегодня";
                break;
        }

        $('.header_popup_time_dropper').empty().append(title);
        $('#popup_time_dropper').addClass('open');
        $('#input_time_dropper').trigger('click');
        thisTimeDrop = $(this);
    });


    $('body').on('click', '.close_popup', function (e) {
        if (time_dropper_type === "diary") {
            tickWakeup($('#input_time_dropper').val());
        }

        e.preventDefault();
        $(this).parent().removeClass('open');
        thisTimeDrop.val($('#input_time_dropper').val());
        $('#input_time_dropper').val('')
    });
    $('body').on('click', '[data-tooltip]', function (e) {
        e.preventDefault();
        if($(this).hasClass('active')){
            $(this).removeClass('active');
            $($(this).data('tooltip')).removeClass('active');
        } else {
            $(this).addClass('active');
            $($(this).data('tooltip')).addClass('active').css('top', (parseInt($(this).offset().top) + 37) + 'px');
        }
    });



    function openInNewTab(url) {
        var win = window.open(url, '_blank');
        win.focus();
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
    function deleteCookie( name ) {
        document.cookie = name + '=undefined; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
    }

    $('.btn_exit').click(function () {
        deleteCookie(cookie_name_token);
        cookie_token = getCookie(cookie_name_token);

        window.location.reload();
    });
});









