const express = require('express')
const linebot = require('linebot');// 判別開發環境

if (process.env.NODE_ENV !== 'production') {      // 如果不是 production 模式
    require('dotenv').config()                      // 使用 dotenv 讀取 .env 檔案
}

const bot = linebot({
    channelId: process.env.CHANNEL_ID,
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

const linebotParser = bot.parser();

bot.on('message', function (event) {
    console.log(event);
    event.reply(event.message.text).then(function (data) {
        // success
        }).catch(function (error) {
        // error
        });
});


const app = express()
const linebotParser = bot.parser();
app.post('/', linebotParser);


//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
    var port = server.address().port;
    console.log("App now running on port", port);
  });


  
// app.listen(process.env.PORT || 3000, () => {
//     console.log('Express server start')
// });
