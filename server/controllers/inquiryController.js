const { sendOwnerInquiryEmail, sendInquiryConfirmation } = require("../services/emailService");

async function createInquiry(req, res, next) {
  try {
    const body = req.body;
    const supportTypes = Array.isArray(body.supportTypes) ? body.supportTypes : [body.supportTypes];
    const preferredSchedule = Array.isArray(body.preferredSchedule)
      ? body.preferredSchedule
      : body.preferredSchedule
        ? [body.preferredSchedule]
        : [];

    const inquiry = {
      createdAt: new Date(),
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      preferredContactMethod: body.preferredContactMethod || "phone",
      relationshipToClient: body.relationshipToClient,
      supportTypes: supportTypes,
      preferredSchedule: preferredSchedule,
      desiredStartDate: body.desiredStartDate,
      additionalInformation: body.additionalInformation
    };

    await sendOwnerInquiryEmail(inquiry);

    try {
      await sendInquiryConfirmation(inquiry);
    } catch (confirmationError) {
      console.error("Owner email sent, but confirmation email failed:", confirmationError.message);
    }

    return res.status(201).json({
      message: "Thank you. We received your care request and will contact you using the information provided."
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { createInquiry };
