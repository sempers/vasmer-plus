var http = require('http');
var path = require('path');
var socketio = require('socket.io');
var express = require('express');
var db = require('./db');
var util = require('util');
var request = require('request');
var qs = require('querystring');
var $ = require('jquery').create();


var app = express();
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname +  '/public/views');
app.engine('html', require('ejs').renderFile);

var server = http.createServer(app);
var io = socketio.listen(server);
var sockets = [];

var database;
database = db.connect(function () {
    db.init();
});

app.get("/load", function(req, res){
   res.render("loader.html");
});

app.get("/*", function (req, res) {
    res.render("index.html");
});

io.on('connection', function (socket) {
    sockets.push(socket);

    var _count = 0;

    socket.on('rec_count', function () {
        db.recCount(function (count) {
            socket.emit('rec_counted', count);
            _count = count;
        });
    });

    var starlingUrl = "http://starling.rinet.ru/cgi-bin/response.cgi?root=%2fusr%2flocal%2fshare%2fstarling%2fmorpho&morpho=1&basename=morpho%2fvasmer%2fvasmer&first=%d&off=";

    function loadStarlingPage(startWordNum) {
        var url = util.format(starlingUrl, startWordNum + 1);
        request(url, function(error, response, body){
           if (!error && response.statusCode === 200){

           }
        });
    }

    socket.on('start_loading', function(){

    });

});

server.listen(process.env.PORT || 3000, process.env.IP || "127.0.0.1", function () {
    var addr = server.address();
    console.log("Server listening at", addr.address + ":" + addr.port);
});
