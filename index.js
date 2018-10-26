/**
 * Created by tomes on 30.6.2017.
 */
'use strict';


const TeleBot = require('telebot'),
    https = require('https'),
    config = require("./config"),
    token = config.botToken,
    api = config.clientID;
const bot = new TeleBot(token);
const hour = 7;
var imageList = [];
var etag = "";
var posted = false;

var chatID = new Set();
var sub = "Otters";
var options = {
    host: 'api.imgur.com',
    port: 443,
    path: '/3/gallery/r/'+sub+'/time/all',
    headers:{
        'Authorization': 'Client-ID '+api,
        'If-None-Match': etag,
    },
};

function getData(ids, callback){
    var body = ""
    https.get(options, function(res) {
        console.log(res.statusCode)
        if(res.statusCode == 200){
            etag = res.headers["etag"];
            res.on('data', function(chunk){
                body += chunk;
            });
            res.on('end', function(){
                imageList = JSON.parse(body).data;
                callback(ids);
            });
        }
        else{
            res.on('end', function(){
                callback(ids);
            });
        }
        }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
}

function postData(ids){
    var rand = imageList[Math.floor(Math.random() * imageList.length)];
    for(let i of ids){
        if(rand.animated == true){
            return bot.sendVideo(i, rand.mp4);
        }else{
            return bot.sendPhoto(i, rand.link);
        }
    }
}

bot.on('/start', function(msg) {
    chatID.add(msg.chat.id);
    return msg.reply.text("Bot started");
});

bot.on('/stop', function(msg) {
    chatID.delete(msg.chat.id);
    return msg.reply.text("Bot stopped");
});

bot.on(['/getMeSaukko', '/saukko'], function(msg){
    getData([msg.chat.id], postData);
});

bot.on('/change', function(msg) {
    sub = msg.text.substring(8);
    options.path = '/3/gallery/r/'+sub+'/time/all';
});


bot.on('tick', function(){
    var date = new Date();
    var currentHours = date.getHours();
    if (currentHours === hour && !posted && chatID.size > 0 ){
        posted = true;
        getData(chatID, postData);
    }
    if (currentHours !== hour){
        posted = false;
    }
});

bot.start();
