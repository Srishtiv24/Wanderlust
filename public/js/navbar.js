(function () {
  const path = window.location.pathname;
  const search = window.location.search;

  // all nav links in both desktop and mobile drawer
  document.querySelectorAll("a[data-path]").forEach((link) => {
    const linkPath = link.getAttribute("data-path");
    const linkQuery = link.getAttribute("data-query"); // e.g. "mood"

    let isActive = false;

    if (linkQuery) {
      // itinerary: must match BOTH path AND query param
      isActive = path === linkPath && search.includes(linkQuery);
    } else if (linkPath === "/listings") {
      // explore: active on /listings WITHOUT mood param
      isActive = path === linkPath && !search.includes("mood");
    } else {
      // all other links: just match path
      isActive = path === linkPath;
    }

    if (isActive) link.classList.add("active");
  });
})();

(function () {
  const hamburger = document.getElementById("wlHamburger");
  const drawer = document.getElementById("wlMobileDrawer");
  const overlay = document.getElementById("wlOverlay");

  function openDrawer() {
    drawer.classList.add("open");
    overlay.classList.add("show");
    hamburger.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    overlay.classList.remove("show");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", () => {
    drawer.classList.contains("open") ? closeDrawer() : openDrawer();
  });

  overlay.addEventListener("click", closeDrawer);

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  // Close drawer when a link inside it is clicked
  drawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });
})();
