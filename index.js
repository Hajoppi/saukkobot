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
function getData(ids,callback){
    var arr = [];
    https.get(options, function(res) {
        res.on('data', function(chunk){
            var str = String(chunk).match(regExp);
            if(str !== null){
                arr.push(str[1]);
            }
        });
        res.on('end', function(){
            callback(arr,ids);
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
}

function postData(arr, ids){
    var rand = arr[Math.floor(Math.random() * arr.length)];
    https.get('https://i.imgur.com/'+rand + '.jpg', function(res){
        if(res.statusCode == 200){
            for(let i of ids){
                return bot.sendPhoto(i, 'http://imgur.com/'+ rand + '.jpg');
            }
        }
        else{
            postData(arr, ids);
        }
    });
}

bot.on('/start', function(msg) {
    chatID.add(msg.chat.id);
    return msg.reply.text("Bot started");
});

bot.on('/stop', function(msg) {
    chatID.delete(msg.chat.id);
    return msg.reply.text("Bot stopped");
});

bot.on('/getMeSaukko', function(msg){
    getData([msg.chat.id],postData);
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
