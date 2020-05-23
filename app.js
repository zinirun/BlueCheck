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
    cors = require('cors'), //ajax 요청시 cors 지원
    multer = require('multer') //사진 업로드

var mysql = require('mysql');
const mySqlClient = mysql.createConnection(require('./config/db_config'));


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



//도면 이동 라우터
router.route('/defact/drawing/').get(function (req, res) {
    var selected_dong = req.query.dong,
        selected_ho = req.query.ho;

    fs.readFile('./public/view_defact.html', 'utf8', function (error, data) {
        res.send(ejs.render(data, {
            dong: selected_dong,
            ho: selected_ho
        }));
    });
});



//하자 등록 이동 라우터
router.route('/defact/add/').get(function (req, res) {
    var selected_dong = req.query.dong,
        selected_ho = req.query.ho,
        selected_loc = req.query.loc;
    console.log(req.query.dong);

    fs.readFile('./public/add_defact.html', 'utf8', function (error, data) {
        res.send(ejs.render(data, {
            dong: selected_dong,
            ho: selected_ho,
            loc: selected_loc
        }));
    });
});


//하자 등록 라우터
router.route('/defact/add_submit').post(function (req, res) {
    var c_name = req.body.construction_name; //공사명
    var loc = req.body.loc; //dong,ho,room 쪼개야함
    var c_type = req.body.construction_type; //공종
    var info = req.body.defact_info; //하자 정보
    var due_date = req.body.due_date; //기한
    //이미지 파일 ?
    var type = req.body.type;
    var result;
    var params = {
        user_id: id,
        password: pw,
        name: name,
        tel: tel,
        type: type
    };
});

var index = require('./routes/index.js');
router.route('/').get(index);

var register = require('./routes/register.js');
router.route('/register').get(register.register);
router.route('/reg_submit').post(register.reg_submit);
var login = require('./routes/login.js');
router.route('/process/login').post(login);

//공사종류, 동, 호  선택페이지
var select = require('./routes/select.js');
router.route('/select').get(select);

//하자 리스트 이동 라우터
var defact = require('./routes/defact.js');
router.route('/defact/list/').get(defact.defactList);
//하자 세부 페이지 라우터
router.route('/defact/detail/').get(defact.defactDetailList);
//하자 상세 페이지 댓글 등록 라우터
router.route('/defact/add/comment/').post(defact.defactAddComment);

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
