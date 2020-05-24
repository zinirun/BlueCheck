function go_add_defact() {
    dong = document.getElementById('span_dong').innerHTML.trim();
    ho = document.getElementById('span_ho').innerHTML.trim();
    loc = document.getElementById('span_loc').innerHTML.trim();

    location.href = '/defact/add?dong=' + dong + '&ho=' + ho + '&loc=' + loc;
}

function addEvent() {
 document.querySelector("#div-defact-container").addEventListener('click', function(e){
     var defactId = e.target.getAttribute('defact-id');
    if (defactId) {
        location.href = '/defact/detail?id=' + defactId;
    }
 });
}

function rejectEvent(){
    document.querySelector('.div-commit-bt').addEventListener('click',function(e){
       var reject, defactId; 
        var targetId = e.target.getAttribute('id');
        //reject==1 이면 불통
        if(targetId=='div_green_bt'){
           defactId = e.target.parentElement.parentElement.getAttribute('defact-id');
            reject=1;
            location.href ='/defact/make_reject?reject='+reject+'&defactId='+defactId;
        }
        //reject==2이면 통과한것
        if(targetId=='div_red_bt'){
            defactId = e.target.parentElement.parentElement.getAttribute('defact-id');
            reject=2;
            location.href ='/defact/make_reject?reject='+reject+'&defactId='+defactId;
        }
    });
}
