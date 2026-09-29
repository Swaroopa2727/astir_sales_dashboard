// Edit Consultant — pre-fills from the Hotlist row (via the URL), validates, saves, returns to Hotlist.
// Replace the save block with your API call for real persistence.
document.addEventListener("DOMContentLoaded", function () {
  var $ = function (id) { return document.getElementById(id); };
  var rms = ["Arshad|Astir","Arshad|Advent Infotech","Asheesh Boddu|Astir","Hemanth Matta|Astir","Keerthana|Astir","Keerthana V|Advent Infotech","Kiran P|Astir","Lahari|Advent Infotech","Rithvik S|Astir","Shashikumar Marapelly|Astir","Sivani Budithi|Astir","Srivani|Advent Infotech","Talapalli Lahari|Astir","Vangireddy Pavithra Devi|Astir","Venkatesh B|Astir","Vijay G|Astir"];
  rms.forEach(function (k) { var o = document.createElement("option"); o.value = k; o.textContent = k.replace("|", "(") + ")"; $("rm").appendChild(o); });

  var q = new URLSearchParams(location.search), fromList = q.has("name");
  var iso = function (s) { return s ? s.slice(6) + "-" + s.slice(0, 2) + "-" + s.slice(3, 5) : ""; };
  var now = new Date(), today = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);

  // Values not carried by the Hotlist row fall back to sample data so the page is never blank.
  var v = fromList ? {
    name: q.get("name"), phone: q.get("phone"), email: q.get("email"), visa: q.get("visa"), exp: q.get("exp"), rate: q.get("rate"), rtype: q.get("rtype"),
    city: q.get("city"), rm: q.get("rm"), priority: q.get("priority"), tech: q.get("tech"), assigned: iso(q.get("date")), resume: ""
  } : {
    name: "DIVYA JALADI", phone: "(331) 999-0341", email: "divyasaji26@gmail.com", visa: "H1B(W2)", exp: "9", rate: "70", rtype: "Hourly",
    city: "North Carolina", rm: "Shashikumar Marapelly|Astir", priority: "High", tech: ".Net Developer", assigned: today, resume: "Divya_Sai_Jaladi_Res....pdf"
  };
  var parts = v.name.trim().split(/\s+/);
  $("firstName").value = parts[0] || ""; $("lastName").value = parts.length > 1 ? parts[parts.length - 1] : ""; $("middleName").value = parts.slice(1, -1).join(" ");
  $("phone").value = v.phone; $("email").value = v.email; $("company").value = (v.rm.split("|")[1]) || "Astir";
  $("visa").value = v.visa; $("exp").value = v.exp; $("rate").value = v.rate; $("rateType").value = v.rtype; $("city").value = v.city;
  $("rm").value = v.rm; $("priority").value = v.priority; $("tech").value = v.tech;
  $("dateAdded").value = today; $("assignedDate").value = v.assigned || today;
  if (!fromList) { $("state").value = "NC"; $("source").value = "W2-Employee"; $("marketingStatus").value = "Hot List"; $("onProject").value = "No"; $("employeeStatus").value = "Current Employee"; $("entity").value = "W2 Astir IT"; $("relocNo").checked = true; }
  if (v.resume) { $("resumeName").textContent = v.resume; $("viewResume").classList.remove("d-none"); }
  $("resumeDelete").addEventListener("click", function () { $("viewResume").classList.add("d-none"); });

  var required = ["firstName","lastName","phone","email","company","visa","exp","city","state","rm","priority","dateAdded","source","assignedDate","marketingStatus","onProject","employeeStatus","entity","tech"];
  function fieldOk(id) { var el = $(id), ok = el.value.trim() !== "" && el.checkValidity(); el.classList.toggle("is-invalid", !ok); return ok; }
  function optionalEmailOk() { var el = $("email2"), ok = el.value === "" || el.checkValidity(); el.classList.toggle("is-invalid", !ok); return ok; }
  function rateOk() {
    var ok = $("rate").value !== "" && $("rateType").value !== "";
    $("rate").closest(".input-group").classList.toggle("is-invalid", !ok);
    $("rate").closest(".fld-body").querySelector(".invalid-feedback").classList.toggle("d-block", !ok); return ok;
  }
  function relocOk() {
    var ok = !!document.querySelector('input[name="relocation"]:checked');
    document.querySelector(".radio-row").closest(".fld-body").querySelector(".invalid-feedback").classList.toggle("d-block", !ok); return ok;
  }
  function resumeOk() { // optional on edit; if a new file is chosen it must be PDF/DOC/DOCX up to 5MB
    var f = $("resume").files[0], ok = !f || (/\.(pdf|doc|docx)$/i.test(f.name) && f.size <= 5 * 1024 * 1024);
    $("resume").classList.toggle("is-invalid", !ok); $("resumeErr").classList.toggle("d-block", !ok); return ok;
  }
  required.concat(["email2"]).forEach(function (id) {
    ["input", "change"].forEach(function (ev) { $(id).addEventListener(ev, function () { if (this.classList.contains("is-invalid")) (id === "email2" ? optionalEmailOk : fieldOk)(id); }); });
  });
  $("resume").addEventListener("change", resumeOk);

  $("consultantForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = required.map(fieldOk).concat([optionalEmailOk(), rateOk(), relocOk(), resumeOk()]).every(Boolean);
    if (!ok) { var bad = document.querySelector(".is-invalid"); if (bad) bad.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    var p = function (s) { return s.slice(5, 7) + "/" + s.slice(8) + "/" + s.slice(0, 4); };
    var name = [$("firstName").value, $("middleName").value, $("lastName").value].map(function (s) { return s.trim(); }).filter(Boolean).join(" ");
    var record = { date: p($("assignedDate").value), consultant: name, rm: $("rm").value, priority: $("priority").value, phone: $("phone").value.trim(),
      email: $("email").value.trim(), visa: $("visa").value, exp: +$("exp").value, rate: +$("rate").value, rtype: $("rateType").value, location: $("city").value.trim(), tech: $("tech").value.trim() };
    if (q.get("orig")) {
      try {
        var edits = JSON.parse(localStorage.getItem("astirConsultantEdits") || "{}");
        edits[q.get("orig")] = record; localStorage.setItem("astirConsultantEdits", JSON.stringify(edits));
      } catch (err) {}
    }
    $("formAlert").classList.remove("d-none");
    setTimeout(function () { window.location.href = "hotlist.html"; }, 1200);
  });
});
