// Targets page — filter by sales type/company/month/year, edit numbers, Save All (in-memory demo data)
document.addEventListener("DOMContentLoaded", function () {
  var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var $ = function (id) { return document.getElementById(id); };
  var monthSel = $("tMonth");
  months.forEach(function (m) { var o = document.createElement("option"); o.textContent = m; if (m === "September") o.selected = true; monthSel.appendChild(o); });

  // RM lists per sales type + company
  var reps = {
    "Bench Sales|Astir": ["Arshad","Asheesh Boddu","Hemanth Matta","Keerthana","Kiran P","Rithvik S","Shashikumar Marapelly","Sivani Budithi","Talapalli Lahari","Vangireddy Pavithra Devi","Venkatesh B","Vijay G"],
    "Bench Sales|Advent Infotech": ["Arshad","Keerthana V","Lahari","Srivani"],
    "Third Party Sales|Astir": ["Harish J","Likhita Sri Anjani Vissa","Manepalli Kumar Sai Bharath","Saibabu Relangi","Tarak K"],
    "Third Party Sales|Advent Infotech": []
  };
  // [submissions, interviews, confirmations, placements, msa targets, msa results]
  var store = {};
  var seed = { "Kiran P":[60,10,2,1,2,0], "Rithvik S":[60,7,2,1,2,0], "Talapalli Lahari":[25,3,0,0,1,0], "Vangireddy Pavithra Devi":[35,4,1,0,1,0], "Vijay G":[50,5,1,1,2,0] };
  Object.keys(seed).forEach(function (n) { store["Bench Sales|Astir|September|2026|" + n] = seed[n]; });

  var current = null;
  function ctx() { return [$("salesType").value, $("tCompany").value, monthSel.value, $("tYear").value]; }

  function persist() {
    if (!current) return;
    document.querySelectorAll("#targetsBody tr[data-rep]").forEach(function (tr) {
      store[current.join("|") + "|" + tr.dataset.rep] = Array.prototype.map.call(tr.querySelectorAll("input"), function (i) { return Math.max(0, parseInt(i.value, 10) || 0); });
    });
  }

  function render() {
    current = ctx();
    var list = reps[current[0] + "|" + current[1]] || [];
    $("targetsBody").innerHTML = list.length ? list.map(function (n) {
      var v = store[current.join("|") + "|" + n] || [0,0,0,0,0,0];
      return '<tr data-rep="' + n + '"><td class="name-cell">' + current[1] + '</td><td class="name-cell">' + n + "</td>" +
        v.map(function (x) { return '<td><input type="number" min="0" value="' + x + '"></td>'; }).join("") + "</tr>";
    }).join("") : '<tr><td colspan="8" class="text-center text-muted py-4">No team members found.</td></tr>';
  }

  $("targetsFilter").addEventListener("submit", function (e) { e.preventDefault(); persist(); render(); });
  $("saveAll").addEventListener("click", function () {
    persist();
    var a = $("saveAlert"); a.classList.remove("d-none");
    setTimeout(function () { a.classList.add("d-none"); }, 2500);
  });
  render();
});
