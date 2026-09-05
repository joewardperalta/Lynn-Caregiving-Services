const nodemailer = require("nodemailer");

const BUSINESS_NAME = "Lynn's Caregiving Services";

const SUPPORT_LABELS = {
  personal_care: "Personal care",
  mobility: "Mobility",
  meals: "Meals",
  companionship: "Companionship",
  respite: "Respite",
  other: "Other"
};

const RELATIONSHIP_LABELS = {
  myself: "Self",
  parent: "Parent",
  spouse: "Spouse",
  family_member: "Family member",
  other: "Other"
};

const CONTACT_METHOD_LABELS = {
  phone: "Phone",
  email: "Email"
};

const SCHEDULE_LABELS = {
  weekdays: "Weekdays",
  weekends: "Weekends",
  morning: "Morning",
  evening: "Evening",
  night: "Night"
};

const POSITION_LABELS = {
  full_time: "Full-time",
  part_time: "Part-time"
};

const AVAILABILITY_LABELS = {
  weekdays: "Weekdays",
  weekends: "Weekends"
};

const SHIFT_LABELS = {
  morning: "Morning",
  evening: "Evening",
  night: "Night shift"
};

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function displayValue(value, fallback) {
  const text = String(value || "").trim();
  return text || fallback || "Not provided";
}

function labelFor(map, value) {
  if (!value) {
    return "Not provided";
  }
  return map[value] || value;
}

function isEmailConfigured() {
  return Boolean(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD && process.env.OWNER_EMAIL);
}

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: String(process.env.EMAIL_SECURE).toLowerCase() === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}

function formatLabelList(values, map) {
  const list = (values || [])
    .map(function (value) {
      return map[value] || value;
    })
    .filter(Boolean);

  return list.length ? list.join(", ") : "Not provided";
}

function formatLabelListHtml(values, map) {
  const list = (values || [])
    .map(function (value) {
      return map[value] || value;
    })
    .filter(Boolean);

  if (!list.length) {
    return "<p style=\"margin:0;font-size:20px;line-height:1.5;color:#1b2740;\">Not provided</p>";
  }

  return (
    "<ul style=\"margin:8px 0 0 0;padding-left:28px;font-size:20px;line-height:1.7;color:#1b2740;\">" +
    list
      .map(function (item) {
        return "<li style=\"margin-bottom:6px;\">" + escapeHtml(item) + "</li>";
      })
      .join("") +
    "</ul>"
  );
}

function detailRow(label, value) {
  return (
    "<tr>" +
    '<td style="padding:12px 0;border-bottom:1px solid #e4d8dc;width:38%;vertical-align:top;font-size:18px;font-weight:700;color:#9b4a63;">' +
    escapeHtml(label) +
    "</td>" +
    '<td style="padding:12px 0;border-bottom:1px solid #e4d8dc;vertical-align:top;font-size:20px;line-height:1.5;color:#1b2740;">' +
    escapeHtml(displayValue(value)) +
    "</td>" +
    "</tr>"
  );
}

function sectionHeading(title) {
  return (
    '<h2 style="margin:28px 0 10px 0;font-size:24px;line-height:1.3;color:#1b2740;border-bottom:3px solid #9b4a63;padding-bottom:8px;">' +
    escapeHtml(title) +
    "</h2>"
  );
}

function wrapOwnerEmail(title, intro, bodyHtml, nextStep) {
  return (
    '<div style="margin:0;padding:0;background:#f7f1f3;">' +
    '<div style="max-width:680px;margin:0 auto;padding:24px 16px;">' +
    '<div style="background:#ffffff;border:1px solid #e4d8dc;border-radius:10px;padding:28px 24px;font-family:Arial, Helvetica, sans-serif;color:#1b2740;">' +
    '<p style="margin:0 0 8px 0;font-size:16px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:#9b4a63;">' +
    escapeHtml(BUSINESS_NAME) +
    "</p>" +
    '<h1 style="margin:0 0 16px 0;font-size:30px;line-height:1.25;color:#1b2740;">' +
    escapeHtml(title) +
    "</h1>" +
    '<p style="margin:0 0 20px 0;font-size:20px;line-height:1.6;color:#1b2740;">' +
    escapeHtml(intro) +
    "</p>" +
    bodyHtml +
    '<div style="margin-top:28px;padding:18px 16px;background:#f5e6eb;border-radius:8px;">' +
    '<p style="margin:0 0 8px 0;font-size:22px;font-weight:700;color:#1b2740;">What to do next</p>' +
    '<p style="margin:0;font-size:20px;line-height:1.6;color:#1b2740;">' +
    escapeHtml(nextStep) +
    "</p>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>"
  );
}

async function sendMailOrThrow(mail, text) {
  if (!isEmailConfigured()) {
    console.warn("Email is not fully configured. Notification was not sent.");
    console.info(text);
    const error = new Error("Email is not configured.");
    error.status = 503;
    throw error;
  }

  const transporter = createTransport();
  await transporter.sendMail(mail);
  return { skipped: false };
}

async function sendOwnerInquiryEmail(inquiry) {
  const submitted = new Date(inquiry.createdAt || Date.now()).toLocaleString("en-CA", {
    timeZone: "America/Toronto",
    dateStyle: "full",
    timeStyle: "short"
  });

  const fullName = displayValue(inquiry.firstName + " " + inquiry.lastName, "Someone");
  const phone = displayValue(inquiry.phone);
  const email = displayValue(inquiry.email);
  const contactMethod = labelFor(CONTACT_METHOD_LABELS, inquiry.preferredContactMethod);
  const relationship = labelFor(RELATIONSHIP_LABELS, inquiry.relationshipToClient);
  const supportText = formatLabelList(inquiry.supportTypes, SUPPORT_LABELS);
  const scheduleText = formatLabelList(inquiry.preferredSchedule, SCHEDULE_LABELS);
  const extraNotes = displayValue(inquiry.additionalInformation, "No extra notes were added.");

  const text = [
    "New care request from the website",
    "",
    "Received: " + submitted,
    "",
    "WHO TO CONTACT",
    "Name: " + fullName,
    "Phone: " + phone,
    "Email: " + email,
    "Best way to reach them: " + contactMethod,
    "",
    "CARE NEEDS",
    "Who needs care: " + relationship,
    "Type of support: " + supportText,
    "Preferred schedule: " + scheduleText,
    "Preferred start date: " + displayValue(inquiry.desiredStartDate),
    "",
    "MESSAGE / NEEDS ASSESSMENT",
    extraNotes,
    "",
    "What to do next: Call or email " + fullName + " using the details above."
  ].join("\n");

  const bodyHtml =
    '<p style="margin:0 0 8px 0;font-size:18px;color:#5f6b72;">Received on ' +
    escapeHtml(submitted) +
    "</p>" +
    sectionHeading("Who to contact") +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">' +
    detailRow("Name", fullName) +
    detailRow("Phone", phone) +
    detailRow("Email", email) +
    detailRow("Best way to reach them", contactMethod) +
    "</table>" +
    sectionHeading("Care needs") +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">' +
    detailRow("Who needs care", relationship) +
    "</table>" +
    '<p style="margin:12px 0 0 0;font-size:18px;font-weight:700;color:#9b4a63;">Type of support</p>' +
    formatLabelListHtml(inquiry.supportTypes, SUPPORT_LABELS) +
    '<p style="margin:12px 0 0 0;font-size:18px;font-weight:700;color:#9b4a63;">Preferred schedule</p>' +
    formatLabelListHtml(inquiry.preferredSchedule, SCHEDULE_LABELS) +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:8px;">' +
    detailRow("Preferred start date", inquiry.desiredStartDate) +
    "</table>" +
    sectionHeading("Message / needs assessment") +
    '<p style="margin:0;font-size:20px;line-height:1.6;color:#1b2740;white-space:pre-wrap;">' +
    escapeHtml(extraNotes) +
    "</p>";

  const html = wrapOwnerEmail(
    "You have a new care request",
    "Someone filled out the Request Care form on your website. The details are below in large, easy-to-read text.",
    bodyHtml,
    "Please call or email " + fullName + ". Their phone number is " + phone + ". Their email is " + email + "."
  );

  return sendMailOrThrow(
    {
      from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
      to: process.env.OWNER_EMAIL,
      replyTo: inquiry.email,
      subject: "New care request from " + fullName,
      text: text,
      html: html
    },
    text
  );
}

async function sendInquiryConfirmation(inquiry) {
  if (String(process.env.SEND_CONFIRMATION_EMAIL).toLowerCase() !== "true") {
    return { skipped: true };
  }

  if (!isEmailConfigured()) {
    return { skipped: true };
  }

  const firstName = displayValue(inquiry.firstName, "there");
  const text = [
    "Hello " + firstName + ",",
    "",
    "Thank you. We received your care request and will contact you using the information provided.",
    "",
    "If you would rather speak with someone now, call (647) 829-9339.",
    "",
    BUSINESS_NAME
  ].join("\n");

  const html =
    '<div style="font-family:Arial, Helvetica, sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#1b2740;">' +
    '<h1 style="font-size:28px;line-height:1.3;margin:0 0 16px 0;">Thank you for your care request</h1>' +
    '<p style="font-size:20px;line-height:1.6;margin:0 0 14px 0;">Hello ' +
    escapeHtml(firstName) +
    ",</p>" +
    '<p style="font-size:20px;line-height:1.6;margin:0 0 14px 0;">Thank you. We received your care request and will contact you using the information provided.</p>' +
    '<p style="font-size:20px;line-height:1.6;margin:0 0 14px 0;">If you would rather speak with someone now, call (647) 829-9339.</p>' +
    '<p style="font-size:20px;line-height:1.6;margin:0;">' +
    escapeHtml(BUSINESS_NAME) +
    "</p>" +
    "</div>";

  const transporter = createTransport();
  await transporter.sendMail({
    from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
    to: inquiry.email,
    subject: "We received your care request",
    text: text,
    html: html
  });

  return { skipped: false };
}

async function sendOwnerContactEmail(message) {
  const submitted = new Date().toLocaleString("en-CA", {
    timeZone: "America/Toronto",
    dateStyle: "full",
    timeStyle: "short"
  });

  const name = displayValue(message.name, "Someone");
  const email = displayValue(message.email);
  const phone = displayValue(message.phone, "Not provided");
  const note = displayValue(message.message, "No message was added.");

  const text = [
    "New website message",
    "",
    "Received: " + submitted,
    "Name: " + name,
    "Email: " + email,
    "Phone: " + phone,
    "",
    "Message:",
    note,
    "",
    "What to do next: Reply to " + name + " using the contact details above."
  ].join("\n");

  const bodyHtml =
    '<p style="margin:0 0 8px 0;font-size:18px;color:#5f6b72;">Received on ' +
    escapeHtml(submitted) +
    "</p>" +
    sectionHeading("Who sent this message") +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">' +
    detailRow("Name", name) +
    detailRow("Email", email) +
    detailRow("Phone", phone) +
    "</table>" +
    sectionHeading("Their message") +
    '<p style="margin:0;font-size:20px;line-height:1.6;color:#1b2740;white-space:pre-wrap;">' +
    escapeHtml(note) +
    "</p>";

  const html = wrapOwnerEmail(
    "You have a new website message",
    "Someone used the Contact form on your website. The details are below in large, easy-to-read text.",
    bodyHtml,
    "Please reply to " + name + ". Their email is " + email + ". Their phone number is " + phone + "."
  );

  return sendMailOrThrow(
    {
      from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
      to: process.env.OWNER_EMAIL,
      replyTo: message.email,
      subject: "New website message from " + name,
      text: text,
      html: html
    },
    text
  );
}

async function sendOwnerApplicationEmail(application) {
  const submitted = new Date(application.createdAt || Date.now()).toLocaleString("en-CA", {
    timeZone: "America/Toronto",
    dateStyle: "full",
    timeStyle: "short"
  });

  const fullName = displayValue(application.firstName + " " + application.lastName, "Someone");
  const phone = displayValue(application.phone);
  const email = displayValue(application.email);
  const position = labelFor(POSITION_LABELS, application.position);
  const availability = formatLabelList(application.availability, AVAILABILITY_LABELS);
  const shifts = formatLabelList(application.preferredShifts, SHIFT_LABELS);
  const experience = displayValue(application.experience, "No experience notes were added.");

  const text = [
    "New PSW job application from the website",
    "",
    "Received: " + submitted,
    "",
    "APPLICANT",
    "Name: " + fullName,
    "Phone: " + phone,
    "Email: " + email,
    "",
    "POSITION DETAILS",
    "Position: " + position,
    "Availability: " + availability,
    "Preferred shifts: " + shifts,
    "",
    "RELEVANT EXPERIENCE",
    experience,
    "",
    "What to do next: Call or email " + fullName + " using the details above."
  ].join("\n");

  const bodyHtml =
    '<p style="margin:0 0 8px 0;font-size:18px;color:#5f6b72;">Received on ' +
    escapeHtml(submitted) +
    "</p>" +
    sectionHeading("Applicant") +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">' +
    detailRow("Name", fullName) +
    detailRow("Phone", phone) +
    detailRow("Email", email) +
    "</table>" +
    sectionHeading("Position details") +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">' +
    detailRow("Position", position) +
    detailRow("Availability", availability) +
    detailRow("Preferred shifts", shifts) +
    "</table>" +
    sectionHeading("Relevant experience") +
    '<p style="margin:0;font-size:20px;line-height:1.6;color:#1b2740;white-space:pre-wrap;">' +
    escapeHtml(experience) +
    "</p>";

  const html = wrapOwnerEmail(
    "You have a new PSW application",
    "Someone filled out the Careers form on your website. The details are below in large, easy-to-read text.",
    bodyHtml,
    "Please call or email " + fullName + ". Their phone number is " + phone + ". Their email is " + email + "."
  );

  return sendMailOrThrow(
    {
      from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
      to: process.env.OWNER_EMAIL,
      replyTo: application.email,
      subject: "New PSW application from " + fullName,
      text: text,
      html: html
    },
    text
  );
}

module.exports = {
  sendOwnerInquiryEmail,
  sendInquiryConfirmation,
  sendOwnerContactEmail,
  sendOwnerApplicationEmail
};
