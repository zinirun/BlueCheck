var ejs = require('ejs'),
    fs = require('fs');
var mysql = require('mysql');

const mySqlClient = mysql.createConnection(require('../config/db_config'));

const rooms = ["현관", "거실", "발코니1", "발코니2", "발코니3", "침실1", "침실2", "침실3", "주방,식당", "욕실1", "욕실2"];

var drawing = function (req, res) {
    var selected_dong = req.query.dong,
        selected_ho = req.query.ho,
        selected_ctype = req.query.ctype;

    var selectUnsolvedDefactSql = 'select room, count(*) as cnt from defact where dong = ? and ho = ? and construction_type = ? and is_reject < 2 group by room';

    fs.readFile('./public/view_defact.html', 'utf8', function (error, data) {
        
        res.cookie('ctype', selected_ctype);
        res.cookie('dong', selected_dong);
        res.cookie('ho', selected_ho);
        
        mySqlClient.query(selectUnsolvedDefactSql, [selected_dong, selected_ho, selected_ctype], function (err, rows) {
            if (err) {
                console.log('Sql Error: ' + err);
                res.redirect('/');
            } else {
                
                console.log("Cookie - dong:"req.cookies.dong +"/ho:"+req.cookies.ho +"/ctype:"+req.cookies.ctype);
                
                var d_data = [];
                var data_cnt = [];

                for (var i = 0; i < 11; i++) {
                    data_cnt.push(0);
                }

                rows.forEach(function (element) {
                    d_data.push([element.room, element.cnt]);
                });

                for (var i = 0 in rooms) {
                    for (var j = 0 in d_data) {
                        if (d_data[j][0] == rooms[i]) {
                            data_cnt[i] = d_data[j][1];
                        }
                    }
                }
                     
                res.send(ejs.render(data, {
                    dong: selected_dong,
                    ho: selected_ho,
                    ctype: selected_ctype,
                    data_cnt: data_cnt
                }));
            }
        });
    });
};

module.exports = drawing;