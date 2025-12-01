// home.js

document.addEventListener("DOMContentLoaded", () => {
  console.log("home.js running");

  // Smooth scrolling for nav links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Mobile nav toggle
  const navToggle = document.getElementById("navToggle");
  const nav = document.querySelector(".nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isShown = nav.style.display === "flex";
      nav.style.display = isShown ? "none" : "flex";
    });
  }

  // Reveal-on-scroll
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("revealed"));
  }

  // Auth modal (simple)
  const authModal = document.getElementById("authModal");
  const btnTopStart = document.getElementById("btnTopStart");
  const btnStart = document.getElementById("btnStart");

  function openAuth() {
    if (!authModal) return;
    if (typeof authModal.showModal === "function") {
      authModal.showModal();
    } else {
      authModal.setAttribute("open", "true");
    }
  }

  if (btnTopStart) {
    btnTopStart.addEventListener("click", (e) => {
      e.preventDefault();
      openAuth();
    });
  }

  if (btnStart) {
    btnStart.addEventListener("click", (e) => {
      e.preventDefault();
      openAuth();
    });
  }

  // Clicking backdrop closes dialog
  if (authModal && typeof authModal.showModal === "function") {
    authModal.addEventListener("click", (e) => {
      const rect = authModal.getBoundingClientRect();
      const inDialog =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (!inDialog) {
        authModal.close();
      }
    });
  }
});
