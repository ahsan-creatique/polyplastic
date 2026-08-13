/* ---------------- Child component: DesignHoursSection ---------------- */
window.RFQConfig = window.RFQConfig || {};

(function (RFQConfig, LM) {
  "use strict";

  // Fixed, finite checklist — no add/remove; only the per-component hour
  // cells are user-editable. Matches the Design Hours reference sheet.
  var DESIGN_COST_ITEMS = [
    { key: "productDesignB2P", label: "PRODUCT DESIGN B2P" },
    { key: "productDesignB2S", label: "PRODUCT DESIGN B2S" },
    { key: "moldFlowAnalysis", label: "MOLD FLOW ANALYSIS" },
    { key: "caeAnalysis", label: "CAE ANALYSIS" }
  ];

  var HOURS_UOM = "HRS";

  function findRow(itemKey) {
    var rows = RFQConfig.state.designHours.rows;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].key === itemKey) return rows[i];
    }
    return null;
  }

  function updateHours(itemKey, componentId, value) {
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

  function derived(text) {
    return LM.el("td", {}, [LM.el("span", { class: "sf-table__derived" }, [text])]);
  }

  function hoursCell(row, component) {
    var el = LM.el;
    return el("td", {}, [el("input", {
      class: "sf-table__input",
      type: "number",
      min: "0",
      value: row.qtyByComponent[component.id] || "",
      onchange: function (e) { updateHours(row.key, component.id, e.target.value); }
    }, [])]);
  }

  function renderRow(item, index, components) {
    var el = LM.el;
    var row = findRow(item.key);
    return el("tr", {}, [
      el("td", { class: "sf-table__actioncol" }, [el("span", { class: "sf-table__derived" }, [String(index + 1)])]),
      derived(item.label),
      derived(HOURS_UOM)
    ].concat(components.map(function (c) {
      return hoursCell(row, c);
    })).concat([
      derived(String(rowTotal(row, components)))
    ]));
  }

  function renderTable(components) {
    var el = LM.el;

    if (!components.length) {
      return el("div", { class: "sf-table__empty" }, ["Add sub parts in Part Assembly Detail to see this table."]);
    }

    var compColWidth = 54 / components.length;
    var colgroup = el("colgroup", {}, [
      el("col", { class: "sf-table__col--srno" }, []),
      el("col", { style: "width:20%" }, []),
      el("col", { style: "width:8%" }, [])
    ].concat(components.map(function () {
      return el("col", { style: "width:" + compColWidth + "%" }, []);
    })).concat([
      el("col", { style: "width:10%" }, [])
    ]));

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

    var tbody = el("tbody", {}, DESIGN_COST_ITEMS.map(function (item, index) {
      return renderRow(item, index, components);
    }));

    return el("div", { class: "sf-table-wrap" }, [
      el("table", { class: "sf-table" }, [colgroup, thead, tbody])
    ]);
  }

  // Body-only version (no card, just a sub-header) — used as the "Design
  // Hours" section inside the Design & Development Feasibility sub-tab.
  RFQConfig.renderDesignHoursBody = function renderDesignHoursBody() {
    var el = LM.el;
    var components = RFQConfig.state.assemblyRows;

    var head = el("div", { class: "sf-section__head sf-section__head--sub" }, [
      el("div", { class: "sf-section__title" }, [
        el("div", { class: "sf-section__bar" }),
        el("h2", {}, ["Design Hours"])
      ])
    ]);

    return el("div", { class: "sf-feasibility-body" }, [
      head,
      renderTable(components)
    ]);
  };
})(window.RFQConfig, window.LM);
