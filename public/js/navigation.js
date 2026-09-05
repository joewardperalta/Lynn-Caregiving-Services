(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector("#site-nav");
  var body = document.body;

  if (!toggle || !nav) {
    return;
  }

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
    body.classList.toggle("nav-open", open);
  }

  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") !== "true";
    setOpen(open);
    if (open) {
      var firstLink = nav.querySelector("a");
      if (firstLink) {
        firstLink.focus();
      }
    }
  });

  nav.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setOpen(false);
    });
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 1100) {
      setOpen(false);
    }
  });
})();
