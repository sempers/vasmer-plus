/**
 * Created by Rookie on 10.02.14.
 */
exports.searchWord = function (req, res, db) {
    if (!db) {
        res.json([]);
        return;
    }
    var word = req.params.word.toLowerCase();
    var _query = "SELECT * FROM vasmer WHERE word LIKE '" + word + "%'";
    db.all(_query, function(err, rows){
       res.json(rows || []);
    });
};

exports.dbConnect = function () {
    try {
        return new (require("sqlite3")).Database("vasmer.sqlite");
    }
    catch (e)
    {
        return null;
    }
};
