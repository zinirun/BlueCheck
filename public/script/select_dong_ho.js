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
        var dong_HTML = '<label><input type="radio" name="div-dong-bt" value="' + dong_list[i] + '"> <div class="div-dong-bt">' + dong_list[i] + '동 </div></label>';

        dong_target.innerHTML += dong_HTML;
    }

    for (var j in ho_list) {
        var ho_HTML = '<label><input type="radio" name="div-ho-bt" value="' + ho_list[j] + '"> <div class="div-ho-bt">' + ho_list[j] + '</div></label>';

        ho_target.innerHTML += ho_HTML;
    }

}


//run if user selected dong (Radio)
function dongSelected(user_selected_dong) {
    document.getElementById("div-dong-box").style.display = none;
    document.getElementById("div-ho-box").style.display = block;

    selected_dong = user_selected_dong;
}

//run if user selected ho (Radio) -> send to router
function hoSelected(user_selected_ho) {
    selected_ho = user_selected_ho;
}