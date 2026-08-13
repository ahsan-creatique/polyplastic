/* ---------------- Child component: TopBar ---------------- */
window.RFQConfig = window.RFQConfig || {};

(function (RFQConfig, LM) {
  "use strict";

  RFQConfig.renderTopBar = function renderTopBar() {
    var el = LM.el;
    var state = RFQConfig.state;

    var nav = el("div", { class: "sf-topbar__nav" }, [
      el("a", { href: "#" }, ["Home"]),
      el("a", { class: "is-active", href: "#" }, ["Opportunities"]),
      el("a", { href: "#" }, ["Accounts"]),
      el("a", { href: "#" }, ["Contacts"]),
      el("a", { href: "#" }, ["Reports"]),
      el("a", { href: "#" }, ["Dashboards"])
    ]);

    var roleSelect = el("select", {
      onchange: function (e) { state.roleId = e.target.value; RFQConfig.renderApp(); }
    }, RFQConfig.ROLES.map(function (r) {
      var opt = el("option", { value: r.id }, [r.name + " — " + r.team]);
      if (r.id === state.roleId) opt.setAttribute("selected", "selected");
      return opt;
    }));

    var role = RFQConfig.currentRole();

    return el("div", { class: "sf-topbar" }, [
      el("div", { class: "sf-topbar__brand" }, [
        el("div", { class: "sf-appgrid" }, [el("span"), el("span"), el("span"), el("span")]),
        el("div", { class: "sf-topbar__app" }, ["Sales"])
      ]),
      nav,
      el("div", { class: "sf-topbar__spacer" }),
      el("div", { class: "sf-topbar__right" }, [
        el("div", { class: "sf-role-switcher", title: "Switch demo persona" }, [roleSelect]),
        el("div", { class: "sf-avatar", title: role.name + " — " + role.team }, [role.initials])
      ])
    ]);
  };
})(window.RFQConfig, window.LM);
