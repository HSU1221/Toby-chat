
const express = require("express");

const router = express.Router();

const line = require('@line/bot-sdk');



require('dotenv').config();

const config = {
    "channelId": process.env.CHANNEL_ID,
    "channelSecret": process.env.CHANNEL_SECRET,
    "channelAccessToken": process.env.CHANNEL_ACCESS_TOKEN
};





// const config = require('../config.json');







const client = new line.Client(config);

router.get('/', (req, res) => res.end(`I'm listening. Please access with POST.`));




router.post('/', (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});







// event handler
function handleEvent(event) {
    if (event.replyToken === "00000000000000000000000000000000" || event.replyToken === "ffffffffffffffffffffffffffffffff")
        return Promise.resolve(null);
    if (event.type !== 'message' || event.message.type !== 'text') {
        // ignore non-text-message event
        return Promise.resolve(null);
    }


    const flex1 = require('../Container/flexmessage/flex1.json'); 

    if (event.message.text === '貼圖') {
        return client.replyMessage(event.replyToken, [
            {
                type: 'sticker',
                packageId: '1',
                stickerId: '1'
            },
            {
                type: 'flex',
                altText: 'this is a flex message',
                contents: flex1      
            }
        ]);
    }


    // create a echoing text message
    const echo = { type: 'text', text: event.message.text };

    // use reply API
    return client.replyMessage(event.replyToken, echo);

};



















/*
router.post("/", function(req, res) {
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
});
*/


module.exports = router;











