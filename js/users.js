// Users page — filter, search, sort, paginate, add/edit/inactivate (in-memory demo data)
document.addEventListener("DOMContentLoaded", function () {
  var PAGE_SIZE = 25;
  var users = [
    ["Advent Infotech","Krishna","krishna@adventinfotech.com","Dashboard User","11/08/2024"],
    ["Advent Infotech","Arshad","arshad@adventinfotech.com","Bench Sales","09/17/2025"],
    ["Advent Infotech","Keerthana V","keerthana@adventinfotech.com","Bench Sales","05/01/2024"],
    ["Advent Infotech","Lahari","lahari@adventinfotech.com","Bench Sales","09/17/2025"],
    ["Advent Infotech","Srivani","sivani@adventinfotech.com","Bench Sales","09/17/2025"],
    ["Astir","Arshad","arshadp@astirit.com","Bench Sales","08/24/2026"],
    ["Astir","Asheesh Boddu","asheeshb@astirit.com","Bench Sales","02/17/2026"],
    ["Astir","Harish J","harishj@astirit.com","Third Party Sales","01/01/2024"],
    ["Astir","Hemanth Matta","hemanthm@astirit.com","Bench Sales","03/17/2026"],
    ["Astir","Keerthana","keerthanav@astirit.com","Bench Sales","03/05/2026"],
    ["Astir","Kiran P","kiranp@astirit.com","Bench Sales","01/01/2024"],
    ["Astir","Likhita Sri Anjani Vissa","likhitav@astirit.com","Third Party Sales","02/17/2026"],
    ["Astir","Manepalli Kumar Sai Bharath","bharathm@astirit.com","Third Party Sales","06/02/2026"],
    ["Astir","Rithvik S","rithvik@astirit.com","Bench Sales","01/01/2024"],
    ["Astir","Saibabu Relangi","sair@astirit.com","Third Party Sales","01/16/2026"],
    ["Astir","Shashikumar Marapelly","shashim@astirit.com","Bench Sales","04/17/2025"],
    ["Astir","Sivani Budithi","sivanib@astirit.com","Bench Sales","08/19/2025"],
    ["Astir","Talapalli Lahari","laharit@astirit.com","Bench Sales","01/08/2025"],
    ["Astir","Tarak K","tarakk@astirit.com","Third Party Sales","01/01/2024"],
    ["Astir","Vangireddy Pavithra Devi","pavithrav@astirit.com","Bench Sales","01/08/2025"],
    ["Astir","Venkatesh B","venkatb@astirit.com","Bench Sales","08/19/2025"],
    ["Astir","Vijay G","vijayg@astirit.com","Bench Sales","01/01/2024"]
  ].map(function (u, i) {
    return { id: i, company: u[0], name: u[1], email: u[2], type: u[3], created: u[4], inactive: "" };
  });

  try {
    var edits = JSON.parse(localStorage.getItem("astirUserEdits") || "{}");
    users.forEach(function (u) { if (edits[u.id]) Object.assign(u, edits[u.id]); });
  } catch (e) {}
  var nextId = users.length, sortKey = null, sortDir = 1, page = 1, editingId = null;
  var $ = function (id) { return document.getElementById(id); };
  var body = $("usersBody"), companySel = $("companyFilter"), inclInactive = $("includeInactive");
  var searchBox = document.querySelector(".topbar-search input");

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function iso(d) { return d ? d.slice(6) + d.slice(0, 2) + d.slice(3, 5) : ""; }
  function today() { var d = new Date(); return ("0"+(d.getMonth()+1)).slice(-2)+"/"+("0"+d.getDate()).slice(-2)+"/"+d.getFullYear(); }

  function visible() {
    var q = (searchBox && searchBox.value || "").trim().toLowerCase();
    var list = users.filter(function (u) {
      if (!inclInactive.checked && u.inactive) return false;
      if (companySel.value !== "all" && u.company !== companySel.value) return false;
      return !q || (u.name + " " + u.email + " " + u.company).toLowerCase().indexOf(q) > -1;
    });
    if (sortKey) list.sort(function (a, b) {
      var x = sortKey === "created" || sortKey === "inactive" ? iso(a[sortKey]) : a[sortKey].toLowerCase();
      var y = sortKey === "created" || sortKey === "inactive" ? iso(b[sortKey]) : b[sortKey].toLowerCase();
      return (x > y ? 1 : x < y ? -1 : 0) * sortDir;
    });
    return list;
  }

  function render() {
    var list = visible(), total = list.length, pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (page > pages) page = pages;
    var start = (page - 1) * PAGE_SIZE, rows = list.slice(start, start + PAGE_SIZE);
    body.innerHTML = rows.length ? rows.map(function (u) {
      return '<tr class="' + (u.inactive ? "row-inactive" : "") + '"><td>' + esc(u.company) + "</td><td>" + esc(u.name) +
        "</td><td>" + esc(u.email) + "</td><td>" + esc(u.type) + "</td><td>" + u.created + "</td><td>" + u.inactive +
        '</td><td class="actions-col"><button class="act-link" data-act="edit" data-id="' + u.id + '"><i class="bi bi-pencil-fill"></i>Edit</button>' +
        '<button class="act-link' + (u.inactive ? "" : " danger") + '" data-act="toggle" data-id="' + u.id + '"><i class="bi ' +
        (u.inactive ? "bi-check-circle" : "bi-slash-circle") + '"></i>' + (u.inactive ? "Activate" : "InActivated") + "</button></td></tr>";
    }).join("") : '<tr><td colspan="7" class="text-center text-muted py-4">No users found.</td></tr>';

    $("showingText").textContent = total ? "Showing " + (start + 1) + " to " + (start + rows.length) + " of " + total + " entries" : "Showing 0 entries";
    var h = '<button id="prevPg" ' + (page === 1 ? "disabled" : "") + '><i class="bi bi-chevron-left"></i></button>';
    for (var p = 1; p <= pages; p++) h += '<button data-pg="' + p + '" class="' + (p === page ? "active" : "") + '">' + p + "</button>";
    $("pager").innerHTML = h + '<button id="nextPg" ' + (page === pages ? "disabled" : "") + '><i class="bi bi-chevron-right"></i></button>';
  }

  $("pager").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    page = b.id === "prevPg" ? page - 1 : b.id === "nextPg" ? page + 1 : +b.dataset.pg; render();
  });
  document.querySelectorAll("th.sortable").forEach(function (th) {
    th.addEventListener("click", function () {
      sortDir = sortKey === th.dataset.key ? -sortDir : 1; sortKey = th.dataset.key; render();
    });
  });
  [companySel, inclInactive].forEach(function (el) { el.addEventListener("change", function () { page = 1; render(); }); });
  if (searchBox) searchBox.addEventListener("input", function () { page = 1; render(); });

  body.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-act]"); if (!b) return;
    var u = users.filter(function (x) { return x.id === +b.dataset.id; })[0];
    if (b.dataset.act === "toggle") { u.inactive = u.inactive ? "" : today(); render(); }
    else location.href = "edit-user.html?" + new URLSearchParams({ id: u.id, name: u.name, email: u.email, type: u.type, company: u.company });
  });

  render();
});
