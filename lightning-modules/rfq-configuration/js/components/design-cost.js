/* ---------------- Child component: DesignCostSection ---------------- */
window.RFQConfig = window.RFQConfig || {};

(function (RFQConfig, LM) {
  "use strict";

  // Fixed, finite checklist — no add/remove; only the per-component cost
  // cells are user-editable. Same line items as Design Hours, but in INR
  // instead of hours, plus a TOTAL COST footer row.
  var DESIGN_COST_ITEMS = [
    { key: "productDesignB2P", label: "PRODUCT DESIGN B2P" },
    { key: "productDesignB2S", label: "PRODUCT DESIGN B2S" },
    { key: "moldFlowAnalysis", label: "MOLD FLOW ANALYSIS" },
    { key: "caeAnalysis", label: "CAE ANALYSIS" }
  ];

  var COST_UOM = "INR";

  function findRow(itemKey) {
    var rows = RFQConfig.state.designCost.rows;
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

  function rowTotal(row, components) {
    var total = 0;
    components.forEach(function (c) {
      var n = parseFloat(row.qtyByComponent[c.id]);
      if (!isNaN(n)) total += n;
    });
    return total;
  }

  function columnTotal(components, componentId) {
    var total = 0;
    DESIGN_COST_ITEMS.forEach(function (item) {
      var row = findRow(item.key);
      var n = parseFloat(row && row.qtyByComponent[componentId]);
      if (!isNaN(n)) total += n;
    });
    return total;
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

  function renderTotalRow(components) {
    var el = LM.el;
    var overall = 0;
    var componentCells = components.map(function (c) {
      var sum = columnTotal(components, c.id);
      overall += sum;
      return el("td", {}, [el("span", { class: "sf-table__fixed-label" }, [String(sum)])]);
    });
    return el("tr", { class: "sf-table__fixed-row" }, [
      el("td", { class: "sf-table__actioncol" }, []),
      el("td", {}, [el("span", { class: "sf-table__fixed-label" }, ["TOTAL COST"])]),
      el("td", {}, [el("span", { class: "sf-table__fixed-label" }, [COST_UOM])])
    ].concat(componentCells).concat([
      el("td", {}, [el("span", { class: "sf-table__fixed-label" }, [String(overall)])])
    ]));
  }

  function buildColgroup(components) {
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

    var colgroup = buildColgroup(components);
    var thead = el("thead", {}, [
      el("tr", {}, [
        el("th", { class: "sf-table__actioncol" }, ["Sr. No"]),
        el("th", {}, ["Design Cost"]),
        el("th", {}, ["UOM"])
      ].concat(components.map(function (c) {
        return el("th", {}, [c.componentMaterial || "—"]);
      })).concat([
        el("th", {}, ["Total"])
      ]))
    ]);

    var dataRows = DESIGN_COST_ITEMS.map(function (item, index) {
      return renderRow(item, index, components);
    });
    var tbody = el("tbody", {}, dataRows);
    var mainTable = el("table", { class: "sf-table" }, [colgroup, thead, tbody]);

    // Total Cost is a separate <table> (sharing the same column layout)
    // rather than a row inside the main table's tbody.
    var totalsColgroup = buildColgroup(components);
    var totalsTable = el("table", { class: "sf-table sf-table--totals" }, [totalsColgroup, el("tbody", {}, [renderTotalRow(components)])]);

    return el("div", { class: "sf-table-wrap" }, [mainTable, totalsTable]);
  }

  // Body-only version (no card, just a sub-header) — used as the "Design
  // Cost" section inside the Cost Of Design & Development sub-tab.
  RFQConfig.renderDesignCostBody = function renderDesignCostBody() {
    var el = LM.el;
    var components = RFQConfig.state.assemblyRows;

    var head = el("div", { class: "sf-section__head sf-section__head--sub" }, [
      el("div", { class: "sf-section__title" }, [
        el("div", { class: "sf-section__bar" }),
        el("h2", {}, ["Design Cost"])
      ])
    ]);

    return el("div", { class: "sf-feasibility-body" }, [
      head,
      renderTable(components)
    ]);
  };
})(window.RFQConfig, window.LM);
