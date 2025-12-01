// patient.js

document.addEventListener("DOMContentLoaded", () => {
  console.log("patient.js running");

  const navButtons = document.querySelectorAll(".dash-nav__item[data-p-view]");
  const views = document.querySelectorAll(".p-view");
  const signOutBtn = document.getElementById("btnSignOutPatient");

  function showSection(name) {
    views.forEach((v) => {
      const sectionName = v.getAttribute("data-p-section");
      if (sectionName === name) {
        v.classList.remove("is-hidden");
      } else {
        v.classList.add("is-hidden");
      }
    });

    navButtons.forEach((btn) => {
      if (btn.dataset.pView === name) {
        btn.classList.add("dash-nav__item--active");
      } else {
        btn.classList.remove("dash-nav__item--active");
      }
    });
  }

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.pView;
      if (target) showSection(target);
    });
  });

  // default view
  showSection("dashboard");

  // sign out
  if (signOutBtn) {
    signOutBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
});
