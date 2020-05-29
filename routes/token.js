var tokenArray = [];
var token = function (req, res) {
    if(req.query.token){
        var tokenValue = req.query.token;
        tokenArray.push({token:tokenValue,type:""});
        console.log("Token Value: "+tokenValue+" push 완료");
        console.log(tokenArray);
    }
    else{
        console.log('There is no token');
    }
    res.end();
};
module.exports = token;