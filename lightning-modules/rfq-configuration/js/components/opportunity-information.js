/* ---------------- Child component: OpportunityInformationSection ---------------- */
window.RFQConfig = window.RFQConfig || {};

(function (RFQConfig, LM) {
  "use strict";

  function displayValue(field) {
    if (field.type === "date") return LM.formatDate(field.value);
    return field.value;
  }

  function commitEdit(field, newValue) {
    field.value = newValue;
    RFQConfig.state.dirty = true;
    RFQConfig.state.editingKey = null;
    RFQConfig.renderApp();
  }

  function renderFieldEditor(field) {
    var el = LM.el;
    // `settled` guards against a field committing twice: re-rendering inside a
    // keydown handler detaches the input synchronously, which triggers a
    // trailing native `blur` — without this guard that blur would silently
    // re-commit (or override an Escape-cancel) on the now-detached element.
    var settled = false;
    function cancel() {
      if (settled) return;
      settled = true;
      RFQConfig.state.editingKey = null;
      RFQConfig.renderApp();
    }
    function commit(value) {
      if (settled) return;
      settled = true;
      commitEdit(field, value);
    }

    if (field.type === "picklist") {
      var select = el("select", {
        class: "sf-field__select",
        onchange: function (e) { commit(e.target.value); },
        onblur: function () { cancel(); }
      }, field.options.map(function (o) {
        var opt = el("option", { value: o }, [o]);
        if (o === field.value) opt.setAttribute("selected", "selected");
        return opt;
      }));
      setTimeout(function () { select.focus(); }, 0);
      return select;
    }
    var input = el("input", {
      class: "sf-field__input",
      type: field.type === "date" ? "date" : "text",
      value: field.value,
      onkeydown: function (e) {
        if (e.key === "Enter") commit(e.target.value);
        if (e.key === "Escape") cancel();
      },
      onblur: function (e) { commit(e.target.value); }
    }, []);
    setTimeout(function () { input.focus(); if (input.select) input.select(); }, 0);
    return input;
  }

  function fieldValueNode(field) {
    var el = LM.el;
    var text = displayValue(field);
    // Stage used to render as a lozenge in the highlights panel's quick-fields
    // row; now that row is gone, keep that treatment here instead of losing it.
    if (field.key === "stage") return el("span", { class: "sf-lozenge" }, [text]);
    return el("span", { class: "sf-field__value" }, [text]);
  }

  function renderFieldItem(field) {
    var el = LM.el;
    var isEditing = RFQConfig.state.editingKey === field.key;
    var labelRow = el("div", { class: "sf-field__label" }, [
      field.label,
      field.required ? el("span", { class: "sf-field__req" }, ["*"]) : null
    ]);

    var body;
    if (!field.editable) {
      body = el("div", { class: "sf-field__display" }, [
        fieldValueNode(field)
      ]);
    } else if (isEditing) {
      body = renderFieldEditor(field);
    } else {
      body = el("div", {
        class: "sf-field__display",
        onclick: function () { RFQConfig.state.editingKey = field.key; RFQConfig.renderApp(); }
      }, [
        fieldValueNode(field),
        el("span", { class: "sf-field__pencil" }, ["✎"])
      ]);
    }

    var spanClass = field.span ? " sf-field--span-" + field.span : "";
    return el("div", { class: "sf-field" + (field.editable ? " sf-field--editable" : "") + spanClass }, [labelRow, body]);
  }

  RFQConfig.renderOpportunityInformationSection = function renderOpportunityInformationSection() {
    var el = LM.el;
    var state = RFQConfig.state;

    var head = el("div", { class: "sf-section__head" }, [
      el("div", { class: "sf-section__title" }, [
        el("div", { class: "sf-section__bar" }),
        el("h2", {}, ["Opportunity Information"])
      ]),
      state.dirty ? el("span", { class: "sf-unsaved-chip" }, ["Unsaved changes"]) : null
    ]);

    var grid = el("div", { class: "sf-field-grid" }, state.fields.map(renderFieldItem));

    // No own card wrapper: app.js merges this into one bordered card together
    // with the Highlights panel right above it.
    return el("div", {}, [head, grid]);
  };
})(window.RFQConfig, window.LM);
