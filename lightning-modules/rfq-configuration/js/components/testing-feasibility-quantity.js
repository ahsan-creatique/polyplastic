/* ---------------- Child component: TestingFeasibilityQuantitySection ---------------- */
window.RFQConfig = window.RFQConfig || {};

(function (RFQConfig, LM) {
  "use strict";

  // Process → LOT options, per the Feasibility of Testing reference sheet.
  var PROCESS_LOT_MAP = {
    "MOLDING": ["RAW MATERIAL"],
    "PLATING": ["PLATING TESTING"],
    "PAINTING": ["PAINTING RM TESTING", "PART PERFORMANCE TESTING"],
    "ASSEMBLY": ["BOPC PART TESTING", "PART PERFORMANCE TESTING"]
  };

  var PROCESS_OPTIONS = ["MOLDING", "PLATING", "PAINTING", "ASSEMBLY"];

  function lotOptionsForProcess(process) {
    return PROCESS_LOT_MAP[process] || [];
  }

  function updateRow(rowId, key, value) {
    var rows = RFQConfig.state.testingFeasibilityQuantity.rows;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].id !== rowId) continue;
      rows[i][key] = value;
      // Changing Process invalidates whatever LOT was picked for the old
      // process — LOT is a dependent dropdown, not an independent field.
      if (key === "process" && lotOptionsForProcess(value).indexOf(rows[i].lot) === -1) {
        rows[i].lot = "";
      }
      break;
    }
    RFQConfig.state.dirty = true;
    RFQConfig.renderApp();
  }

  function updateQty(rowId, componentId, value) {
    var rows = RFQConfig.state.testingFeasibilityQuantity.rows;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].id !== rowId) continue;
      rows[i].qtyByComponent[componentId] = value;
      break;
    }
    RFQConfig.state.dirty = true;
    RFQConfig.renderApp();
  }

  function addRow() {
    var state = RFQConfig.state.testingFeasibilityQuantity;
    state.rows.push({ id: state.nextId++, process: "", lot: "", qtyByComponent: {} });
    RFQConfig.state.dirty = true;
    RFQConfig.renderApp();
  }

  function removeRow(rowId) {
    var state = RFQConfig.state.testingFeasibilityQuantity;
    state.rows = state.rows.filter(function (r) { return r.id !== rowId; });
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

  function cell(content) {
    return LM.el("td", {}, [content]);
  }

  function srNoCell(index) {
    return LM.el("td", { class: "sf-table__actioncol" }, [
      LM.el("span", { class: "sf-table__derived" }, [String(index + 1)])
    ]);
  }

  function selectCell(value, options, placeholder, disabled, onChange) {
    var el = LM.el;
    var optionEls = [el("option", { value: "" }, [placeholder])].concat(options.map(function (o) {
      var opt = el("option", { value: o }, [o]);
      if (o === value) opt.setAttribute("selected", "selected");
      return opt;
    }));
    var selectAttrs = {
      class: "sf-table__select",
      onchange: function (e) { onChange(e.target.value); }
    };
    if (disabled) selectAttrs.disabled = "disabled";
    var select = el("select", selectAttrs, optionEls);
    return cell(select);
  }

  function processCell(row) {
    return selectCell(row.process, PROCESS_OPTIONS, "--Select Process--", false, function (v) {
      updateRow(row.id, "process", v);
    });
  }

  function lotCell(row) {
    var options = lotOptionsForProcess(row.process);
    return selectCell(row.lot, options, "--Select LOT--", !row.process, function (v) {
      updateRow(row.id, "lot", v);
    });
  }

  function uomCell() {
    return cell(LM.el("span", { class: "sf-table__derived" }, [RFQConfig.FIXED_UOM]));
  }

  function componentQtyCell(row, component) {
    var el = LM.el;
    return cell(el("input", {
      class: "sf-table__input",
      type: "number",
      min: "0",
      value: row.qtyByComponent[component.id] || "",
      onchange: function (e) { updateQty(row.id, component.id, e.target.value); }
    }, []));
  }

  function totalCell(row, components) {
    return cell(LM.el("span", { class: "sf-table__derived" }, [String(rowTotal(row, components))]));
  }

  function removeCell(row) {
    var el = LM.el;
    return el("td", { class: "sf-table__actioncol" }, [
      el("button", {
        class: "sf-table__del",
        title: "Remove row",
        onclick: function () { removeRow(row.id); }
      }, [el("span", {
        html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
          + '<polyline points="3 6 5 6 21 6"></polyline>'
          + '<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>'
          + '<path d="M10 11v6"></path><path d="M14 11v6"></path>'
          + '<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>'
      })])
    ]);
  }

  function renderRow(row, index, components) {
    var el = LM.el;
    return el("tr", {}, [
      srNoCell(index),
      processCell(row),
      lotCell(row),
      uomCell()
    ].concat(components.map(function (c) {
      return componentQtyCell(row, c);
    })).concat([
      totalCell(row, components),
      removeCell(row)
    ]));
  }

  function renderTable(rows, components) {
    var el = LM.el;

    if (!components.length) {
      return el("div", { class: "sf-table__empty" }, ["Add sub parts in Part Assembly Detail to see this table."]);
    }
    if (!rows.length) {
      return el("div", { class: "sf-table__empty" }, ["No rows added yet. Click “+ Add Row” to get started."]);
    }

    var compColWidth = 46 / components.length;
    var colgroup = el("colgroup", {}, [
      el("col", { class: "sf-table__col--srno" }, []),
      el("col", { style: "width:14%" }, []),
      el("col", { style: "width:16%" }, []),
      el("col", { style: "width:8%" }, [])
    ].concat(components.map(function () {
      return el("col", { style: "width:" + compColWidth + "%" }, []);
    })).concat([
      el("col", { style: "width:8%" }, []),
      el("col", { class: "sf-table__col--icon" }, [])
    ]));

    var thead = el("thead", {}, [
      el("tr", {}, [
        el("th", { class: "sf-table__actioncol" }, ["Sr. No"]),
        el("th", {}, ["Process"]),
        el("th", {}, ["LOT"]),
        el("th", {}, ["UOM"])
      ].concat(components.map(function (c) {
        return el("th", {}, [c.componentMaterial || "—"]);
      })).concat([
        el("th", {}, ["Total"]),
        el("th", { class: "sf-table__actioncol" }, [""])
      ]))
    ]);

    var tbody = el("tbody", {}, rows.map(function (row, index) { return renderRow(row, index, components); }));

    return el("div", { class: "sf-table-wrap" }, [
      el("table", { class: "sf-table" }, [colgroup, thead, tbody])
    ]);
  }

  // Body-only version (no card/heading beyond a sub-header) — used as the
  // "Feasibility of Testing" tab's content inside the Part Assembly tab strip.
  RFQConfig.renderTestingFeasibilityQuantityBody = function renderTestingFeasibilityQuantityBody() {
    var el = LM.el;
    var state = RFQConfig.state.testingFeasibilityQuantity;
    var components = RFQConfig.state.assemblyRows;

    var head = el("div", { class: "sf-section__head sf-section__head--sub" }, [
      el("div", { class: "sf-section__title" }, [
        el("div", { class: "sf-section__bar" }),
        el("h2", {}, ["Testing Feasibility"])
      ]),
      el("button", { class: "sf-btn sf-btn--brand", onclick: addRow }, ["+ Add Row"])
    ]);

    return el("div", { class: "sf-feasibility-body" }, [
      head,
      renderTable(state.rows, components)
    ]);
  };
})(window.RFQConfig, window.LM);
