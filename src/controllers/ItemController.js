var db = require("../configs/database")

module.exports = {
    getAll : (req, res, next) => {
        var sql = "select * from article"
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

    //Get a single item by id
    get : (req, res, next) => {
        var sql = "select * from article where idarticle = ?"
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

    //Create a new item
    post : (req, res, next) => {
        var errors=[]
        if (!req.body.name){
            errors.push("No name specified");
        }
        if (!req.body.type){
            errors.push("No type specified");
        }
        if (!req.body.price){
            errors.push("No price specified");
        }
        if (errors.length){
            res.status(400).json({"error":errors.join(",")});
            return;
        }
        var data = {
            name: req.body.name,
            type: req.body.type,
            price: req.body.price
        }
        var sql ='INSERT INTO article (name, type, price) VALUES (?,?,?)'
        var params =[data.name, data.type, data.price]
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

    //update a new article
    patch : (req, res, next) => {
        var data = {
            name: req.body.name,
            type: req.body.type,
            price: req.body.price
        }
        db.run(
            `UPDATE article set 
            name = COALESCE(?,name), 
            type = COALESCE(?,type), 
            price = COALESCE(?,price)
            WHERE idarticle = ?`,
            [data.name, data.type, data.price, req.params.id],
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

    //delete a user
    delete : (req, res, next) => {
        db.run(
            'DELETE FROM article WHERE idarticle = ?',
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