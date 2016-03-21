var sqlite3 = require('sqlite3');

var _db;

exports.connect = function (callback) {
    _db = new sqlite3.Database("vasmer.db", (sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE), function (err) {
        if (err)
            _db = null;
        else
            callback();
    });
};

exports.init = function () {
    if (_db)
        _db.run("CREATE TABLE IF NOT EXISTS vasmer (id INTEGER PRIMARY KEY AUTOINCREMENT, word VARCHAR(255), general TEXT, origin TEXT, trubachev TEXT);",
            function (err) {
                if (err)
                    console.log("CREATE TABLE FAIL");
            });
};

exports.recCount = function (callback) {
    callback(30);
    return;

    if (!_db)
        callback(0);
    else {
        _db.get("SELECT COUNT(*) FROM vasmer", function (err, row) {
            if (err)
                callback(0);
            else
                callback(row);
        });
    }
};

