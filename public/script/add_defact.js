const d_construct_type = [
    "조적공사",
    "미장공사",
    "방수공사",
    "석공사",
    "타일공사",
    "도장공사",
    "유리공사",
    "커튼월공사",
    "수장공사",
];

const d_info = [
    ["조적공사", "벽돌공사", "천장", "매지불량"],
    ["조적공사", "블록공사", "벽", "파손"],
    ["조적공사", "ALC공사", "바닥", "수직불량"],
    ["조적공사", "ALC공사", "바닥", "수평불량"],
    ["조적공사", "ALC공사", "바닥", "오염"],
    ["조적공사", "ALC공사", "바닥", "기타(타이핑)"]
];

function addLoadDate() {
    document.getElementById('input_due_date').value = new Date().toISOString().substring(0, 10);
}

function load_construction_type() {
    document.getElementById('div_add_defact_box').style.display = 'none';
    document.getElementById('div_hide_ctype_box').style.display = 'block';

    loadTarget = document.getElementById('div_ctype_list');

    loadTarget.innerHTML = '';

    for (var i in d_construct_type) {
        innerItem = '<li class="li-type" value="' + d_construct_type[i] + '">' + d_construct_type[i];
        loadTarget.innerHTML += innerItem;
    }

    addClickEvent();
}

function ctypeSelected(user_selected_ctype) {
    if (user_selected_ctype.target.getAttribute('value')) {
        selected_ctype = user_selected_ctype.target.getAttribute('value');
        document.getElementById('input_ctype').setAttribute('value', selected_ctype);
        document.getElementById('div_hide_ctype_box').style.display = 'none';
        document.getElementById('div_add_defact_box').style.display = 'block';
    }
}


function addClickEvent() {
    var pointTarget = document.getElementById('div_ctype_list');

    pointTarget.addEventListener('click',
        function (e) {
            ctypeSelected(e);
        });
}

function loadDefactInfo() {
    var c_type = document.getElementById('input_ctype').getAttribute('value');
    document.getElementById('div_user_type_box').style.display = 'none';
    if (c_type) {
        document.getElementById('div_add_defact_box').style.display = 'none';
        document.getElementById('div_hide_info_box').style.display = 'block';
        loadTarget = document.getElementsByClassName('div-d-item');
        for (var i in loadTarget) {
            loadTarget[i].innerHTML = '';
        }

        d_select(c_type, 1);
    } else {
        alert('공종을 먼저 선택하세요.');
    }
}

function addClickListener(dom, nextFunction, nextIndex) {
    if (nextIndex != 4) { //3번째 최종 하자 리스트 누를 때는 예외처리
        dom.addEventListener('click',
            function (e) {
                if (e.target.getAttribute('value')) {
                    document.getElementById('div_user_type_box').style.display = 'none';
                    if (nextIndex == 2) {
                        document.getElementById('div_s3').innerHTML = '';
                    }
                    prevDom = document.getElementsByClassName('li-type-'+(nextIndex-1));
                    for (var i = 0; i < prevDom.length; i++) {
                        prevDom[i].style.background = "#f2f2f2";
                        prevDom[i].style.color = "black";
                    }
                    e.target.style.background = "dodgerblue";
                    e.target.style.color = "white";
                    nextFunction(e.target.getAttribute('value'), nextIndex);
                }
            });
    }
    else{
        dom.addEventListener('click',
            function (e) {
                if (e.target.getAttribute('value')) {
                    document.getElementById('div_user_type_box').style.display = 'none';
                    value = e.target.getAttribute('value');
                    if(value == "기타(타이핑)"){
                        document.getElementById('div_user_type_box').style.display = 'block';
                        document.getElementById('input_typing').focus();
                    }
                    else selectedFinalValue(value);
                }
            });
    }
}

function d_select(type, index) {
    loadTarget = document.getElementById('div_s' + index);
    loadTarget.innerHTML = "";
    var loadedItem = "";
    for (var i in d_info) {
        if (d_info[i][index - 1] == type) {
            if (loadedItem.includes(d_info[i][index])) continue; // 아이템 중복 검사
            else {
                innerItem = '<li class="li-type-' + index + '" value="' + d_info[i][index] + '">' + d_info[i][index];
                loadTarget.innerHTML += innerItem;
                loadedItem += d_info[i][index];
            }
        }
    }
    addClickListener(loadTarget, d_select, index + 1);
}

function selectedFinalValue(defactValue){
    document.getElementById('div_add_defact_box').style.display = 'block';
    document.getElementById('div_hide_info_box').style.display = 'none';
    document.getElementById('input_dtype').setAttribute('value', defactValue);
}

function user_typed(){
    typedValue = document.getElementById('input_typing').value;
    if(typedValue.length > 0){
        document.getElementById('div_add_defact_box').style.display = 'block';
        document.getElementById('div_hide_info_box').style.display = 'none';
        document.getElementById('input_dtype').setAttribute('value', typedValue);
    }
    else{
        alert("1자 이상 입력하세요.");
    }
}

function hide_ctype_box(){
    document.getElementById('div_add_defact_box').style.display = 'block';
    document.getElementById('div_hide_ctype_box').style.display = 'none';
}

function hide_info_box(){
    document.getElementById('div_add_defact_box').style.display = 'block';
    document.getElementById('div_hide_info_box').style.display = 'none';
}