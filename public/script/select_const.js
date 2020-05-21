document.querySelector('.div-ctype-list').addEventListener('click',function(e){
    if(e.target.innerText){
        location.href='/select?ctype='+e.target.innerText;
    }
});