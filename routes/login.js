const ejs = require('ejs'),
    fs = require('fs'),
    mysql = require('mysql'),
    crypto = require('crypto');

const mySqlClient = mysql.createConnection(require('../config/db_config'));


var login = function (req, res) {

    let checkId = req.body.id,
        checkPwd = crypto.createHash('sha512').update(req.body.password).digest('base64');
    var selectPwdSql = "select * from user where user_id = ? && password=?";
    var setToken = 'update user set token = ? where id=?;';
    mySqlClient.query(selectPwdSql, [checkId, checkPwd], function (err, row) {
        if (err) {
            console.log("dong/ho select page sql ERROR>>" + err);
        } else {
            if (row[0]) {
                console.log('login sql - name:' + row[0].name + 'type:' + row[0].type);
                req.session.user = {
                    id: row[0].id,
                    userId: checkId,
                    userName: row[0].name,
                    userType: row[0].type
                };
                console.log(req.cookies.token);
                if (req.cookies.token) {
                    
                    //Token Update
                    mySqlClient.query(setToken, [req.cookies.token, row[0].id], function (err, row) {
                        if (err) {
                            console.log('update token error>>' + err);
                        } else {
                            console.log('토큰 정상 업데이트');
                            res.writeHead(200, {
                                'Set-Cookie': 'token=; Max-Age:0'
                            });
                            res.redirect('/select/const/');
                        }
                    });
                } else {
                    res.redirect('/select/const/');
                }

            } else {
                res.send('<script type="text/javascript">alert("아이디 또는 비밀번호가 일치하지 않습니다."); window.location="/";</script>');
            }

        }
    });
};

module.exports = login;
