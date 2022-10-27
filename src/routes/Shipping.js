const express = require('express')
const router = express.Router();

const controller = require("../controllers/ShippingController")

//list of Shipping
router.get("/", controller.getAll);
router.get("/list", controller.getId);

//Get a single Shipping by id
router.get("/:id", controller.get);

//Create a new Shipping
router.post("/", controller.post);

//Update a Shipping
router.patch("/:id", controller.patch);

//Delete a Shipping
router.delete("/:id", controller.delete);

module.exports = router