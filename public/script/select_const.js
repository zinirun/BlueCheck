document.getElementById('div_ctype_list').addEventListener('click',function(e){
    if(e.target.innerText.length < 7){
        location.href='/select?ctype='+e.target.innerText;
    }
});