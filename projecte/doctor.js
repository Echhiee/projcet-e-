// doctor.js

document.addEventListener("DOMContentLoaded", () => {
  console.log("doctor.js running");

  const signOutBtn = document.getElementById("btnSignOutDoctor");
  if (signOutBtn) {
    signOutBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
});
