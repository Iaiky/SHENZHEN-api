const express = require('express')
const router = express.Router();

const controller = require("../controllers/UserController")

//list of users
router.get("/", controller.getAll);

//Get a single user by id
router.get("/:id", controller.get);

//Create a new user
router.post("/", controller.post);

//Update a user
router.patch("/:id", controller.patch);

//Delete a user
router.delete("/:id", controller.delete);

module.exports = router