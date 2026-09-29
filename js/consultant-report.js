// Consultant Report — shared by pages/consultant-report.html and the Consultant Report tab on the dashboard.
// Demo data is in memory; replace CONSULTANT_ROWS / the filter logic with your API.
(function () {
  var PAGE_SIZE = 10;
  // consultant, company, RM, activity, date, vendor, client, rate
  var CONSULTANT_ROWS = [
    ["Abishake Thakallapelli","Astir","Vangireddy Pavithra Devi","Submissions","08/04/2026","srivensys","TCS - Remote","$55/Hourly"],
    ["Abishake Thakallapelli","Astir","Vangireddy Pavithra Devi","Submissions","08/19/2026","Vbeyond","Movate/Target","$62/Hourly"],
    ["Aparna M","Astir","Talapalli Lahari","Submissions","08/19/2026","Enterprise Solutions, Inc.","LTM","$70/Hourly"],
    ["Aparna M","Astir","Talapalli Lahari","Submissions","08/19/2026","Sparinfosystems","UST Global/Elevance Health(Anthem)","$70/Hourly"],
    ["Aparna M","Astir","Sivani Budithi","Submissions","08/19/2026","Valzo Soft Solutions LLC","TCS/Healthcare","$75/Hourly"],
    ["Aparna M","Astir","Arshad","Submissions","08/17/2026","Applab System Inc,","Wipro","$68/Hourly"],
    ["Aparna M","Astir","Hemanth Matta","Submissions","08/17/2026","ConfigUSA Inc","TCS / Banking client","$70/Hourly"],
    ["Aparna M","Astir","Kiran P","Submissions","08/18/2026","TEKsystems","Liberty Mutual","$73/Hourly"],
    ["Aparna M","Astir","Talapalli Lahari","Submissions","08/17/2026","Galent","Mphasis / Morgan Stanley","$72/Hourly"],
    ["Rithvik S","Astir","Sivani Budithi","Submissions","08/21/2026","Cognizant","BCBS","$65/Hourly"],
    ["Rithvik S","Astir","Sivani Budithi","Interviews","08/24/2026","Cognizant","BCBS","$65/Hourly"],
    ["Nitin Rai","Astir","Venkatesh B","Submissions","08/10/2026","Apex Systems","Wells Fargo","$60/Hourly"],
    ["Nitin Rai","Astir","Venkatesh B","Interviews","08/13/2026","Apex Systems","Wells Fargo","$60/Hourly"],
    ["Srikant Manchana","Astir","Rithvik S","Submissions","08/06/2026","Compunnel Inc","Verizon","$90/Hourly"],
    ["Srikant Manchana","Astir","Rithvik S","Confirmations","08/20/2026","Compunnel Inc","Verizon","$90/Hourly"],
    ["Maria Fuentes","Astir","Vijay G","Submissions","08/12/2026","Kforce Inc","Humana","$80/Hourly"],
    ["Maria Fuentes","Astir","Vijay G","Interviews","08/18/2026","Kforce Inc","Humana","$80/Hourly"],
    ["Haripriya Rao","Astir","Talapalli Lahari","Submissions","08/05/2026","Dexian","Capital One","$55/Hourly"],
    ["Haripriya Rao","Astir","Talapalli Lahari","Placements","08/26/2026","Dexian","Capital One","$55/Hourly"],
    ["Kiran Lamkb","Astir","Kiran P","Submissions","08/25/2026","TEKsystems","AT&T","$63/Hourly"],
    ["Rishi Korrapolu","Astir","Kiran P","Submissions","08/14/2026","NTT Data","Deloitte","$65/Hourly"],
    ["Rishi Korrapolu","Astir","Kiran P","Interviews","08/21/2026","NTT Data","Deloitte","$65/Hourly"],
    ["Priya Nair","Astir","Hemanth Matta","Submissions","08/11/2026","Diverse Lynx","Bank of America","$68/Hourly"],
    ["Suresh Babu","Advent Infotech","Keerthana V","Submissions","08/07/2026","Global Data Solutions","Walmart","$58/Hourly"],
    ["Suresh Babu","Advent Infotech","Keerthana V","Interviews","08/14/2026","Global Data Solutions","Walmart","$58/Hourly"]
  ];
  var ACT = { Submissions: 1, Interviews: 2, Confirmations: 3, Placements: 4 };
  var COLS = ["consultant","company","rm","activity","date","vendor","client","rate"];
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function iso(d) { return d.slice(6) + d.slice(0, 2) + d.slice(3, 5); }

  function mount(root, getCompany) {
    var body = root.querySelector("[data-cr-body]"), showing = root.querySelector("[data-cr-showing]"), pager = root.querySelector("[data-cr-pager]");
    var searchBox = document.querySelector(".topbar-search input");
    var page = 1, sortKey = null, sortDir = 1;

    function visible() {
      var company = getCompany ? getCompany() : "all", q = (searchBox && searchBox.value || "").trim().toLowerCase();
      var list = CONSULTANT_ROWS.filter(function (r) {
        if (company !== "all" && r[1] !== company) return false;
        return !q || r.join(" ").toLowerCase().indexOf(q) > -1;
      });
      if (sortKey !== null) list.sort(function (a, b) {
        var x, y;
        if (sortKey === 4) { x = iso(a[4]); y = iso(b[4]); }
        else if (sortKey === 3) { x = ACT[a[3]]; y = ACT[b[3]]; }
        else { x = a[sortKey].toLowerCase(); y = b[sortKey].toLowerCase(); }
        return (x > y ? 1 : x < y ? -1 : 0) * sortDir;
      });
      return list;
    }
    function render() {
      var list = visible(), total = list.length, pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
      if (page > pages) page = pages;
      var start = (page - 1) * PAGE_SIZE, slice = list.slice(start, start + PAGE_SIZE);
      body.innerHTML = slice.length ? slice.map(function (r) {
        return "<tr><td class='strong'>" + esc(r[0]) + "</td><td class='strong ctr'>" + esc(r[1]) + "</td><td class='strong ctr'>" + esc(r[2]) + "</td><td class='ctr'>" + r[3] +
          "</td><td class='ctr'>" + r[4] + "</td><td class='ctr'>" + esc(r[5]) + "</td><td class='ctr'>" + esc(r[6]) + "</td><td class='ctr'>" + esc(r[7]) + "</td></tr>";
      }).join("") : '<tr><td colspan="8" class="text-center text-muted py-4">No consultants found.</td></tr>';
      showing.textContent = total ? "Showing " + (start + 1) + " to " + (start + slice.length) + " of " + total + " entries" : "Showing 0 entries";
      var h = '<button data-pg="prev" ' + (page === 1 ? "disabled" : "") + '><i class="bi bi-chevron-left"></i></button>';
      for (var p = 1; p <= pages; p++) h += '<button data-pg="' + p + '" class="' + (p === page ? "active" : "") + '">' + p + "</button>";
      pager.innerHTML = h + '<button data-pg="next" ' + (page === pages ? "disabled" : "") + '><i class="bi bi-chevron-right"></i></button>';
    }
    pager.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b || b.disabled) return;
      var v = b.dataset.pg; page = v === "prev" ? page - 1 : v === "next" ? page + 1 : +v; render();
    });
    root.querySelectorAll("th[data-col]").forEach(function (th) {
      th.addEventListener("click", function () {
        var k = +th.dataset.col; sortDir = sortKey === k ? -sortDir : 1; sortKey = k; render();
      });
    });
    if (searchBox) searchBox.addEventListener("input", function () { page = 1; render(); });
    render();
    return {
      refresh: function () { page = 1; render(); },
      exportCsv: function () {
        var lines = [["Consultant","Company","RM Name","Activity","Date","Vendor","Client","Rate"]].concat(visible());
        var csv = lines.map(function (l) { return l.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(","); }).join("\n");
        var a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "consultant-report.csv"; a.click(); URL.revokeObjectURL(a.href);
      }
    };
  }
  window.ConsultantReport = { mount: mount };
})();
