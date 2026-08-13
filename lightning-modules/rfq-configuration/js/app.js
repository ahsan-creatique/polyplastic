/* =====================================================================
   PARENT COMPONENT: RfqConfigurationPage
   Owns page-level state (persona, field values) and mounts the child
   components declared in js/components/*.js into #rfq-root. To add a
   new sub-component: create js/components/my-thing.js that assigns
   RFQConfig.renderMyThing, list it in index.html BEFORE this file, and
   call it from renderApp() below the same way the four others are.
===================================================================== */

window.RFQConfig = window.RFQConfig || {};

(function (RFQConfig, LM) {
  "use strict";

  RFQConfig.ROLES = [
    { id: "feasibility", name: "Ravi", team: "Feasibility Team", initials: "RV" },
    { id: "cop", name: "Anurag", team: "COP Team", initials: "AN" },
    { id: "kam", name: "Harish", team: "KAM", initials: "HR" }
  ];

  var STAGE_OPTIONS = [
    "Draft", "Feasibility Study", "Ready for Costing", "Costing Updated",
    "Awaiting for Margin", "Ready for Quotation", "Close Won", "Close Lost",
    "Not Feasible", "Rejected"
  ];

  function todayIso() {
    // Fixed reference date for this demo build (kept stable across renders).
    return "2026-08-10";
  }
  var TODAY = todayIso();

  function initialFields() {
    return [
      { key: "oppName", label: "Opportunity Name", type: "text", editable: true, required: true, value: "Suzuki SPX03 Grill INQ 2026" },
      { key: "custName", label: "Customer Name", type: "text", editable: true, required: true, value: "Maruti Suzuki GGN" },
      { key: "custCode", label: "Customer Code", type: "text", editable: false, value: "0000043" },
      { key: "stage", label: "Stage Name", type: "picklist", editable: true, value: "Feasibility Study", options: STAGE_OPTIONS },
      { key: "date", label: "Date", type: "date", editable: true, value: TODAY },
      { key: "closeDate", label: "Close Date", type: "date", editable: true, value: LM.addDaysIso(TODAY, 20) },
      { key: "custRefNo", label: "Customer Ref. No.", type: "text", editable: true, value: "MS000232S" },
      { key: "custRfqDate", label: "Customer RFQ Date", type: "date", editable: true, value: LM.addDaysIso(TODAY, -1) },
      { key: "oemName", label: "OEM Name", type: "text", editable: true, value: "Maruti Suzuki" },
      { key: "supplyCondition", label: "Supply Condition", type: "picklist", editable: true, value: "SPD", options: ["OE", "SPD", "Accessories"] },
      { key: "supply", label: "Supply", type: "picklist", editable: true, value: "Domestic", options: ["EXPORT", "DOMESTIC"] },
      { key: "location", label: "City / State / Country", type: "text", editable: false, value: "Ahmedabad, Gujarat, India", span: 2 }
    ];
  }

  RFQConfig.initialFields = initialFields;

  function initialPartFields() {
    return [
      { key: "partName", label: "Part Name", type: "text", editable: true, required: true, value: "YFG 27MC" },
      { key: "projectName", label: "Project Name", type: "text", editable: true, value: "Y2V-NM" },
      { key: "partCommodity", label: "Part Commodity", type: "text", editable: true, value: "BEZEL" },
      { key: "nepNo", label: "NEP No.", type: "text", editable: false, value: "N-000057032" },
      { key: "application", label: "Application", type: "picklist", editable: true, value: "Interior", options: ["Interior", "Exterior"] },
      { key: "partFolio", label: "Part Folio", type: "picklist", editable: true, value: "Auto", options: ["Auto", "White Goods", "Others"] },
      { key: "designType", label: "Design Type", type: "picklist", editable: true, value: "B2P", options: ["B2P", "B2S"] },
      { key: "partSize", label: "Part Size", type: "text", editable: true, value: "160 x 70 x 30" },
      { key: "surfaceFinish", label: "Surface Finish", type: "text", editable: true, value: "" },
      { key: "process", label: "Process", type: "picklist", editable: true, value: "Existing", options: ["Existing", "New", "Special"] },
      { key: "toolScope", label: "Tool Scope", type: "picklist", editable: true, value: "PIPL", options: ["PIPL", "Customer"] },
      { key: "piplSupplyLocation", label: "PIPL Supply Location", type: "text", editable: true, value: "" },
      { key: "annualVolume", label: "Annual Volume", type: "text", editable: true, value: "930000" },
      { key: "packagingType", label: "Packaging Type", type: "text", editable: true, value: "" },
      { key: "sopDate", label: "SOP Date", type: "date", editable: true, value: TODAY }
    ];
  }

  RFQConfig.initialPartFields = initialPartFields;

  // Header Material always mirrors Part Name, and UOM is always NOS — neither
  // varies per row, so rows only carry the fields the user actually fills in.
  RFQConfig.FIXED_UOM = "NOS";

  // Every default process level, in order — used to give GRILL/GARNISH RH/
  // GARNISH LH a fully seeded Part Configuration (Raw Material + Process
  // rows, with real totals) instead of starting blank.
  var FULL_PROCESS_LEVELS = ["MOLDING", "PLATING", "PAINTING", "BOP ASSEMBLY", "NON RETURNABLE PACKAGING"];

  function initialAssemblyRows() {
    return [
      {
        id: 1, componentMaterial: "GRILL", quantity: "1",
        processLevels: RFQConfig.buildSeededProcessLevels(FULL_PROCESS_LEVELS),
        partPicture: "https://rukminim2.flixcart.com/image/1536/1536/l1dwknk0/car-grill-cover/r/y/7/bentley-style-front-full-chrome-grill-compatible-with-ertiga-original-imagcysqqtc5p9hw.jpeg?q=90",
        materialInfo: { moldSize: "1200 X 400 X 450", noOfCavity: "1", moldWeight: "4500" }
      },
      {
        id: 2, componentMaterial: "GARNISH RH", quantity: "1",
        processLevels: RFQConfig.buildSeededProcessLevels(FULL_PROCESS_LEVELS),
        materialInfo: { moldSize: "600 X 350 X 450", noOfCavity: "2", moldWeight: "2500" }
      },
      {
        id: 3, componentMaterial: "GARNISH LH", quantity: "1",
        processLevels: RFQConfig.buildSeededProcessLevels(FULL_PROCESS_LEVELS),
        materialInfo: { moldSize: "600 X 350 X 450", noOfCavity: "2", moldWeight: "2500" }
      },
      {
        id: 4, componentMaterial: "LOGO", quantity: "1",
        // All 5 level cards show up like every other component, but Level
        // 4 and Level 5 default to --None-- (blank value) — a level only
        // counts toward Raw Material Cost / Process Cost once a process is
        // actually selected for it, so LOGO's default configuration only
        // costs out Molding/Plating/Painting until a user picks something
        // for the other two.
        processLevels: RFQConfig.buildSeededProcessLevels(["MOLDING", "PLATING", "PAINTING", "", ""]),
        partPicture: "https://m.media-amazon.com/images/I/51NYlkjmlEL._AC_UF1000,1000_QL80_.jpg",
        materialInfo: { moldSize: "450 X 300 X 350", noOfCavity: "2", moldWeight: "500" }
      }
    ];
  }

  RFQConfig.initialAssemblyRows = initialAssemblyRows;

  // Seeded to match the Feasibility of Tooling reference sheet — component
  // quantities are keyed by the matching Part Assembly Detail row id
  // (1=GRILL, 2=GARNISH RH, 3=GARNISH LH, 4=LOGO per initialAssemblyRows).
  function initialToolingProcessRows() {
    return [
      { id: 1, process: "MOLDING", lot: "MOLD", qtyByComponent: { 1: "1", 3: "1", 2: "1", 4: "1" } },
      { id: 2, process: "MOLDING", lot: "CHECKING FIXTURE", qtyByComponent: { 1: "1", 3: "1", 2: "1" } },
      { id: 3, process: "MOLDING", lot: "COOLING FIXTURE", qtyByComponent: { 3: "1", 2: "1" } },
      { id: 4, process: "MOLDING", lot: "WARPAGE GAUGE", qtyByComponent: { 3: "1", 2: "1", 4: "1" } },
      { id: 5, process: "PLATING", lot: "PLATING HANGER", qtyByComponent: { 3: "1", 2: "1", 4: "1" } },
      { id: 6, process: "PLATING", lot: "CD GAUGE", qtyByComponent: { 3: "1", 2: "1" } },
      { id: 7, process: "PLATING", lot: "WARPAGE GAUGE", qtyByComponent: { 1: "1", 2: "1", 4: "1" } },
      { id: 8, process: "PLATING", lot: "CHECKING FIXTURE", qtyByComponent: { 3: "1", 2: "1" } },
      { id: 9, process: "PLATING", lot: "MASKING JIG", qtyByComponent: { 4: "1" } },
      { id: 10, process: "PAINTING", lot: "PAINTING HANGER", qtyByComponent: { 1: "1" } },
      { id: 11, process: "PAINTING", lot: "MASKING JIG", qtyByComponent: { 1: "1" } },
      { id: 12, process: "PAINTING", lot: "RESTING JIG", qtyByComponent: { 1: "1" } },
      { id: 13, process: "ASSEMBLY", lot: "SPM", qtyByComponent: { 1: "1", 3: "1", 2: "1", 4: "1" } },
      { id: 14, process: "ASSEMBLY", lot: "TAPE CUTTING DIE", qtyByComponent: { 4: "1" } },
      { id: 15, process: "ASSEMBLY", lot: "FOAM CUTTING DIE", qtyByComponent: { 4: "1" } },
      { id: 16, process: "ASSEMBLY", lot: "RELEASE PAPER CUTTING DIE", qtyByComponent: { 4: "1" } },
      { id: 17, process: "ASSEMBLY", lot: "CHECKING FIXTURE", qtyByComponent: { 1: "1", 3: "1", 2: "1" } },
      { id: 18, process: "ASSEMBLY", lot: "TAPE PRESSING FIXTURE", qtyByComponent: { 4: "1" } }
    ];
  }

  RFQConfig.initialToolingProcessRows = initialToolingProcessRows;

  // Seeded to match the Feasibility of Testing reference sheet — same
  // component-quantity keying as initialToolingProcessRows (1=GRILL,
  // 2=GARNISH RH, 3=GARNISH LH, 4=LOGO).
  function initialTestingFeasibilityRows() {
    return [
      { id: 1, process: "MOLDING", lot: "RAW MATERIAL", qtyByComponent: { 1: "1", 3: "1", 2: "1", 4: "1" } },
      { id: 2, process: "PLATING", lot: "PLATING TESTING", qtyByComponent: { 3: "1", 2: "1", 4: "1" } },
      { id: 3, process: "PAINTING", lot: "PAINTING RM TESTING", qtyByComponent: { 1: "1" } },
      { id: 4, process: "PAINTING", lot: "PART PERFORMANCE TESTING", qtyByComponent: { 1: "1" } },
      { id: 5, process: "ASSEMBLY", lot: "BOPC PART TESTING", qtyByComponent: { 1: "1", 3: "1", 2: "1", 4: "1" } },
      { id: 6, process: "ASSEMBLY", lot: "PART PERFORMANCE TESTING", qtyByComponent: { 1: "1", 3: "1", 2: "1", 4: "1" } }
    ];
  }

  RFQConfig.initialTestingFeasibilityRows = initialTestingFeasibilityRows;

  // Seeded to match the Costing of Testing reference sheet. Keyed by the
  // matching Testing Feasibility row id (see initialTestingFeasibilityRows)
  // → { componentId: amount }, same component-id keying as elsewhere
  // (1=GRILL, 2=GARNISH RH, 3=GARNISH LH, 4=LOGO).
  function initialCostingOfTesting() {
    return {
      internal: {
        2: { 3: "7000", 2: "7000", 4: "7000" },
        3: { 1: "50000" },
        4: { 1: "50000" },
        5: { 1: "40000", 2: "40000", 3: "40000", 4: "40000" },
        6: { 1: "50000" }
      },
      external: {
        1: { 1: "20000", 2: "20000", 3: "20000", 4: "20000" },
        3: { 1: "100000" }
      }
    };
  }

  RFQConfig.initialCostingOfTesting = initialCostingOfTesting;

  // Seeded to match the Design Hours reference sheet — component hours are
  // keyed by the matching Part Assembly Detail row id (1=GRILL, 2=GARNISH
  // RH, 3=GARNISH LH, 4=LOGO per initialAssemblyRows).
  function initialDesignHoursRows() {
    return [
      { key: "productDesignB2P", qtyByComponent: {} },
      { key: "productDesignB2S", qtyByComponent: { 1: "200", 3: "150", 4: "100" } },
      { key: "moldFlowAnalysis", qtyByComponent: { 1: "20", 3: "20", 4: "20" } },
      { key: "caeAnalysis", qtyByComponent: {} }
    ];
  }

  RFQConfig.initialDesignHoursRows = initialDesignHoursRows;

  // Seeded to match the LOT Information reference sheet — same
  // component-id keying as initialDesignHoursRows (1=GRILL, 2=GARNISH RH,
  // 3=GARNISH LH, 4=LOGO). PROJECT MANAGEMENT carries hour values; every
  // other row carries "Y"/"N" flags.
  function initialLotInformationRows() {
    return [
      { key: "projectManagement", qtyByComponent: { 1: "1100", 3: "800", 4: "500" } },
      { key: "rmPlasticGranulesTrial", qtyByComponent: { 1: "Y", 2: "Y", 3: "Y", 4: "Y" } },
      { key: "rmPaintTrial", qtyByComponent: { 1: "Y" } },
      { key: "partLogisticsBeforeSop", qtyByComponent: { 1: "Y" } },
      { key: "trialVisitCostDomestic", qtyByComponent: { 1: "Y", 2: "Y", 3: "Y", 4: "Y" } },
      { key: "trialVisitCostOverseas", qtyByComponent: {} },
      { key: "toolShipmentCost", qtyByComponent: { 1: "Y", 2: "Y", 3: "Y", 4: "Y" } }
    ];
  }

  RFQConfig.initialLotInformationRows = initialLotInformationRows;

  // Seeded to match the Design Cost reference sheet — same component-id
  // keying as initialDesignHoursRows (1=GRILL, 2=GARNISH RH, 3=GARNISH LH,
  // 4=LOGO), same line items as Design Hours but in INR.
  function initialDesignCostRows() {
    return [
      { key: "productDesignB2P", qtyByComponent: {} },
      { key: "productDesignB2S", qtyByComponent: { 1: "160000", 3: "120000", 4: "80000" } },
      { key: "moldFlowAnalysis", qtyByComponent: { 1: "30000", 3: "30000", 4: "30000" } },
      { key: "caeAnalysis", qtyByComponent: {} }
    ];
  }

  RFQConfig.initialDesignCostRows = initialDesignCostRows;

  // Seeded to match the PPAP Cost reference sheet — same component-id
  // keying as initialDesignCostRows, same line items as LOT Information
  // but every row is a plain INR amount.
  function initialPpapCostRows() {
    return [
      { key: "projectManagement", qtyByComponent: { 1: "440000", 3: "320000", 4: "200000" } },
      { key: "rmPlasticGranulesTrial", qtyByComponent: { 1: "150000", 3: "100000", 4: "50000" } },
      { key: "rmPaintTrial", qtyByComponent: { 1: "70000" } },
      { key: "partLogisticsBeforeSop", qtyByComponent: { 1: "20000" } },
      { key: "trialVisitCostDomestic", qtyByComponent: { 1: "25000", 3: "25000", 4: "25000" } },
      { key: "trialVisitCostOverseas", qtyByComponent: {} },
      { key: "toolShipmentCost", qtyByComponent: {} }
    ];
  }

  RFQConfig.initialPpapCostRows = initialPpapCostRows;

  RFQConfig.DEFAULT_PART_PICTURE = "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSghMd_X-N_v4QHSANeBdbzPQY2Fs45itDWSRvT2SvE0slsf1Vn6nyfAqGtTR6LA78CRAFXMdH7RcHCNPDI5r1uKRVPhaTEU2Xdv6C_m9LeO7ZKKNCvfPHkJA";

  RFQConfig.assemblyRowById = function assemblyRowById(rowId) {
    var rows = RFQConfig.state.assemblyRows;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].id === rowId) return rows[i];
    }
    return null;
  };

  RFQConfig.state = {
    roleId: RFQConfig.ROLES[0].id,
    fields: initialFields(),
    partFields: initialPartFields(),
    assemblyRows: initialAssemblyRows(),
    assemblyNextId: 5,
    partConfigModal: { open: false, rowId: null, componentMaterial: "" },
    // User-resized column widths (in px) for the Part Configuration tables,
    // keyed by a stable table id — survives re-renders since the tables
    // themselves are rebuilt from scratch every time.
    columnWidths: {},
    processFeasibility: { rawOpen: true, processOpen: true },
    toolingProcessQuantity: { rows: initialToolingProcessRows(), nextId: 19 },
    componentMaterialAccordion: {},
    testingFeasibilityQuantity: { rows: initialTestingFeasibilityRows(), nextId: 7 },
    costingOfTesting: initialCostingOfTesting(),
    designHours: { rows: initialDesignHoursRows() },
    lotInformation: { rows: initialLotInformationRows() },
    designCost: { rows: initialDesignCostRows() },
    ppapCost: { rows: initialPpapCostRows() },
    // Total Part Cost sub-tab — Forwarding (INR) and Overhead/Profit
    // (%age) are the only user-entered fields, keyed by assembly row id;
    // Raw Material Cost / Process Cost are rolled up from each
    // component's Part Configuration levels instead of stored here.
    totalPartCost: { forwarding: {}, overheadPct: {}, profitPct: {} },
    assemblyTab: "process-feasibility",
    toolingSubTab: "tooling-process-quantity",
    designDevSubTab: "design-development-feasibility",
    costingSubTab: "total-part-cost",
    // Data URL of the uploaded part photo, or the default placeholder photo
    // until the user removes/replaces it.
    partPicture: RFQConfig.DEFAULT_PART_PICTURE,
    editingKey: null,
    dirty: false
  };

  RFQConfig.fieldByKey = function fieldByKey(key) {
    var fields = RFQConfig.state.fields;
    for (var i = 0; i < fields.length; i++) {
      if (fields[i].key === key) return fields[i];
    }
    return null;
  };

  RFQConfig.partFieldByKey = function partFieldByKey(key) {
    var fields = RFQConfig.state.partFields;
    for (var i = 0; i < fields.length; i++) {
      if (fields[i].key === key) return fields[i];
    }
    return null;
  };

  RFQConfig.currentRole = function currentRole() {
    var roleId = RFQConfig.state.roleId;
    for (var i = 0; i < RFQConfig.ROLES.length; i++) {
      if (RFQConfig.ROLES[i].id === roleId) return RFQConfig.ROLES[i];
    }
    return RFQConfig.ROLES[0];
  };

  RFQConfig.renderApp = function renderApp() {
    var root = document.getElementById("rfq-root");
    root.innerHTML = "";
    root.appendChild(RFQConfig.renderTopBar());

    // Part Configuration opens as its own full screen (replacing the main
    // dashboard below the top bar) rather than an overlay on top of it.
    if (RFQConfig.state.partConfigModal.open) {
      root.appendChild(RFQConfig.renderPartConfigScreen());
      return;
    }

    // Highlights, Opportunity Information, and Part Detail Information are
    // merged into one bordered card (hairline dividers between them) instead
    // of separate cards with a gap.
    var recordCard = LM.el("section", { class: "sf-card" }, [
      RFQConfig.renderHighlightsPanel(),
      RFQConfig.renderOpportunityInformationSection(),
      RFQConfig.renderPartDetailInformationSection()
    ]);

    var main = LM.el("div", { class: "sf-main" }, [
      RFQConfig.renderBreadcrumb(),
      recordCard,
      RFQConfig.renderPartAssemblyDetailSection(),
      RFQConfig.renderPartAssemblyTabsSection(),
      // Reserved mount point for upcoming sub-components (per-role panels,
      // related lists, tabs, etc.) added in later iterations.
      LM.el("div", { class: "sf-extension-zone", id: "rfq-extension-zone" })
    ]);
    root.appendChild(main);
  };

  RFQConfig.renderApp();
})(window.RFQConfig, window.LM);
