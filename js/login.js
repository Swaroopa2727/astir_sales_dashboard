// Login page — validation, show/hide password, remember me.
// Demo only: replace the sign-in block with a real authentication call.
document.addEventListener("DOMContentLoaded", function () {
  var $ = function (id) { return document.getElementById(id); };

  try { var saved = localStorage.getItem("astirRememberedEmail"); if (saved) { $("email").value = saved; $("remember").checked = true; } } catch (e) {}

  $("pwToggle").addEventListener("click", function () {
    var show = $("password").type === "password";
    $("password").type = show ? "text" : "password";
    this.innerHTML = '<i class="bi ' + (show ? "bi-eye-slash" : "bi-eye") + '"></i>';
    this.setAttribute("aria-label", show ? "Hide password" : "Show password");
  });

  ["email", "password"].forEach(function (id) {
    $(id).addEventListener("input", function () { this.classList.remove("is-invalid"); $("loginError").classList.add("d-none"); });
  });

  $("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var okEmail = $("email").value.trim() !== "" && $("email").checkValidity();
    var okPw = $("password").value !== "";
    $("email").classList.toggle("is-invalid", !okEmail);
    $("password").classList.toggle("is-invalid", !okPw);
    if (!okEmail || !okPw) return;

    try {
      if ($("remember").checked) localStorage.setItem("astirRememberedEmail", $("email").value.trim());
      else localStorage.removeItem("astirRememberedEmail");
    } catch (err) {}

    // TODO: authenticate against your backend here; show errors in #loginError on failure.
    window.location.href = "dashboard.html";
  });
});
