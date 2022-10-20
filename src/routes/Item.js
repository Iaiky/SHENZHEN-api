const express = require('express')
const router = express.Router();

const controller = require("../controllers/ItemController")

//list of Item
router.get("/", controller.getAll);
router.get("/list", controller.getItem);

//Get a single Item by id
router.get("/:id", controller.get);

//Create a new Item
router.post("/", controller.post);

//Update a Item
router.patch("/:id", controller.patch);

//Delete a Item
router.delete("/:id", controller.delete);

module.exports = router