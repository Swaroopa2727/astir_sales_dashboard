// Standalone Consultant Report page wiring
document.addEventListener("DOMContentLoaded", function () {
  var $ = function (id) { return document.getElementById(id); };
  var cr = ConsultantReport.mount($("consultantReportRoot"), function () { return $("crCompany").value; });
  function setTitle() { $("crTitle").textContent = "Consultant Report – " + $("crMonth").value + " " + $("crYear").value; }
  $("crFilter").addEventListener("submit", function (e) { e.preventDefault(); setTitle(); cr.refresh(); });
  $("crExport").addEventListener("click", cr.exportCsv);
  setTitle();
});
