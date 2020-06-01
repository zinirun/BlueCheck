var ejs = require('ejs'),
    fs = require('fs');
var mysql = require('mysql');
const mySqlClient = mysql.createConnection(require('../config/db_config'));


var login = function (req, res) {
        var checkId = req.body.id;
        var checkPwd = req.body.password;
        var selectPwdSql = "select * from user where user_id = ? && password=?";
    var setToken = 'update user set token = ? where id=?;';
        mySqlClient.query(selectPwdSql, [checkId, checkPwd], function (err, row) {
            if (err) {
                console.log("dong/ho select page sql ERROR>>" + err);
            } else {
                if (row[0]) {
                    console.log('login sql - name:'+row[0].name + 'type:'+ row[0].type);
                    req.session.user = {
                        id: row[0].id,
                        userId: checkId,
                        userName: row[0].name,
                        userType: row[0].type
                    };
                    if(req.cookies.token){
                        mySqlClient.query(setToken,[req.cookies.token, row[0].id], function(err, row){
                           if(err){
                               console.log('update token error>>'+err);
                           } 
                            else{
                                console.log('토큰 정상 업데이트');
                                res.redirect('/select/const/');
                            }
                        });
                    }
                    else{
                        res.redirect('/select/const/');
                    }
                    
                } else {
                    res.send('<script type="text/javascript">alert("아이디 또는 비밀번호가 일치하지 않습니다."); window.location="/";</script>');
                }
            }
        });
};
module.exports = login;