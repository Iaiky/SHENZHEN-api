var db = require("../configs/database")
var md5 = require("md5")

module.exports = {
    getAll : (req, res, next) => {
        var sql = "select * from user"
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

    //get list of validate user
    getValidList : (req, res, next) => {
        var sql = "select * from user where validation = 1"
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

    //get list of non validate user
    getUnvalidList : (req, res, next) => {
        var sql = "select * from user where validation is null"
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

    //Get a single user by id
    get : (req, res, next) => {
        var sql = "select * from user where id = ?"
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

    //Create a new user
    post : (req, res, next) => {
        var errors=[]
        if (!req.body.password){
            errors.push("No password specified");
        }
        if (!req.body.email){
            errors.push("No email specified");
        }
        if (errors.length){
            res.status(400).json({"error":errors.join(",")});
            return;
        }
        var data = {
            name: req.body.name,
            email: req.body.email,
            password : md5(req.body.password),
            usertype : req.body.usertype
        }
        var sql ='INSERT INTO user (name, email, password, usertype) VALUES (?,?,?,?)'
        var params =[data.name, data.email, data.password, data.usertype]
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
            email: req.body.email,
            usertype : req.body.usertype
        }
        db.run(
            `UPDATE user set 
            name = COALESCE(?,name), 
            email = COALESCE(?,email), 
            usertype = COALESCE(?,usertype) 
            WHERE id = ?`,
            [data.name, data.email, data.usertype, req.params.id],
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

    //add a new user
    add : (req, res, next) => {
        db.run(
            `UPDATE user set 
            validation = 1
            WHERE id = ?`,
            req.params.id,
            function (err, result) {
                if (err){
                    res.status(400).json({"error": res.message})
                    return;
                }
                res.json({
                    message: "success",
                    changes: this.changes
                })
        });
    },

    //delete a user
    delete : (req, res, next) => {
        db.run(
            'DELETE FROM user WHERE id = ?',
            req.params.id,
            function (err, result) {
                if (err){
                    res.status(400).json({"error": res.message})
                    return;
                }
                res.json({"message":"deleted", changes: this.changes})
        });
    },
    //authentication
    auth : (req, res, next) => {
        var errors=[]
        if (!req.body.password){
            errors.push("No password specified");
        }
        if (!req.body.email){
            errors.push("No email specified");
        }
        if (errors.length){
            res.status(400).json({"error":errors.join(",")});
            return;
        }
        var data = {
            email: req.body.email,
            password : md5(req.body.password)
        }
        var sql ='SELECT * FROM user WHERE email=? and password=? and validation = 1'
        var params =[data.email, data.password]
        db.all(sql, params, function (err, result) {
            if (err){
                res.status(400).json({"error": err.message})
                return;
            }
            if(result.length === 0) {   
                res.status(400).send("No Match")
                return;          
            }
            res.json({
                "message": "success",
                "data": result
            })
        });
    },

}