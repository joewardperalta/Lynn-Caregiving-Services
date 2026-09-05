const express = require("express");
const { inquiryValidation } = require("../middleware/validation");
const { createInquiry } = require("../controllers/inquiryController");

const router = express.Router();

router.post("/", inquiryValidation, createInquiry);

module.exports = router;
