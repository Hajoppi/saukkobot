/**
 * Created by tomes on 3.7.2017.
 */
'use strict';
const http = require('http');
const https = require('https');
const token = 'token';
const hour = 7;
var posted = false;
var regExp = /"\/r\/Otters\/(.+)"[ ]/;

var chatID = null;

var options_imgur = {
    host: 'imgur.com',
    port: 80,
    path: '/r/Otters'
};
var options_update = {
    host: 'api.telegram.org',
    port: 443,
    path: '/bot'+token+'/getUpdates'
};
function getData(callback){
    var arr = [];
    http.get(options_imgur, function(res) {
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

function getUpdates(){
    var body = '';
    https.get(options_update, function(res){
        res.on('data', function(d){
            body += d;
        });
        res.on('end', function(){
            var json = JSON.parse(body);
            chatID = json['result'][0]['message']['chat']['id'];
        });
    });
}

function sendPhoto(chat, photo_url){
    var photo_options = {
        host: 'api.telegram.org',
        port: 443,
        path: '/bot'+token+'/sendPhoto?chat_id='+chat+'&photo='+photo_url
    };
    https.get(photo_options, function (res) {
        console.log(res.statusCode);
    });

}
setInterval(function () {
    //console.log("getting updates");
    getUpdates();
    var date = new Date();
    var currentHours = date.getHours();
    if (currentHours === hour && !posted && chatID !== null){
        posted = true;
        getData(function(arr){
            console.log("sending photo");
            console.log(arr);
            var rand = arr[Math.floor(Math.random() * arr.length)];
            sendPhoto(chatID, 'http://imgur.com/'+ rand + '.jpg');
        });
    }
    if (currentHours !== hour){
        posted = false;
    }
},10000);

