var ejs = require('ejs'),
    fs = require('fs');
var mysql = require('mysql');

const mySqlClient = mysql.createConnection(require('../config/db_config'));

//해당 동/호/방 안 하자 리스트 
var defactList = function (req, res) {
    var selected_dong = req.query.dong,
        selected_ho = req.query.ho,
        selected_loc = req.query.loc;
    var selectDefactSql = "select * from defact where dong=? and ho = ? and room=?;";

    mySqlClient.query(selectDefactSql, [selected_dong, selected_ho, selected_loc], function (err, rows, fields) {
        if (err) {
            console.log("ERROR>>" + err);
        } else {
            var unsolvedDefact = [];
            var solvedDefact = [];

            rows.forEach(function (element) {

                if (element.is_solved == '0') {
                    unsolvedDefact.push(element);
                } else {
                    solvedDefact.push(element);
                }

            });
            fs.readFile('./public/list_defact.html', 'utf8', function (error, data) {
                res.cookie('loc',selected_loc);
                res.send(ejs.render(data, {
                    dong: selected_dong,
                    ho: selected_ho,
                    loc: selected_loc,
                    unsolvedDefact: unsolvedDefact,
                    solvedDefact: solvedDefact
                }));

            });
        }
    });
};

var defactDetailList = function (req, res) {

    var defactId = req.query.id;

    var selectDetailSql = 'select d.id, d.img, d.construction_name, d.construction_type, d.info, d.due_date, d.is_read, d.is_solved from defact d where d.id = ?';

    var selectCommentSql = 'select u.name, u.type user_type,  c.comment from comment c, user u where c.defact_id = ? and u.id = c.user_id;';
    mySqlClient.query(selectDetailSql, defactId, function (err, row) {
        if (err) {
            console.log("select detail sql ERROR>> " + err);
        } else {
            var detailInfo = row[0];
            var commentInfo = [];
            mySqlClient.query(selectCommentSql, defactId, function (err, rows) {
                if (err) {
                    console.log('select comment sql error>' + err);
                } else {
                    rows.forEach(function (element) {
                        commentInfo.push(element);
                    });
                    fs.readFile('./public/detail_defact.html', 'utf8', function (err, data) {

                        res.send(ejs.render(data, {
                            detailInfo: detailInfo,
                            commentInfo: commentInfo
                        }));
                    });
                }

            });
        }
    });
};

var addComment = function (req, res) {
    if (req.session.user) {
        var user = {
            userId: req.session.user.id,
            userType: req.session.user.userType,
            userName: req.session.user.userName
        };
        var defactId = req.body.defact_id;
        var inputComment = req.body.inputComment;
        var insertCommentSql = 'insert into comment  (user_id, defact_id, comment )values (?,?,?)';

        var params = [user.userId, defactId, inputComment];
        mySqlClient.query(insertCommentSql, params, function (err) {
            if (err) {
                console.log("Comment Sql Error>>" + err);
            } else {
                //나중에 Ajax로 바꿔볼것!!!!!!
                res.writeHead(302, {
                    'Location': '/defact/detail?id=' + defactId
                });
                res.end();
            }
        });
    } else {
        res.send('<script type="text/javascript">alert("로그인 후 이용하세요."); window.location="/";</script>');
    }
};

module.exports.defactList = defactList;
module.exports.defactDetailList = defactDetailList;
module.exports.defactAddComment = addComment;