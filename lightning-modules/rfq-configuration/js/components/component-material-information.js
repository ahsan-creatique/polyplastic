/* ---------------- Child component: ComponentMaterialInformationSection ---------------- */
window.RFQConfig = window.RFQConfig || {};

(function (RFQConfig, LM) {
  "use strict";

  // Fixed, finite checklist per component — no add/remove; only Qty is
  // user-editable. Matches the reference sheet (Material / Component
  // Material / UOM / Qty).
  var MATERIAL_INFO_ITEMS = [
    { key: "moldSize", description: "MOLD SIZE", uom: "MM" },
    { key: "noOfCavity", description: "NO OF CAVITY", uom: "NOS" },
    { key: "moldWeight", description: "MOLD WEIGHT", uom: "KG" }
  ];

  // Seeded once per component, the first time its accordion is rendered —
  // not on every render, so an edited value doesn't get wiped.
  function ensureMaterialInfo(component) {
    if (!component.materialInfo) {
      component.materialInfo = { moldSize: "", noOfCavity: "", moldWeight: "" };
    }
    return component.materialInfo;
  }

  function isAccordionOpen(componentId) {
    var store = RFQConfig.state.componentMaterialAccordion;
    if (!(componentId in store)) store[componentId] = true;
    return store[componentId];
  }

  function toggleAccordion(componentId) {
    var store = RFQConfig.state.componentMaterialAccordion;
    store[componentId] = !isAccordionOpen(componentId);
    RFQConfig.renderApp();
  }

  function updateQty(componentId, itemKey, value) {
    var component = RFQConfig.assemblyRowById(componentId);
    if (!component) return;
    ensureMaterialInfo(component)[itemKey] = value;
    RFQConfig.state.dirty = true;
    RFQConfig.renderApp();
  }

  function renderRow(component, item, index) {
    var el = LM.el;
    var info = ensureMaterialInfo(component);
    return el("tr", {}, [
      el("td", { class: "sf-table__actioncol" }, [el("span", { class: "sf-table__derived" }, [String(index + 1)])]),
      el("td", {}, [el("span", { class: "sf-table__derived" }, [component.componentMaterial || "—"])]),
      el("td", {}, [el("span", { class: "sf-table__derived" }, [item.description])]),
      el("td", {}, [el("span", { class: "sf-table__derived" }, [item.uom])]),
      el("td", {}, [el("input", {
        class: "sf-table__input",
        type: "text",
        placeholder: "Qty",
        value: info[item.key],
        onchange: function (e) { updateQty(component.id, item.key, e.target.value); }
      }, [])])
    ]);
  }

  function renderTable(component) {
    var el = LM.el;
    var colgroup = el("colgroup", {}, [
      el("col", { class: "sf-table__col--srno" }, []),
      el("col", { style: "width:20%" }, []),
      el("col", { style: "width:34%" }, []),
      el("col", { style: "width:15%" }, []),
      el("col", { style: "width:20%" }, [])
    ]);
    var thead = el("thead", {}, [
      el("tr", {}, [
        el("th", { class: "sf-table__actioncol" }, ["Sr. No"]),
        el("th", {}, ["Material"]),
        el("th", {}, ["Component Material"]),
        el("th", {}, ["UOM"]),
        el("th", {}, ["Qty"])
      ])
    ]);
    var tbody = el("tbody", {}, MATERIAL_INFO_ITEMS.map(function (item, index) {
      return renderRow(component, item, index);
    }));

    return el("div", { class: "sf-table-wrap" }, [
      el("table", { class: "sf-table" }, [colgroup, thead, tbody])
    ]);
  }

  function renderComponentAccordion(component) {
    var el = LM.el;
    var isOpen = isAccordionOpen(component.id);
    var head = el("div", {
      class: "sf-accordion__head",
      onclick: function () { toggleAccordion(component.id); }
    }, [
      el("span", { class: "sf-accordion__chevron" + (isOpen ? " sf-accordion__chevron--open" : "") }, ["▾"]),
      el("span", { class: "sf-accordion__title" }, [component.componentMaterial || "—"])
    ]);

    var children = [head];
    if (isOpen) children.push(el("div", { class: "sf-accordion__body" }, [renderTable(component)]));
    return el("div", { class: "sf-accordion" }, children);
  }

  // Body-only version (no card/heading beyond a sub-header) — used as the
  // "Tooling Construction" section below List of Tooling, inside the
  // Tooling Feasibility tab.
  RFQConfig.renderComponentMaterialInformationBody = function renderComponentMaterialInformationBody() {
    var el = LM.el;
    var components = RFQConfig.state.assemblyRows;

    var head = el("div", { class: "sf-section__head sf-section__head--sub" }, [
      el("div", { class: "sf-section__title" }, [
        el("div", { class: "sf-section__bar" }),
        el("h2", {}, ["Tooling Construction"])
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
      el("div", { class: "sf-exec-panel" }, components.map(renderComponentAccordion))
    ]);
  };
})(window.RFQConfig, window.LM);
