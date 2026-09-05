const { sendOwnerApplicationEmail } = require("../services/emailService");

async function createApplication(req, res, next) {
  try {
    const body = req.body;
    const availability = Array.isArray(body.availability)
      ? body.availability
      : body.availability
        ? [body.availability]
        : [];
    const preferredShifts = Array.isArray(body.preferredShifts)
      ? body.preferredShifts
      : body.preferredShifts
        ? [body.preferredShifts]
        : [];

    await sendOwnerApplicationEmail({
      createdAt: new Date(),
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      position: body.position,
      availability: availability,
      preferredShifts: preferredShifts,
      experience: body.experience
    });

    return res.status(201).json({
      message: "Thank you. We received your application and will contact you using the information provided."
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { createApplication };
