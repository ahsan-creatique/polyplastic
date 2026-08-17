/* ---------------- Child component: LotInformationSection ---------------- */
window.RFQConfig = window.RFQConfig || {};

(function (RFQConfig, LM) {
  "use strict";

  // Fixed, finite checklist — no add/remove. PROJECT MANAGEMENT is the one
  // numeric (hours) row with a real Total; every other row is a per-
  // component Y/N flag and has no meaningful total.
  var LOT_INFO_ITEMS = [
    { key: "projectManagement", label: "PROJECT MANAGEMENT", uom: "HRS", type: "number" },
    { key: "rmPlasticGranulesTrial", label: "RM (PLASTIC GRANULERS) & TRIAL", uom: "NOS", type: "yn" },
    { key: "rmPaintTrial", label: "RM (PAINT) & TRIAL", uom: "NOS", type: "yn" },
    { key: "partLogisticsBeforeSop", label: "PART LOGISTICS BEFORE SOP", uom: "NOS", type: "yn" },
    { key: "trialVisitCostDomestic", label: "TRIAL VISIT COST ( DOMESTIC )", uom: "NOS", type: "yn" },
    { key: "trialVisitCostOverseas", label: "TRIAL VISIT COST ( OVERSEAS )", uom: "NOS", type: "yn" },
    { key: "toolShipmentCost", label: "TOOL SHIPMENT COST", uom: "", type: "yn" }
  ];

  var YN_OPTIONS = ["Y", "N"];

  function findRow(itemKey) {
    var rows = RFQConfig.state.lotInformation.rows;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].key === itemKey) return rows[i];
    }
    return null;
  }

  function updateValue(itemKey, componentId, value) {
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

  function numberCell(row, component) {
    var el = LM.el;
    return el("td", {}, [el("input", {
      class: "sf-table__input",
      type: "number",
      min: "0",
      value: row.qtyByComponent[component.id] || "",
      onchange: function (e) { updateValue(row.key, component.id, e.target.value); }
    }, [])]);
  }

  function ynCell(row, component) {
    var el = LM.el;
    var value = row.qtyByComponent[component.id] || "";
    var optionEls = [el("option", { value: "" }, [""])].concat(YN_OPTIONS.map(function (o) {
      var opt = el("option", { value: o }, [o]);
      if (o === value) opt.setAttribute("selected", "selected");
      return opt;
    }));
    var select = el("select", {
      class: "sf-table__select",
      onchange: function (e) { updateValue(row.key, component.id, e.target.value); }
    }, optionEls);
    return el("td", {}, [select]);
  }

  function renderRow(item, index, components) {
    var el = LM.el;
    var row = findRow(item.key);
    var isNumber = item.type === "number";
    return el("tr", {}, [
      el("td", { class: "sf-table__actioncol" }, [el("span", { class: "sf-table__derived" }, [String(index + 1)])]),
      derived(item.label),
      derived(item.uom)
    ].concat(components.map(function (c) {
      return isNumber ? numberCell(row, c) : ynCell(row, c);
    })).concat([
      isNumber ? derived(String(rowTotal(row, components))) : derived("—")
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
      el("col", { style: "width:22%" }, []),
      el("col", { style: "width:8%" }, [])
    ].concat(components.map(function () {
      return el("col", { style: "width:" + compColWidth + "%" }, []);
    })).concat([
      el("col", { style: "width:10%" }, [])
    ]));

    var thead = el("thead", {}, [
      el("tr", {}, [
        el("th", { class: "sf-table__actioncol" }, ["Sr. No"]),
        el("th", {}, ["PPAP Activity"]),
        el("th", {}, ["UOM"])
      ].concat(components.map(function (c) {
        return el("th", {}, [c.componentMaterial || "—"]);
      })).concat([
        el("th", {}, ["Total"])
      ]))
    ]);

    var tbody = el("tbody", {}, LOT_INFO_ITEMS.map(function (item, index) {
      return renderRow(item, index, components);
    }));

    return el("div", { class: "sf-table-wrap" }, [
      el("table", { class: "sf-table" }, [colgroup, thead, tbody])
    ]);
  }

  // Body-only version (no card, just a sub-header) — used as the "LOT
  // Information" section below Design Hours, inside the Design &
  // Development Feasibility sub-tab.
  RFQConfig.renderLotInformationBody = function renderLotInformationBody() {
    var el = LM.el;
    var components = RFQConfig.state.assemblyRows;

    var head = el("div", { class: "sf-section__head sf-section__head--sub" }, [
      el("div", { class: "sf-section__title" }, [
        el("div", { class: "sf-section__bar" }),
        el("h2", {}, ["LOT Information"])
      ])
    ]);

    return el("div", { class: "sf-feasibility-body" }, [
      head,
      renderTable(components)
    ]);
  };
})(window.RFQConfig, window.LM);
