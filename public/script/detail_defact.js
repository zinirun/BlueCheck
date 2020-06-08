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
        cid = e.target.getAttribute('cid')
        target = document.getElementById('li_c_'+cid);
        target.innerHTML += '<form><input class="input-edit" placeholder="수정 내용을 입력하세요." cid="'+cid+'"><input type="submit" class="edit-commit-bt" value="수정"></form>';
        // 코멘트 아이디, 수정 내용 받아서 /defact 쪽 라우터 넘기면됨
    }
});

document.querySelector(".span-comment-delete-bt").addEventListener('click',function(e){
    if(e.target.getAttribute('cid')){
        if(confirm("댓글을 삭제할까요?")){
            location.href = "/defact/delete/comment/"+e.target.getAttribute('cid');
        }else{
            return false;
        }
    }
});