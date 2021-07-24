# Toby-chat

## To test code locally
1. use `npm run dev` to run the code locally(listen at localhost:8080)
2. then execute ngrok.exe and type `ngrok http 8080` 
3. copy the url(ex:  https://9f6768873372.ngrok.io) and paste it to the line webhook, remember to add '/line' at the end (ex: https://9f6768873372.ngrok.io/line)

## To git push local main to remote branch
use `git push origin main:echo`
if you are at the first time to do this, you will get\
\
`! [rejected]        main -> echo (fetch first)`\
`error: failed to push some refs to 'https://github.com/yuyunchia/Toby-chat.git'`\    
`hint: Updates were rejected because the remote contains work that you do`\
`hint: to the same ref. You may want to first integrate the remote changes`\
`hint: See the 'Note about fast-forwards' in 'git push --help' for details.`\
\
Just type `git pull origin echo`,then type `git push origin main:echo`

## What This branch do 
it will reply echo of text, image, location. Specially, to reply image, need to upload image to imgur to get (https:...)

## Module expanation:
To run locally: `npm install --save-dev nodemon`\
To get a server:  `npm install express --save`\
To use linebot api: `npm install @line/bot-sdk --save`\
To upload image to imgur: `npm install @line/bot-sdk --save`



