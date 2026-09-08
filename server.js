require("dotenv").config();

const path = require("path");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const inquiryRoutes = require("./server/routes/inquiryRoutes");
const contactRoutes = require("./server/routes/contactRoutes");
const applicationRoutes = require("./server/routes/applicationRoutes");
const errorHandler = require("./server/middleware/errorHandler");

const app = express();
const port = Number(process.env.PORT || 3000);

app.disable("x-powered-by");

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: process.env.NODE_ENV === "production" ? [] : null
      }
    }
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: false, limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  handler: function (req, res) {
    res.status(429).json({
      message: "We couldn't submit your request right now. Please try again or contact us directly."
    });
  }
});

app.use("/api/inquiries", formLimiter, inquiryRoutes);
app.use("/api/contact", formLimiter, contactRoutes);
app.use("/api/applications", formLimiter, applicationRoutes);

app.use("/api", function (req, res) {
  res.status(404).json({ message: "Not found." });
});

app.use(errorHandler);

app.listen(port, function () {
  console.log("Lynn's Caregiving Services website running at http://localhost:" + port);
});
