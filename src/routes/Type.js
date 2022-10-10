const express = require('express')
const router = express.Router();

const controller = require("../controllers/TypeController")

//list of type of item
router.get("/", controller.getAll);

//Get a single type of item by id
router.get("/:id", controller.get);

//Create a new type of item
router.post("/", controller.post);

//Update a ctype of item
router.patch("/:id", controller.patch);

//Delete a type of item
router.delete("/:id", controller.delete);

module.exports = router