/* ---------------- Child component: PartAssemblyDetailSection ---------------- */
window.RFQConfig = window.RFQConfig || {};

(function (RFQConfig, LM) {
  "use strict";

  function updateRow(rowId, key, value) {
    var rows = RFQConfig.state.assemblyRows;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].id === rowId) { rows[i][key] = value; break; }
    }
    RFQConfig.state.dirty = true;
    RFQConfig.renderApp();
  }

  function removeRow(rowId) {
    var state = RFQConfig.state;
    state.assemblyRows = state.assemblyRows.filter(function (r) { return r.id !== rowId; });
    state.dirty = true;
    RFQConfig.renderApp();
  }

  function addRow() {
    var state = RFQConfig.state;
    // Header Material is fetched from Part Name and UOM is always NOS, so a
    // new row only needs the fields the user actually provides.
    state.assemblyRows.push({ id: state.assemblyNextId++, componentMaterial: "", quantity: "1" });
    state.dirty = true;
    RFQConfig.renderApp();
  }

  function cell(content) {
    return LM.el("td", {}, [content]);
  }

  function srNoCell(index) {
    return LM.el("td", { class: "sf-table__actioncol" }, [
      LM.el("span", { class: "sf-table__derived" }, [String(index + 1)])
    ]);
  }

  function headerMaterialCell() {
    var partName = RFQConfig.partFieldByKey("partName");
    return cell(LM.el("span", { class: "sf-table__derived" }, [partName ? partName.value : ""]));
  }

  function componentMaterialCell(row) {
    var el = LM.el;
    return cell(el("input", {
      class: "sf-table__input",
      type: "text",
      placeholder: "Component material",
      value: row.componentMaterial,
      onchange: function (e) { updateRow(row.id, "componentMaterial", e.target.value); }
    }, []));
  }

  function quantityCell(row) {
    var el = LM.el;
    return cell(el("input", {
      class: "sf-table__input",
      type: "number",
      min: "0",
      value: row.quantity,
      onchange: function (e) { updateRow(row.id, "quantity", e.target.value); }
    }, []));
  }

  function uomCell() {
    return cell(LM.el("span", { class: "sf-table__derived" }, [RFQConfig.FIXED_UOM]));
  }

  function partConfigurationCell(row) {
    var el = LM.el;
    return cell(el("button", {
      class: "sf-btn sf-btn--secondary sf-btn--sm",
      onclick: function () { RFQConfig.openPartConfigModal(row); }
    }, ["Part Configuration"]));
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

  function renderRow(row, index) {
    var el = LM.el;
    return el("tr", {}, [
      srNoCell(index),
      headerMaterialCell(),
      componentMaterialCell(row),
      quantityCell(row),
      uomCell(),
      partConfigurationCell(row),
      removeCell(row)
    ]);
  }

  function renderTable(rows) {
    var el = LM.el;
    if (!rows.length) {
      return el("div", { class: "sf-table__empty" }, ["No sub parts added yet. Click “+ Add Sub Part” to get started."]);
    }
    var colgroup = el("colgroup", {}, [
      el("col", { class: "sf-table__col--srno" }, []),
      el("col", { class: "sf-table__col--header" }, []),
      el("col", { class: "sf-table__col--wide" }, []),
      el("col", { class: "sf-table__col--narrow" }, []),
      el("col", { class: "sf-table__col--narrow" }, []),
      el("col", { class: "sf-table__col--config" }, []),
      el("col", { class: "sf-table__col--icon" }, [])
    ]);
    var thead = el("thead", {}, [
      el("tr", {}, [
        el("th", { class: "sf-table__actioncol" }, ["Sr. No"]),
        el("th", {}, ["Header Material"]),
        el("th", {}, ["Component Material"]),
        el("th", {}, ["Quantity"]),
        el("th", {}, ["UOM"]),
        el("th", {}, ["Part Configuration"]),
        el("th", { class: "sf-table__actioncol" }, [""])
      ])
    ]);
    var tbody = el("tbody", {}, rows.map(renderRow));
    return el("div", { class: "sf-table-wrap" }, [
      LM.resizableTable(RFQConfig.state.columnWidths, "partAssemblyDetail", colgroup, thead, tbody)
    ]);
  }

  RFQConfig.renderPartAssemblyDetailSection = function renderPartAssemblyDetailSection() {
    var el = LM.el;
    var state = RFQConfig.state;

    var head = el("div", { class: "sf-section__head" }, [
      el("div", { class: "sf-section__title" }, [
        el("div", { class: "sf-section__bar" }),
        el("h2", {}, ["Part Assembly Detail"])
      ]),
      el("button", { class: "sf-btn sf-btn--brand", onclick: addRow }, ["+ Add Sub Part"])
    ]);

    return el("section", { class: "sf-card" }, [
      head,
      renderTable(state.assemblyRows)
    ]);
  };
})(window.RFQConfig, window.LM);
