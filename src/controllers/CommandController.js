var db = require("../configs/database")

module.exports = {
    getAll : (req, res, next) => {
        var sql = "select command.idcommand,command.datecommand,client.name ||' '|| client.forename as client,article.name as article,(select type.name from type inner join article on type.idtype = article.type where command.idarticle = article.idarticle) as category,command.quantity,article.price * command.quantity as price,shipping.dateenvoi,shipping.datearrive,shipping.container,command.statut from (((command inner join client on command.idclient = client.idclient)inner join article on command.idarticle = article.idarticle)left join shipping on command.idshipping = shipping.idshipping)order by datecommand desc "
        db.all(sql, (err, rows) => {
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

    //Get a single command by id
    get : (req, res, next) => {
        var sql = "select command.idcommand,command.datecommand,client.name ||' '|| client.forename as client,article.name as article,(select type.name from type inner join article on type.idtype = article.type where command.idarticle = article.idarticle) as category,command.quantity,article.price * command.quantity as price,shipping.dateenvoi,shipping.datearrive,shipping.container,command.statut,user.name as username from ((((command inner join client on command.idclient = client.idclient)inner join article on command.idarticle = article.idarticle)left join shipping on command.idshipping = shipping.idshipping)inner join user on command.iduser = user.id) where idcommand = ?"
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

    //Get a single command by id
    getOne : (req, res, next) => {
        var sql = "select * from command where idcommand = ?"
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

    //Create a new command
    post : (req, res, next) => {
        var errors=[]
        if (!req.body.quantity){
            errors.push("No quantity specified");
        }
        if (!req.body.idclient){
            errors.push("No idclient specified");
        }
        if (!req.body.idarticle){
            errors.push("No idarticle specified");
        }
        if (!req.body.iduser){
            errors.push("No iduser specified");
        }
        if (errors.length){
            res.status(400).json({"error":errors.join(",")});
            return;
        }
        var data = {
            quantity: req.body.quantity,
            statut: req.body.statut,
            idclient: req.body.idclient,
            idarticle: req.body.idarticle,
            idshipping: req.body.idshipping,
            iduser: req.body.iduser
        }
        var sql ="INSERT INTO command (quantity, datecommand, statut, idarticle, idclient, idshipping, iduser) VALUES (?,date('now'),?,?,?,?,?)"
        var params =[data.quantity, data.statut, data.idarticle, data.idclient, data.idshipping, data.iduser]
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

    //update a new article
    patch : (req, res, next) => {
        var data = {
            quantity: req.body.quantity,
            datecommand: req.body.datecommand,
            statut: req.body.statut,
            idclient: req.body.idclient,
            idarticle: req.body.idarticle,
            idshipping: req.body.idshipping,
            iduser: req.body.iduser
        }
        db.run(
            `UPDATE command set 
            quantity = COALESCE(?,quantity), 
            datecommand = COALESCE(?,datecommand), 
            statut = COALESCE(?,statut),
            idarticle = COALESCE(?,idarticle),
            idclient = COALESCE(?,idclient),
            idshipping = COALESCE(?,idshipping),
            iduser = COALESCE(?,iduser)
            WHERE idcommand = ?`,
            [data.quantity, data.datecommand, data.statut, data.idarticle,data.idclient, data.idshipping, data.iduser, req.params.id],
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
            'DELETE FROM command WHERE idcommand = ?',
            req.params.id,
            function (err, result) {
                if (err){
                    res.status(400).json({"error": res.message})
                    return;
                }
                res.json({"message":"deleted", changes: this.changes})
        });
    },

    //Get a number of command 
    // by idclient
    getnumberclient : (req, res, next) => {
        var sql = "select count(idcommand) as numbercommand from command group by idclient having idclient = ?"
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
    // by idarticle
    getnumberitem : (req, res, next) => {
        var sql = "select count(idcommand) as numbercommand from command group by idarticle having idarticle = ?"
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
    // by idshipping
    getnumbershipping : (req, res, next) => {
        var sql = "select count(idcommand) as numbercommand from command group by idshipping having idshipping = ?"
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
    // by iduser
    getnumberuser : (req, res, next) => {
        var sql = "select count(idcommand) as numbercommand from command group by iduser having iduser = ?"
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

    //list command 
    // of a client
    getlistcommandclient : (req, res, next) => {
        var sql = "select command.idcommand,command.datecommand,client.name ||' '|| client.forename as client,article.name as article,(select type.name from type inner join article on type.idtype = article.type where command.idarticle = article.idarticle) as category,command.quantity,article.price * command.quantity as price,shipping.dateenvoi,shipping.datearrive,shipping.container,command.statut from (((command inner join client on command.idclient = client.idclient)inner join article on command.idarticle = article.idarticle)left join shipping on command.idshipping = shipping.idshipping)where command.idclient = ? order by datecommand desc"
        var params = [req.params.id]
        db.all(sql, params, (err, row) => {
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
    // of a item
    getlistcommanditem : (req, res, next) => {
        var sql = "select command.idcommand,command.datecommand,client.name ||' '|| client.forename as client,article.name as article,(select type.name from type inner join article on type.idtype = article.type where command.idarticle = article.idarticle) as category,command.quantity,article.price * command.quantity as price,shipping.dateenvoi,shipping.datearrive,shipping.container,command.statut from (((command inner join client on command.idclient = client.idclient)inner join article on command.idarticle = article.idarticle)left join shipping on command.idshipping = shipping.idshipping)where command.idarticle = ? order by datecommand desc"
        var params = [req.params.id]
        db.all(sql, params, (err, row) => {
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
    // of a shipping
    getlistcommandshipping : (req, res, next) => {
        var sql = "select command.idcommand,command.datecommand,client.name ||' '|| client.forename as client,article.name as article,(select type.name from type inner join article on type.idtype = article.type where command.idarticle = article.idarticle) as category,command.quantity,article.price * command.quantity as price,shipping.dateenvoi,shipping.datearrive,shipping.container,command.statut from (((command inner join client on command.idclient = client.idclient)inner join article on command.idarticle = article.idarticle)left join shipping on command.idshipping = shipping.idshipping)where command.idshipping = ? order by datecommand desc"
        var params = [req.params.id]
        db.all(sql, params, (err, row) => {
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
    // of a user
    getlistcommanduser : (req, res, next) => {
        var sql = "select command.idcommand,command.datecommand,client.name ||' '|| client.forename as client,article.name as article,(select type.name from type inner join article on type.idtype = article.type where command.idarticle = article.idarticle) as category,command.quantity,article.price * command.quantity as price,shipping.dateenvoi,shipping.datearrive,shipping.container,command.statut from (((command inner join client on command.idclient = client.idclient)inner join article on command.idarticle = article.idarticle)left join shipping on command.idshipping = shipping.idshipping)where command.iduser = ? order by datecommand desc"
        var params = [req.params.id]
        db.all(sql, params, (err, row) => {
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
}