//공종, 동, 호 선택 함수
var ejs = require('ejs'),
    fs = require('fs');

var select = function (req, res) {
    if (req.session.user) {
        //동, 호 선택
        if (req.query.ctype) {
            fs.readFile('./public/select.html','utf8',function(err,data){
                //선택한 공사종류를 쿠키에 저장
               res.cookie('ctypeCookie',req.query.ctype);
                res.send(ejs.render(data, {
                    name: req.session.user.userName,
                    type: req.session.user.userType
                }));
            });
        } 
        //공사종류 선택
        else {
            fs.readFile('./public/select_const.html', 'utf8', function (error, data) {
                var ctype = req.query.ctype;
                res.send(ejs.render(data, {
                    name: req.session.user.userName,
                    type: req.session.user.userType
                }));
            });
        }

    } else {
        res.send('<script type="text/javascript">alert("로그인 후 이용하세요."); window.location="/";</script>');
    }
};
module.exports = select;