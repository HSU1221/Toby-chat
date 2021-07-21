const https = require("https")
const express = require("express")
const app = express()

const config = require('./config.json');

const TOKEN = config.channelAccessToken;



const line = require('@line/bot-sdk');

const client = new line.Client(config);




app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.get("/", (req, res) => {
  res.sendStatus(200)
})



app.post("/webhook", function(req, res) {
    res.send("HTTP POST request sent to the webhook URL!")
    console.log("get post('/webhook')");
    const event = req.body.events[0];
    // If the user sends a message to your bot, send a reply message
    if (event.type === "message") {
        const message = event.message;
        
        if (message.type === 'text'){
            client.replyMessage(event.replyToken,{
                type: 'text',
                text: message.text,
            });
        }
        
    }
})




// 在 localhost 走 8080 port
var server = app.listen(process.env.PORT || 8080, function() {
    var port = server.address().port;
    console.log("My Line bot App running on port", port);
});


