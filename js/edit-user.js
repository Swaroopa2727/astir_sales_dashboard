// Edit User page — pre-fills from the Users list (via the URL), validates, saves, returns to Users.
// Replace the save block with your API call for real persistence.
document.addEventListener("DOMContentLoaded", function () {
  var $ = function (id) { return document.getElementById(id); };
  var q = new URLSearchParams(location.search);
  $("fullName").value = q.get("name") || "";
  $("email").value = q.get("email") || "";
  $("userType").value = q.get("type") || "";
  $("company").value = q.get("company") || "";

  var fields = ["fullName", "email", "userType", "company"].map($);
  function check(el) {
    var ok = el.value.trim() !== "" && el.checkValidity();
    el.classList.toggle("is-invalid", !ok); return ok;
  }
  fields.forEach(function (el) {
    ["input", "change"].forEach(function (ev) { el.addEventListener(ev, function () { if (el.classList.contains("is-invalid")) check(el); }); });
  });

  $("editUserForm").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!fields.map(check).every(Boolean)) { document.querySelector(".is-invalid").focus(); return; }
    var id = q.get("id");
    if (id !== null) {
      try {
        var edits = JSON.parse(localStorage.getItem("astirUserEdits") || "{}");
        edits[id] = { name: $("fullName").value.trim(), email: $("email").value.trim(), type: $("userType").value, company: $("company").value };
        localStorage.setItem("astirUserEdits", JSON.stringify(edits));
      } catch (err) {}
    }
    $("formAlert").classList.remove("d-none");
    setTimeout(function () { window.location.href = "users.html"; }, 1200);
  });
});
