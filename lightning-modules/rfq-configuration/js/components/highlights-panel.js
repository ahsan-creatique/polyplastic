/* ---------------- Child component: HighlightsPanel ---------------- */
window.RFQConfig = window.RFQConfig || {};

(function (RFQConfig, LM) {
  "use strict";

  RFQConfig.renderHighlightsPanel = function renderHighlightsPanel() {
    var el = LM.el;
    var state = RFQConfig.state;

    var opp = RFQConfig.fieldByKey("oppName");
    var cust = RFQConfig.fieldByKey("custName");

    var icon = el("div", { class: "sf-record-icon" }, [
      el("span", { html:
        '<svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg"><path d="M26 4 L48 26 L26 48 L4 26 Z"/></svg>'
      })
    ]);

    var actions = el("div", { class: "sf-highlights__actions" }, [
      el("button", {
        class: "sf-btn",
        onclick: function () {
          state.fields = RFQConfig.initialFields();
          state.partFields = RFQConfig.initialPartFields();
          state.assemblyRows = RFQConfig.initialAssemblyRows();
          state.assemblyNextId = 4;
          state.partPicture = RFQConfig.DEFAULT_PART_PICTURE;
          state.dirty = false;
          state.editingKey = null;
          RFQConfig.renderApp();
        }
      }, ["Cancel"]),
      el("button", {
        class: "sf-btn sf-btn--brand",
        onclick: function () { state.dirty = false; state.editingKey = null; RFQConfig.renderApp(); }
      }, ["Save"])
    ]);
    if (!state.dirty) {
      actions.querySelectorAll("button").forEach(function (btn) { btn.setAttribute("disabled", "disabled"); });
    }

    var top = el("div", { class: "sf-highlights__top" }, [
      icon,
      el("div", { class: "sf-highlights__title" }, [
        el("div", { class: "sf-highlights__eyebrow" }, ["Opportunity"]),
        el("div", { class: "sf-highlights__name" }, [opp.value]),
        el("div", { class: "sf-highlights__sub" }, [cust.value])
      ]),
      actions
    ]);

    // Stage/Date/Close Date/Customer Code used to be duplicated here in a quick-fields
    // row; they're removed since Opportunity Information below already shows them.
    // No own card wrapper: app.js merges this into one bordered card together
    // with the Opportunity Information section right below it.
    return el("div", { class: "sf-highlights" }, [top]);
  };
})(window.RFQConfig, window.LM);
