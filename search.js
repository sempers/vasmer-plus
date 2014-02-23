/**
 * Created by Rookie on 10.02.14.
 */
exports.searchWord = function (req, res, db) {
    if (!db)
        res.json({"error": "NoDB"});
    var word = req.params.word;
    var _query = "SELECT * FROM vasmer WHERE word LIKE '" + word + "%'";
    db.query(_query,
        ['id', 'word', 'general', 'origin', 'trubachev', 'langref'],
        function (err, rows) {
            res.json(rows || []);
    });
};
