/* ---------------- Child component: ProcessFeasibilitySection ---------------- */
window.RFQConfig = window.RFQConfig || {};

(function (RFQConfig, LM) {
  "use strict";

  // One row per canonical process option, in this order — label is the
  // short form shown in the table (matches the reference image).
  var PROCESS_ROWS = [
    { value: "MOLDING", label: "MOLDING" },
    { value: "PLATING", label: "PLATING" },
    { value: "PAINTING", label: "PAINTING" },
    { value: "BOP ASSEMBLY", label: "ASSEMBLY" },
    { value: "NON RETURNABLE PACKAGING", label: "PACKAGING" }
  ];

  function toggleRaw() {
    var state = RFQConfig.state.processFeasibility;
    state.rawOpen = !state.rawOpen;
    RFQConfig.renderApp();
  }

  function toggleProcess() {
    var state = RFQConfig.state.processFeasibility;
    state.processOpen = !state.processOpen;
    RFQConfig.renderApp();
  }

  function renderFeasibilityAccordion(title, isOpen, onToggle, body) {
    var el = LM.el;
    var head = el("div", {
      class: "sf-accordion__head",
      onclick: onToggle
    }, [
      el("span", { class: "sf-accordion__chevron" + (isOpen ? " sf-accordion__chevron--open" : "") }, ["▾"]),
      el("span", { class: "sf-accordion__title" }, [title])
    ]);

    var children = [head];
    if (isOpen) children.push(el("div", { class: "sf-accordion__body" }, [body]));
    return el("div", { class: "sf-accordion" }, children);
  }

  // A component "uses" a process if that process appears in any of its
  // Part Configuration Process Levels (Level 1..N picklist selections).
  // Until the user has explicitly opened and saved that component's Part
  // Configuration, fall back to the same defaults the modal itself would
  // show — so an unconfigured component isn't wrongly read as using
  // nothing at all.
  function componentUsesProcess(component, processValue) {
    var levels = component.processLevels || (RFQConfig.defaultProcessLevels ? RFQConfig.defaultProcessLevels() : []);
    return levels.some(function (l) { return l.value === processValue; });
  }

  // Shared by both accordions — only the first column's constant label
  // differs ("Raw Material" vs "Process"); the Y/N logic is identical since
  // both read the same Part Configuration Process Levels per component.
  function renderFeasibilityTable(firstColLabel) {
    var el = LM.el;
    var components = RFQConfig.state.assemblyRows;

    if (!components.length) {
      return el("div", { class: "sf-table__empty" }, ["Add sub parts in Part Assembly Detail to see feasibility here."]);
    }

    var compColWidth = 68 / components.length;
    var colgroup = el("colgroup", {}, [
      el("col", { style: "width:16%" }, []),
      el("col", { style: "width:16%" }, [])
    ].concat(components.map(function () {
      return el("col", { style: "width:" + compColWidth + "%" }, []);
    })));

    var thead = el("thead", {}, [
      el("tr", {}, [
        el("th", {}, [firstColLabel]),
        el("th", {}, ["Process Level"])
      ].concat(components.map(function (c) {
        return el("th", {}, [c.componentMaterial || "—"]);
      })))
    ]);

    var tbody = el("tbody", {}, PROCESS_ROWS.map(function (def) {
      return el("tr", {}, [
        el("td", {}, [el("span", { class: "sf-table__derived" }, [firstColLabel.toUpperCase()])]),
        el("td", {}, [el("span", { class: "sf-table__derived" }, [def.label])])
      ].concat(components.map(function (c) {
        var used = componentUsesProcess(c, def.value);
        return el("td", { class: "sf-table__actioncol" }, [
          el("span", { class: used ? "sf-feas-cell--yes" : "sf-feas-cell--no" }, [used ? "Y" : "N"])
        ]);
      })));
    }));

    return el("div", { class: "sf-table-wrap" }, [
      LM.resizableTable(RFQConfig.state.columnWidths, "processFeasibility", colgroup, thead, tbody)
    ]);
  }

  // Body-only version (no card/heading) — used as the "Process Feasibility"
  // tab's content inside the Part Assembly tab strip.
  RFQConfig.renderProcessFeasibilityBody = function renderProcessFeasibilityBody() {
    var el = LM.el;
    var state = RFQConfig.state.processFeasibility;

    return el("div", { class: "sf-feasibility-body" }, [
      el("div", { class: "sf-exec-panel" }, [
        renderFeasibilityAccordion("Raw Material", state.rawOpen, toggleRaw, renderFeasibilityTable("Raw Material")),
        renderFeasibilityAccordion("Process", state.processOpen, toggleProcess, renderFeasibilityTable("Process"))
      ])
    ]);
  };
})(window.RFQConfig, window.LM);
