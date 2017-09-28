/**
 * Created by tomes on 30.6.2017.
 */
'use strict';


const TeleBot = require('telebot'),
    https = require('https');
const bot = new TeleBot('');
const hour = 10;
var posted = false;
var regExp = /"\/r\/Otters\/(.+)"[ ]/;


var chatID = new Set();

var options = {
    host: 'imgur.com',
    port: 443,
    path: '/r/Otters'
};
function getData(callback){
    var arr = [];
    console.log("getting data");
    https.get(options, function(res) {
        res.on('data', function(chunk){
            var str = String(chunk).match(regExp);
            if(str !== null){
                console.log(str[1]);
                arr.push(str[1]);
            }
        });
        res.on('end', function(){
            callback(arr);
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
}

bot.on('/start', function(msg) {
    chatID.add(msg.from.id);
    console.log("id gotten " + msg.from.id);
    return msg.reply.text("Bot started");
});

bot.on('/stop', function(msg) {
    chatID.delete(msg.from.id);
    return msg.reply.text("Bot stopped");
});


bot.on('tick', function(){
    var date = new Date();
    var currentHours = date.getHours();
    if (currentHours === hour && !posted && chatID.size > 0 ){
        posted = true;
        getData(function(arr){
            var rand = arr[Math.floor(Math.random() * arr.length)];
            for(let i of chatID){
                return bot.sendPhoto(i, 'http://imgur.com/'+ rand + '.jpg');
            }
        });
    }
    if (currentHours !== hour){
        posted = false;
    }
});

bot.start();
