// Targets Report — shared by pages/targets-report.html and the Targets Report tab on the dashboard.
// Demo data is in memory; replace TARGETS_ROWS / the filter logic with your API.
(function () {
  var PAGE_SIZE = 10;
  // company, RM, then [target, result] for Submissions, Interviews, Confirmations, Placements, MSA
  var TARGETS_ROWS = [
    ["Astir","Arshad",0,0,0,0,0,0,0,0,0,0],
    ["Astir","Asheesh Boddu",0,21,0,0,0,0,0,0,0,0],
    ["Astir","Hemanth Matta",0,30,0,4,0,0,0,0,0,0],
    ["Astir","Keerthana",0,0,0,0,0,0,0,0,0,0],
    ["Astir","Kiran P",60,22,10,5,2,0,1,0,2,0],
    ["Astir","Rithvik S",60,25,7,3,2,1,1,0,2,0],
    ["Astir","Shashikumar Marapelly",0,30,0,5,0,0,0,0,0,0],
    ["Astir","Sivani Budithi",0,43,0,8,0,0,0,0,0,0],
    ["Astir","Talapalli Lahari",25,50,3,8,0,0,0,0,1,0]
  ];
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }

  function mount(root, getCompany) {
    var body = root.querySelector("[data-cr-body]"), showing = root.querySelector("[data-cr-showing]"), pager = root.querySelector("[data-cr-pager]");
    var searchBox = document.querySelector(".topbar-search input");
    var page = 1;
    function visible() {
      var company = getCompany ? getCompany() : "all", q = (searchBox && searchBox.value || "").trim().toLowerCase();
      return TARGETS_ROWS.filter(function (r) {
        return (company === "all" || r[0] === company) && (!q || r[1].toLowerCase().indexOf(q) > -1);
      });
    }
    function render() {
      var list = visible(), total = list.length, pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
      if (page > pages) page = pages;
      var start = (page - 1) * PAGE_SIZE, slice = list.slice(start, start + PAGE_SIZE);
      body.innerHTML = slice.length ? slice.map(function (r) {
        return "<tr><td class='strong'>" + esc(r[0]) + "</td><td class='strong'>" + esc(r[1]) + "</td>" + r.slice(2).map(function (n) { return "<td class='num'>" + n + "</td>"; }).join("") + "</tr>";
      }).join("") : '<tr><td colspan="12" class="text-center text-muted py-4">No targets found.</td></tr>';
      showing.textContent = total ? "Showing " + (start + 1) + " to " + (start + slice.length) + " of " + total + " entries" : "Showing 0 entries";
      var h = '<button data-pg="prev" ' + (page === 1 ? "disabled" : "") + '><i class="bi bi-chevron-left"></i></button>';
      for (var p = 1; p <= pages; p++) h += '<button data-pg="' + p + '" class="' + (p === page ? "active" : "") + '">' + p + "</button>";
      pager.innerHTML = h + '<button data-pg="next" ' + (page === pages ? "disabled" : "") + '><i class="bi bi-chevron-right"></i></button>';
    }
    pager.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b || b.disabled) return;
      var v = b.dataset.pg; page = v === "prev" ? page - 1 : v === "next" ? page + 1 : +v; render();
    });
    if (searchBox) searchBox.addEventListener("input", function () { page = 1; render(); });
    render();
    return {
      refresh: function () { page = 1; render(); },
      exportCsv: function () {
        var head = ["Company","RM Name"];
        ["Submissions","Interviews","Confirmations","Placements","MSA"].forEach(function (g) { head.push(g + " Targets", g + " Results"); });
        var csv = [head].concat(visible()).map(function (l) { return l.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(","); }).join("\n");
        var a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "targets-report.csv"; a.click(); URL.revokeObjectURL(a.href);
      }
    };
  }
  window.TargetsReport = { mount: mount };
})();
