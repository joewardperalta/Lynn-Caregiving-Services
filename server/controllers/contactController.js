const { sendOwnerContactEmail } = require("../services/emailService");

async function createContactMessage(req, res, next) {
  try {
    const body = req.body;

    await sendOwnerContactEmail({
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message
    });

    return res.status(201).json({
      message: "Thank you. Your message has been sent."
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { createContactMessage };
