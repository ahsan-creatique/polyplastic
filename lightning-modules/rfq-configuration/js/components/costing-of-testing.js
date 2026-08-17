/* ---------------- Child component: CostingOfTestingSection ---------------- */
window.RFQConfig = window.RFQConfig || {};

(function (RFQConfig, LM) {
  "use strict";

  // Fixed currency unit for both Internal and External costing tables.
  var COST_UOM = "INR";

  // Rows mirror Testing Feasibility 1:1 (same Process/LOT per row) — adding
  // or removing a row there adds/removes the matching row here. Only the
  // amount cells are user-editable, keyed by [testing row id][component id].
  function amountsFor(tableKey, testingRowId) {
    var store = RFQConfig.state.costingOfTesting[tableKey];
    return store[testingRowId] || {};
  }

  function updateAmount(tableKey, testingRowId, componentId, value) {
    var store = RFQConfig.state.costingOfTesting[tableKey];
    if (!store[testingRowId]) store[testingRowId] = {};
    store[testingRowId][componentId] = value;
    RFQConfig.state.dirty = true;
    RFQConfig.renderApp();
  }

  function rowTotal(tableKey, testingRowId, components) {
    var amounts = amountsFor(tableKey, testingRowId);
    var total = 0;
    components.forEach(function (c) {
      var n = parseFloat(amounts[c.id]);
      if (!isNaN(n)) total += n;
    });
    return total;
  }

  function columnTotal(tableKey, testingRows, componentId) {
    var total = 0;
    testingRows.forEach(function (row) {
      var n = parseFloat(amountsFor(tableKey, row.id)[componentId]);
      if (!isNaN(n)) total += n;
    });
    return total;
  }

  function derived(text) {
    return LM.el("td", {}, [LM.el("span", { class: "sf-table__derived" }, [text])]);
  }

  function amountCell(tableKey, testingRowId, component) {
    var el = LM.el;
    var amounts = amountsFor(tableKey, testingRowId);
    return el("td", {}, [el("input", {
      class: "sf-table__input",
      type: "number",
      min: "0",
      value: amounts[component.id] || "",
      onchange: function (e) { updateAmount(tableKey, testingRowId, component.id, e.target.value); }
    }, [])]);
  }

  function renderDataRow(tableKey, testingRow, index, components) {
    var el = LM.el;
    return el("tr", {}, [
      el("td", { class: "sf-table__actioncol" }, [el("span", { class: "sf-table__derived" }, [String(index + 1)])]),
      derived(testingRow.process || "—"),
      derived(testingRow.lot || "—"),
      derived(COST_UOM)
    ].concat(components.map(function (c) {
      return amountCell(tableKey, testingRow.id, c);
    })).concat([
      derived(String(rowTotal(tableKey, testingRow.id, components)))
    ]));
  }

  function renderTotalRow(label, tableKey, testingRows, components) {
    var el = LM.el;
    var overall = 0;
    var componentCells = components.map(function (c) {
      var sum = columnTotal(tableKey, testingRows, c.id);
      overall += sum;
      return el("td", {}, [el("span", { class: "sf-table__fixed-label" }, [String(sum)])]);
    });
    return el("tr", { class: "sf-table__fixed-row" }, [
      el("td", { class: "sf-table__actioncol" }, []),
      el("td", {}, []),
      el("td", {}, [el("span", { class: "sf-table__fixed-label" }, [label])]),
      el("td", {}, [el("span", { class: "sf-table__fixed-label" }, [COST_UOM])])
    ].concat(componentCells).concat([
      el("td", {}, [el("span", { class: "sf-table__fixed-label" }, [String(overall)])])
    ]));
  }

  function costingColgroup(components) {
    var el = LM.el;
    var compColWidth = 46 / components.length;
    return el("colgroup", {}, [
      el("col", { class: "sf-table__col--srno" }, []),
      el("col", { style: "width:14%" }, []),
      el("col", { style: "width:16%" }, []),
      el("col", { style: "width:8%" }, [])
    ].concat(components.map(function () {
      return el("col", { style: "width:" + compColWidth + "%" }, []);
    })).concat([
      el("col", { style: "width:8%" }, [])
    ]));
  }

  function renderCostingTable(label, tableKey, testingRows, components) {
    var el = LM.el;
    var thead = el("thead", {}, [
      el("tr", {}, [
        el("th", { class: "sf-table__actioncol" }, ["Sr. No"]),
        el("th", {}, ["Process"]),
        el("th", {}, [label]),
        el("th", {}, ["UOM"])
      ].concat(components.map(function (c) {
        return el("th", {}, [c.componentMaterial || "—"]);
      })).concat([
        el("th", {}, ["Total"])
      ]))
    ]);

    var dataRows = testingRows.map(function (row, index) {
      return renderDataRow(tableKey, row, index, components);
    });
    var tbody = el("tbody", {}, dataRows);
    var widthsKey = "costingOfTesting-" + tableKey;
    var mainTable = LM.resizableTable(RFQConfig.state.columnWidths, widthsKey, costingColgroup(components), thead, tbody);

    // Total Cost is a separate <table> (sharing the same colgroup) rather
    // than a row inside the main table's tbody — same pattern as the Raw
    // Material tables' Total Amount.
    var totalRow = renderTotalRow("TOTAL COST", tableKey, testingRows, components);
    var totalsTable = LM.resizableTable(RFQConfig.state.columnWidths, widthsKey, costingColgroup(components), null, el("tbody", {}, [totalRow]), "sf-table--totals");

    return el("div", { class: "sf-table-wrap" }, [mainTable, totalsTable]);
  }

  function renderGrandTotalTable(testingRows, components) {
    var el = LM.el;
    var overall = 0;
    var componentCells = components.map(function (c) {
      var sum = columnTotal("internal", testingRows, c.id) + columnTotal("external", testingRows, c.id);
      overall += sum;
      return el("td", {}, [el("span", { class: "sf-table__fixed-label" }, [String(sum)])]);
    });
    var row = el("tr", { class: "sf-table__fixed-row" }, [
      el("td", { class: "sf-table__actioncol" }, []),
      el("td", {}, []),
      el("td", {}, [el("span", { class: "sf-table__fixed-label" }, ["GRAND TOTAL"])]),
      el("td", {}, [el("span", { class: "sf-table__fixed-label" }, [COST_UOM])])
    ].concat(componentCells).concat([
      el("td", {}, [el("span", { class: "sf-table__fixed-label" }, [String(overall)])])
    ]));

    return el("div", { class: "sf-table-wrap" }, [
      LM.resizableTable(RFQConfig.state.columnWidths, "costingOfTesting-grandTotal", costingColgroup(components), null, el("tbody", {}, [row]))
    ]);
  }

  // Reuses the same head/title/bar structure as the section heading (rather
  // than a bare <h3>) so the Internal/External sub-headings inherit the
  // exact same left padding and get their own top padding for free — no
  // magic-number margins to keep in sync if the section head's spacing ever
  // changes.
  function renderSubHeading(text) {
    var el = LM.el;
    return el("div", { class: "sf-section__head sf-section__head--sub" }, [
      el("div", { class: "sf-section__title" }, [
        el("div", { class: "sf-section__bar" }),
        el("h3", {}, [text])
      ])
    ]);
  }

  // Body-only version (no card/heading beyond a sub-header) — used as the
  // "Costing of Testing" section below Testing Feasibility, inside the
  // Feasibility of Testing tab.
  RFQConfig.renderCostingOfTestingBody = function renderCostingOfTestingBody() {
    var el = LM.el;
    var components = RFQConfig.state.assemblyRows;
    var testingRows = RFQConfig.state.testingFeasibilityQuantity.rows;

    var head = el("div", { class: "sf-section__head sf-section__head--sub" }, [
      el("div", { class: "sf-section__title" }, [
        el("div", { class: "sf-section__bar" }),
        el("h2", {}, ["Costing of Testing"])
      ])
    ]);

    if (!components.length) {
      return el("div", { class: "sf-feasibility-body" }, [
        head,
        el("div", { class: "sf-table__empty" }, ["Add sub parts in Part Assembly Detail to see this section."])
      ]);
    }
    if (!testingRows.length) {
      return el("div", { class: "sf-feasibility-body" }, [
        head,
        el("div", { class: "sf-table__empty" }, ["Add rows in Testing Feasibility to see costing here."])
      ]);
    }

    return el("div", { class: "sf-feasibility-body" }, [
      head,
      el("div", { class: "sf-exec-panel" }, [
        el("div", {}, [
          renderSubHeading("Internal Costing"),
          renderCostingTable("Internal", "internal", testingRows, components)
        ]),
        el("hr", { class: "sf-section-divider" }, []),
        el("div", {}, [
          renderSubHeading("External Costing"),
          renderCostingTable("External", "external", testingRows, components)
        ]),
        renderGrandTotalTable(testingRows, components)
      ])
    ]);
  };
})(window.RFQConfig, window.LM);
