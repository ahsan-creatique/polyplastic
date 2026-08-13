/* ---------------- Child component: HighlightsPanel ---------------- */
window.RFQConfig = window.RFQConfig || {};

(function (RFQConfig, LM) {
  "use strict";

  RFQConfig.renderHighlightsPanel = function renderHighlightsPanel() {
    var el = LM.el;
    var state = RFQConfig.state;

    var opp = RFQConfig.fieldByKey("oppName");
    var cust = RFQConfig.fieldByKey("custName");
    var nepNo = RFQConfig.partFieldByKey("nepNo");
    var sopDate = RFQConfig.partFieldByKey("sopDate");

    // Customer Name | NEP No. | SOP Date: <date> — NEP No. shows as a bare
    // value (same as its badge elsewhere), SOP Date gets a label since a
    // bare date alone wouldn't say what it is.
    var subParts = [cust.value];
    if (nepNo && nepNo.value) subParts.push(nepNo.value);
    if (sopDate && sopDate.value) subParts.push("SOP Date: " + LM.formatDate(sopDate.value));

    var icon = el("div", { class: "sf-record-icon" }, [
      el("span", { html:
        '<svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg"><path d="M26 4 L48 26 L26 48 L4 26 Z"/></svg>'
      })
    ]);

    var cancelBtn = el("button", {
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
    }, ["Cancel"]);

    var saveBtn = el("button", {
      class: "sf-btn sf-btn--brand",
      onclick: function () { state.dirty = false; state.editingKey = null; RFQConfig.renderApp(); }
    }, ["Save"]);

    // Cancel/Save are only meaningful once there's something to discard or
    // persist — Generate Quote isn't gated by that, so it's disabled
    // independently (never, for now) instead of through this same check.
    if (!state.dirty) {
      cancelBtn.setAttribute("disabled", "disabled");
      saveBtn.setAttribute("disabled", "disabled");
    }

    var actionChildren = [];
    var stageField = RFQConfig.fieldByKey("stage");
    if (stageField && stageField.value === "Ready for Quotation") {
      actionChildren.push(el("button", {
        class: "sf-btn sf-btn--brand",
        onclick: function () {
          window.alert("Quote generated for " + RFQConfig.fieldByKey("oppName").value + ".");
        }
      }, ["Generate Quote"]));
    }
    actionChildren.push(cancelBtn, saveBtn);

    var actions = el("div", { class: "sf-highlights__actions" }, actionChildren);

    var top = el("div", { class: "sf-highlights__top" }, [
      icon,
      el("div", { class: "sf-highlights__title" }, [
        el("div", { class: "sf-highlights__eyebrow" }, ["Opportunity"]),
        el("div", { class: "sf-highlights__name" }, [opp.value]),
        el("div", { class: "sf-highlights__sub" }, [subParts.join(" | ")])
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
