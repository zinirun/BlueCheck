var express = require('express');
var app = express();
var http = require('http').createServer(app);
var path = require('path'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    static = require('serve-static'),
    errorHandler = require('errorhandler'),
    expressErrorHandler = require('express-error-handler'),
    expressSession = require('express-session'),
    ejs = require('ejs'),
    fs = require('fs'),
    url = require('url'),
    cors = require('cors'); //ajax 요청시 cors 지원

var mysql = require('mysql');
const mySqlClient = mysql.createConnection(require('./config/db_config'));

//이미지 업로드 모듈 (POST)
var imgUpload = require('./routes/img_upload').imgUpload;

app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/public', express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));
app.use(cors());

var router = express.Router();

//도면 이동 라우터
router.route('/defact/drawing/').get(function (req, res) {
    var selected_dong = req.query.dong,
        selected_ho = req.query.ho;

    res.cookie('dong', req.query.dong);
    res.cookie('ho', req.query.ho);

    fs.readFile('./public/view_defact.html', 'utf8', function (error, data) {
        res.send(ejs.render(data, {
            dong: selected_dong,
            ho: selected_ho
        }));
    });
});

//하자 리스트 이동 라우터
router.route('/defact/list/').get(function (req, res) {
    var selected_dong = req.cookies.dong,
        selected_ho = req.cookies.ho,
        selected_loc = req.query.loc;

    res.cookie('loc', req.query.loc);

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
});

//하자 세부 페이지 라우터
router.route('/defact/detail/').get(function (req, res) {
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
});

//하자 상세 페이지 댓글 등록 라우터
router.route('/defact/add/comment/').post(function (req, res) {
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
});

//공사종류, 동, 호  선택페이지
router.route('/select').get(function (req, res) {
    if (req.session.user) {
        //동, 호 선택
        if (req.query.ctype) {
            fs.readFile('./public/select.html', 'utf8', function (err, data) {
                //선택한 공사종류를 쿠키에 저장
                res.cookie('ctype', req.query.ctype);
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
});


//메인 페이지 라우터
var index = require('./routes/index.js');
router.route('/').get(index);

//회원가입 라우터
var register = require('./routes/register.js');
router.route('/register').get(register.register);
router.route('/reg_submit').post(register.reg_submit);

//로그인 라우터
var login = require('./routes/login.js');
router.route('/process/login').post(login);

//하자 등록 라우터 (submit)
var addDefact = require('./routes/add_defact.js');
router.route('/defact/add_submit').post(imgUpload.single('img'), addDefact.addDefact);

//하자 등록 이동 라우터
router.route('/defact/add/').get(addDefact.loadAddDefact);

app.use('/', router);



// 404 에러 페이지 처리
var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);


//웹서버 생성
http.listen(app.get('port'),
    function () {
        console.log('server started - port: ' + app.get('port'));
    }
);
