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

//MainPage 라우터
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

//회원가입 이동 라우터
router.route('/register').get(function (req, res) {
    fs.readFile('./public/register.html', 'utf8', function (error, data) {
        res.send(ejs.render(data, {
        }));
    });
});

//회원가입 라우터
router.route('/reg_submit').post(function(req,res){
    var id = req.body.id;
    var pw = req.body.pw;
    var name = req.body.name;
    var tel = req.body.tel;
    var auth = req.body.auth;
    var type = req.body.type;
    
    var params = [id,pw,name,tel,type];
    var result="";
    console.log('요청 파라미터:'+id+', '+pw+', '+name+', '+tel+', '+auth+', '+type);
    if(auth==='1234'){
        checkIfUsed(params,result,res);
        }
    
    else{
        res.send('<script type="text/javascript">alert("인증코드가 일치하지 않습니다."); window.location="/register";</script>');
         res.end();
    }
   
});

function checkIfUsed(params,result,res){
     mySqlClient.connect();
     var checkIdSql = 'SELECT * FROM user WHERE user_id = ?;';
    mySqlClient.query(checkIdSql,params[0],function(err,rows){
        if(err){
            console.log("Search Error>>"+err);
            mySqlClient.end(); return;
        }
        else{
            if(rows.length>0){
                result = "이미 사용중인 아이디입니다.";
                printRegisterResult(result,res);
            }
            else{
                addUser(params,result,res);
            }
        }
    });
}


function addUser(params,result,res){
    var insertSql = 'INSERT INTO user (user_id, password, name,tel, type) VALUES (?,?,?,?,?);';
    mySqlClient.query(insertSql,params,function(err){
        if(err) 
            console.log("Insert Error>>"+err); 
        else {
            result = "회원가입이 완료되었습니다.";
            console.log(result);
            printRegisterResult(result,res);
        }
    });
}


function printRegisterResult(result,res){
    res.send('<script type="text/javascript">alert("'+result+'"); window.location="/register";</script>');
    mySqlClient.end();
    res.end();
}

//-------------------------Mysql------------------------------------

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
