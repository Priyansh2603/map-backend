const express = require("express");
const router = express.Router();
const fieldController = require("../controllers/fieldController");
const authMiddleware = require("../authMiddleware");

router.post("/add-field",authMiddleware, fieldController.addField);

module.exports = router;
