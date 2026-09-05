const { body, validationResult } = require("express-validator");

const SUPPORT_TYPES = ["personal_care", "mobility", "meals", "companionship", "respite", "other"];
const RELATIONSHIPS = ["myself", "parent", "spouse", "family_member", "other"];
const CONTACT_METHODS = ["phone", "email"];
const SCHEDULE_OPTIONS = ["weekdays", "weekends", "morning", "evening", "night"];
const POSITIONS = ["full_time", "part_time"];
const AVAILABILITY_OPTIONS = ["weekdays", "weekends"];
const SHIFT_OPTIONS = ["morning", "evening", "night"];

function stripUnsafe(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .trim();
}

function cleanOptional(value, max) {
  const cleaned = stripUnsafe(value);
  return cleaned ? cleaned.slice(0, max) : "";
}

function asList(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function requireListIn(allowed, message) {
  return function (value) {
    const list = asList(value);
    const valid = list.every(function (item) {
      return allowed.includes(item);
    });
    if (!valid) {
      throw new Error(message);
    }
    return true;
  };
}

function handleValidation(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  const errors = result.array().map(function (item) {
    return { field: item.path, message: item.msg };
  });

  return res.status(400).json({
    message: "Please check the highlighted fields and try again.",
    errors: errors
  });
}

const nameEmailPhone = [
  body("firstName")
    .customSanitizer(stripUnsafe)
    .trim()
    .notEmpty()
    .withMessage("Please enter a first name.")
    .bail()
    .isLength({ max: 100 })
    .withMessage("First name is too long."),
  body("lastName")
    .customSanitizer(stripUnsafe)
    .trim()
    .notEmpty()
    .withMessage("Please enter a last name.")
    .bail()
    .isLength({ max: 100 })
    .withMessage("Last name is too long."),
  body("email")
    .customSanitizer(stripUnsafe)
    .trim()
    .notEmpty()
    .withMessage("Please enter an email address.")
    .bail()
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .bail()
    .isLength({ max: 255 })
    .normalizeEmail(),
  body("phone")
    .customSanitizer(stripUnsafe)
    .trim()
    .notEmpty()
    .withMessage("Please enter a phone number.")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Phone number is too long.")
    .bail()
    .matches(/^[0-9+()\-\s.]{7,50}$/)
    .withMessage("Please enter a valid phone number.")
];

const inquiryValidation = [
  ...nameEmailPhone,
  body("preferredContactMethod")
    .optional({ values: "falsy" })
    .isIn(CONTACT_METHODS)
    .withMessage("Please choose a preferred contact method."),
  body("relationshipToClient")
    .customSanitizer(stripUnsafe)
    .notEmpty()
    .withMessage("Please tell us who needs care.")
    .bail()
    .isIn(RELATIONSHIPS)
    .withMessage("Please tell us who needs care."),
  body("supportTypes").custom(function (value) {
    const list = asList(value);
    if (!list.length) {
      throw new Error("Please select at least one type of support.");
    }
    const valid = list.every(function (item) {
      return SUPPORT_TYPES.includes(item);
    });
    if (!valid) {
      throw new Error("Please select a valid type of support.");
    }
    return true;
  }),
  body("preferredSchedule")
    .optional({ values: "falsy" })
    .custom(requireListIn(SCHEDULE_OPTIONS, "Please choose a valid schedule option.")),
  body("desiredStartDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("Please enter a valid start date."),
  body("additionalInformation")
    .optional({ values: "falsy" })
    .customSanitizer(function (value) {
      return cleanOptional(value, 2000);
    }),
  body("privacyAcknowledged").custom(function (value) {
    if (value === true || value === "true" || value === "yes" || value === "on") {
      return true;
    }
    throw new Error("Please confirm that we may contact you about this request.");
  }),
  handleValidation
];

const contactValidation = [
  body("name")
    .customSanitizer(stripUnsafe)
    .trim()
    .notEmpty()
    .withMessage("Please enter your name.")
    .bail()
    .isLength({ max: 150 })
    .withMessage("Name is too long."),
  body("email")
    .customSanitizer(stripUnsafe)
    .trim()
    .notEmpty()
    .withMessage("Please enter an email address.")
    .bail()
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .bail()
    .isLength({ max: 255 })
    .normalizeEmail(),
  body("phone")
    .optional({ values: "falsy" })
    .customSanitizer(stripUnsafe)
    .trim()
    .isLength({ max: 50 })
    .withMessage("Phone number is too long.")
    .matches(/^[0-9+()\-\s.]{7,50}$/)
    .withMessage("Please enter a valid phone number."),
  body("message")
    .customSanitizer(function (value) {
      return cleanOptional(value, 2000);
    })
    .notEmpty()
    .withMessage("Please enter a message."),
  handleValidation
];

const applicationValidation = [
  ...nameEmailPhone,
  body("position")
    .customSanitizer(stripUnsafe)
    .notEmpty()
    .withMessage("Please choose a position.")
    .bail()
    .isIn(POSITIONS)
    .withMessage("Please choose a position."),
  body("availability")
    .optional({ values: "falsy" })
    .custom(requireListIn(AVAILABILITY_OPTIONS, "Please choose a valid availability option.")),
  body("preferredShifts")
    .optional({ values: "falsy" })
    .custom(requireListIn(SHIFT_OPTIONS, "Please choose a valid shift.")),
  body("experience")
    .optional({ values: "falsy" })
    .customSanitizer(function (value) {
      return cleanOptional(value, 2000);
    }),
  body("privacyAcknowledged").custom(function (value) {
    if (value === true || value === "true" || value === "yes" || value === "on") {
      return true;
    }
    throw new Error("Please confirm that we may contact you about this application.");
  }),
  handleValidation
];

module.exports = {
  inquiryValidation,
  contactValidation,
  applicationValidation,
  stripUnsafe
};
