var tokenArray = [];
var token = function (req, res) {
    if(req.body.token){
        var tokenValue = req.body.token;
        if(!tokenArray.includes(tokenValue)){
            tokenArray.push(tokenValue);
        }
        console.log('token: '+tokenValue);
        res.end();
    }
    else{
        console.log('There is no token');
        res.end();
    }
};
module.exports.addToken = token;
module.exports.tokenArray = tokenArray;