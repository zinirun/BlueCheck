var tokenArray = [];
var token = function (req, res) {
    if(req.body.token){
        var tokenValue = req.body.token;
        tokenArray.push({token:tokenValue,type:""});
        console.log("Token Value: "+tokenValue+" push 완료");
        console.log(tokenArray);
        res.end();
    }
    else{
        console.log('There is no token');
        res.end();
    }
};
module.exports = token;