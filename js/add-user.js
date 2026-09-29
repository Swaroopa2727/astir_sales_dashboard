// Add User page — validation, then return to the Users list.
// Replace the redirect block with your API call to actually save the user.
document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("addUserForm");
  var alertBox = document.getElementById("formAlert");
  var fields = ["fullName", "email", "userType"].map(function (id) { return document.getElementById(id); });

  function check(el) {
    var ok = el.value.trim() !== "" && el.checkValidity();
    el.classList.toggle("is-invalid", !ok);
    return ok;
  }
  fields.forEach(function (el) {
    el.addEventListener("input", function () { if (el.classList.contains("is-invalid")) check(el); });
    el.addEventListener("change", function () { if (el.classList.contains("is-invalid")) check(el); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var valid = fields.map(check).every(Boolean);
    if (!valid) { fields.filter(function (f) { return f.classList.contains("is-invalid"); })[0].focus(); return; }
    alertBox.classList.remove("d-none");
    setTimeout(function () { window.location.href = "users.html"; }, 1200);
  });
});
