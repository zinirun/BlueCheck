var savedPushTokens = [];
const { Expo } = require('expo-server-sdk');
let expo = new Expo();

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

const handlePushTokens = (message) => {
    let notifications = [];
    for (let pushToken of savedPushTokens) {
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error('Push token ${pushToken} is not a valid Expo push token');
            continue;
        }
        notifications.push({
            to: pushToken,
            sound: 'default',
            title: '새로운 하자 등록',
            body: message,
            data: {
                message
            },
            channelId: "default",
        })
    }
    let chunks = expo.chunkPushNotifications(notifications);
    (async () => {
        for (let chunk of chunks) {
            try {
                let receipts = await expo.sendPushNotificationsAsync(chunk);
                console.log(receipts);
            } catch (error) {
                console.error(error);
            }
        }
    })();
}

module.exports.sendPush = handlePushTokens;
module.exports.addToken = token;
module.exports.tokenArray = savedPushTokens;