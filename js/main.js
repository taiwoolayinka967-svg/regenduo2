const body = document.body;
const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("primaryNav");
const themeToggle = document.getElementById("themeToggle");

menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }),
);

window.addEventListener(
  "scroll",
  () => header.classList.toggle("scrolled", window.scrollY > 20),
  { passive: true },
);

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme) body.dataset.theme = savedTheme;
function updateThemeIcon() {
  themeToggle.querySelector(".theme-icon").textContent =
    body.dataset.theme === "dark" ? "☀" : "☾";
  themeToggle.setAttribute(
    "aria-label",
    body.dataset.theme === "dark"
      ? "Switch to light theme"
      : "Switch to dark theme",
  );
}
updateThemeIcon();
themeToggle.addEventListener("click", () => {
  body.dataset.theme = body.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("portfolio-theme", body.dataset.theme);
  updateThemeIcon();
});

const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".project-card");
filters.forEach((filter) =>
  filter.addEventListener("click", () => {
    filters.forEach((x) => x.classList.remove("active"));
    filter.classList.add("active");
    const category = filter.dataset.filter;
    cards.forEach((card) => {
      const show = category === "all" || card.dataset.category === category;
      card.hidden = !show;
    });
  }),
);

const projectData = {
  noya: {
    kicker: "Web design · Development",
    title: "NŌYA Objects",
    description:
      "A calm, editorial e-commerce experience for a modern objects brand. The direction pairs tactile typography with generous whitespace and a warm neutral palette.",
    tags: ["Art direction", "Responsive UI", "Frontend"],
  },
  flow: {
    kicker: "Product · UI/UX",
    title: "Flow — Focus app",
    description:
      "A focused productivity concept built around reducing noise. The interface uses clear hierarchy, lightweight motion and a small set of high-value actions.",
    tags: ["Product design", "UX", "Interaction"],
  },
  monument: {
    kicker: "Brand identity · Digital",
    title: "Monument Studio",
    description:
      "A distinctive identity and digital home for an architecture studio. The system balances an expressive typographic mark with an understated portfolio experience.",
    tags: ["Identity", "Web design", "Art direction"],
  },
  kinetic: {
    kicker: "Creative development · Web",
    title: "Kinetic Athletics",
    description:
      "An energetic campaign site that turns movement into the visual language. Scroll-led composition, oversized type and strong contrast create a memorable experience.",
    tags: ["Creative code", "Motion", "Campaign"],
  },
};
const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle"),
  modalKicker = document.getElementById("modalKicker"),
  modalDescription = document.getElementById("modalDescription"),
  modalTags = document.getElementById("modalTags");
function openModal(key) {
  const p = projectData[key];
  if (!p) return;
  modalKicker.textContent = p.kicker;
  modalTitle.textContent = p.title;
  modalDescription.textContent = p.description;
  modalTags.innerHTML = p.tags.map((t) => `<span>${t}</span>`).join("");
  modal.setAttribute("aria-hidden", "false");
  body.classList.add("modal-open");
  modal.querySelector(".modal-close").focus();
}
function closeModal() {
  modal.setAttribute("aria-hidden", "true");
  body.classList.remove("modal-open");
}
cards.forEach((card) =>
  card.addEventListener("click", (e) => {
    if (e.target.closest("a")) return;
    openModal(card.dataset.project);
  }),
);
modal
  .querySelectorAll("[data-close-modal]")
  .forEach((el) => el.addEventListener("click", closeModal));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false")
    closeModal();
});

document.querySelectorAll(".faq-item button").forEach((btn) =>
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item"),
      open = item.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  }),
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const form = document.getElementById("contactForm"),
  status = document.getElementById("formStatus"),
  toast = document.getElementById("toast");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form),
    name = data.get("name").trim(),
    email = data.get("email").trim(),
    message = data.get("message").trim();
  if (!name || !email || !message) {
    status.textContent = "Please complete all fields.";
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    status.textContent = "Please enter a valid email address.";
    return;
  }
  status.textContent = `Thanks, ${name.split(" ")[0]} — your inquiry is ready to send.`;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3500);
  form.reset();
});
