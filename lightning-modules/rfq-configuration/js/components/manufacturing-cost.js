/* ---------------- Child component: ManufacturingCostSection ---------------- */
window.RFQConfig = window.RFQConfig || {};

(function (RFQConfig, LM) {
  "use strict";

  var COST_UOM = "INR";

  // Same canonical process types Part Configuration's Level picklist
  // offers — every level on a component gets bucketed under one of these
  // regardless of how many of a component's levels use it or what order
  // they're in.
  var PROCESS_TYPES = ["MOLDING", "PLATING", "PAINTING", "BOP ASSEMBLY", "NON RETURNABLE PACKAGING"];

  function levelsFor(component) {
    return component.processLevels || RFQConfig.defaultProcessLevels();
  }

  // Sums `field` (rawMaterialTotalAmount / processTotalAmount) across
  // whichever of a component's levels use this process — a component can
  // put the same process on more than one level, or skip it entirely
  // (e.g. LOGO has no BOP ASSEMBLY / NON RETURNABLE PACKAGING levels).
  function amountFor(component, processType, field) {
    var total = 0;
    levelsFor(component).forEach(function (level) {
      if (level.value !== processType) return;
      var n = parseFloat(level[field]);
      if (!isNaN(n)) total += n;
    });
    return total;
  }

  function derived(text) {
    return LM.el("td", {}, [LM.el("span", { class: "sf-table__derived" }, [text])]);
  }

  function money(n) {
    return n.toFixed(2);
  }

  function renderRow(processType, index, components, field) {
    var el = LM.el;
    var total = 0;
    var cells = components.map(function (c) {
      var v = amountFor(c, processType, field);
      total += v;
      return derived(money(v));
    });
    return el("tr", {}, [
      el("td", { class: "sf-table__actioncol" }, [el("span", { class: "sf-table__derived" }, [String(index + 1)])]),
      derived(processType),
      derived(COST_UOM)
    ].concat(cells).concat([derived(money(total))]));
  }

  function renderTotalRow(components, field) {
    var el = LM.el;
    var overall = 0;
    var cells = components.map(function (c) {
      var sum = 0;
      PROCESS_TYPES.forEach(function (p) { sum += amountFor(c, p, field); });
      overall += sum;
      return el("td", {}, [el("span", { class: "sf-table__fixed-label" }, [money(sum)])]);
    });
    return el("tr", { class: "sf-table__fixed-row" }, [
      el("td", { class: "sf-table__actioncol" }, []),
      el("td", {}, [el("span", { class: "sf-table__fixed-label" }, ["TOTAL COST"])]),
      el("td", {}, [el("span", { class: "sf-table__fixed-label" }, [COST_UOM])])
    ].concat(cells).concat([
      el("td", {}, [el("span", { class: "sf-table__fixed-label" }, [money(overall)])])
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

  // One table for either Raw Material Cost or Process Cost — driven by
  // `field`, which level property to read (rawMaterialTotalAmount /
  // processTotalAmount).
  function renderTable(components, field) {
    var el = LM.el;
    var thead = el("thead", {}, [
      el("tr", {}, [
        el("th", { class: "sf-table__actioncol" }, ["Sr. No"]),
        el("th", {}, ["Process"]),
        el("th", {}, ["UOM"])
      ].concat(components.map(function (c) {
        return el("th", {}, [c.componentMaterial || "—"]);
      })).concat([
        el("th", {}, ["Total"])
      ]))
    ]);

    var dataRows = PROCESS_TYPES.map(function (p, i) { return renderRow(p, i, components, field); });
    var tbody = el("tbody", {}, dataRows);
    var tableKey = "manufacturingCost-" + field;
    var mainTable = LM.resizableTable(RFQConfig.state.columnWidths, tableKey, buildColgroup(components), thead, tbody);

    // Total Cost is a separate <table> (sharing the same column layout)
    // rather than a row inside the main table's tbody — same pattern used
    // by Design Cost / Costing of Testing.
    var totalsTable = LM.resizableTable(RFQConfig.state.columnWidths, tableKey, buildColgroup(components), null, el("tbody", {}, [renderTotalRow(components, field)]), "sf-table--totals");

    return el("div", { class: "sf-table-wrap" }, [mainTable, totalsTable]);
  }

  // Reuses the section head's title/bar structure for the Raw Material
  // Cost / Process Cost sub-headings, same as Costing of Testing's
  // Internal/External split.
  function renderSubHeading(text) {
    var el = LM.el;
    return el("div", { class: "sf-section__head sf-section__head--sub" }, [
      el("div", { class: "sf-section__title" }, [
        el("div", { class: "sf-section__bar" }),
        el("h3", {}, [text])
      ])
    ]);
  }

  // Body-only version (no card, just a sub-header) — used as the
  // "Manufacturing Cost" sub-tab inside the Costing tab.
  RFQConfig.renderManufacturingCostBody = function renderManufacturingCostBody() {
    var el = LM.el;
    var components = RFQConfig.state.assemblyRows;

    var head = el("div", { class: "sf-section__head sf-section__head--sub" }, [
      el("div", { class: "sf-section__title" }, [
        el("div", { class: "sf-section__bar" }),
        el("h2", {}, ["Manufacturing Cost"])
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
        el("div", {}, [
          renderSubHeading("Raw Material Cost"),
          renderTable(components, "rawMaterialTotalAmount")
        ]),
        el("hr", { class: "sf-section-divider" }, []),
        el("div", {}, [
          renderSubHeading("Process Cost"),
          renderTable(components, "processTotalAmount")
        ])
      ])
    ]);
  };
})(window.RFQConfig, window.LM);
