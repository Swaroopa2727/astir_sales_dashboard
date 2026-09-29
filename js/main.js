// =========================================================
// Sidebar toggle (desktop collapse + mobile off-canvas)
// =========================================================
document.addEventListener("DOMContentLoaded", function () {
  var body = document.body;
  var toggleBtn = document.getElementById("sidebarToggle");

  // Logout returns to the sign-in page
  var logoutBtn = document.querySelector(".btn-logout");
  if (logoutBtn) logoutBtn.addEventListener("click", function () { window.location.href = "login.html"; });
  var backdrop = document.getElementById("sidebarBackdrop");

  function isMobile() {
    return window.innerWidth < 992;
  }

  toggleBtn.addEventListener("click", function () {
    if (isMobile()) {
      body.classList.toggle("sidebar-mobile-open");
    } else {
      body.classList.toggle("sidebar-collapsed");
    }
  });

  if (backdrop) {
    backdrop.addEventListener("click", function () {
      body.classList.remove("sidebar-mobile-open");
    });
  }

  window.addEventListener("resize", function () {
    if (!isMobile()) {
      body.classList.remove("sidebar-mobile-open");
    }
  });

  // =========================================================
  // Chart.js — shared palette
  // =========================================================
  var palette = {
    teal: "#16b3a3",
    orange: "#f5a623",
    pink: "#e0507a",
    green: "#2fa86a",
    gridColor: "#eef1f6",
    textMuted: "#6b7686"
  };

  var ChartConstructor = window.Chart;
  if (ChartConstructor) {
    ChartConstructor.defaults.font.family = "Inter, 'Segoe UI', Arial, sans-serif";
    ChartConstructor.defaults.color = palette.textMuted;
  }

  // ---- Weekly doughnut charts ----
  var weeklyData = [
    { id: "week1Chart", value: 85 },
    { id: "week2Chart", value: 90 },
    { id: "week3Chart", value: 88 },
    { id: "week4Chart", value: 86 }
  ];

  weeklyData.forEach(function (week) {
    var el = document.getElementById(week.id);
    if (!el) return;
    if (window.Highcharts) {
      Highcharts.chart(el, {
        chart: {
          type: "pie",
          backgroundColor: "transparent",
          options3d: { enabled: true, alpha: 55, beta: 0, depth: 28, viewDistance: 25 },
          height: 150,
          spacing: [0, 0, 0, 0]
        },
        title: { text: null },
        credits: { enabled: false },
        accessibility: { enabled: true },
        tooltip: { pointFormat: "<b>{point.y}%</b>" },
        plotOptions: {
          pie: {
            allowPointSelect: false,
            cursor: "pointer",
            depth: 28,
            dataLabels: { enabled: false },
            showInLegend: false
          }
        },
        series: [{
          name: "Sales",
          data: [
            { name: "Completed", y: week.value, color: palette.teal },
            { name: "Remaining", y: 100 - week.value, color: palette.orange }
          ]
        }]
      });
    } else if (ChartConstructor) {
      new ChartConstructor(el, {
        type: "doughnut",
        data: { datasets: [{ data: [week.value, 100 - week.value], backgroundColor: [palette.teal, palette.orange], borderWidth: 0, cutout: "72%" }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } } }
      });
    }
  });

  // =========================================================
  // ECharts-GL — 3D Monthly Sales (extruded bar chart)
  // =========================================================
  var monthlyEl = document.getElementById("monthlySales3D");
  var monthlyChart3D = null;
  if (monthlyEl && window.echarts) {
    monthlyChart3D = echarts.init(monthlyEl);

    var monthlyCategories = ["Submissions", "Interviews", "Confirmations", "Placements"];
    var monthlyValues = [298, 38, 2, 4];
    var monthlyColors = [palette.teal, palette.orange, palette.pink, palette.green];

    var monthlyData = monthlyCategories.map(function (name, i) {
      return {
        value: [i, 0, monthlyValues[i]],
        itemStyle: { color: monthlyColors[i] }
      };
    });

    monthlyChart3D.setOption({
      tooltip: {
        formatter: function (p) {
          return monthlyCategories[p.value[0]] + ": <b>" + p.value[2] + "</b>";
        }
      },
      xAxis3D: {
        type: "category",
        data: monthlyCategories,
        axisLabel: { textStyle: { color: "#6b7686", fontSize: 11 } }
      },
      yAxis3D: {
        type: "category",
        data: ["Aug 2026"],
        axisLabel: { show: false }
      },
      zAxis3D: {
        type: "value",
        max: 350,
        axisLabel: { textStyle: { color: "#6b7686" } }
      },
      grid3D: {
        boxWidth: 130,
        boxDepth: 35,
        boxHeight: 75,
        viewControl: {
          alpha: 22,
          beta: 35,
          distance: 190,
          autoRotate: true,
          autoRotateSpeed: 6,
          rotateSensitivity: 1.2,
          zoomSensitivity: 1
        },
        light: {
          main: { intensity: 1.3, shadow: true },
          ambient: { intensity: 0.35 }
        },
        environment: "#ffffff"
      },
      series: [{
        type: "bar3D",
        data: monthlyData,
        shading: "lambert",
        bevelSize: 0.25,
        barSize: 22,
        label: {
          show: true,
          formatter: function (p) { return p.value[2]; },
          textStyle: { fontSize: 12, color: "#1c2a3f" }
        },
        emphasis: { itemStyle: { color: "#1a80ab" } }
      }]
    });
  }

  // =========================================================
  // ECharts-GL — 3D Sales Trend (depth "ridge" line chart)
  // =========================================================
  var trendEl = document.getElementById("salesTrend3D");
  var trendChart3D = null;
  if (trendEl && window.echarts) {
    trendChart3D = echarts.init(trendEl);

    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP"];
    var series = [
      { name: "Submissions", color: palette.teal, data: [255, 270, 305, 265, 280, 300, 260, 305, 90] },
      { name: "Interviews", color: palette.orange, data: [25, 30, 35, 28, 32, 40, 30, 38, 15] },
      { name: "Confirmations", color: palette.pink, data: [3, 4, 5, 3, 4, 5, 3, 2, 1] },
      { name: "Placements", color: palette.green, data: [5, 6, 7, 5, 6, 8, 5, 4, 2] }
    ];
    var seriesNames = series.map(function (s) { return s.name; });

    var trendSeries = series.map(function (s, sIndex) {
      return {
        type: "line3D",
        name: s.name,
        data: s.data.map(function (v, mIndex) { return [mIndex, sIndex, v]; }),
        lineStyle: { color: s.color, width: 4 }
      };
    });

    trendChart3D.setOption({
      tooltip: {
        formatter: function (p) {
          return seriesNames[p.value[1]] + " · " + months[p.value[0]] + ": <b>" + p.value[2] + "</b>";
        }
      },
      xAxis3D: {
        type: "category",
        data: months,
        axisLabel: { textStyle: { color: "#6b7686", fontSize: 11 } }
      },
      yAxis3D: {
        type: "category",
        data: seriesNames,
        axisLabel: { show: false }
      },
      zAxis3D: {
        type: "value",
        max: 350,
        axisLabel: { textStyle: { color: "#6b7686" } }
      },
      grid3D: {
        boxWidth: 140,
        boxDepth: 70,
        boxHeight: 75,
        viewControl: {
          alpha: 20,
          beta: 40,
          distance: 210,
          autoRotate: true,
          autoRotateSpeed: 6,
          rotateSensitivity: 1.2,
          zoomSensitivity: 1
        },
        light: {
          main: { intensity: 1.2, shadow: true },
          ambient: { intensity: 0.4 }
        },
        environment: "#ffffff"
      },
      series: trendSeries
    });
  }

  // Keep 3D charts crisp on resize / sidebar toggle
  window.addEventListener("resize", function () {
    if (monthlyChart3D) monthlyChart3D.resize();
    if (trendChart3D) trendChart3D.resize();
  });
  toggleBtn.addEventListener("click", function () {
    setTimeout(function () {
      if (monthlyChart3D) monthlyChart3D.resize();
      if (trendChart3D) trendChart3D.resize();
    }, 260);
  });
});
