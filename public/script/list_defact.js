function go_add_defact(){
    dong = document.getElementById('span_dong').innerHTML.trim();
    ho = document.getElementById('span_ho').innerHTML.trim();
    loc = document.getElementById('span_loc').innerHTML.trim();
    
    location.href = '/defact/add?dong='+dong+'&ho='+ho+'&loc='+loc;
}