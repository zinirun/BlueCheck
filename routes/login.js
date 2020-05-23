var ejs = require('ejs'),
    fs = require('fs');
var mysql = require('mysql');
const mySqlClient = mysql.createConnection(require('../config/db_config'));

var login = function (req, res) {
    if (req.session.user) {
        console.log('세션 유저데이터 있음');
        res.redirect('/select');
    } else {
        var checkId = req.body.id;
        var checkPwd = req.body.password;
        var selectPwdSql = "select * from user where user_id = ? && password=?";
        mySqlClient.query(selectPwdSql, [checkId, checkPwd], function (err, row) {
            if (err) {
                console.log("dong/ho select page sql ERROR>>" + err);
            } else {
                if (row[0]) {
                    req.session.user = {
                        id: row[0].id,
                        userId: checkId,
                        userName: row[0].name,
                        userType: row[0].type
                    };

                    res.redirect('/select');
                    return true;
                } else {
                    res.send('<script type="text/javascript">alert("아이디 또는 비밀번호가 일치하지 않습니다."); window.location="/";</script>');
                }
            }
        });
    }
};
module.exports = login;