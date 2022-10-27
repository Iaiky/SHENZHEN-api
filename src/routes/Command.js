const express = require('express')
const router = express.Router();

const controller = require("../controllers/CommandController")

//list of command
router.get("/", controller.getAll);

//get the number of command made 
// by a client
router.get("/numbercommandclient/:id", controller.getnumberclient);
// by a item
router.get("/numbercommanditem/:id", controller.getnumberitem);
// by a shipping
router.get("/numbercommandshipping/:id", controller.getnumbershipping);


//get list of command made 
// by a client
router.get("/commandclientlist/:id", controller.getlistcommandclient);
// by a item
router.get("/commanditemlist/:id", controller.getlistcommanditem);
// by a shipping
router.get("/commandshippinglist/:id", controller.getlistcommandshipping);

//Get a single command by id
router.get("/update/:id", controller.getOne);
router.get("/:id", controller.get);

//Create a new command
router.post("/", controller.post);

//Update a command
router.patch("/:id", controller.patch);

//Delete a command
router.delete("/:id", controller.delete);

module.exports = router