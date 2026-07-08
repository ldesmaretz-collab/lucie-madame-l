const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-menu-toggle]");
const form = document.querySelector("[data-v2-form]");
const carousel = document.querySelector("[data-carousel]");
const carouselTrack = document.querySelector("[data-carousel-track]");
const carouselPrev = document.querySelector("[data-carousel-prev]");
const carouselNext = document.querySelector("[data-carousel-next]");
const scrollTopButton = document.querySelector("[data-scroll-top]");

function syncHeader() {
  const isScrolled = window.scrollY > 24;
  header?.classList.toggle("is-scrolled", isScrolled);
  scrollTopButton?.classList.toggle("is-visible", window.scrollY > 520);
}

function closeMenu() {
  document.body.classList.remove("menu-open");
  nav?.classList.remove("is-open");
  toggle?.setAttribute("aria-expanded", "false");
}

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

toggle?.addEventListener("click", () => {
  const isOpen = toggle.getAttribute("aria-expanded") === "true";
  if (isOpen) {
    closeMenu();
    return;
  }

  document.body.classList.add("menu-open");
  nav?.classList.add("is-open");
  toggle.setAttribute("aria-expanded", "true");
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) closeMenu();
});

function moveCarousel(direction = 1) {
  if (!carouselTrack) return;
  const card = carouselTrack.querySelector("figure");
  const gap = Number.parseFloat(window.getComputedStyle(carouselTrack).columnGap || "18") || 18;
  const step = card ? card.getBoundingClientRect().width + gap : 420;
  const parent = carouselTrack.parentElement;
  parent?.scrollBy({ left: step * direction, behavior: "smooth" });
}

carouselPrev?.addEventListener("click", () => moveCarousel(-1));
carouselNext?.addEventListener("click", () => moveCarousel(1));

scrollTopButton?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

if (carousel && carouselTrack && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const parent = carouselTrack.parentElement;
  let lastTime = 0;
  let paused = false;

  carousel.addEventListener("mouseenter", () => { paused = true; });
  carousel.addEventListener("mouseleave", () => { paused = false; });
  carousel.addEventListener("focusin", () => { paused = true; });
  carousel.addEventListener("focusout", () => { paused = false; });

  function animateCarousel(time) {
    if (!parent) return;
    if (!lastTime) lastTime = time;
    const delta = Math.min(time - lastTime, 40);
    lastTime = time;

    if (!paused) {
      parent.scrollLeft += delta * 0.035;
      const loopPoint = (parent.scrollWidth - parent.clientWidth) / 2;
      if (parent.scrollLeft >= loopPoint) parent.scrollLeft -= loopPoint;
    }

    window.requestAnimationFrame(animateCarousel);
  }

  window.requestAnimationFrame(animateCarousel);
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const isEnglish = document.documentElement.lang === "en";
  const firstName = data.get("firstName") || "";
  const company = data.get("company") || "";
  const email = data.get("email") || "";
  const message = data.get("message") || "";
  const status = form.querySelector("[data-v2-status]");
  const body = [
    `${isEnglish ? "First name" : "Prenom"}: ${firstName}`,
    `${isEnglish ? "Company" : "Societe"}: ${company}`,
    `Email: ${email}`,
    "",
    message
  ].join("\n");

  if (status) status.textContent = isEnglish ? "Thank you, your message has been prepared." : "Merci, votre message a bien ete prepare.";
  const subject = isEnglish ? "Studio Madame-L V2 - Project request" : "Studio Madame-L V2 - Demande de projet";
  window.location.href = `mailto:lucie@madame-l.studio?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
