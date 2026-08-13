/* ---------------- Child component: Breadcrumb ---------------- */
window.RFQConfig = window.RFQConfig || {};

(function (RFQConfig, LM) {
  "use strict";

  RFQConfig.renderBreadcrumb = function renderBreadcrumb() {
    var el = LM.el;
    var opp = RFQConfig.fieldByKey("oppName");
    return el("div", { class: "sf-breadcrumb" }, [
      el("a", { href: "#" }, ["Opportunities"]),
      el("span", { class: "sf-breadcrumb__sep" }, ["›"]),
      el("span", {}, [opp.value])
    ]);
  };
})(window.RFQConfig, window.LM);
