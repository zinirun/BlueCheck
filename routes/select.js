//공종, 동, 호 선택 함수
var ejs = require('ejs'),
    fs = require('fs'),
    mysql = require('mysql');

const mySqlClient = mysql.createConnection(require('../config/db_config'));

let dong_list = [];
let ho_list = [];
const ctype_list = ["조적공사", "미장공사", "방수공사", "석공사", "타일공사", "도장공사", "유리공사", "커튼월공사", "수장공사"];

const MAX_DONG = 9; // 101~108 Dong
const MAX_HO = 4; // 1 ho ~ 4 ho
const MAX_FLOOR = 10; //101~104 - 1001~1004 Ho

for (var k = 1; k <= MAX_DONG; k++) {
    dong_list.push(100 + k);
}

for (var i = MAX_FLOOR; i >= 1; i--) {
    for (var j = 1; j <= MAX_HO; j++) {
        ho_list.push(i * 100 + j);
    }
}

var select = function (req, res) {
    if (req.session.user) {
        //동, 호 선택
        if (req.query.ctype) {
            if (req.query.dong) { // 호 선택
                fs.readFile('./public/select_ho.html', 'utf8', function (err, data) {
                    var selectUnsolvedDefactSql_ho = 'select ho, count(*) as cnt from defact where dong = ? and construction_type = ? and is_reject < 2 group by ho';
                    mySqlClient.query(selectUnsolvedDefactSql_ho, [req.query.dong, req.query.ctype], function (err, rows) {
                        if (err) {
                            console.log('Sql Error: ' + err);
                            res.redirect('/');
                        } else {
                            var h_data = [];
                            var ho_data_cnt = [];

                            for (var i = 0 in ho_list) {
                                ho_data_cnt.push(0);
                            }

                            rows.forEach(function (element) {
                                h_data.push([element.ho, element.cnt]);
                            });

                            for (var i = 0 in ho_list) {
                                for (var j = 0 in h_data) {
                                    if (h_data[j][0] == ho_list[i]) {
                                        ho_data_cnt[i] = h_data[j][1];
                                    }
                                }
                            }

                            res.send(ejs.render(data, {
                                name: req.session.user.userName,
                                type: req.session.user.userType,
                                ctype: req.query.ctype,
                                dong: req.query.dong,
                                ho_data: ho_data_cnt
                            }));
                        }
                    });
                });

            } else { //동 선택
                fs.readFile('./public/select_dong.html', 'utf8', function (err, data) {
                    var selectUnsolvedDefactSql_dong = 'select dong, count(*) as cnt from defact where construction_type = ? and is_reject < 2 group by dong';
                    mySqlClient.query(selectUnsolvedDefactSql_dong, [req.query.ctype], function (err, rows) {
                        if (err) {
                            console.log('Sql Error: ' + err);
                            res.redirect('/');
                        } else {
                            var d_data = [];
                            var dong_data_cnt = [];

                            for (var i = 0 in dong_list) {
                                dong_data_cnt.push(0);
                            }

                            rows.forEach(function (element) {
                                d_data.push([element.dong, element.cnt]);
                            });

                            for (var i = 0 in dong_list) {
                                for (var j = 0 in d_data) {
                                    if (d_data[j][0] == dong_list[i]) {
                                        dong_data_cnt[i] = d_data[j][1];
                                    }
                                }
                            }

                            res.send(ejs.render(data, {
                                name: req.session.user.userName,
                                type: req.session.user.userType,
                                dong_data: dong_data_cnt,
                                ctype: req.query.ctype
                            }));

                        }
                    });
                });
            }
        }
        //공사종류 선택 (첫번재로 실행)
        else {
            var selectUnsolvedDefactSql_ctype = 'select construction_type as c, count(*) as cnt from defact where is_reject < 2 group by construction_type order by construction_type';

            fs.readFile('./public/select_const.html', 'utf8', function (error, data) {
                mySqlClient.query(selectUnsolvedDefactSql_ctype, function (err, rows) {

                    var c_data = [];
                    var c_data_cnt = [];

                    for (var i = 0 in ctype_list) {
                        c_data_cnt.push(0);
                    }

                    rows.forEach(function (element) {
                        c_data.push([element.c, element.cnt]);
                    });

                    for (var i = 0 in ctype_list) {
                        for (var j = 0 in c_data) {
                            if (c_data[j][0] == ctype_list[i]) {
                                c_data_cnt[i] = c_data[j][1];
                            }
                        }
                    }

                    res.send(ejs.render(data, {
                        name: req.session.user.userName,
                        type: req.session.user.userType,
                        c_data: c_data_cnt,

                    }));
                });
            });
        }
    } else {
        res.send('<script type="text/javascript">alert("로그인 후 이용하세요."); window.location="/";</script>');
    }
};
module.exports = select;
