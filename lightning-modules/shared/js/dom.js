/* ============================================================
   Shared DOM/date utilities used by every module's components.
   Plain global namespace (window.LM) to match this project's
   existing script-tag convention — no bundler, no ES modules.
   ============================================================ */

window.LM = window.LM || {};

(function (LM) {
  "use strict";

  LM.el = function el(tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    for (var k in attrs) {
      if (k === "class") node.className = attrs[k];
      else if (k === "html") node.innerHTML = attrs[k];
      else if (k.indexOf("on") === 0 && typeof attrs[k] === "function") node.addEventListener(k.slice(2), attrs[k]);
      else node.setAttribute(k, attrs[k]);
    }
    (children || []).forEach(function (c) {
      if (c === null || c === undefined) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  };

  LM.addDaysIso = function addDaysIso(iso, days) {
    var d = new Date(iso + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
  };

  LM.formatDate = function formatDate(iso) {
    var d = new Date(iso + "T00:00:00Z");
    return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric", timeZone: "UTC" });
  };

  // Adds a drag handle to the right edge of every header cell in `table`
  // (which must have a <colgroup> with one <col> per header cell) so users
  // can resize columns. `onCommit(widthsInPx)` fires once per drag, on
  // mouseup, so callers can persist the new widths (re-renders otherwise
  // wipe them, since these apps rebuild their DOM from scratch each time).
  LM.enableColumnResize = function enableColumnResize(table, onCommit) {
    var colgroup = table.querySelector("colgroup");
    var headRow = table.querySelector("thead tr");
    if (!colgroup || !headRow) return;
    var cols = colgroup.children;
    var ths = headRow.children;
    var count = Math.min(cols.length, ths.length);

    var loop = function (index) {
      var th = ths[index];
      th.style.position = "relative";
      var handle = document.createElement("span");
      handle.className = "sf-col-resizer";
      th.appendChild(handle);

      handle.addEventListener("mousedown", function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Snapshot every column's current rendered width to px first, so the
        // drag doesn't fight the table's percentage-based layout.
        for (var j = 0; j < count; j++) {
          cols[j].style.width = ths[j].getBoundingClientRect().width + "px";
        }

        var startX = e.clientX;
        var startWidth = cols[index].getBoundingClientRect().width;

        function onMove(ev) {
          var next = Math.max(36, startWidth + (ev.clientX - startX));
          cols[index].style.width = next + "px";
        }
        function onUp() {
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup", onUp);
          if (onCommit) {
            var widths = [];
            for (var k = 0; k < count; k++) widths.push(parseFloat(cols[k].style.width));
            onCommit(widths);
          }
        }
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
      });
    };

    for (var i = 0; i < count; i++) loop(i);
  };

  // Builds a <table class="sf-table"> that persists and restores column
  // widths from `widthsStore[tableKey]` — every table in these apps goes
  // through this so widths survive the state-driven rebuild-from-scratch
  // re-render. Tables sharing a tableKey (e.g. a data table and its
  // separate totals-row table) resize in lock-step. Pass `thead` as null
  // for a headless totals table — it still gets saved widths applied, it
  // just has no header cells to hang a drag handle off of.
  LM.resizableTable = function resizableTable(widthsStore, tableKey, colgroup, thead, tbody, extraClass) {
    var cls = extraClass ? "sf-table " + extraClass : "sf-table";
    var children = thead ? [colgroup, thead, tbody] : [colgroup, tbody];
    var table = LM.el("table", { class: cls }, children);
    var savedWidths = widthsStore[tableKey];
    if (savedWidths) {
      var cols = colgroup.children;
      for (var i = 0; i < cols.length && i < savedWidths.length; i++) {
        cols[i].style.width = savedWidths[i] + "px";
      }
    }
    LM.enableColumnResize(table, function (widths) {
      widthsStore[tableKey] = widths;
    });
    return table;
  };
})(window.LM);
