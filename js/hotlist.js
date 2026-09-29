// Hotlist page — RM filter, search, sort, paginate, add/edit/inactivate, CSV download (in-memory demo data)
document.addEventListener("DOMContentLoaded", function () {
  var PAGE_SIZE = 25, PRI = { High: 1, Medium: 2, Low: 3 };
  var rms = [["Arshad","Astir"],["Arshad","Advent Infotech"],["Asheesh Boddu","Astir"],["Hemanth Matta","Astir"],["Keerthana","Astir"],
    ["Keerthana V","Advent Infotech"],["Kiran P","Astir"],["Lahari","Advent Infotech"],["Rithvik S","Astir"],["Shashikumar Marapelly","Astir"],
    ["Sivani Budithi","Astir"],["Srivani","Advent Infotech"],["Talapalli Lahari","Astir"],["Vangireddy Pavithra Devi","Astir"],["Venkatesh B","Astir"],["Vijay G","Astir"]]
    .map(function (r) { return { key: r[0] + "|" + r[1], label: r[0] + "(" + r[1] + ")" }; });

  // date, consultant, rm key, priority, phone, email, visa, exp, rate, rate type, location, technology
  var rows = [
    ["08/25/2026","Kiran Lamkb","Kiran P|Astir","High","(940) 629-3193","lamkbkiran@gmail.com","OPT",6,63,"Hourly","Dallas","Power BI Developer"],
    ["06/29/2026","Maria Fuentes","Vijay G|Astir","High","(732) 875-6549","msfuentes@hotmail.com","TN",15,80,"Hourly","Philadelphia","Java Developer"],
    ["06/24/2026","Srikant Manchana","Rithvik S|Astir","High","(310) 721-5583","srikant.manchana@gmail.com","H1 Transfer",16,90,"Hourly","Los Angeles","Senior / Lead Database & Data Engineer"],
    ["06/24/2026","Haripriya Rao","Talapalli Lahari|Astir","Medium","(248) 954-1115","Haripriya9289@gmail.com","H4 EAD",8,55,"Hourly","Edison","Enterprise Business Analyst"],
    ["06/24/2026","Nitin Rai","Venkatesh B|Astir","High","(310) 916-7652","nrai8283@gmail.com","H1B(W2)",10,60,"Hourly","Dallas","QA tester"],
    ["06/24/2026","Rishi Korrapolu","Kalyan K|Astir","High","(201) 985-4221","rishikorrapolu@outlook.com","H1B(W2)",7,65,"Hourly","Edison","Automated QA"]
  ].map(function (r, i) {
    return { id: i, date: r[0], consultant: r[1], rm: r[2], priority: r[3], phone: r[4], email: r[5], visa: r[6], exp: r[7], rate: r[8], rtype: r[9], location: r[10], tech: r[11], inactive: false };
  });

  try {
    JSON.parse(localStorage.getItem("astirNewConsultants") || "[]").forEach(function (c) { rows.unshift(c); });
  } catch (e) {}
  rows.forEach(function (r, i) { r.id = i; r.orig = r.email; });
  try {
    var ce = JSON.parse(localStorage.getItem("astirConsultantEdits") || "{}");
    rows.forEach(function (r) { if (ce[r.orig]) Object.assign(r, ce[r.orig]); });
  } catch (e) {}
  var nextId = rows.length, rmSel = "all", sortKey = null, sortDir = 1, page = 1, editingId = null;
  var $ = function (id) { return document.getElementById(id); };
  var searchBox = document.querySelector(".topbar-search input");
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function iso(d) { return d.slice(6) + d.slice(0, 2) + d.slice(3, 5); }
  function rmName(k) { return k.split("|")[0]; }
  function today() { var d = new Date(); return ("0"+(d.getMonth()+1)).slice(-2)+"/"+("0"+d.getDate()).slice(-2)+"/"+d.getFullYear(); }

  // ---- RM searchable dropdown ----
  function drawRm(filter) {
    var f = (filter || "").toLowerCase();
    var items = [{ key: "all", label: "--All--" }].concat(rms).filter(function (r) { return r.label.toLowerCase().indexOf(f) > -1; });
    $("rmList").innerHTML = items.map(function (r) {
      return '<li data-key="' + esc(r.key) + '" class="' + (r.key === rmSel ? "selected" : "") + '">' + esc(r.label) + "</li>";
    }).join("");
  }
  $("rmBtn").addEventListener("click", function () {
    $("rmPanel").classList.toggle("d-none"); $("rmSearch").value = ""; drawRm(""); $("rmSearch").focus();
  });
  $("rmSearch").addEventListener("input", function () { drawRm(this.value); });
  $("rmList").addEventListener("click", function (e) {
    var li = e.target.closest("li"); if (!li) return;
    rmSel = li.dataset.key; $("rmLabel").textContent = li.textContent; $("rmPanel").classList.add("d-none"); page = 1; render();
  });
  document.addEventListener("click", function (e) { if (!$("rmDd").contains(e.target)) $("rmPanel").classList.add("d-none"); });

  function visible() {
    var q = (searchBox && searchBox.value || "").trim().toLowerCase();
    var list = rows.filter(function (r) {
      if (!$("includeInactive").checked && r.inactive) return false;
      if (rmSel !== "all" && r.rm !== rmSel) return false;
      return !q || [r.consultant, rmName(r.rm), r.email, r.tech, r.location, r.visa].join(" ").toLowerCase().indexOf(q) > -1;
    });
    if (sortKey) list.sort(function (a, b) {
      var x, y;
      if (sortKey === "date") { x = iso(a.date); y = iso(b.date); }
      else if (sortKey === "priority") { x = PRI[a.priority]; y = PRI[b.priority]; }
      else if (sortKey === "rm") { x = rmName(a.rm).toLowerCase(); y = rmName(b.rm).toLowerCase(); }
      else { x = String(a[sortKey]).toLowerCase(); y = String(b[sortKey]).toLowerCase(); }
      return (x > y ? 1 : x < y ? -1 : 0) * sortDir;
    });
    return list;
  }

  function render() {
    var list = visible(), total = list.length, pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (page > pages) page = pages;
    var start = (page - 1) * PAGE_SIZE, slice = list.slice(start, start + PAGE_SIZE);
    $("hotBody").innerHTML = slice.length ? slice.map(function (r) {
      return '<tr class="' + (r.inactive ? "row-inactive" : "") + '"><td>' + r.date + '</td><td><a href="#" class="consultant" data-act="edit" data-id="' + r.id + '">' + esc(r.consultant) +
        "</a></td><td>" + esc(rmName(r.rm)) + "</td><td>" + r.priority + '</td><td class="phone">' + esc(r.phone) + "</td><td>" + esc(r.email) + "</td><td>" + esc(r.visa) +
        "</td><td>" + r.exp + "</td><td>$" + r.rate + "/" + r.rtype + "</td><td>" + esc(r.location) + "</td><td>" + esc(r.tech) +
        '</td><td class="actions-col users-table d-flex"><button class="act-link d-flex" data-act="edit" data-id="' + r.id + '"><i class="bi bi-pencil-fill"></i>Edit</button>' +
        '<button class="act-link danger d-flex" data-act="toggle" data-id="' + r.id + '"><i class="bi ' + (r.inactive ? "bi-check-circle" : "bi-slash-circle") + '"></i>' + (r.inactive ? "Activate" : "InActivate") + "</button></td></tr>";
    }).join("") : '<tr><td colspan="12" class="text-center text-muted py-4">No consultants found.</td></tr>';
    $("showingText").textContent = total ? "Showing " + (start + 1) + " to " + (start + slice.length) + " of " + total + " entries" : "Showing 0 entries";
    var h = '<button id="prevPg" ' + (page === 1 ? "disabled" : "") + '><i class="bi bi-chevron-left"></i></button>';
    for (var p = 1; p <= pages; p++) h += '<button data-pg="' + p + '" class="' + (p === page ? "active" : "") + '">' + p + "</button>";
    $("pager").innerHTML = h + '<button id="nextPg" ' + (page === pages ? "disabled" : "") + '><i class="bi bi-chevron-right"></i></button>';
  }

  $("pager").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    page = b.id === "prevPg" ? page - 1 : b.id === "nextPg" ? page + 1 : +b.dataset.pg; render();
  });
  document.querySelectorAll("th.sortable").forEach(function (th) {
    th.addEventListener("click", function () { sortDir = sortKey === th.dataset.key ? -sortDir : 1; sortKey = th.dataset.key; render(); });
  });
  $("includeInactive").addEventListener("change", function () { page = 1; render(); });
  if (searchBox) searchBox.addEventListener("input", function () { page = 1; render(); });

  // ---- edit (opens the Edit Consultant page) / inactivate ----
  $("hotBody").addEventListener("click", function (e) {
    var el = e.target.closest("[data-act]"); if (!el) return; e.preventDefault();
    var r = rows.filter(function (x) { return x.id === +el.dataset.id; })[0];
    if (el.dataset.act === "toggle") { r.inactive = !r.inactive; render(); return; }
    location.href = "edit-consultant.html?" + new URLSearchParams({ orig: r.orig, email: r.email, name: r.consultant, rm: r.rm, priority: r.priority, phone: r.phone,
      visa: r.visa, exp: r.exp, rate: r.rate, rtype: r.rtype, city: r.location, tech: r.tech, date: r.date });
  });

  // ---- CSV download of the current (filtered) list ----
  $("downloadBtn").addEventListener("click", function () {
    var head = ["Assigned Date","Consultant","RM Name","Priority","Phone","Email","Visa","Year of Exp","Rate","Rate Type","Location","Technology"];
    var lines = [head].concat(visible().map(function (r) { return [r.date, r.consultant, rmName(r.rm), r.priority, r.phone, r.email, r.visa, r.exp, r.rate, r.rtype, r.location, r.tech]; }));
    var csv = lines.map(function (l) { return l.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(","); }).join("\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "hotlist.csv"; a.click(); URL.revokeObjectURL(a.href);
  });

  render();
});
