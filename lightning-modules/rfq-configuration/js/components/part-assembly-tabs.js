/* ---------------- Child component: PartAssemblyTabsSection ---------------- */
window.RFQConfig = window.RFQConfig || {};

(function (RFQConfig, LM) {
  "use strict";

  // Each tab's content is its own component — for now only "Process
  // Feasibility" has one wired up; the rest render a reserved placeholder
  // until their components are built in a later pass.
  var TABS = [
    { key: "process-feasibility", label: "Part Feasibility" },
    { key: "tooling-feasibility", label: "Tooling Feasibility" },
    { key: "testing-feasibility", label: "Testing Feasibility" },
    { key: "design-development", label: "Design & Development" },
    { key: "costing", label: "Costing" }
  ];

  // Sub-tabs shown inside the "Tooling Feasibility" tab.
  var TOOLING_SUB_TABS = [
    { key: "tooling-process-quantity", label: "List of Tooling", render: function () { return RFQConfig.renderToolingProcessQuantityBody(); } },
    { key: "component-material-information", label: "Tooling Construction", render: function () { return RFQConfig.renderComponentMaterialInformationBody(); } }
  ];

  // Sub-tabs shown inside the "Design & Development" tab — no components
  // built for these yet, so each renders the same reserved placeholder the
  // top-level tabs use until a later pass wires up real content.
  var DESIGN_DEV_SUB_TABS = [
    {
      key: "design-development-feasibility", label: "Design & Development Feasibility",
      render: function () {
        return LM.el("div", {}, [
          RFQConfig.renderDesignHoursBody(),
          LM.el("hr", { class: "sf-tab-section-divider" }, []),
          RFQConfig.renderLotInformationBody()
        ]);
      }
    },
    {
      key: "costing-of-design-development", label: "Cost Of Design & Development",
      render: function () {
        return LM.el("div", {}, [
          RFQConfig.renderDesignCostBody(),
          LM.el("hr", { class: "sf-tab-section-divider" }, []),
          RFQConfig.renderPpapCostBody()
        ]);
      }
    }
  ];

  // Sub-tabs shown inside the "Costing" tab — no components built for
  // these yet, so each renders the same reserved placeholder the
  // top-level tabs use until a later pass wires up real content.
  var COSTING_SUB_TABS = [
    { key: "total-part-cost", label: "Total Part Cost", render: function () { return RFQConfig.renderTotalPartCostBody(); } },
    { key: "manufacturing-cost", label: "Manufacturing Cost", render: function () { return RFQConfig.renderManufacturingCostBody(); } }
  ];

  function setActiveTab(key) {
    RFQConfig.state.assemblyTab = key;
    RFQConfig.renderApp();
  }

  function renderReservedPlaceholder(label) {
    return LM.el("div", { class: "sf-table__empty" }, [
      "The " + label + " component will be added here in an upcoming update."
    ]);
  }

  function renderTabButton(tab) {
    var el = LM.el;
    var isActive = RFQConfig.state.assemblyTab === tab.key;
    return el("button", {
      class: "sf-assembly-tab" + (isActive ? " sf-assembly-tab--active" : ""),
      onclick: function () { setActiveTab(tab.key); }
    }, [tab.label]);
  }

  function renderSubTabButton(tab, activeKey, onSelect) {
    var el = LM.el;
    var isActive = activeKey === tab.key;
    return el("button", {
      class: "sf-subtab" + (isActive ? " sf-subtab--active" : ""),
      onclick: function () { onSelect(tab.key); }
    }, [tab.label]);
  }

  // Generic sub-tab strip + body — `stateKey` is the RFQConfig.state field
  // that tracks which of `tabs` is active, so each tab group (Tooling,
  // Design & Development, ...) keeps its own independent selection.
  function renderSubTabbedContent(tabs, stateKey) {
    var el = LM.el;
    var activeKey = RFQConfig.state[stateKey];
    var active = tabs.filter(function (t) { return t.key === activeKey; })[0] || tabs[0];

    var subTabBar = el("div", { class: "sf-subtabs" }, tabs.map(function (tab) {
      return renderSubTabButton(tab, activeKey, function (key) {
        RFQConfig.state[stateKey] = key;
        RFQConfig.renderApp();
      });
    }));
    var subContent = el("div", { class: "sf-subtab-body" }, [active.render()]);

    return el("div", {}, [subTabBar, subContent]);
  }

  function renderActiveTabContent() {
    var el = LM.el;
    var key = RFQConfig.state.assemblyTab;

    if (key === "process-feasibility") return RFQConfig.renderProcessFeasibilityBody();
    if (key === "tooling-feasibility") return renderSubTabbedContent(TOOLING_SUB_TABS, "toolingSubTab");
    if (key === "testing-feasibility") {
      return el("div", {}, [
        RFQConfig.renderTestingFeasibilityQuantityBody(),
        el("hr", { class: "sf-tab-section-divider" }, []),
        RFQConfig.renderCostingOfTestingBody()
      ]);
    }
    if (key === "design-development") return renderSubTabbedContent(DESIGN_DEV_SUB_TABS, "designDevSubTab");
    if (key === "costing") return renderSubTabbedContent(COSTING_SUB_TABS, "costingSubTab");

    var tab = TABS.filter(function (t) { return t.key === key; })[0];
    return renderReservedPlaceholder(tab ? tab.label : "");
  }

  RFQConfig.renderPartAssemblyTabsSection = function renderPartAssemblyTabsSection() {
    var el = LM.el;

    var tabBar = el("div", { class: "sf-assembly-tabs" }, TABS.map(renderTabButton));
    var content = el("div", { class: "sf-assembly-tab-body" }, [renderActiveTabContent()]);

    return el("section", { class: "sf-card" }, [tabBar, content]);
  };
})(window.RFQConfig, window.LM);
