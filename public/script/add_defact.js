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

function load_construction_type(){
    document.getElementById('div_add_defact_box').style.display = 'none';
    document.getElementById('div_hide_ctype_box').style.display = 'block';
    
    loadTarget = document.getElementById('div_ctype_list');
    
    loadTarget.innerHTML = '';
    
    for(var i in d_construct_type){
        innerItem = '<li class="li-type" value="'+d_construct_type[i]+'">'+d_construct_type[i];
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
