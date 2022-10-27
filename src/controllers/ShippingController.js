var db = require("../configs/database")

module.exports = {
    getAll : (req, res, next) => {
        var sql = "select * from shipping order by dateenvoi desc"
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

    getId : (req, res, next) => {
        var sql = "select idshipping from shipping order by dateenvoi desc"
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

    //Get a single shipping by id
    get : (req, res, next) => {
        var sql = "select * from shipping where idshipping = ?"
        var params = [req.params.id]
        db.get(sql, params, (err, row) => {
            if (err) {
            res.status(400).json({"error":err.message});
            return;
            }
            res.json({
                "message":"successss",
                "data":row
            })
        });
    },

    //Create a new shipping
    post : (req, res, next) => {
        var errors=[]
        if (!req.body.dateenvoi){
            errors.push("No dateenvoi specified");
        }
        if (!req.body.container){
            errors.push("No container specified");
        }
        if (errors.length){
            res.status(400).json({"error":errors.join(",")});
            return;
        }
        var data = {
            dateenvoi: req.body.dateenvoi,
            datearrive: req.body.datearrive,
            container: req.body.container
        }
        var sql ='INSERT INTO shipping (dateenvoi, datearrive, container) VALUES (?,?,?)'
        var params =[data.dateenvoi, data.datearrive, data.container, data.command]
        db.run(sql, params, function (err, result) {
            if (err){
                res.status(400).json({"error": err.message})
                return;
            }
            res.json({
                "message": "succes",
                "data": data,
                "id" : this.lastID
            })
        });
    },

    //update a shipping
    patch : (req, res, next) => {
        var data = {
            dateenvoi: req.body.dateenvoi,
            datearrive: req.body.datearrive,
            container: req.body.container
        }
        db.run(
            `UPDATE shipping set 
            dateenvoi = COALESCE(?,dateenvoi), 
            datearrive = COALESCE(?,datearrive), 
            container = COALESCE(?,container)
            WHERE idshipping = ?`,
            [data.dateenvoi, data.datearrive, data.container, req.params.id],
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

    //delete a shipping
    delete : (req, res, next) => {
        db.run(
            'DELETE FROM shipping WHERE idshipping = ?',
            req.params.id,
            function (err, result) {
                if (err){
                    res.status(400).json({"error": res.message})
                    return;
                }
                res.json({"message":"deleted", changes: this.changes})
        });
    }
}