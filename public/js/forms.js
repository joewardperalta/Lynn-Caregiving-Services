(function () {
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var MAX_LENGTHS = {
    firstName: 100,
    lastName: 100,
    name: 150,
    email: 255,
    phone: 50,
    additionalInformation: 2000,
    experience: 2000,
    message: 2000
  };

  function setFieldError(field, message) {
    var wrapper = field.closest(".form-field") || field.closest(".form-fieldset");
    if (!wrapper) {
      return;
    }
    wrapper.classList.add("is-invalid");
    var error = wrapper.querySelector(".field-error");
    if (error) {
      error.textContent = message;
    }
  }

  function clearErrors(form) {
    form.querySelectorAll(".is-invalid").forEach(function (el) {
      el.classList.remove("is-invalid");
    });
  }

  function showStatus(form, type, message) {
    var status = form.querySelector(".form-status");
    if (!status) {
      return;
    }
    status.classList.add("is-visible");
    status.classList.remove("form-status--error", "form-status--success");
    status.classList.add(type === "success" ? "form-status--success" : "form-status--error");
    status.textContent = message;
  }

  function hideStatus(form) {
    var status = form.querySelector(".form-status");
    if (!status) {
      return;
    }
    status.classList.remove("is-visible");
    status.textContent = "";
  }

  function requiredValue(form, name) {
    var field = form.elements[name];
    if (!field) {
      return "";
    }
    return String(field.value || "").trim();
  }

  function checkedValues(form, name) {
    return Array.prototype.map.call(form.querySelectorAll('input[name="' + name + '"]:checked'), function (input) {
      return input.value;
    });
  }

  function validateInquiry(form) {
    var errors = [];
    var firstName = requiredValue(form, "firstName");
    var lastName = requiredValue(form, "lastName");
    var email = requiredValue(form, "email");
    var phone = requiredValue(form, "phone");
    var relationship = requiredValue(form, "relationshipToClient");
    var privacy = form.elements.privacyAcknowledged;
    var support = form.querySelectorAll('input[name="supportTypes"]:checked');

    if (!firstName) {
      errors.push(["firstName", "Please enter a first name."]);
    } else if (firstName.length > MAX_LENGTHS.firstName) {
      errors.push(["firstName", "First name is too long."]);
    }

    if (!lastName) {
      errors.push(["lastName", "Please enter a last name."]);
    } else if (lastName.length > MAX_LENGTHS.lastName) {
      errors.push(["lastName", "Last name is too long."]);
    }

    if (!email) {
      errors.push(["email", "Please enter an email address."]);
    } else if (!EMAIL_PATTERN.test(email) || email.length > MAX_LENGTHS.email) {
      errors.push(["email", "Please enter a valid email address."]);
    }

    if (!phone) {
      errors.push(["phone", "Please enter a phone number."]);
    } else if (phone.length > MAX_LENGTHS.phone) {
      errors.push(["phone", "Phone number is too long."]);
    }

    if (!relationship) {
      errors.push(["relationshipToClient", "Please tell us who needs care."]);
    }

    if (!support.length) {
      errors.push(["supportTypes", "Please select at least one type of support."]);
    }

    if (!privacy || !privacy.checked) {
      errors.push(["privacyAcknowledged", "Please confirm that we may contact you about this request."]);
    }

    return errors;
  }

  function validateContact(form) {
    var errors = [];
    var name = requiredValue(form, "name");
    var email = requiredValue(form, "email");
    var message = requiredValue(form, "message");

    if (!name) {
      errors.push(["name", "Please enter your name."]);
    } else if (name.length > MAX_LENGTHS.name) {
      errors.push(["name", "Name is too long."]);
    }

    if (!email) {
      errors.push(["email", "Please enter an email address."]);
    } else if (!EMAIL_PATTERN.test(email) || email.length > MAX_LENGTHS.email) {
      errors.push(["email", "Please enter a valid email address."]);
    }

    if (!message) {
      errors.push(["message", "Please enter a message."]);
    } else if (message.length > MAX_LENGTHS.message) {
      errors.push(["message", "Message is too long."]);
    }

    return errors;
  }

  function validateApplication(form) {
    var errors = [];
    var firstName = requiredValue(form, "firstName");
    var lastName = requiredValue(form, "lastName");
    var email = requiredValue(form, "email");
    var phone = requiredValue(form, "phone");
    var position = requiredValue(form, "position");
    var privacy = form.elements.privacyAcknowledged;

    if (!firstName) {
      errors.push(["firstName", "Please enter a first name."]);
    } else if (firstName.length > MAX_LENGTHS.firstName) {
      errors.push(["firstName", "First name is too long."]);
    }

    if (!lastName) {
      errors.push(["lastName", "Please enter a last name."]);
    } else if (lastName.length > MAX_LENGTHS.lastName) {
      errors.push(["lastName", "Last name is too long."]);
    }

    if (!email) {
      errors.push(["email", "Please enter an email address."]);
    } else if (!EMAIL_PATTERN.test(email) || email.length > MAX_LENGTHS.email) {
      errors.push(["email", "Please enter a valid email address."]);
    }

    if (!phone) {
      errors.push(["phone", "Please enter a phone number."]);
    } else if (phone.length > MAX_LENGTHS.phone) {
      errors.push(["phone", "Phone number is too long."]);
    }

    if (!position) {
      errors.push(["position", "Please choose a position."]);
    }

    if (!privacy || !privacy.checked) {
      errors.push(["privacyAcknowledged", "Please confirm that we may contact you about this application."]);
    }

    return errors;
  }

  function collectInquiry(form) {
    return {
      firstName: requiredValue(form, "firstName"),
      lastName: requiredValue(form, "lastName"),
      email: requiredValue(form, "email"),
      phone: requiredValue(form, "phone"),
      preferredContactMethod: requiredValue(form, "preferredContactMethod") || "phone",
      relationshipToClient: requiredValue(form, "relationshipToClient"),
      supportTypes: checkedValues(form, "supportTypes"),
      preferredSchedule: checkedValues(form, "preferredSchedule"),
      desiredStartDate: requiredValue(form, "desiredStartDate"),
      additionalInformation: requiredValue(form, "additionalInformation"),
      privacyAcknowledged: Boolean(form.elements.privacyAcknowledged && form.elements.privacyAcknowledged.checked)
    };
  }

  function collectContact(form) {
    return {
      name: requiredValue(form, "name"),
      email: requiredValue(form, "email"),
      phone: requiredValue(form, "phone"),
      message: requiredValue(form, "message")
    };
  }

  function collectApplication(form) {
    return {
      firstName: requiredValue(form, "firstName"),
      lastName: requiredValue(form, "lastName"),
      email: requiredValue(form, "email"),
      phone: requiredValue(form, "phone"),
      position: requiredValue(form, "position"),
      availability: checkedValues(form, "availability"),
      preferredShifts: checkedValues(form, "preferredShifts"),
      experience: requiredValue(form, "experience"),
      privacyAcknowledged: Boolean(form.elements.privacyAcknowledged && form.elements.privacyAcknowledged.checked)
    };
  }

  function setSubmitting(button, submitting) {
    if (!button) {
      return;
    }
    button.disabled = submitting;
    button.classList.toggle("is-loading", submitting);
    button.textContent = submitting ? "Submitting..." : button.getAttribute("data-default-label");
  }

  async function submitForm(form, endpoint, payload) {
    var button = form.querySelector('button[type="submit"]');
    if (button && !button.getAttribute("data-default-label")) {
      button.setAttribute("data-default-label", button.textContent);
    }

    hideStatus(form);
    setSubmitting(button, true);

    try {
      var response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });

      var data = {};
      try {
        data = await response.json();
      } catch (parseError) {
        data = {};
      }

      if (response.ok) {
        if (form.dataset.successRedirect) {
          window.location.href = form.dataset.successRedirect;
          return;
        }
        form.reset();
        showStatus(form, "success", data.message || "Thank you. Your message has been sent.");
        return;
      }

      if (Array.isArray(data.errors)) {
        data.errors.forEach(function (item) {
          if (item.field) {
            setFieldError(form.elements[item.field] || form, item.message);
          }
        });
      }

      showStatus(
        form,
        "error",
        data.message || "We couldn't submit your request right now. Please try again or contact us directly."
      );
    } catch (error) {
      showStatus(
        form,
        "error",
        "We couldn't submit your request right now. Please try again or contact us directly."
      );
    } finally {
      setSubmitting(button, false);
    }
  }

  function bindForm(form, validate, collect, endpoint) {
    form.setAttribute("novalidate", "novalidate");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors(form);
      hideStatus(form);

      var errors = validate(form);
      if (errors.length) {
        errors.forEach(function (item) {
          var field = form.elements[item[0]];
          if (field && field.length && !field.tagName) {
            field = field[0];
          }
          if (!field) {
            field = form.querySelector('[name="' + item[0] + '"]');
          }
          if (field) {
            setFieldError(field, item[1]);
          }
        });
        showStatus(form, "error", "Please check the highlighted fields and try again.");
        var firstInvalid = form.querySelector(".is-invalid");
        if (firstInvalid) {
          var focusable = firstInvalid.querySelector("input, select, textarea");
          if (focusable) {
            focusable.focus();
          }
        }
        return;
      }

      submitForm(form, endpoint, collect(form));
    });
  }

  var inquiryForm = document.querySelector("#inquiry-form");
  if (inquiryForm) {
    bindForm(inquiryForm, validateInquiry, collectInquiry, "/api/inquiries");
  }

  var contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    bindForm(contactForm, validateContact, collectContact, "/api/contact");
  }

  var applicationForm = document.querySelector("#application-form");
  if (applicationForm) {
    bindForm(applicationForm, validateApplication, collectApplication, "/api/applications");
  }
})();
