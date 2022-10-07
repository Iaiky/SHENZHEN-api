const express = require('express')
const router = express.Router();

const controller = require("../controllers/ClientController")

//list of clients
router.get("/", controller.getAll);

//Get a single client by id
router.get("/:id", controller.get);

//Create a new client
router.post("/", controller.post);

//Update a client
router.patch("/:id", controller.patch);

//Delete a client
router.delete("/:id", controller.delete);

module.exports = router