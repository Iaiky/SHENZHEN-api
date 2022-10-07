var db = require("../configs/database")

module.exports = {
    getAll : (req, res, next) => {
        var sql = "select * from client"
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

    //Get a single client by id
    get : (req, res, next) => {
        var sql = "select * from client where idclient = ?"
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

    //Create a new client
    post : (req, res, next) => {
        var errors=[]
        if (!req.body.name){
            errors.push("No name specified");
        }
        if (!req.body.forename){
            errors.push("No forename specified");
        }
        if (!req.body.address){
            errors.push("No address specified");
        }
        if (!req.body.tel){
            errors.push("No tel specified");
        }
        if (errors.length){
            res.status(400).json({"error":errors.join(",")});
            return;
        }
        var data = {
            name: req.body.name,
            forename: req.body.forename,
            address: req.body.address,
            tel: req.body.tel
        }
        var sql ='INSERT INTO client (name, forename, address, tel) VALUES (?,?,?,?)'
        var params =[data.name, data.forename, data.address, data.tel]
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

    //update a new user
    patch : (req, res, next) => {
        var data = {
            name: req.body.name,
            forename: req.body.forename,
            address: req.body.address,
            tel:req.body.tel
        }
        db.run(
            `UPDATE client set 
            name = COALESCE(?,name), 
            forename = COALESCE(?,forename), 
            address = COALESCE(?,address),
            tel = COALESCE(?,tel)
            WHERE idclient = ?`,
            [data.name, data.forename, data.address, data.tel, req.params.id],
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
            'DELETE FROM client WHERE idclient = ?',
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