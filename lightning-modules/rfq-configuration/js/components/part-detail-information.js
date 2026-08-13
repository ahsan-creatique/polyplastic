/* ---------------- Child component: PartDetailInformationSection ---------------- */
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

    return el("div", { class: "sf-field" + (field.editable ? " sf-field--editable" : "") }, [labelRow, body]);
  }

  function handlePictureFile(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      RFQConfig.state.partPicture = reader.result;
      RFQConfig.state.dirty = true;
      RFQConfig.renderApp();
    };
    reader.readAsDataURL(file);
  }

  function removePicture(e) {
    e.stopPropagation();
    RFQConfig.state.partPicture = null;
    RFQConfig.state.dirty = true;
    RFQConfig.renderApp();
  }

  function renderPartPictureSection() {
    var el = LM.el;
    var picture = RFQConfig.state.partPicture;

    var fileInput = el("input", {
      type: "file",
      accept: "image/*",
      class: "sf-part-picture__file-input",
      onchange: function (e) { handlePictureFile(e.target.files[0]); }
    }, []);

    var body;
    if (picture) {
      body = el("div", { class: "sf-part-picture" }, [
        el("img", { class: "sf-part-picture__preview", src: picture, alt: "Part picture" }, []),
        el("div", { class: "sf-part-picture__actions" }, [
          el("button", {
            class: "sf-btn sf-btn--secondary sf-btn--sm",
            onclick: function () { fileInput.click(); }
          }, ["Change"]),
          el("button", {
            class: "sf-btn sf-btn--sm",
            onclick: removePicture
          }, ["Remove"])
        ]),
        fileInput
      ]);
    } else {
      body = el("div", {
        class: "sf-part-picture sf-part-picture--empty",
        onclick: function () { fileInput.click(); }
      }, [
        el("span", { class: "sf-part-picture__icon" }, ["⬆"]),
        el("span", { class: "sf-part-picture__hint" }, ["Click to upload part picture"]),
        fileInput
      ]);
    }

    var head = el("div", { class: "sf-section__head sf-section__head--sub" }, [
      el("div", { class: "sf-section__title" }, [
        el("div", { class: "sf-section__bar" }),
        el("h2", {}, ["Part Picture"])
      ])
    ]);

    return el("div", {}, [
      el("hr", { class: "sf-section-divider" }, []),
      head,
      el("div", { class: "sf-part-picture-body" }, [body])
    ]);
  }

  RFQConfig.renderPartDetailInformationSection = function renderPartDetailInformationSection() {
    var el = LM.el;
    var state = RFQConfig.state;

    var nepNo = RFQConfig.partFieldByKey("nepNo");
    var head = el("div", { class: "sf-section__head" }, [
      el("div", { class: "sf-section__title" }, [
        el("div", { class: "sf-section__bar" }),
        el("h2", {}, ["Part Detail Information"]),
        nepNo && nepNo.value ? el("span", { class: "sf-lozenge" }, [nepNo.value]) : null
      ])
    ]);

    var grid = el("div", { class: "sf-field-grid" }, state.partFields.map(renderFieldItem));

    // No own card wrapper: app.js merges this into the same bordered card as
    // Highlights and Opportunity Information above it.
    return el("div", {}, [
      el("hr", { class: "sf-section-divider" }, []),
      head,
      grid,
      renderPartPictureSection()
    ]);
  };
})(window.RFQConfig, window.LM);
