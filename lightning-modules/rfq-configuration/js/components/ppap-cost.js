/* ---------------- Child component: PpapCostSection ---------------- */
window.RFQConfig = window.RFQConfig || {};

(function (RFQConfig, LM) {
  "use strict";

  // Fixed, finite checklist — no add/remove; only the per-component cost
  // cells are user-editable. Same line items as LOT Information, but every
  // row here is a plain INR amount (no Y/N flags), plus a TOTAL COST
  // footer row.
  var PPAP_COST_ITEMS = [
    { key: "projectManagement", label: "PROJECT MANAGEMENT" },
    { key: "rmPlasticGranulesTrial", label: "RM (PLASTIC GRANULERS) & TRIAL" },
    { key: "rmPaintTrial", label: "RM (PAINT) & TRIAL" },
    { key: "partLogisticsBeforeSop", label: "PART LOGISTICS BEFORE SOP" },
    { key: "trialVisitCostDomestic", label: "TRIAL VISIT COST ( DOMESTIC )" },
    { key: "trialVisitCostOverseas", label: "TRIAL VISIT COST ( OVERSEAS )" },
    { key: "toolShipmentCost", label: "TOOL SHIPMENT COST" }
  ];

  var COST_UOM = "INR";

  function findRow(itemKey) {
    var rows = RFQConfig.state.ppapCost.rows;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].key === itemKey) return rows[i];
    }
    return null;
  }

  function updateCost(itemKey, componentId, value) {
    var row = findRow(itemKey);
    if (!row) return;
    row.qtyByComponent[componentId] = value;
    RFQConfig.state.dirty = true;
    RFQConfig.renderApp();
  }

  function sumByComponent(rows, componentId) {
    var total = 0;
    rows.forEach(function (row) {
      var n = parseFloat(row.qtyByComponent[componentId]);
      if (!isNaN(n)) total += n;
    });
    return total;
  }

  function rowTotal(row, components) {
    var total = 0;
    components.forEach(function (c) {
      var n = parseFloat(row.qtyByComponent[c.id]);
      if (!isNaN(n)) total += n;
    });
    return total;
  }

  function ppapColumnTotal(componentId) {
    return sumByComponent(RFQConfig.state.ppapCost.rows, componentId);
  }

  // Reads Design Cost's own state directly rather than importing its
  // internals — Grand Total Cost combines the two sections' TOTAL COST
  // rows, same relationship as Testing's Internal+External Grand Total.
  function designCostColumnTotal(componentId) {
    return sumByComponent(RFQConfig.state.designCost.rows, componentId);
  }

  function derived(text) {
    return LM.el("td", {}, [LM.el("span", { class: "sf-table__derived" }, [text])]);
  }

  function costCell(row, component) {
    var el = LM.el;
    return el("td", {}, [el("input", {
      class: "sf-table__input",
      type: "number",
      min: "0",
      value: row.qtyByComponent[component.id] || "",
      onchange: function (e) { updateCost(row.key, component.id, e.target.value); }
    }, [])]);
  }

  function renderRow(item, index, components) {
    var el = LM.el;
    var row = findRow(item.key);
    return el("tr", {}, [
      el("td", { class: "sf-table__actioncol" }, [el("span", { class: "sf-table__derived" }, [String(index + 1)])]),
      derived(item.label),
      derived(COST_UOM)
    ].concat(components.map(function (c) {
      return costCell(row, c);
    })).concat([
      derived(String(rowTotal(row, components)))
    ]));
  }

  function fixedRow(cssClass, label, componentTotals, overall) {
    var el = LM.el;
    var componentCells = componentTotals.map(function (sum) {
      return el("td", {}, [el("span", { class: "sf-table__fixed-label" }, [String(sum)])]);
    });
    return el("tr", { class: cssClass }, [
      el("td", { class: "sf-table__actioncol" }, []),
      el("td", {}, [el("span", { class: "sf-table__fixed-label" }, [label])]),
      el("td", {}, [el("span", { class: "sf-table__fixed-label" }, [COST_UOM])])
    ].concat(componentCells).concat([
      el("td", {}, [el("span", { class: "sf-table__fixed-label" }, [String(overall)])])
    ]));
  }

  function costingColgroup(components) {
    var el = LM.el;
    var compColWidth = 54 / components.length;
    return el("colgroup", {}, [
      el("col", { class: "sf-table__col--srno" }, []),
      el("col", { style: "width:20%" }, []),
      el("col", { style: "width:8%" }, [])
    ].concat(components.map(function () {
      return el("col", { style: "width:" + compColWidth + "%" }, []);
    })).concat([
      el("col", { style: "width:10%" }, [])
    ]));
  }

  function renderTable(components) {
    var el = LM.el;

    if (!components.length) {
      return el("div", { class: "sf-table__empty" }, ["Add sub parts in Part Assembly Detail to see this table."]);
    }

    var thead = el("thead", {}, [
      el("tr", {}, [
        el("th", { class: "sf-table__actioncol" }, ["Sr. No"]),
        el("th", {}, ["PPAP Cost"]),
        el("th", {}, ["UOM"])
      ].concat(components.map(function (c) {
        return el("th", {}, [c.componentMaterial || "—"]);
      })).concat([
        el("th", {}, ["Total"])
      ]))
    ]);

    var dataRows = PPAP_COST_ITEMS.map(function (item, index) {
      return renderRow(item, index, components);
    });
    var tbody = el("tbody", {}, dataRows);
    var mainTable = LM.resizableTable(RFQConfig.state.columnWidths, "ppapCost", costingColgroup(components), thead, tbody);

    // Total Cost is a separate <table> (sharing the same column layout)
    // rather than a row inside the main table's tbody.
    var ppapTotals = components.map(function (c) { return ppapColumnTotal(c.id); });
    var ppapOverall = ppapTotals.reduce(function (a, b) { return a + b; }, 0);
    var totalCostRow = fixedRow("sf-table__fixed-row", "TOTAL COST", ppapTotals, ppapOverall);
    var totalsTable = LM.resizableTable(RFQConfig.state.columnWidths, "ppapCost", costingColgroup(components), null, el("tbody", {}, [totalCostRow]), "sf-table--totals");

    return el("div", { class: "sf-table-wrap" }, [mainTable, totalsTable]);
  }

  function renderGrandTotalTable(components) {
    var el = LM.el;
    var grandTotals = components.map(function (c) { return designCostColumnTotal(c.id) + ppapColumnTotal(c.id); });
    var grandOverall = grandTotals.reduce(function (a, b) { return a + b; }, 0);
    var row = fixedRow("sf-table__fixed-row", "GRAND TOTAL COST", grandTotals, grandOverall);

    return el("div", { class: "sf-table-wrap" }, [
      LM.resizableTable(RFQConfig.state.columnWidths, "ppapCost", costingColgroup(components), null, el("tbody", {}, [row]))
    ]);
  }

  // Body-only version (no card, just a sub-header) — used as the "PPAP
  // Cost" section below Design Cost, inside the Cost Of Design &
  // Development sub-tab.
  RFQConfig.renderPpapCostBody = function renderPpapCostBody() {
    var el = LM.el;
    var components = RFQConfig.state.assemblyRows;

    var head = el("div", { class: "sf-section__head sf-section__head--sub" }, [
      el("div", { class: "sf-section__title" }, [
        el("div", { class: "sf-section__bar" }),
        el("h2", {}, ["PPAP Cost"])
      ])
    ]);

    if (!components.length) {
      return el("div", { class: "sf-feasibility-body" }, [
        head,
        el("div", { class: "sf-table__empty" }, ["Add sub parts in Part Assembly Detail to see this section."])
      ]);
    }

    return el("div", { class: "sf-feasibility-body" }, [
      head,
      el("div", { class: "sf-exec-panel" }, [
        renderTable(components),
        renderGrandTotalTable(components)
      ])
    ]);
  };
})(window.RFQConfig, window.LM);
