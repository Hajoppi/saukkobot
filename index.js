/**
 * Created by tomes on 30.6.2017.
 */
'use strict';


const TeleBot = require('telebot'),
    http = require('http');
const bot = new TeleBot('424665228:AAHyFzFnv8trrk_RdcIuM2SKr58I-vFy1Lw');
const hour = 17;
var posted = false;
var regExp = /"\/r\/Otters\/(.+)"[ ]/;


var chatID = new Set();

var options = {
    host: 'imgur.com',
    port: 80,
    path: '/r/Otters'
};
function getData(callback){
    var arr = [];
    console.log("getting data");
    http.get(options, function(res) {
        console.log(res.body);
        res.on('data', function(chunk){
            console.log("Got Chunk");
            var str = String(chunk).match(regExp);
            if(str !== null){
                console.log(str[i]);
                arr.push(str[1]);
            }
        });
        res.on('end', function(){
            callback(arr)
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
});

bot.on('tick', function(){
    var date = new Date();
    var currentHours = date.getHours();
    if (currentHours === hour && !posted && chatID.size > 0 ){
        posted = true;
        getData(function(arr){
            var rand = arr[Math.floor(Math.random() * arr.length)];
            for(i in chatID){
                return bot.sendPhoto(i, 'http://imgur.com/'+ rand + '.jpg');
            }
        });
    }
    if (currentHours !== hour){
        posted = false;
    }
});

bot.start();
