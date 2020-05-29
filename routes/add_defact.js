//하자 등록 라우터
var ejs = require('ejs'),
    fs = require('fs'),
    mysql = require('mysql'),
    getCurrentId = require('./img_upload').getCurrentId;
var request = require('request');

const mySqlClient = mysql.createConnection(require('../config/db_config'));

//push notification
var token = require('./token.js');
var deviceToken = token.tokenArray;

var admin = require("firebase-admin");

var serviceAccount = require("../firebaseSDK.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bluecheck-37ecc.firebaseio.com"
});

//-------------------

var loadAddDefact = function (req, res) {
    var selected_dong = req.query.dong,
        selected_ho = req.query.ho,
        selected_loc = req.query.loc;

    fs.readFile('./public/add_defact.html', 'utf8', function (error, data) {
        res.send(ejs.render(data, {
            dong: selected_dong,
            ho: selected_ho,
            loc: selected_loc,
            ctype: req.cookies.ctype
        }));
    });
};

var addDefact = function (req, res) {
    if (req.session.user) {
        var c_name = req.body.construction_name; //공사명
        var loc = req.body.loc; //dong,ho,room 쪼개야함
        var dong = loc.substring(0, loc.lastIndexOf("동"));
        var ho = loc.substring(loc.lastIndexOf("동") + 2, loc.lastIndexOf("호"));
        var room = loc.substring(loc.lastIndexOf("호") + 2);

        var c_type = req.body.construction_type; //공종
        var info = req.body.defact_info; //하자 정보
        var due_date = req.body.due_date; //기한
        var imgUrl = '/' + dong + '/' + ho + '/' + dong + '_' + ho + '_' + room + '_' + (getCurrentId() + 1) + '.png';

        var params = {
            construction_name: c_name,
            construction_type: c_type,
            dong: dong,
            ho: ho,
            room: room,
            info: info,
            due_date: due_date,
            img: imgUrl
        };

        var insertDefactSql = 'INSERT INTO defact SET ?;';
        mySqlClient.query(insertDefactSql, params, function (err) {
            if (err) {
                console.log("Insert Error>>" + err);
                alertMsg = "하자 등록 중 오류가 발생했습니다.";
                res.send('<script type="text/javascript">alert("' + alertMsg + '"); window.history.back();</script>');
            } else {

                alertMsg = "하자 등록이 완료되었습니다.";
                backUrl = '/defact/list?dong=' + dong + '&ho=' + ho + '&loc=' + room;
                //                res.send('<script type="text/javascript">alert("' + alertMsg + '"); location.href = "' + backUrl + '";</script>');
                //                var payload = {
                //                    notification: {
                //                        title: "하자 등록 알림",
                //                        body: dong + "동 " + ho + "호에 새로운 하자가 등록되었습니다."
                //                    }
                //                }
                //                var options = {
                //                    priority: "normal",
                //                    timeToLive: 60 * 60
                //                };
                //                admin.messaging().sendToDevice(deviceToken, payload, options)
                //                    .then(function (response) {
                //                        console.log("Successflly sent message:", response);
                //                        res.send('<script type="text/javascript">alert("' + alertMsg + '"); location.href = "' + backUrl + '";</script>');
                //                    })
                //                    .catch(function (err) {
                //                        console.log("Error sending message:", err);
                //                    });
                request.post({
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    uri: 'https://exp.host/--/api/v2/push/send',
                    body: JSON.stringify({
                        to: token[0],
                        sound: 'default',
                        title: 'The title of your message goes here',
                        body: 'The body of the message goes here'
                    })
                }, function(err, response, body){
                    if(err)
                        console.log("Push error>>"+err);
                    else{
                        console.log("Succesfully sent>>"+response);
                        res.redirect('/defact/list?dong='+dong+'&ho='+ho+'&loc='+room);
                    }
                });
                
            }
        });
    } else {
        res.send('<script type="text/javascript">alert("로그인 후 이용하세요."); window.location="/";</script>');
    }
};

//-------------------------------푸시알림------


//------------------------------------------

module.exports.loadAddDefact = loadAddDefact;
module.exports.addDefact = addDefact;
