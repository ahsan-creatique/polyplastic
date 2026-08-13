/* ---------------- Child component: TotalPartCostSection ---------------- */
window.RFQConfig = window.RFQConfig || {};

(function (RFQConfig, LM) {
  "use strict";

  var COST_UOM = "INR";
  var PCT_UOM = "%";

  // A component's Raw Material Cost / Process Cost are not tracked here —
  // they're rolled up from whatever the user already entered in that
  // component's Part Configuration levels (rawMaterialTotalAmount /
  // processTotalAmount, kept in sync there on every render + save).
  // Components that were never opened in Part Configuration fall back to
  // the default (empty) level set, which contributes 0.
  function levelsFor(component) {
    return component.processLevels || RFQConfig.defaultProcessLevels();
  }

  function sumLevelField(component, field) {
    var total = 0;
    levelsFor(component).forEach(function (level) {
      var n = parseFloat(level[field]);
      if (!isNaN(n)) total += n;
    });
    return total;
  }

  function rawMaterialCostFor(component) {
    return sumLevelField(component, "rawMaterialTotalAmount");
  }

  function processCostFor(component) {
    return sumLevelField(component, "processTotalAmount");
  }

  function manufacturingCostFor(component) {
    return rawMaterialCostFor(component) + processCostFor(component);
  }

  function numFor(store, componentId) {
    var n = parseFloat(store[componentId]);
    return isNaN(n) ? 0 : n;
  }

  function forwardingFor(component) {
    return numFor(RFQConfig.state.totalPartCost.forwarding, component.id);
  }

  function overheadPctFor(component) {
    return numFor(RFQConfig.state.totalPartCost.overheadPct, component.id);
  }

  function profitPctFor(component) {
    return numFor(RFQConfig.state.totalPartCost.profitPct, component.id);
  }

  // Build-up: Manufacturing Cost + Forwarding is the base; Overhead %age
  // marks that base up, then Profit %age marks up the overhead-loaded cost.
  function grandTotalFor(component) {
    var base = manufacturingCostFor(component) + forwardingFor(component);
    var afterOverhead = base + (base * overheadPctFor(component) / 100);
    return afterOverhead + (afterOverhead * profitPctFor(component) / 100);
  }

  function updateEditableField(fieldKey, componentId, value) {
    var store = RFQConfig.state.totalPartCost[fieldKey];
    store[componentId] = value;
    RFQConfig.state.dirty = true;
    RFQConfig.renderApp();
  }

  function money(n) {
    return n.toFixed(2);
  }

  function fixedLabelCell(text) {
    return LM.el("td", {}, [LM.el("span", { class: "sf-table__fixed-label" }, [text])]);
  }

  function derivedCell(text) {
    return LM.el("td", {}, [LM.el("span", { class: "sf-table__derived" }, [text])]);
  }

  function dashCell() {
    return derivedCell("—");
  }

  function editableCell(store, componentId, onCommit) {
    var el = LM.el;
    var value = store[componentId];
    return el("td", {}, [el("input", {
      class: "sf-table__input",
      type: "number",
      min: "0",
      value: value == null ? "" : value,
      onchange: function (e) { onCommit(componentId, e.target.value); }
    }, [])]);
  }

  // Derived (non-editable) money row — Raw Material Cost, Process Cost.
  function renderDerivedRow(srNo, label, valueFn, components) {
    var el = LM.el;
    var total = 0;
    var cells = components.map(function (c) {
      var v = valueFn(c);
      total += v;
      return derivedCell(money(v));
    });
    return el("tr", {}, [
      el("td", { class: "sf-table__actioncol" }, [el("span", { class: "sf-table__derived" }, [String(srNo)])]),
      fixedLabelCell(label),
      derivedCell(COST_UOM)
    ].concat(cells).concat([derivedCell(money(total))]));
  }

  // Highlighted subtotal/grand-total row — same shape as renderDerivedRow
  // but styled like the rest of the app's fixed total rows.
  function renderHighlightedRow(label, valueFn, components) {
    var el = LM.el;
    var total = 0;
    var cells = components.map(function (c) {
      var v = valueFn(c);
      total += v;
      return el("td", {}, [el("span", { class: "sf-table__fixed-label" }, [money(v)])]);
    });
    return el("tr", { class: "sf-table__fixed-row" }, [
      el("td", { class: "sf-table__actioncol" }, []),
      fixedLabelCell(label),
      derivedCell(COST_UOM)
    ].concat(cells).concat([
      el("td", {}, [el("span", { class: "sf-table__fixed-label" }, [money(total)])])
    ]));
  }

  // Editable per-component row — Forwarding (INR), Overhead / Profit
  // (%age). Percentage rows show a dash in the trailing Total column since
  // summing rates across components isn't meaningful.
  function renderEditableRow(label, uom, fieldKey, components, totalIsMeaningful) {
    var el = LM.el;
    var store = RFQConfig.state.totalPartCost[fieldKey];
    var total = 0;
    var cells = components.map(function (c) {
      total += numFor(store, c.id);
      return editableCell(store, c.id, function (componentId, value) { updateEditableField(fieldKey, componentId, value); });
    });
    return el("tr", {}, [
      el("td", { class: "sf-table__actioncol" }, []),
      fixedLabelCell(label),
      derivedCell(uom)
    ].concat(cells).concat([
      totalIsMeaningful ? derivedCell(money(total)) : dashCell()
    ]));
  }

  function buildColgroup(components) {
    var el = LM.el;
    var compColWidth = 46 / components.length;
    return el("colgroup", {}, [
      el("col", { class: "sf-table__col--srno" }, []),
      el("col", { style: "width:16%" }, []),
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
        el("th", { class: "sf-table__actioncol" }, [""]),
        el("th", {}, ["Total"]),
        el("th", {}, ["UOM"])
      ].concat(components.map(function (c) {
        return el("th", {}, [c.componentMaterial || "—"]);
      })).concat([
        el("th", {}, ["Total"])
      ]))
    ]);

    var rows = [
      renderDerivedRow(1, "RAW MATERIAL COST", rawMaterialCostFor, components),
      renderDerivedRow(2, "PROCESS COST", processCostFor, components),
      renderHighlightedRow("TOTAL MANUFACTURING COST", manufacturingCostFor, components),
      renderEditableRow("FORWARDING", COST_UOM, "forwarding", components, true),
      renderEditableRow("OVERHEAD COST (%AGE)", PCT_UOM, "overheadPct", components, false),
      renderEditableRow("PROFIT (%AGE)", PCT_UOM, "profitPct", components, false),
      renderHighlightedRow("GRAND TOTAL", grandTotalFor, components)
    ];

    var tbody = el("tbody", {}, rows);
    var table = el("table", { class: "sf-table" }, [colgroup, thead, tbody]);

    return el("div", { class: "sf-table-wrap" }, [table]);
  }

  // Body-only version (no card, just a sub-header) — used as the "Total
  // Part Cost" sub-tab inside the Costing tab.
  RFQConfig.renderTotalPartCostBody = function renderTotalPartCostBody() {
    var el = LM.el;
    var components = RFQConfig.state.assemblyRows;

    var head = el("div", { class: "sf-section__head sf-section__head--sub" }, [
      el("div", { class: "sf-section__title" }, [
        el("div", { class: "sf-section__bar" }),
        el("h2", {}, ["Total Part Cost"])
      ])
    ]);

    return el("div", { class: "sf-feasibility-body" }, [
      head,
      renderTable(components)
    ]);
  };
})(window.RFQConfig, window.LM);
