const express = require("express");
const { contactValidation } = require("../middleware/validation");
const { createContactMessage } = require("../controllers/contactController");

const router = express.Router();

router.post("/", contactValidation, createContactMessage);

module.exports = router;
