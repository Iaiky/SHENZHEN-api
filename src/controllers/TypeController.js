var db = require("../configs/database")

module.exports = {
    getAll : (req, res, next) => {
        var sql = "select * from type"
        var params = []
        db.all(sql, params, (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }
            res.json({
                "message":"success",
                "data":rows
            })
          });
    },

    //Get a single type of item by id
    get : (req, res, next) => {
        var sql = "select * from type where idtype = ?"
        var params = [req.params.id]
        db.get(sql, params, (err, row) => {
            if (err) {
            res.status(400).json({"error":err.message});
            return;
            }
            res.json({
                "message":"success",
                "data":row
            })
        });
    },

    //Create a new type of item
    post : (req, res, next) => {
        var errors=[]
        if (!req.body.name){
            errors.push("No name specified");
        }
        if (errors.length){
            res.status(400).json({"error":errors.join(",")});
            return;
        }
        var data = { name : req.body.name}
        var sql ='INSERT INTO type (name) VALUES (?)'
        var params = data.name
        db.run(sql, params, function (err, result) {
            if (err){
                res.status(400).json({"error": err.message})
                return;
            }
            res.json({
                "message": "success",
                "data": data,
                "id" : this.lastID
            })
        });
    },

    //update a type of item
    patch : (req, res, next) => {
        var data = req.body.name
        db.run(
            `UPDATE type set 
            name = COALESCE(?,name)
            WHERE idtype = ?`,
            [data, req.params.id],
            function (err, result) {
                if (err){
                    res.status(400).json({"error": res.message})
                    return;
                }
                res.json({
                    message: "success",
                    data: data,
                    changes: this.changes
                })
        });
    },

    //delete a type of item
    delete : (req, res, next) => {
        db.run(
            'DELETE FROM type WHERE idtype = ?',
            req.params.id,
            function (err, result) {
                if (err){
                    res.status(400).json({"error": res.message})
                    return;
                }
                res.json({"message":"deleted", changes: this.changes})
        });
    },
}