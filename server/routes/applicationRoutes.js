const express = require("express");
const { applicationValidation } = require("../middleware/validation");
const { createApplication } = require("../controllers/applicationController");

const router = express.Router();

router.post("/", applicationValidation, createApplication);

module.exports = router;
