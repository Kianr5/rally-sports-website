const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const header = document.querySelector("[data-header]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setMenu(open, restoreFocus = false) {
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  navLinks.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);

  if (!open && restoreFocus) {
    menuButton.focus({ preventScroll: true });
  }
}

menuButton.addEventListener("click", () => {
  const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
  setMenu(willOpen, !willOpen);
});

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    setMenu(false, true);
  }
});

document.addEventListener("keydown", (event) => {
  const menuIsOpen = menuButton.getAttribute("aria-expanded") === "true";

  if (event.key === "Escape" && menuIsOpen) {
    setMenu(false, true);
    return;
  }

  if (event.key === "Tab" && menuIsOpen) {
    const menuFocusables = [
      menuButton,
      ...navLinks.querySelectorAll('a[href], button:not([disabled])')
    ];
    const firstFocusable = menuFocusables[0];
    const lastFocusable = menuFocusables[menuFocusables.length - 1];

    if (event.shiftKey && document.activeElement === firstFocusable) {
      event.preventDefault();
      lastFocusable.focus();
    } else if (!event.shiftKey && document.activeElement === lastFocusable) {
      event.preventDefault();
      firstFocusable.focus();
    }
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 920) {
    setMenu(false);
  }
});

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealElements = document.querySelectorAll(".reveal");

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.documentElement.classList.add("js-enabled");
  revealElements.forEach((element) => revealObserver.observe(element));
}

document.querySelector("[data-year]").textContent = new Date().getFullYear();
