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

var mySqlClient = mysql.createConnection({
    connectionLimit: 10,
    host: 'localhost',
    user: 'bestwayuser',
    password: '1234',
    database: 'bestwaydb',
    dateStrings: 'date',
    debug: false
});

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use('/public', express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));
app.use(cors());

var router = express.Router();

//MainPage 라우터
router.route('/').get(function (req, res) {

    fs.readFile('./public/index.html', 'utf8', function (error, data) {
        res.send(ejs.render(data, {}));
    });
});

//도면 이동 라우터
router.route('/defact/drawing/').get(function (req, res) {
    var selected_dong = req.query.dong,
        selected_ho = req.query.ho;

    console.log(selected_dong + selected_ho);

    fs.readFile('./public/view_defact.html', 'utf8', function (error, data) {
        res.send(ejs.render(data, {
            dong: selected_dong,
            ho: selected_ho
        }));
    });
});

//하자 리스트 이동 라우터
router.route('/defact/list/').get(function (req, res) {
    var selected_dong = req.query.dong,
        selected_ho = req.query.ho,
        selected_loc = req.query.loc;

    fs.readFile('./public/list_defact.html', 'utf8', function (error, data) {
        res.send(ejs.render(data, {
            dong: selected_dong,
            ho: selected_ho,
            loc: selected_loc
        }));
    });
});

//회원가입 이동 라우터
router.route('/register').get(function (req, res) {
    fs.readFile('./public/register.html', 'utf8', function (error, data) {
        res.send(ejs.render(data, {}));
    });
});


//회원가입 라우터
router.route('/reg_submit').post(function (req, res) {
    var id = req.body.id;
    var pw = req.body.pw;
    var name = req.body.name;
    var tel = req.body.tel;
    var auth = req.body.auth;
    var type = req.body.type;
    var result;
    var params = {
        user_id: id,
        password: pw,
        name: name,
        tel: tel,
        type: type
    };

    var alertMsg = "";
    if (auth === '1234') {
        result = checkInput(params);
        if (result == 2) {
            alertMsg = '연락처 입력이 잘못되었습니다.';
            res.send('<script type="text/javascript">alert("' + alertMsg + '"); window.location="/register";</script>');
        } else if (result == 3) {
            alertMsg = '아이디는 영어/숫자 4-12자리로 입력해주세요.';
            res.send('<script type="text/javascript">alert("' + alertMsg + '"); window.location="/register";</script>');
        } else {
            var checkIdSql = 'SELECT * FROM user WHERE user_id = ?;';
            mySqlClient.query(checkIdSql, params.user_id, function (err, rows) {
                if (err) {
                    console.log("Search Error>>" + err);
                    alertMsg = "회원등록 중 오류가 발생했습니다.";
                    res.send('<script type="text/javascript">alert("' + alertMsg + '"); window.location="/register";</script>');
                } else {
                    if (rows.length > 0) {
                        alertMsg = "이미 사용중인 아이디입니다.";
                        res.send('<script type="text/javascript">alert("' + alertMsg + '"); window.location="/register";</script>');
                    } else {
                        var insertSql = 'INSERT INTO user SET ?;';
                        mySqlClient.query(insertSql, params, function (err) {
                            if (err) {
                                console.log("Insert Error>>" + err);
                                alertMsg = "회원등록 중 오류가 발생했습니다.";
                                res.send('<script type="text/javascript">alert("' + alertMsg + '"); window.location="/register";</script>');
                            } else {
                                alertMsg = "회원가입이 완료되었습니다.";
                                res.send('<script type="text/javascript">alert("' + alertMsg + '"); window.location="/";</script>');

                            }
                        });
                    }

                }
            });
        }
    } else {
        res.send('<script type="text/javascript">alert("인증코드가 일치하지 않습니다."); window.location="/register";</script>');
        res.end();
    }
});

//회원가입 이동 라우터
router.route('/register').get(function (req, res) {
    fs.readFile('./public/register.html', 'utf8', function (error, data) {
        res.send(ejs.render(data, {}));
    });
});

function checkInput(params) {
    var result;
    var pattern_eng = /[a-zA-Z]/; //영어 입력 체크 패턴
    var pattern_num = /[0-9]/; //숫자 입력 체크 
    var pattern_spc = /[~!@#$%^&*()_+|<>?:{}]/; // 특수문자
    var pattern_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글체크
    id = params.user_id;
    tel = params.tel;
    if ((pattern_num.test(id)) || (pattern_eng.test(id)) && !(pattern_spc.test(id)) && !(pattern_kor.test(id))) { //id검사
        if ((pattern_num.test(tel)) && !(pattern_eng.test(tel)) && !(pattern_spc.test(tel)) && !(pattern_kor.test(tel))) { //tel검사
            result = 1; //정상
        } else {
            result = 2; // tel 입력 오류
        }
    } else {
        result = 3; //id 입력 오류
    }
    return result;
}


//-------------------------회원가입------------------------------------


//--------------------------로그인-------------------------------------
router.route('/process/login').post(function (req, res) {
    if (req.session.user) {
        console.log('세션 유저데이터 있음');
        res.redirect('/select');
    } else {
        var checkId = req.body.id;
        var checkPwd = req.body.password;

        console.log("processlogin 도착");
        fs.readFile('./public/select.html', 'utf8', function (err, data) {
            var selectPwdSql = "select * from user where user_id = ? && password=?";
            mySqlClient.query(selectPwdSql, [checkId,checkPwd], function (err, row) {
                if (err) {
                    console.log("ERROR>>" + err);
                } else {
                    if (row[0]) {
                        console.log("sql 반환 됨");
                        req.session.user = {
                            id: row[0].id,
                            userId: checkId,
                            userName: row[0].name,
                            userType: row[0].type
                        };
                        console.log("리다이렉트시도");
                        res.redirect('/select');
                        return true;
                    } else {
                        res.send('<script type="text/javascript">alert("아이디와 비밀번호가 일치하지 않습니다."); window.location="/";</script>');
                    }
                }
            });


        });
    }
});

//동/호 선택 페이지
router.route('/select').get(function (req, res) {
    if(req.session.user){
    fs.readFile('./public/select.html', 'utf8', function (error, data) {
        res.send(ejs.render(data, {}));
    });
    }
    else{
        res.send('<script type="text/javascript">alert("로그인 후 이용하세요."); window.location="/";</script>');
    }
});


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
