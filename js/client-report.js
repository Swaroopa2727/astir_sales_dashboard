// Client Report — shared by pages/client-report.html and the Client Report tab on the dashboard.
// Demo data is in memory; replace CLIENT_ROWS / the filter logic with your API.
(function () {
  var PAGE_SIZE = 10;
  // company, vendor, client, submissions, interviews, confirmations, placements
  var CLIENT_ROWS = [
    ["Astir","4-serveinc","UBS",1,0,0,0],
    ["Astir","Aayog solutions LLC","Morgan Stanley",0,1,0,0],
    ["Astir","Ab2 consulting","Medline",1,0,0,0],
    ["Astir","ABSLI","Deloitte/Humana",1,0,0,0],
    ["Astir","Accelyst, LLC","IBM",1,0,0,0],
    ["Astir","Ace infotech","State of FL",1,0,0,0],
    ["Astir","ACS Consultancy Services","MTA",1,0,0,0],
    ["Astir","ACS Consultancy Services, Inc","Information Technology Services (ITS) Albany, NY",1,0,0,0],
    ["Astir","Aether Talent Solutions LLC","fujitsu",1,1,0,0],
    ["Astir","AgreeYa Solutions","Metropolitan Transportation Corporation",1,0,0,0],
    ["Astir","Apex Systems","Wells Fargo",4,1,0,0],
    ["Astir","Beacon Hill Staffing","Cigna",2,0,0,0],
    ["Astir","Compunnel Inc","Verizon",6,2,1,0],
    ["Astir","Dexian","Capital One",3,1,0,0],
    ["Astir","Diverse Lynx","Bank of America",5,1,0,1],
    ["Astir","Infojini Inc","State of NJ",2,0,0,0],
    ["Astir","Judge Group","Comcast",1,0,0,0],
    ["Astir","Kforce Inc","Humana",7,2,0,0],
    ["Astir","Mastech Digital","Citi",3,1,0,0],
    ["Astir","NTT Data","Deloitte",8,3,1,0],
    ["Astir","Randstad Digital","Anthem",4,1,0,0],
    ["Astir","Sapient Technologies","Fidelity",2,0,0,0],
    ["Astir","TEKsystems","AT&T",12,4,0,1],
    ["Astir","Vaco","Cognizant",5,2,0,0],
    ["Astir","Yoh Services","Pfizer",3,1,0,0],
    ["Advent Infotech","Global Data Solutions","Walmart",4,1,0,0],
    ["Advent Infotech","Prime Tech Partners","Kroger",2,0,0,0],
    ["Advent Infotech","Sysmind LLC","Target",3,1,1,0],
    ["Advent Infotech","Zenith IT Staffing","Best Buy",1,0,0,0]
  ];

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }

  function mount(root, getCompany) {
    var body = root.querySelector("[data-cr-body]"), showing = root.querySelector("[data-cr-showing]"), pager = root.querySelector("[data-cr-pager]");
    var searchBox = document.querySelector(".topbar-search input");
    var page = 1;

    function visible() {
      var company = getCompany ? getCompany() : "all", q = (searchBox && searchBox.value || "").trim().toLowerCase();
      return CLIENT_ROWS.filter(function (r) {
        if (company !== "all" && r[0] !== company) return false;
        return !q || (r[1] + " " + r[2]).toLowerCase().indexOf(q) > -1;
      });
    }
    function render() {
      var list = visible(), total = list.length, pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
      if (page > pages) page = pages;
      var start = (page - 1) * PAGE_SIZE, slice = list.slice(start, start + PAGE_SIZE);
      body.innerHTML = slice.length ? slice.map(function (r) {
        return "<tr><td>" + esc(r[0]) + "</td><td>" + esc(r[1]) + "</td><td>" + esc(r[2]) + '</td><td class="num">' + r[3] + '</td><td class="num">' + r[4] + '</td><td class="num">' + r[5] + '</td><td class="num">' + r[6] + "</td></tr>";
      }).join("") : '<tr><td colspan="7" class="text-center text-muted py-4">No clients found.</td></tr>';
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
        var lines = [["Company","Vendor","Client","Submissions","Interviews","Confirmations","Placements"]].concat(visible());
        var csv = lines.map(function (l) { return l.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(","); }).join("\n");
        var a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "client-report.csv"; a.click(); URL.revokeObjectURL(a.href);
      }
    };
  }
  window.ClientReport = { mount: mount };
})();
