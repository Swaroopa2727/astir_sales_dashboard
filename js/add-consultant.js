// Add New Consultant — validation, then saves to the hotlist (localStorage demo) and returns to Hotlist.
// Replace the save block with your API call for real persistence.
document.addEventListener("DOMContentLoaded", function () {
  var $ = function (id) { return document.getElementById(id); };
  var rms = ["Arshad|Astir","Arshad|Advent Infotech","Asheesh Boddu|Astir","Hemanth Matta|Astir","Keerthana|Astir","Keerthana V|Advent Infotech","Kiran P|Astir","Lahari|Advent Infotech","Rithvik S|Astir","Shashikumar Marapelly|Astir","Sivani Budithi|Astir","Srivani|Advent Infotech","Talapalli Lahari|Astir","Vangireddy Pavithra Devi|Astir","Venkatesh B|Astir","Vijay G|Astir"];
  rms.forEach(function (k) { var o = document.createElement("option"); o.value = k; o.textContent = k.replace("|", "(") + ")"; $("rm").appendChild(o); });

  var d = new Date(), t = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  $("dateAdded").value = t; $("assignedDate").value = t;

  var required = ["firstName","lastName","phone","email","company","visa","exp","city","state","rm","priority","dateAdded","source","assignedDate","marketingStatus","onProject","employeeStatus","tech"];
  function fieldOk(id) {
    var el = $(id), ok = el.value.trim() !== "" && el.checkValidity();
    el.classList.toggle("is-invalid", !ok); return ok;
  }
  function optionalEmailOk(id) { var el = $(id), ok = el.value === "" || el.checkValidity(); el.classList.toggle("is-invalid", !ok); return ok; }
  function rateOk() {
    var ok = $("rate").value !== "" && $("rateType").value !== "";
    $("rate").classList.toggle("is-invalid", !ok); $("rate").closest(".input-group").classList.toggle("is-invalid", !ok);
    var fb = $("rate").closest(".fld-body").querySelector(".invalid-feedback"); fb.classList.toggle("d-block", !ok); return ok;
  }
  function relocOk() {
    var ok = !!document.querySelector('input[name="relocation"]:checked');
    document.querySelector(".radio-row").closest(".fld-body").querySelector(".invalid-feedback").classList.toggle("d-block", !ok); return ok;
  }
  function resumeOk() {
    var f = $("resume").files[0];
    var ok = !!f && /\.(pdf|doc|docx)$/i.test(f.name) && f.size <= 5 * 1024 * 1024;
    $("resume").classList.toggle("is-invalid", !ok); $("resumeErr").classList.toggle("d-block", !ok); return ok;
  }

  required.concat(["email2"]).forEach(function (id) {
    $(id).addEventListener("input", function () { if (this.classList.contains("is-invalid")) (id === "email2" ? optionalEmailOk : fieldOk)(id); });
    $(id).addEventListener("change", function () { if (this.classList.contains("is-invalid")) (id === "email2" ? optionalEmailOk : fieldOk)(id); });
  });
  $("resume").addEventListener("change", resumeOk);

  $("consultantForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var results = required.map(fieldOk).concat([optionalEmailOk("email2"), rateOk(), relocOk(), resumeOk()]);
    if (!results.every(Boolean)) {
      var bad = document.querySelector(".is-invalid"); if (bad) bad.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    var p = function (s) { return s.slice(5, 7) + "/" + s.slice(8) + "/" + s.slice(0, 4); };
    var name = [$("firstName").value, $("middleName").value, $("lastName").value].map(function (s) { return s.trim(); }).filter(Boolean).join(" ");
    var record = { date: p($("assignedDate").value), consultant: name, rm: $("rm").value, priority: $("priority").value, phone: $("phone").value.trim(),
      email: $("email").value.trim(), visa: $("visa").value, exp: +$("exp").value, rate: +$("rate").value, rtype: $("rateType").value,
      location: $("city").value.trim(), tech: $("tech").value.trim(), inactive: false };
    try {
      var list = JSON.parse(localStorage.getItem("astirNewConsultants") || "[]");
      list.push(record); localStorage.setItem("astirNewConsultants", JSON.stringify(list));
    } catch (err) {}
    $("formAlert").classList.remove("d-none");
    setTimeout(function () { window.location.href = "hotlist.html"; }, 1200);
  });
});
