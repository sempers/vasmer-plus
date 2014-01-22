var http = require('http');
var path = require('path');
var socketio = require('socket.io');
var express = require('express');
var dblite = require('dblite');
var util = require('util');
var request = require('request');

var app = express();
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);

var db = dblite("vasmer.sqlite");

db.query("CREATE TABLE IF NOT EXISTS vasmer (id INTEGER PRIMARY KEY AUTOINCREMENT, word VARCHAR(255), general TEXT, origin TEXT, trubachev TEXT, langref VARCHAR);");

var server = http.createServer(app);
var io = socketio.listen(server);
var sockets = [];

app.get("/load", function (req, res) {
    res.render("loader.html");
});

app.get("/search/:word", function (req, res) {
    res.json({"FAKE": true});
    return;
    var word = decodeURIComponent(req.params.word);
    db.query("SELECT * FROM vasmer WHERE word LIKE (?)", [word], function (err, rows) {
        res.json(rows || []);
    });
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

    var TIMEOUT = 500;
    var MAX_REC = 18239;

    socket.on('start_loading', function () {
        var startWord = 0;

        function loadStarlingPage(callback) {
            var url = util.format(starlingUrl, startWord + 1);

            request(url, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    startWord += 20;
                    callback(null);
                }
                callback(util.format("Request to Starling failed at startWord %d", startWord));
            });
        }

        db.query("DELETE FROM vasmer", function (err) {
            if (!err)
                async.whilst(
                    function () {
                        return startWord < MAX_REC;
                    },
                    loadStarlingPage,
                    function (err) {
                        console.log(err);
                    });
        });

    });

});

server.listen(process.env.PORT || 3000, process.env.IP || "127.0.0.1", function () {
    var addr = server.address();
    console.log("Server listening at", addr.address + ":" + addr.port);
});
