(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  document.documentElement.classList.add("js-enabled");

  var items = document.querySelectorAll(".reveal");
  if (!items.length || !("IntersectionObserver" in window)) {
    items.forEach(function (item) {
      item.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  items.forEach(function (item) {
    observer.observe(item);
  });
})();
