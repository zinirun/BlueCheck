document.querySelector("#span-defact-finish-bt").addEventListener('click',function(e){
    location.href='/defact/make_solved';
});

document.querySelector("#span-pdf-bt").addEventListener('click',function(e){
    document.querySelector(".div-defact-box").style.display = "none";
    document.querySelector("#div_pdf_box").style.display = "block";
});

document.querySelector("#span_pdf_close").addEventListener('click',function(e){
    document.querySelector("#div_pdf_box").style.display = "none";
    document.querySelector(".div-defact-box").style.display = "block";
});

document.querySelector(".span-comment-edit-bt").addEventListener('click',function(e){
    if(e.target.getAttribute('cid')){
        // 코멘트 아이디, 수정 내용 받아서 /defact 쪽 라우터 넘기면됨
    }
});

document.querySelector(".span-comment-delete-bt").addEventListener('click',function(e){
    if(e.target.getAttribute('cid')){
        
    }
});