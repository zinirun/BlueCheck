var ejs = require('ejs'),
    fs = require('fs');
var mysql = require('mysql');

const mySqlClient = mysql.createConnection(require('../config/db_config'));

//해당 동/호/방 안 하자 리스트 
var defactList = function (req, res) {
    if (req.session.user) {
        var selected_dong = req.query.dong,
            selected_ho = req.query.ho,
            selected_loc = req.query.loc,
            ctype = req.cookies.ctype;
        var selectDefactSql = "select * from defact where dong=? and ho = ? and room=? and construction_type=? order by is_reject;";

        mySqlClient.query(selectDefactSql, [selected_dong, selected_ho, selected_loc, ctype], function (err, rows, fields) {
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
                    res.cookie('loc', selected_loc);
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
    } else {
        res.send('<script type="text/javascript">alert("로그인 후 이용하세요."); window.location="/";</script>');
    }
};

var defactDetailList = function (req, res) {
    if (req.session.user) {
        var defactId = req.query.id;
        res.cookie('defactId', defactId);
        var ctype = req.cookies.ctype;
        var selectDetailSql = 'select d.id, d.img, d.construction_name, d.construction_type, d.info, d.create_date, d.due_date, d.is_solved, d.is_reject from defact d where d.id = ? and d.construction_type=?';

        var selectCommentSql = 'select u.name, u.type user_type,  c.comment from comment c, user u where c.defact_id = ? and u.id = c.user_id;';
        mySqlClient.query(selectDetailSql, [defactId, ctype], function (err, row) {
            if (err) {
                console.log("select detail sql ERROR>> " + err);
            } else {
                var detailInfo = row[0];
                detailInfo.create_date = detailInfo.create_date.substring(0,11);
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
                                commentInfo: commentInfo,
                                dong: req.cookies.dong,
                                ho: req.cookies.ho,
                                loc: req.cookies.loc
                            }));
                        });
                    }

                });
            }
        });
    } else {
        res.send('<script type="text/javascript">alert("로그인 후 이용하세요."); window.location="/"');
    }
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

var defactMakeSolved = function (req, res) {
    if (req.session.user) {
        var defactId = req.cookies.defactId;
        var updateIsSolvedSql = 'update defact set is_solved=1 where id=?;';
        mySqlClient.query(updateIsSolvedSql, defactId, function (err) {
            if (err) {
                console.log('update is solved err>>' + err);
            } else {
                var ho = req.cookies.ho,
                    dong = req.cookies.dong,
                    loc = req.cookies.loc;
                res.redirect('/defact/list/?dong=' + dong + '&ho=' + ho + '&loc=' + loc);
            }
        });
    } else {
        res.send('<script type="text/javascript">alert("로그인 후 이용하세요."); window.location="/";</script>');
    }
};

var rejectOrPass = function (req, res) {
    if (req.session.user) {
        if (req.session.user.userType == '기사') {
            var defactId = req.query.defactId;
            var reject = req.query.reject;
            //reject ==1 이면 red reject==2 면 green
            var rejectSql = 'update defact set is_reject = ? where id = ?;';
            mySqlClient.query(rejectSql, [reject, defactId], function (err) {
                if (err) {
                    console.log('Reject error>>' + err);
                } else {
                    dong = req.cookies.dong;
                    ho = req.cookies.ho;
                    loc = req.cookies.loc;
                    res.redirect('/defact/list?dong=' + dong + '&ho=' + ho + '&loc=' + loc);
                }
            });
        } else {
            res.send('<script type="text/javascript">alert("권한이 없습니다."); window.location="/defact/list?dong=' + req.cookies.dong + '&ho=' + req.cookies.ho + '&loc=' + req.cookies.loc + '";</script>');
        }
    } else {
        res.send('<script type="text/javascript">alert("로그인 후 이용하세요."); window.location="/";</script>');
    }
};

module.exports.defactMakeSolved = defactMakeSolved;
module.exports.defactList = defactList;
module.exports.defactDetailList = defactDetailList;
module.exports.defactAddComment = addComment;
module.exports.rejectOrPass = rejectOrPass;
