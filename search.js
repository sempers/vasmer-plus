/**
 * Created by Rookie on 10.02.14.
 */
exports.searchWord = function (req, res, db) {
    if (!db) {
        res.json({"error": "NoDB"});
        return;
    }
    var word = req.params.word.toLowerCase();
    var _query = "SELECT * FROM vasmer WHERE word LIKE '" + word + "%'";
    db.all(_query, function(err, rows){
       res.json(rows || []);
    });
};
