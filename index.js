/**
 * Created by tomes on 30.6.2017.
 */
const TeleBot = require('telebot'),
    http = require('http');
const bot = new TeleBot('token goes here');
const hour = 7;
var posted = false;
var regExp = /"\/r\/Otters\/(.+)"[ ]/;


var chatID = null;

var options = {
    host: 'imgur.com',
    port: 80,
    path: '/r/Otters'
};
function getData(callback){
    var arr = [];
    http.get(options, function(res) {
        res.on('data', function(chunk){
            var str = String(chunk).match(regExp);
            if(str !== null){
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
bot.on('update', function (res) {
    chatID = res[0]['message']['chat']['id'];
    console.log("id gotten" + chatID);
});

bot.on('tick', function(){
    var date = new Date();
    var currentHours = date.getHours();
    if (currentHours === hour && !posted && chatID !== null){
        posted = true;
        getData(function(arr){
            var rand = arr[Math.floor(Math.random() * arr.length)];
            return bot.sendPhoto(chatID, 'http://imgur.com/'+ rand + '.jpg');
        });
    }
    if (currentHours !== hour){
        posted = false;
    }
});

bot.start();