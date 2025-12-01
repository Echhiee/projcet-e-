// doctor.js

document.addEventListener("DOMContentLoaded", () => {
  console.log("doctor.js running");

  const signOutBtn = document.getElementById("btnSignOutDoctor");
  if (signOutBtn) {
    function deleteCookie(name) {
      document.cookie = encodeURIComponent(name) + "=;path=/;max-age=0";
    }

    signOutBtn.addEventListener("click", () => {
      deleteCookie("auth");
      deleteCookie("user");
      window.location.href = "index.html";
    });
  }
});
