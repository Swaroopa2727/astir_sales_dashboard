// Standalone Targets Report page wiring
document.addEventListener("DOMContentLoaded", function () {
  var $ = function (id) { return document.getElementById(id); };
  var tr = TargetsReport.mount($("targetsReportRoot"), function () { return $("crCompany").value; });
  function setTitle() { $("crTitle").textContent = "Targets Report – " + $("crMonth").value + " " + $("crYear").value; }
  $("crFilter").addEventListener("submit", function (e) { e.preventDefault(); setTitle(); tr.refresh(); });
  $("crExport").addEventListener("click", tr.exportCsv);
  setTitle();
});
