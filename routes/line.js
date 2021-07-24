

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


const axios = require('axios');

const FormData = require('form-data');














const client = new line.Client(config);

//const client = require('../Container/client');// 失敗
//import client from "../Container/client";


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






function handleEvent(event) {
    if (event.replyToken && event.replyToken.match(/^(.)\1*$/)) {
      return console.log('Test hook recieved: ' + JSON.stringify(event.message));
    }
    console.log(`User ID: ${event.source.userId}`);
  
    switch (event.type) {
        case 'message':
            const message = event.message;
            switch (message.type) {
                case 'text':
                    return handleText(message, event.replyToken, event.source);
                case 'image':
                    return handleImage(message, event.replyToken);
                case 'video':
                    return handleVideo(message, event.replyToken);
                case 'audio':
                    return handleAudio(message, event.replyToken);
                case 'location':
                    return handleLocation(message, event.replyToken, event.source);
                case 'sticker':
                    return handleSticker(message, event.replyToken);
                default:
                    throw new Error(`Unknown message: ${JSON.stringify(message)}`);
            }
            default:
                throw new Error(`Unknown event: ${JSON.stringify(event)}`);
    }
};

function handleText(message, replyToken, source) {
    console.log("get user's text")
    switch (message.text) {
        case '測試1':
            return client.replyMessage(replyToken, [
                {
                    type: 'sticker',
                    packageId: '1',
                    stickerId: '1'
                }
            ])
    
        default:
            console.log(`Echo message to ${replyToken}: ${message.text}`);
            const echo = {
                type: 'text',
                text: message.text
            };
            return client.replyMessage(replyToken, echo);
    }
};




function downloadContent(messageId, downloadPath) {
    return client.getMessageContent(messageId)
        .then((stream) => new Promise((resolve, reject) => {
            const writable = fs.createWriteStream(downloadPath);
            stream.pipe(writable);
            stream.on('end', () => resolve(downloadPath));
            stream.on('error', reject);
        }));
};
 
/*function handleImage(message, replyToken) {
    let getContent;
    if (message.contentProvider.type === "line") {
        const downloadPath = path.join(process.cwd(), 'public', 'downloaded', `${message.id}.jpg`);
    
        getContent = downloadContent(message.id, downloadPath)
            .then((downloadPath) => {
            return {
                originalContentUrl: baseURL + '/downloaded/' + path.basename(downloadPath),
                previewImageUrl: baseURL + '/downloaded/' + path.basename(downloadPath),
            };
            });
    } else if (message.contentProvider.type === "external") {
        getContent = Promise.resolve(message.contentProvider);
    }
  
    return getContent
        .then(({ originalContentUrl, previewImageUrl }) => {
            return client.replyMessage(
            replyToken,
            {
                type: 'image',
                originalContentUrl,
                previewImageUrl,
            }
            );
        });
};*/


function handleImage(message, replyToken) {
    console.log("handle message");
    let getContent;
    if (message.contentProvider.type === "line") {
        //const downloadPath = path.join(process.cwd(), 'public', 'downloaded', `${message.id}.jpg`);
    
        getContent = client.getMessageContent(message.id)
            .then( (stream) =>new Promise( async (resolve, reject) => {
                const formdata = new FormData();
                formdata.append('image', stream);
                formdata.append('title', 'test'); //optional
                formdata.append('description', 'test'); //optional

                const result = await axios.post(
                    'https://api.imgur.com/3/upload',
                    formdata,
                    {
                        headers: {
                        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
                        ...formdata.getHeaders(),
                        },
                    }
                )
                .then( (result) =>{
                    const imageurl = result.data.data.link;
                    
                    console.log('The image url:'+ imageurl); // the url of image on imgur
                    // return {
                    //     originalContentUrl: result.data.data.link,
                    //     previewImageUrl: result.data.data.link,
                    // };
                    return client.replyMessage(
                        replyToken,[
                            {
                                type: 'text',
                                text: 'This image is at ' + imageurl
                            },
                            {
                                type: 'image',
                                originalContentUrl: imageurl ,
                                previewImageUrl: imageurl
                            }
                        ]
                    );
                })

                

            }));
            
    } else if (message.contentProvider.type === "external") {
        getContent = Promise.resolve(message.contentProvider);
    }
  
    // return getContent
    //     .then(({ originalContentUrl, previewImageUrl }) => {
    //         return client.replyMessage(
    //         replyToken,
    //         {
    //             type: 'image',
    //             originalContentUrl,
    //             previewImageUrl,
    //         }
    //         );
    //     });
};


// did not done
function handleVideo(message, replyToken) {
    return ;
}


 
/*function handleAudio(message, replyToken) {
    let getContent;
    if (message.contentProvider.type === "line") {
      const downloadPath = path.join(process.cwd(), 'public', 'downloaded', `${message.id}.m4a`);
  
      getContent = downloadContent(message.id, downloadPath)
        .then((downloadPath) => {
          return {
            originalContentUrl: baseURL + '/downloaded/' + path.basename(downloadPath),
          };
        });
    } else {
      getContent = Promise.resolve(message.contentProvider);
    }
  
    return getContent
      .then(({ originalContentUrl }) => {
        return client.replyMessage(
          replyToken,
          {
            type: 'audio',
            originalContentUrl,
            duration: message.duration,
          }
        );
      });
};*/

function handleAudio(message, replyToken) {
    return ;
}



function handleLocation(message, replyToken) {
    // console.log("get user location");
    // console.log("message.title: " + message.title);
    // console.log("message.address: " + message.address);
    // console.log("message.latitude: " + message.latitude);
    // console.log("message.message.longitude: " + message.longitude);

    const title = ((message.title === undefined) ? 'none' : message.title);
    return client.replyMessage(
        replyToken,
        {
        type: 'location',
        title: title,
        address: message.address,
        latitude: message.latitude,
        longitude: message.longitude,
        }
    );
}



// did not done
function handleSticker(message, replyToken) {
    return;
}






module.exports = router;











