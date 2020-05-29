var tokenArray = [];
var token = function (req, res) {
    if(req.body.token){
        var tokenValue = req.body.token.value;
        tokenArray.push(tokenValue);
        console.log('token: '+tokenArray);
        res.end();
    }
    else{
        console.log('There is no token');
        res.end();
    }
};
module.exports.addToken = token;
module.exports.tokenArray = tokenArray;