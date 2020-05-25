let selected_dong = -1;
let selected_ho = -1;

let dong_list = [];
let ho_list = [];

const MAX_DONG = 9; // 101~108 Dong
const MAX_HO = 4; // 1 ho ~ 4 ho
const MAX_FLOOR = 10; //101~104 - 1001~1004 Ho

function addList() {
    for (var k = 1; k <= MAX_DONG; k++) {
        dong_list.push(100 + k);
    }

    for (var i = MAX_FLOOR; i >= 1; i--) {
        for (var j = 1; j <= MAX_HO; j++) {
            ho_list.push(i * 100 + j);
        }
    }
}

function appendDongHo() {
    dong_target = document.getElementById("div_dong_target");
    ho_target = document.getElementById("div_ho_target");

    for (var i in dong_list) {
        var dong_HTML = '<label><input type="radio" name="div-dong-bt" value="' + dong_list[i] + '"> <div class="div-dong-bt">'+ dong_list[i] +'동<div class="div-dong-float-icon" id="d'+i+'">0</div></div></label>';

        dong_target.innerHTML += dong_HTML;
    }

    for (var j in ho_list) {
        var ho_HTML = '<label><input type="radio" name="div-ho-bt" value="' + ho_list[j] + '"> <div class="div-ho-bt" >'+ ho_list[j] +'<div class="div-ho-float-icon" id="h'+j+'">0</div></div></label>';

        ho_target.innerHTML += ho_HTML;
    }

    addEvent();
}

//run if user selected dong (Radio)
function dongSelected(user_selected_dong) {
    if (user_selected_dong.target.getAttribute('value')) {
        document.getElementById("div-dong-box").style.display = 'none';
        document.getElementById("div-ho-box").style.display = 'block';
        selected_dong = user_selected_dong.target.getAttribute('value');

        document.getElementById('span_dong').innerHTML = selected_dong + '동';
    }
}

//run if user selected ho (Radio) -> send to router
// After user choose dong, ho
// dong : selected_dong
// ho : selected_ho
// Move page to view_defact
function hoSelected(user_selected_ho) {
    if (user_selected_ho.target.getAttribute('value')) {
        selected_ho = user_selected_ho.target.getAttribute('value');
        
        location.href = "/defact/drawing?dong="+selected_dong+"&ho="+selected_ho;
    }
}

function addEvent() {
    var dongTarget = document.getElementById('div_dong_target');

    dongTarget.addEventListener('click',
        function (e) {
            dongSelected(e);
        });

    var hoTarget = document.getElementById('div_ho_target');

    hoTarget.addEventListener('click',
        function (e) {
            hoSelected(e);
        });
}

function backToDong() {
    document.getElementById("div-dong-box").style.display = 'block';
    document.getElementById("div-ho-box").style.display = 'none';
}