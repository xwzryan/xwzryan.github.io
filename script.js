const formatter = new Intl.NumberFormat("zh-CN");
document.documentElement.classList.add("reveal-enabled");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
  const rect = element.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.96) {
    element.classList.add("is-visible");
  }
});

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count || 0);
      const duration = 900;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.7 }
);

document.querySelectorAll("[data-count]").forEach((element) => {
  countObserver.observe(element);
});

const seatRange = document.querySelector("#seatRange");
const seatOutput = document.querySelector("#seatOutput");
const quarterPrice = document.querySelector("#quarterPrice");

function updatePrice() {
  const seats = Number(seatRange.value);
  const total = seats * 666 * 3;
  seatOutput.textContent = seats;
  quarterPrice.textContent = `¥${formatter.format(total)}`;
}

seatRange?.addEventListener("input", updatePrice);
updatePrice();

const cursorGlow = document.querySelector(".cursor-glow");
let pointerX = 0;
let pointerY = 0;
let glowX = 0;
let glowY = 0;

function moveGlow() {
  glowX += (pointerX - glowX) * 0.12;
  glowY += (pointerY - glowY) * 0.12;
  if (cursorGlow) {
    cursorGlow.style.transform = `translate3d(${glowX - 170}px, ${glowY - 170}px, 0)`;
  }
  requestAnimationFrame(moveGlow);
}

window.addEventListener("pointermove", (event) => {
  pointerX = event.clientX;
  pointerY = event.clientY;
  if (cursorGlow) cursorGlow.style.opacity = "1";

  document.querySelectorAll("[data-tilt]:hover").forEach((card) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 5;
    const rotateX = ((y / rect.height) - 0.5) * -5;
    card.style.setProperty("--mx", `${(x / rect.width) * 100}%`);
    card.style.setProperty("--my", `${(y / rect.height) * 100}%`);
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
});

window.addEventListener("pointerleave", () => {
  if (cursorGlow) cursorGlow.style.opacity = "0";
});

document.querySelectorAll("[data-tilt]").forEach((card) => {
  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
    card.style.setProperty("--mx", "50%");
    card.style.setProperty("--my", "20%");
  });
});

moveGlow();
