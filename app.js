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
    user: 'root',
    password: 'wjswls1',
    database: 'meokgom',
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
        res.send(ejs.render(data, {
        }));
    });
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
