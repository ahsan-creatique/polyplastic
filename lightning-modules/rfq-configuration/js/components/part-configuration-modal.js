/* ---------------- Child component: PartConfigurationModal ---------------- */
window.RFQConfig = window.RFQConfig || {};

(function (RFQConfig, LM) {
  "use strict";

  var PROCESS_OPTIONS = ["MOLDING", "PLATING", "PAINTING", "BOP ASSEMBLY", "NON RETURNABLE PACKAGING"];
  var DEFAULT_LEVEL_COUNT = 5;
  var DEFAULT_LEVEL_VALUES = ["MOLDING", "PLATING", "PAINTING", "BOP ASSEMBLY", "NON RETURNABLE PACKAGING"];

  var RAW_MATERIAL_TYPES = ["PG", "BOPC"];

  // Item master for the MOLDING raw material table — drives the Item
  // Description suggestions per Type, and the auto-fill on selection.
  var MOLDING_ITEM_MASTER = [
    { type: "PG", code: "RMPG-ABEP-NT00", description: "ABS ELECTROPLATING GRADE (GROSS WT)", uom: "G", supplier: "Styrolution" },
    { type: "PG", code: "RMPG-MBSP-BK01", description: "MASTER BATCH", uom: "%", supplier: "Styrolution" },
    { type: "PG", code: "RMPG-ABRN-NT01", description: "RUNNER", uom: "G", supplier: "Styrolution" },
    { type: "BOPC", code: "BOHD-SCMS-0012", description: "SCREW M4 X 10", uom: "EA", supplier: "Styrolution" }
  ];

  // Fixed, finite checklist for the MOLDING process table — no add/remove,
  // only Spec is user-editable.
  var MOLDING_PROCESS_ITEMS = [
    { description: "INJECTION MOLDING MACHINE", uom: "TON", spec: "100" },
    { description: "CYCLE TIME", uom: "SEC", spec: "50" },
    { description: "NUMBER OF CAVITY", uom: "NOS", spec: "2" },
    { description: "DEFLASHING ( NO OF PARTS / HOUR / PERSON )", uom: "NOS", spec: "60" },
    { description: "REJECTION", uom: "%", spec: "2" }
  ];

  // PLATING raw material: 4 area items always present (non-removable), plus
  // a searchable/removable list seeded from these consumables, plus a
  // trailing Rejection row (also always present, non-removable).
  var PLATING_FIXED_AREA_ITEMS = [
    { description: "'A' SURFACE AREA", uom: "CM2", qty: "20.450" },
    { description: "'B' SURFACE AREA", uom: "CM2", qty: "28.320" },
    { description: "PLATING PIN SURFACE AREA", uom: "CM2", qty: "2.000" },
    { description: "TOTAL SURFACE AREA", uom: "CM2", qty: "32.560" }
  ];
  var PLATING_ITEM_MASTER = [
    { description: "PVC PLUG", uom: "NOS" },
    { description: "PVC CAP", uom: "NOS" },
    { description: "MASKING CHEMICALS", uom: "ML/CM2" }
  ];
  var PLATING_OPTIONAL_SEED_QTY = { "PVC PLUG": "2.000", "PVC CAP": "0", "MASKING CHEMICALS": "0" };

  // Fixed, finite checklist for the PLATING process table — no add/remove;
  // only Qty and Cust. Spec are user-editable.
  var PLATING_PROCESS_ITEMS = [
    { description: "TOTAL SURFACE AREA", uom: "CM2", qty: "32.560" },
    { description: "PLATING TYPE", uom: "", qty: "" },
    { description: "REJECTION %AGE", uom: "%", qty: "10.5" },
    { description: "NUMBER OF PARTS / FLIGHT BAR", uom: "NOS", qty: "20" }
  ];

  var PAINTING_TYPES = ["IPA CLEANING", "PRIMER COAT", "BASE COAT", "CLEAR COAT", "JIG SRIPPING", "MASKING", "DACKLE"];

  // Item master for the PAINTING raw material table — only items that carry
  // a real item code in the source sheet; supplier is BNPA for all of them.
  var PAINTING_ITEM_MASTER = [
    { type: "IPA CLEANING", code: "RMCH-ACSP-0001", description: "ISO PROPYL ALCOHOL", uom: "ML", supplier: "BNPA" },
    { type: "PRIMER COAT", code: "RMPT-PUPR-0001", description: "PRIMER", uom: "ML", supplier: "BNPA" },
    { type: "PRIMER COAT", code: "RMPT-PUHD-0001", description: "HARDENER-1", uom: "ML", supplier: "BNPA" },
    { type: "PRIMER COAT", code: "RMPT-PUTH-0001", description: "THINNER-1", uom: "ML", supplier: "BNPA" },
    { type: "BASE COAT", code: "RMPT-PUBC-0001", description: "PAINT", uom: "ML", supplier: "BNPA" },
    { type: "BASE COAT", code: "RMPT-PUHD-0002", description: "HARDENER-2", uom: "ML", supplier: "BNPA" },
    { type: "BASE COAT", code: "RMPT-PUTH-0002", description: "THINNER-2", uom: "ML", supplier: "BNPA" },
    { type: "CLEAR COAT", code: "RMPT-PULQ-0001", description: "LACQUER", uom: "ML", supplier: "BNPA" },
    { type: "CLEAR COAT", code: "RMPT-PUTH-0003", description: "THINNER-3", uom: "ML", supplier: "BNPA" },
    { type: "JIG SRIPPING", code: "RMPT-PUTH-0004", description: "THINNER", uom: "ML", supplier: "BNPA" }
  ];

  var PAINT_SHOP_TYPES = ["Semi Automatic", "Fully Automatic", "Robotic"];

  // Fixed, finite checklist for the PAINTING process table — "TYPE OF PAINT
  // SHOP" is deliberately excluded here; it's rendered as its own picklist
  // in the accordion header instead of a table row. No add/remove; only
  // Qty and Spec are user-editable.
  var PAINTING_PROCESS_ITEMS = [
    { description: "PAINTED SURFACE AREA", uom: "CM2", qty: "20.450", spec: "" },
    { description: "PART SIZE (L X B)", uom: "CM", qty: "10 X 4", spec: "" },
    { description: "NUMBER OF COATS", uom: "NOS", qty: "3", spec: "" },
    { description: "NUMBER OF PARTS / HANGER", uom: "NOS", qty: "2", spec: "" },
    { description: "NUMBER OF PARTS PAINTED / HOUR", uom: "NOS", qty: "70", spec: "" },
    { description: "NUMBER OF PARTS FOR BUFFING", uom: "%", qty: "15", spec: "" },
    { description: "NUMBER OF PARTS RE-PAINTING", uom: "%", qty: "8", spec: "" },
    { description: "REJECTION %AGE", uom: "%", qty: "6", spec: "" }
  ];

  // Item master for the BOP ASSEMBLY raw material table — no Type column
  // here (unlike Molding/Painting); Item Description alone drives the
  // UOM/Item Code/Supplier autofill. The source sheet has no item codes or
  // suppliers filled in yet, so those come through blank on match.
  var BOP_ASSEMBLY_ITEM_MASTER = [
    { code: "", description: "DSA TAPE GRADE", uom: "NOS", supplier: "" },
    { code: "", description: "BLANK SIZE", uom: "L X B", supplier: "" },
    { code: "", description: "NO OF PARTS / BLANK", uom: "NOS", supplier: "" },
    { code: "", description: "TAPE AREA PER PART", uom: "CM2", supplier: "" },
    { code: "", description: "FOAM GRADE", uom: "", supplier: "" },
    { code: "", description: "FOAM AREA PER PART", uom: "CM2", supplier: "" },
    { code: "", description: "PROTECTIVE FILM", uom: "CM2", supplier: "" },
    { code: "", description: "SCREW / NUT / PLASTIC CLIP / RING", uom: "NOS", supplier: "" },
    { code: "", description: "TAB TAPE / JOINT TAPE / PRIMER", uom: "NOS", supplier: "" },
    { code: "", description: "EPDM FOAM", uom: "", supplier: "" },
    { code: "", description: "TEMPLATE / MANUAL", uom: "NOS", supplier: "" }
  ];

  // Fixed, finite checklist for the BOP ASSEMBLY process table — no
  // add/remove; only Qty is user-editable.
  var BOP_PROCESS_ITEMS = [
    { description: "SPM MACHINE CYCLE TIME", uom: "SEC", qty: "60" },
    { description: "NUMBER OF PARTS ASSEMBLE / HOUR", uom: "NOS", qty: "70" },
    { description: "NUMBER OF PERSONS USED", uom: "NOS", qty: "2" },
    { description: "REJECTION %AGE", uom: "%", qty: "6" }
  ];

  var NRP_TYPES = ["POLY BAG", "FOAM BAG", "BUBBLE BAG", "C-BOX", "PALLET", "STRIP", "BOPP TAPE"];

  // Item master for the NON RETURNABLE PACKAGING raw material table —
  // Type drives the Item Description suggestions, same as Molding/Painting.
  var NRP_ITEM_MASTER = [
    { type: "POLY BAG", code: "COPM-PBAG-0001", description: "POLY BAG 10\" X 15\"", uom: "NOS", supplier: "" },
    { type: "FOAM BAG", code: "COPM-FBAG-0001", description: "FOAM BAG 10\" X 15\"", uom: "NOS", supplier: "" },
    { type: "BUBBLE BAG", code: "COPM-BBAG-0001", description: "BUBBLE BAG 10\" X 15\"", uom: "NOS", supplier: "" },
    { type: "C-BOX", code: "COPM-CBOX-0001", description: "C-BOX 600 X 400 X 300 MM 5 PLY", uom: "NOS", supplier: "" },
    { type: "C-BOX", code: "COPM-CBOX-0002", description: "C-BOX 1200 X 800 X 600 MM 7 PLY", uom: "NOS", supplier: "" },
    { type: "PALLET", code: "COPM-PLET-0001", description: "WOODEL PALLET 1200 X 1000 MM", uom: "NOS", supplier: "" },
    { type: "STRIP", code: "COPM-STRP-0001", description: "STRIP", uom: "M", supplier: "" },
    { type: "BOPP TAPE", code: "COPM-BTPE-0001", description: "BOPP TAPE 40 MM", uom: "ROLL", supplier: "" }
  ];

  // Fixed, finite checklist for the NON RETURNABLE PACKAGING process table —
  // no add/remove; only Qty / Hr is user-editable.
  var NRP_PROCESS_ITEMS = [
    { description: "PACKAGING / PERSON / HRS", uom: "NOS", qty: "100" }
  ];

  function cloneRawMaterialRow(r) {
    return { id: r.id, type: r.type, itemCode: r.itemCode, itemDescription: r.itemDescription, uom: r.uom, qty: r.qty, supplier: r.supplier, custSpec: r.custSpec, price: r.price };
  }

  function cloneProcessRow(r) {
    return { id: r.id, description: r.description, uom: r.uom, spec: r.spec, mhr: r.mhr };
  }

  function clonePlatingRow(r) {
    return { id: r.id, fixed: r.fixed, description: r.description, uom: r.uom, qty: r.qty, custSpec: r.custSpec, price: r.price };
  }

  function clonePlatingProcessRow(r) {
    return { id: r.id, description: r.description, uom: r.uom, qty: r.qty, custSpec: r.custSpec, mhr: r.mhr };
  }

  function clonePaintingRow(r) {
    return { id: r.id, type: r.type, itemCode: r.itemCode, itemDescription: r.itemDescription, uom: r.uom, qty: r.qty, supplier: r.supplier, custSpec: r.custSpec, price: r.price };
  }

  function clonePaintingProcessRow(r) {
    return { id: r.id, description: r.description, uom: r.uom, qty: r.qty, spec: r.spec, mhr: r.mhr };
  }

  function cloneBopRow(r) {
    return { id: r.id, itemCode: r.itemCode, itemDescription: r.itemDescription, uom: r.uom, qty: r.qty, supplier: r.supplier, custSpec: r.custSpec, price: r.price };
  }

  function cloneBopProcessRow(r) {
    return { id: r.id, description: r.description, uom: r.uom, qty: r.qty, mhr: r.mhr };
  }

  function cloneNrpRow(r) {
    return { id: r.id, type: r.type, itemCode: r.itemCode, itemDescription: r.itemDescription, uom: r.uom, qty: r.qty, supplier: r.supplier, custSpec: r.custSpec, price: r.price };
  }

  function cloneNrpProcessRow(r) {
    return { id: r.id, description: r.description, uom: r.uom, qty: r.qty, mhr: r.mhr };
  }

  function cloneLevels(levels) {
    return levels.map(function (l) {
      return {
        id: l.id,
        value: l.value,
        rawMaterialRows: l.rawMaterialRows ? l.rawMaterialRows.map(cloneRawMaterialRow) : undefined,
        rawMaterialNextId: l.rawMaterialNextId,
        // Total Raw Material Amount (Qty × Price, summed) for whichever
        // process this level represents — kept in sync on every render so
        // other components can read a level's cost straight from state
        // (row.processLevels[i].rawMaterialTotalAmount) without recomputing.
        rawMaterialTotalAmount: l.rawMaterialTotalAmount || 0,
        // Same idea as rawMaterialTotalAmount, but for whichever Process
        // table (Molding/Plating/Painting/BOP/NRP) this level uses —
        // read back later as row.processLevels[i].processTotalAmount.
        processTotalAmount: l.processTotalAmount || 0,
        partWeight: l.partWeight || "",
        rejection: l.rejection || "",
        processRows: l.processRows ? l.processRows.map(cloneProcessRow) : undefined,
        platingRows: l.platingRows ? l.platingRows.map(clonePlatingRow) : undefined,
        platingNextId: l.platingNextId,
        platingRejection: l.platingRejection || "",
        platingProcessRows: l.platingProcessRows ? l.platingProcessRows.map(clonePlatingProcessRow) : undefined,
        paintingRows: l.paintingRows ? l.paintingRows.map(clonePaintingRow) : undefined,
        paintingNextId: l.paintingNextId,
        paintingProcessRows: l.paintingProcessRows ? l.paintingProcessRows.map(clonePaintingProcessRow) : undefined,
        paintShopType: l.paintShopType || "",
        bopRows: l.bopRows ? l.bopRows.map(cloneBopRow) : undefined,
        bopNextId: l.bopNextId,
        bopProcessRows: l.bopProcessRows ? l.bopProcessRows.map(cloneBopProcessRow) : undefined,
        nrpRows: l.nrpRows ? l.nrpRows.map(cloneNrpRow) : undefined,
        nrpNextId: l.nrpNextId,
        nrpProcessRows: l.nrpProcessRows ? l.nrpProcessRows.map(cloneNrpProcessRow) : undefined
      };
    });
  }

  function defaultLevels() {
    var levels = [];
    for (var i = 1; i <= DEFAULT_LEVEL_COUNT; i++) levels.push({ id: i, value: DEFAULT_LEVEL_VALUES[i - 1] || "" });
    return levels;
  }

  // Exposed so Process Feasibility can show what a component's Process
  // Levels would default to before the user has ever opened and saved its
  // Part Configuration screen — otherwise every unconfigured component
  // reads as using no process at all.
  RFQConfig.defaultProcessLevels = defaultLevels;

  // Placeholder demo value for Price/MHR — a random 0-9, and only for rows
  // that actually carry a quantity-like value and aren't a percentage
  // (Rejection %, etc. stay blank since "qty × price" isn't meaningful
  // there).
  function demoPriceIf(quantityValue, uom) {
    if (!quantityValue || uom === "%") return "";
    return String(Math.floor(Math.random() * 10));
  }

  // Same blank-if-%-or-empty rule as demoPriceIf, but a fixed value
  // instead of a random one — used to seed the four default assembly rows
  // (see RFQConfig.buildSeededProcessLevels below) with a stable Total
  // Part Cost instead of a number that changes on every reload.
  function fixedPriceIf(quantityValue, uom) {
    if (!quantityValue || uom === "%") return "";
    return "5";
  }

  // Overwrites the random price/MHR the matching ensure*Data function just
  // seeded with the fixed demo value above, using the same row already in
  // place (qtyField holds "qty" for every raw-material/process shape
  // except Molding's Process table, which keys its quantity off "spec").
  function reseedRowPrices(rows, priceField, qtyField) {
    rows.forEach(function (row) {
      row[priceField] = fixedPriceIf(row[qtyField], row.uom);
    });
  }

  // Fully seeds one level (Raw Material + Process rows, with totals) using
  // the exact same item lists and quantities the Part Configuration modal
  // would lazily create on first open for that process — just with the
  // fixed pricing above instead of demoPriceIf's randomness, so a fresh
  // page load has a real, stable Total Part Cost instead of zero.
  function seedLevelDefaults(level) {
    if (level.value === "MOLDING") {
      ensureRawMaterialData(level);
      reseedRowPrices(level.rawMaterialRows, "price", "qty");
      level.rawMaterialTotalAmount = computeRawMaterialTotalAmount(level.rawMaterialRows);

      ensureProcessData(level);
      reseedRowPrices(level.processRows, "mhr", "spec");
      level.processTotalAmount = computeProcessTotalAmount(level.processRows, "spec");
    } else if (level.value === "PLATING") {
      ensurePlatingRawMaterialData(level);
      reseedRowPrices(level.platingRows, "price", "qty");
      level.rawMaterialTotalAmount = computeRawMaterialTotalAmount(level.platingRows);

      ensurePlatingProcessData(level);
      reseedRowPrices(level.platingProcessRows, "mhr", "qty");
      level.processTotalAmount = computeProcessTotalAmount(level.platingProcessRows, "qty");
    } else if (level.value === "PAINTING") {
      ensurePaintingRawMaterialData(level);
      reseedRowPrices(level.paintingRows, "price", "qty");
      level.rawMaterialTotalAmount = computeRawMaterialTotalAmount(level.paintingRows);

      ensurePaintingProcessData(level);
      reseedRowPrices(level.paintingProcessRows, "mhr", "qty");
      level.processTotalAmount = computeProcessTotalAmount(level.paintingProcessRows, "qty");
    } else if (level.value === "BOP ASSEMBLY") {
      ensureBopRawMaterialData(level);
      reseedRowPrices(level.bopRows, "price", "qty");
      level.rawMaterialTotalAmount = computeRawMaterialTotalAmount(level.bopRows);

      ensureBopProcessData(level);
      reseedRowPrices(level.bopProcessRows, "mhr", "qty");
      level.processTotalAmount = computeProcessTotalAmount(level.bopProcessRows, "qty");
    } else if (level.value === "NON RETURNABLE PACKAGING") {
      ensureNrpRawMaterialData(level);
      reseedRowPrices(level.nrpRows, "price", "qty");
      level.rawMaterialTotalAmount = computeRawMaterialTotalAmount(level.nrpRows);

      ensureNrpProcessData(level);
      reseedRowPrices(level.nrpProcessRows, "mhr", "qty");
      level.processTotalAmount = computeProcessTotalAmount(level.nrpProcessRows, "qty");
    }
  }

  // Exposed so app.js can give the demo assembly rows (GRILL, GARNISH RH,
  // GARNISH LH, LOGO) real Raw Material Cost / Process Cost numbers from
  // the start, instead of every component reading 0 in Total Part Cost
  // until someone manually opens and saves its Part Configuration.
  RFQConfig.buildSeededProcessLevels = function buildSeededProcessLevels(levelValues) {
    return levelValues.map(function (value, i) {
      var level = { id: i + 1, value: value };
      seedLevelDefaults(level);
      return level;
    });
  };

  // Raw material rows/summary fields are seeded once per level, the first
  // time its Raw Material accordion is rendered for MOLDING — not on every
  // render, so removing a row doesn't cause it to reappear.
  function ensureRawMaterialData(level) {
    if (level.rawMaterialRows) return;
    level.rawMaterialRows = [
      { id: 1, type: "PG", itemCode: "RMPG-ABEP-NT00", itemDescription: "ABS ELECTROPLATING GRADE (GROSS WT)", uom: "G", qty: "10.250", supplier: "Styrolution", custSpec: "ABS", price: demoPriceIf("10.250", "G") },
      { id: 2, type: "PG", itemCode: "RMPG-MBSP-BK01", itemDescription: "MASTER BATCH", uom: "%", qty: "2", supplier: "Styrolution", custSpec: "", price: demoPriceIf("2", "%") },
      { id: 3, type: "PG", itemCode: "RMPG-ABRN-NT01", itemDescription: "RUNNER", uom: "G", qty: "-2.540", supplier: "Styrolution", custSpec: "", price: demoPriceIf("-2.540", "G") },
      { id: 4, type: "BOPC", itemCode: "BOHD-SCMS-0012", itemDescription: "SCREW M4 X 10", uom: "EA", qty: "2.000", supplier: "Styrolution", custSpec: "", price: demoPriceIf("2.000", "EA") }
    ];
    level.rawMaterialNextId = 5;
    level.partWeight = "";
    level.rejection = "2";
  }

  // Process rows are seeded once per level, the first time its Process
  // accordion is rendered for MOLDING — list is fixed/finite, no add/remove.
  function ensureProcessData(level) {
    if (level.processRows) return;
    level.processRows = MOLDING_PROCESS_ITEMS.map(function (item, i) {
      return { id: i + 1, description: item.description, uom: item.uom, spec: item.spec, mhr: demoPriceIf(item.spec, item.uom) };
    });
  }

  // Fixed area rows + seeded optional rows are created once per level; the
  // 4 area rows and the trailing rejection row can never be removed, only
  // the seeded/added consumable rows can be.
  function ensurePlatingRawMaterialData(level) {
    if (level.platingRows) return;
    var id = 1;
    var rows = [];
    PLATING_FIXED_AREA_ITEMS.forEach(function (item) {
      rows.push({ id: id++, fixed: true, description: item.description, uom: item.uom, qty: item.qty, custSpec: "", price: demoPriceIf(item.qty, item.uom) });
    });
    PLATING_ITEM_MASTER.forEach(function (item) {
      var qty = PLATING_OPTIONAL_SEED_QTY[item.description] || "";
      rows.push({ id: id++, fixed: false, description: item.description, uom: item.uom, qty: qty, custSpec: "", price: demoPriceIf(qty, item.uom) });
    });
    level.platingRows = rows;
    level.platingNextId = id;
    level.platingRejection = "10.5";
  }

  // Process rows are seeded once per level, the first time its Process
  // accordion is rendered for PLATING — list is fixed/finite, no add/remove.
  function ensurePlatingProcessData(level) {
    if (level.platingProcessRows) return;
    level.platingProcessRows = PLATING_PROCESS_ITEMS.map(function (item, i) {
      return { id: i + 1, description: item.description, uom: item.uom, qty: item.qty, custSpec: "", mhr: demoPriceIf(item.qty, item.uom) };
    });
  }

  function findPlatingMasterItem(description) {
    var needle = (description || "").trim().toLowerCase();
    for (var i = 0; i < PLATING_ITEM_MASTER.length; i++) {
      if (PLATING_ITEM_MASTER[i].description.toLowerCase() === needle) return PLATING_ITEM_MASTER[i];
    }
    return null;
  }

  // Seeded once per level from the source sheet: the 10 items that carry a
  // real item code (master-backed, supplier BNPA) plus the 3 that don't
  // (plain free-text rows, no autofill). All rows are addable/removable —
  // unlike Molding/Plating there are no always-present fixed rows here.
  function ensurePaintingRawMaterialData(level) {
    if (level.paintingRows) return;
    level.paintingRows = [
      { id: 1, type: "IPA CLEANING", itemCode: "RMCH-ACSP-0001", itemDescription: "ISO PROPYL ALCOHOL", uom: "ML", qty: "2.000", supplier: "BNPA", custSpec: "", price: demoPriceIf("2.000", "ML") },
      { id: 2, type: "PRIMER COAT", itemCode: "RMPT-PUPR-0001", itemDescription: "PRIMER", uom: "ML", qty: "5.200", supplier: "BNPA", custSpec: "", price: demoPriceIf("5.200", "ML") },
      { id: 3, type: "PRIMER COAT", itemCode: "RMPT-PUHD-0001", itemDescription: "HARDENER-1", uom: "ML", qty: "0.520", supplier: "BNPA", custSpec: "", price: demoPriceIf("0.520", "ML") },
      { id: 4, type: "PRIMER COAT", itemCode: "RMPT-PUTH-0001", itemDescription: "THINNER-1", uom: "ML", qty: "2.500", supplier: "BNPA", custSpec: "", price: demoPriceIf("2.500", "ML") },
      { id: 5, type: "BASE COAT", itemCode: "RMPT-PUBC-0001", itemDescription: "PAINT", uom: "ML", qty: "7.800", supplier: "BNPA", custSpec: "", price: demoPriceIf("7.800", "ML") },
      { id: 6, type: "BASE COAT", itemCode: "RMPT-PUHD-0002", itemDescription: "HARDENER-2", uom: "ML", qty: "1.600", supplier: "BNPA", custSpec: "", price: demoPriceIf("1.600", "ML") },
      { id: 7, type: "BASE COAT", itemCode: "RMPT-PUTH-0002", itemDescription: "THINNER-2", uom: "ML", qty: "3.500", supplier: "BNPA", custSpec: "", price: demoPriceIf("3.500", "ML") },
      { id: 8, type: "CLEAR COAT", itemCode: "RMPT-PULQ-0001", itemDescription: "LACQUER", uom: "ML", qty: "4.500", supplier: "BNPA", custSpec: "", price: demoPriceIf("4.500", "ML") },
      { id: 9, type: "CLEAR COAT", itemCode: "RMPT-PUTH-0003", itemDescription: "THINNER-3", uom: "ML", qty: "3.000", supplier: "BNPA", custSpec: "", price: demoPriceIf("3.000", "ML") },
      { id: 10, type: "JIG SRIPPING", itemCode: "RMPT-PUTH-0004", itemDescription: "THINNER", uom: "ML", qty: "6.000", supplier: "BNPA", custSpec: "", price: demoPriceIf("6.000", "ML") },
      { id: 11, type: "MASKING", itemCode: "", itemDescription: "TAPE", uom: "CM2", qty: "", supplier: "", custSpec: "", price: demoPriceIf("", "CM2") },
      { id: 12, type: "DACKLE", itemCode: "", itemDescription: "DACKLE", uom: "NOS", qty: "4", supplier: "", custSpec: "", price: demoPriceIf("4", "NOS") },
      { id: 13, type: "MASKING", itemCode: "", itemDescription: "PLASTIC MASKING", uom: "NOS", qty: "1", supplier: "", custSpec: "", price: demoPriceIf("1", "NOS") }
    ];
    level.paintingNextId = 14;
  }

  // All 13 rows from the source sheet, seeded once per level; addable and
  // removable like Molding/Painting — no always-present fixed rows here.
  function ensureBopRawMaterialData(level) {
    if (level.bopRows) return;
    level.bopRows = [
      { id: 1, itemCode: "", itemDescription: "DSA TAPE GRADE", uom: "NOS", qty: "2.000", supplier: "", custSpec: "", price: demoPriceIf("2.000", "NOS") },
      { id: 2, itemCode: "", itemDescription: "BLANK SIZE", uom: "L X B", qty: "", supplier: "", custSpec: "", price: demoPriceIf("", "L X B") },
      { id: 3, itemCode: "", itemDescription: "NO OF PARTS / BLANK", uom: "NOS", qty: "7.800", supplier: "", custSpec: "", price: demoPriceIf("7.800", "NOS") },
      { id: 4, itemCode: "", itemDescription: "TAPE AREA PER PART", uom: "CM2", qty: "", supplier: "", custSpec: "", price: demoPriceIf("", "CM2") },
      { id: 5, itemCode: "", itemDescription: "FOAM GRADE", uom: "", qty: "", supplier: "", custSpec: "", price: demoPriceIf("", "") },
      { id: 6, itemCode: "", itemDescription: "BLANK SIZE", uom: "L X B", qty: "", supplier: "", custSpec: "", price: demoPriceIf("", "L X B") },
      { id: 7, itemCode: "", itemDescription: "NO OF PARTS / BLANK", uom: "NOS", qty: "", supplier: "", custSpec: "", price: demoPriceIf("", "NOS") },
      { id: 8, itemCode: "", itemDescription: "FOAM AREA PER PART", uom: "CM2", qty: "", supplier: "", custSpec: "", price: demoPriceIf("", "CM2") },
      { id: 9, itemCode: "", itemDescription: "PROTECTIVE FILM", uom: "CM2", qty: "", supplier: "", custSpec: "", price: demoPriceIf("", "CM2") },
      { id: 10, itemCode: "", itemDescription: "SCREW / NUT / PLASTIC CLIP / RING", uom: "NOS", qty: "", supplier: "", custSpec: "", price: demoPriceIf("", "NOS") },
      { id: 11, itemCode: "", itemDescription: "TAB TAPE / JOINT TAPE / PRIMER", uom: "NOS", qty: "", supplier: "", custSpec: "", price: demoPriceIf("", "NOS") },
      { id: 12, itemCode: "", itemDescription: "EPDM FOAM", uom: "", qty: "", supplier: "", custSpec: "", price: demoPriceIf("", "") },
      { id: 13, itemCode: "", itemDescription: "TEMPLATE / MANUAL", uom: "NOS", qty: "", supplier: "", custSpec: "", price: demoPriceIf("", "NOS") }
    ];
    level.bopNextId = 14;
  }

  // All 8 rows from the source sheet, seeded once per level; addable and
  // removable, just like Molding/Painting.
  function ensureNrpRawMaterialData(level) {
    if (level.nrpRows) return;
    level.nrpRows = [
      { id: 1, type: "POLY BAG", itemCode: "COPM-PBAG-0001", itemDescription: "POLY BAG 10\" X 15\"", uom: "NOS", qty: "1", supplier: "", custSpec: "", price: demoPriceIf("1", "NOS") },
      { id: 2, type: "FOAM BAG", itemCode: "COPM-FBAG-0001", itemDescription: "FOAM BAG 10\" X 15\"", uom: "NOS", qty: "1", supplier: "", custSpec: "", price: demoPriceIf("1", "NOS") },
      { id: 3, type: "BUBBLE BAG", itemCode: "COPM-BBAG-0001", itemDescription: "BUBBLE BAG 10\" X 15\"", uom: "NOS", qty: "1", supplier: "", custSpec: "", price: demoPriceIf("1", "NOS") },
      { id: 4, type: "C-BOX", itemCode: "COPM-CBOX-0001", itemDescription: "C-BOX 600 X 400 X 300 MM 5 PLY", uom: "NOS", qty: "20", supplier: "", custSpec: "", price: demoPriceIf("20", "NOS") },
      { id: 5, type: "C-BOX", itemCode: "COPM-CBOX-0002", itemDescription: "C-BOX 1200 X 800 X 600 MM 7 PLY", uom: "NOS", qty: "160", supplier: "", custSpec: "", price: demoPriceIf("160", "NOS") },
      { id: 6, type: "PALLET", itemCode: "COPM-PLET-0001", itemDescription: "WOODEL PALLET 1200 X 1000 MM", uom: "NOS", qty: "160", supplier: "", custSpec: "", price: demoPriceIf("160", "NOS") },
      { id: 7, type: "STRIP", itemCode: "COPM-STRP-0001", itemDescription: "STRIP", uom: "M", qty: "4", supplier: "", custSpec: "", price: demoPriceIf("4", "M") },
      { id: 8, type: "BOPP TAPE", itemCode: "COPM-BTPE-0001", itemDescription: "BOPP TAPE 40 MM", uom: "ROLL", qty: "100", supplier: "", custSpec: "", price: demoPriceIf("100", "ROLL") }
    ];
    level.nrpNextId = 9;
  }

  function findNrpMasterItem(type, description) {
    var needle = (description || "").trim().toLowerCase();
    for (var i = 0; i < NRP_ITEM_MASTER.length; i++) {
      var m = NRP_ITEM_MASTER[i];
      if (m.type === type && m.description.toLowerCase() === needle) return m;
    }
    return null;
  }

  function ensureNrpProcessData(level) {
    if (level.nrpProcessRows) return;
    level.nrpProcessRows = NRP_PROCESS_ITEMS.map(function (item, i) {
      return { id: i + 1, description: item.description, uom: item.uom, qty: item.qty, mhr: demoPriceIf(item.qty, item.uom) };
    });
  }

  function ensureBopProcessData(level) {
    if (level.bopProcessRows) return;
    level.bopProcessRows = BOP_PROCESS_ITEMS.map(function (item, i) {
      return { id: i + 1, description: item.description, uom: item.uom, qty: item.qty, mhr: demoPriceIf(item.qty, item.uom) };
    });
  }

  function findBopMasterItem(description) {
    var needle = (description || "").trim().toLowerCase();
    for (var i = 0; i < BOP_ASSEMBLY_ITEM_MASTER.length; i++) {
      if (BOP_ASSEMBLY_ITEM_MASTER[i].description.toLowerCase() === needle) return BOP_ASSEMBLY_ITEM_MASTER[i];
    }
    return null;
  }

  function ensurePaintingProcessData(level) {
    if (level.paintingProcessRows) return;
    level.paintingProcessRows = PAINTING_PROCESS_ITEMS.map(function (item, i) {
      return { id: i + 1, description: item.description, uom: item.uom, qty: item.qty, spec: item.spec, mhr: demoPriceIf(item.qty, item.uom) };
    });
    if (level.paintShopType == null) level.paintShopType = "";
  }

  function findPaintingMasterItem(type, description) {
    var needle = (description || "").trim().toLowerCase();
    for (var i = 0; i < PAINTING_ITEM_MASTER.length; i++) {
      var m = PAINTING_ITEM_MASTER[i];
      if (m.type === type && m.description.toLowerCase() === needle) return m;
    }
    return null;
  }

  function findLevel(modal, levelId) {
    for (var i = 0; i < modal.levels.length; i++) {
      if (modal.levels[i].id === levelId) return modal.levels[i];
    }
    return null;
  }

  function findMasterItem(type, description) {
    var needle = (description || "").trim().toLowerCase();
    for (var i = 0; i < MOLDING_ITEM_MASTER.length; i++) {
      var m = MOLDING_ITEM_MASTER[i];
      if (m.type === type && m.description.toLowerCase() === needle) return m;
    }
    return null;
  }

  function executionTabs(modal) {
    return modal.levels.filter(function (l) { return l.value !== ""; });
  }

  function ensureActiveTab(modal) {
    var tabs = executionTabs(modal);
    if (!tabs.length) { modal.activeLevelId = null; return; }
    var stillValid = tabs.some(function (t) { return t.id === modal.activeLevelId; });
    if (!stillValid) modal.activeLevelId = tabs[0].id;
  }

  RFQConfig.openPartConfigModal = function openPartConfigModal(row) {
    var modal = RFQConfig.state.partConfigModal;
    modal.open = true;
    modal.rowId = row.id;
    modal.componentMaterial = row.componentMaterial;
    modal.levels = cloneLevels(row.processLevels || defaultLevels());
    modal.nextLevelId = modal.levels.reduce(function (max, l) { return Math.max(max, l.id + 1); }, 1);
    modal.partPicture = row.partPicture || null;
    modal.executionExpanded = true;
    modal.activeLevelId = null;
    ensureActiveTab(modal);
    RFQConfig.renderApp();
  };

  function returnToMain() {
    var modal = RFQConfig.state.partConfigModal;
    modal.open = false;
    modal.rowId = null;
    modal.componentMaterial = "";
    modal.levels = [];
    modal.activeLevelId = null;
    modal.partPicture = null;
    RFQConfig.renderApp();
  }

  function handlePictureFile(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      RFQConfig.state.partConfigModal.partPicture = reader.result;
      RFQConfig.renderApp();
    };
    reader.readAsDataURL(file);
  }

  function removeModalPicture(e) {
    e.stopPropagation();
    RFQConfig.state.partConfigModal.partPicture = null;
    RFQConfig.renderApp();
  }

  function addLevel() {
    var modal = RFQConfig.state.partConfigModal;
    modal.levels.push({ id: modal.nextLevelId++, value: "" });
    RFQConfig.renderApp();
  }

  function updateLevel(levelId, value) {
    var modal = RFQConfig.state.partConfigModal;
    for (var i = 0; i < modal.levels.length; i++) {
      if (modal.levels[i].id === levelId) { modal.levels[i].value = value; break; }
    }
    ensureActiveTab(modal);
    RFQConfig.renderApp();
  }

  function setActiveTab(levelId) {
    RFQConfig.state.partConfigModal.activeLevelId = levelId;
    RFQConfig.renderApp();
  }

  function panelState(modal, levelId) {
    if (!modal.panelState) modal.panelState = {};
    if (!modal.panelState[levelId]) modal.panelState[levelId] = { rawOpen: true, processOpen: true };
    return modal.panelState[levelId];
  }

  function toggleRawMaterial(levelId) {
    var modal = RFQConfig.state.partConfigModal;
    var state = panelState(modal, levelId);
    state.rawOpen = !state.rawOpen;
    RFQConfig.renderApp();
  }

  function toggleProcess(levelId) {
    var modal = RFQConfig.state.partConfigModal;
    var state = panelState(modal, levelId);
    state.processOpen = !state.processOpen;
    RFQConfig.renderApp();
  }

  function toggleExecutionExpanded() {
    var modal = RFQConfig.state.partConfigModal;
    modal.executionExpanded = !modal.executionExpanded;
    RFQConfig.renderApp();
  }

  function addRawMaterialRow(levelId) {
    var modal = RFQConfig.state.partConfigModal;
    var level = findLevel(modal, levelId);
    if (!level) return;
    level.rawMaterialRows.push({ id: level.rawMaterialNextId++, type: RAW_MATERIAL_TYPES[0], itemCode: "", itemDescription: "", uom: "", qty: "", supplier: "", custSpec: "", price: "" });
    RFQConfig.renderApp();
  }

  function removeRawMaterialRow(levelId, rowId) {
    var modal = RFQConfig.state.partConfigModal;
    var level = findLevel(modal, levelId);
    if (!level) return;
    level.rawMaterialRows = level.rawMaterialRows.filter(function (r) { return r.id !== rowId; });
    RFQConfig.renderApp();
  }

  function updateRawMaterialRow(levelId, rowId, key, value) {
    var modal = RFQConfig.state.partConfigModal;
    var level = findLevel(modal, levelId);
    if (!level) return;
    for (var i = 0; i < level.rawMaterialRows.length; i++) {
      var row = level.rawMaterialRows[i];
      if (row.id !== rowId) continue;
      row[key] = value;
      // Selecting a known Item Description auto-fills Item Code/UOM/Supplier.
      // A description that doesn't match the master is kept as free text and
      // the other fields stay whatever the user already set/typed.
      if (key === "itemDescription") {
        var match = findMasterItem(row.type, value);
        if (match) {
          row.itemCode = match.code;
          row.uom = match.uom;
          row.supplier = match.supplier;
        }
      }
      break;
    }
    RFQConfig.renderApp();
  }

  function addPlatingRow(levelId) {
    var modal = RFQConfig.state.partConfigModal;
    var level = findLevel(modal, levelId);
    if (!level) return;
    level.platingRows.push({ id: level.platingNextId++, fixed: false, description: "", uom: "", qty: "", custSpec: "", price: "" });
    RFQConfig.renderApp();
  }

  function removePlatingRow(levelId, rowId) {
    var modal = RFQConfig.state.partConfigModal;
    var level = findLevel(modal, levelId);
    if (!level) return;
    level.platingRows = level.platingRows.filter(function (r) { return r.id !== rowId; });
    RFQConfig.renderApp();
  }

  function updatePlatingRow(levelId, rowId, key, value) {
    var modal = RFQConfig.state.partConfigModal;
    var level = findLevel(modal, levelId);
    if (!level) return;
    for (var i = 0; i < level.platingRows.length; i++) {
      var row = level.platingRows[i];
      if (row.id !== rowId) continue;
      row[key] = value;
      // A matched Description auto-fetches UOM; user can still change it after.
      if (key === "description") {
        var match = findPlatingMasterItem(value);
        if (match) row.uom = match.uom;
      }
      break;
    }
    RFQConfig.renderApp();
  }

  function updatePlatingRejection(levelId, value) {
    var modal = RFQConfig.state.partConfigModal;
    var level = findLevel(modal, levelId);
    if (level) level.platingRejection = value;
    RFQConfig.renderApp();
  }

  function addPaintingRow(levelId) {
    var modal = RFQConfig.state.partConfigModal;
    var level = findLevel(modal, levelId);
    if (!level) return;
    level.paintingRows.push({ id: level.paintingNextId++, type: PAINTING_TYPES[0], itemCode: "", itemDescription: "", uom: "", qty: "", supplier: "", custSpec: "", price: "" });
    RFQConfig.renderApp();
  }

  function removePaintingRow(levelId, rowId) {
    var modal = RFQConfig.state.partConfigModal;
    var level = findLevel(modal, levelId);
    if (!level) return;
    level.paintingRows = level.paintingRows.filter(function (r) { return r.id !== rowId; });
    RFQConfig.renderApp();
  }

  function updatePaintingRow(levelId, rowId, key, value) {
    var modal = RFQConfig.state.partConfigModal;
    var level = findLevel(modal, levelId);
    if (!level) return;
    for (var i = 0; i < level.paintingRows.length; i++) {
      var row = level.paintingRows[i];
      if (row.id !== rowId) continue;
      row[key] = value;
      if (key === "itemDescription") {
        var match = findPaintingMasterItem(row.type, value);
        if (match) {
          row.itemCode = match.code;
          row.uom = match.uom;
          row.supplier = match.supplier;
        }
      }
      break;
    }
    RFQConfig.renderApp();
  }

  function addBopRow(levelId) {
    var modal = RFQConfig.state.partConfigModal;
    var level = findLevel(modal, levelId);
    if (!level) return;
    level.bopRows.push({ id: level.bopNextId++, itemCode: "", itemDescription: "", uom: "", qty: "", supplier: "", custSpec: "", price: "" });
    RFQConfig.renderApp();
  }

  function removeBopRow(levelId, rowId) {
    var modal = RFQConfig.state.partConfigModal;
    var level = findLevel(modal, levelId);
    if (!level) return;
    level.bopRows = level.bopRows.filter(function (r) { return r.id !== rowId; });
    RFQConfig.renderApp();
  }

  function updateBopRow(levelId, rowId, key, value) {
    var modal = RFQConfig.state.partConfigModal;
    var level = findLevel(modal, levelId);
    if (!level) return;
    for (var i = 0; i < level.bopRows.length; i++) {
      var row = level.bopRows[i];
      if (row.id !== rowId) continue;
      row[key] = value;
      if (key === "itemDescription") {
        var match = findBopMasterItem(value);
        if (match) {
          row.itemCode = match.code;
          row.uom = match.uom;
          row.supplier = match.supplier;
        }
      }
      break;
    }
    RFQConfig.renderApp();
  }

  function addNrpRow(levelId) {
    var modal = RFQConfig.state.partConfigModal;
    var level = findLevel(modal, levelId);
    if (!level) return;
    level.nrpRows.push({ id: level.nrpNextId++, type: NRP_TYPES[0], itemCode: "", itemDescription: "", uom: "", qty: "", supplier: "", custSpec: "", price: "" });
    RFQConfig.renderApp();
  }

  function removeNrpRow(levelId, rowId) {
    var modal = RFQConfig.state.partConfigModal;
    var level = findLevel(modal, levelId);
    if (!level) return;
    level.nrpRows = level.nrpRows.filter(function (r) { return r.id !== rowId; });
    RFQConfig.renderApp();
  }

  function updateNrpRow(levelId, rowId, key, value) {
    var modal = RFQConfig.state.partConfigModal;
    var level = findLevel(modal, levelId);
    if (!level) return;
    for (var i = 0; i < level.nrpRows.length; i++) {
      var row = level.nrpRows[i];
      if (row.id !== rowId) continue;
      row[key] = value;
      if (key === "itemDescription") {
        var match = findNrpMasterItem(row.type, value);
        if (match) {
          row.itemCode = match.code;
          row.uom = match.uom;
          row.supplier = match.supplier;
        }
      }
      break;
    }
    RFQConfig.renderApp();
  }

  function updateNrpProcessQty(levelId, rowId, value) {
    var modal = RFQConfig.state.partConfigModal;
    var level = findLevel(modal, levelId);
    if (!level) return;
    for (var i = 0; i < level.nrpProcessRows.length; i++) {
      if (level.nrpProcessRows[i].id === rowId) { level.nrpProcessRows[i].qty = value; break; }
    }
    RFQConfig.renderApp();
  }

  function updateNrpProcessMhr(levelId, rowId, value) {
    var modal = RFQConfig.state.partConfigModal;
    var level = findLevel(modal, levelId);
    if (!level) return;
    for (var i = 0; i < level.nrpProcessRows.length; i++) {
      if (level.nrpProcessRows[i].id === rowId) { level.nrpProcessRows[i].mhr = value; break; }
    }
    RFQConfig.renderApp();
  }

  function updateBopProcessQty(levelId, rowId, value) {
    var modal = RFQConfig.state.partConfigModal;
    var level = findLevel(modal, levelId);
    if (!level) return;
    for (var i = 0; i < level.bopProcessRows.length; i++) {
      if (level.bopProcessRows[i].id === rowId) { level.bopProcessRows[i].qty = value; break; }
    }
    RFQConfig.renderApp();
  }

  function updateBopProcessMhr(levelId, rowId, value) {
    var modal = RFQConfig.state.partConfigModal;
    var level = findLevel(modal, levelId);
    if (!level) return;
    for (var i = 0; i < level.bopProcessRows.length; i++) {
      if (level.bopProcessRows[i].id === rowId) { level.bopProcessRows[i].mhr = value; break; }
    }
    RFQConfig.renderApp();
  }

  function updatePaintingProcessRow(levelId, rowId, key, value) {
    var modal = RFQConfig.state.partConfigModal;
    var level = findLevel(modal, levelId);
    if (!level) return;
    for (var i = 0; i < level.paintingProcessRows.length; i++) {
      if (level.paintingProcessRows[i].id === rowId) { level.paintingProcessRows[i][key] = value; break; }
    }
    RFQConfig.renderApp();
  }

  function updatePaintShopType(levelId, value) {
    var modal = RFQConfig.state.partConfigModal;
    var level = findLevel(modal, levelId);
    if (level) level.paintShopType = value;
    RFQConfig.renderApp();
  }

  function updatePlatingProcessRow(levelId, rowId, key, value) {
    var modal = RFQConfig.state.partConfigModal;
    var level = findLevel(modal, levelId);
    if (!level) return;
    for (var i = 0; i < level.platingProcessRows.length; i++) {
      if (level.platingProcessRows[i].id === rowId) { level.platingProcessRows[i][key] = value; break; }
    }
    RFQConfig.renderApp();
  }

  function updateProcessSpec(levelId, rowId, value) {
    var modal = RFQConfig.state.partConfigModal;
    var level = findLevel(modal, levelId);
    if (!level) return;
    for (var i = 0; i < level.processRows.length; i++) {
      if (level.processRows[i].id === rowId) { level.processRows[i].spec = value; break; }
    }
    RFQConfig.renderApp();
  }

  function updateProcessRowMhr(levelId, rowId, value) {
    var modal = RFQConfig.state.partConfigModal;
    var level = findLevel(modal, levelId);
    if (!level) return;
    for (var i = 0; i < level.processRows.length; i++) {
      if (level.processRows[i].id === rowId) { level.processRows[i].mhr = value; break; }
    }
    RFQConfig.renderApp();
  }

  function updatePartWeight(levelId, value) {
    var modal = RFQConfig.state.partConfigModal;
    var level = findLevel(modal, levelId);
    if (level) level.partWeight = value;
    RFQConfig.renderApp();
  }

  function updateRejection(levelId, value) {
    var modal = RFQConfig.state.partConfigModal;
    var level = findLevel(modal, levelId);
    if (level) level.rejection = value;
    RFQConfig.renderApp();
  }

  function handleSave() {
    var modal = RFQConfig.state.partConfigModal;
    var row = RFQConfig.assemblyRowById(modal.rowId);
    if (row) {
      row.processLevels = cloneLevels(modal.levels);
      row.partPicture = modal.partPicture;
      RFQConfig.state.dirty = true;
    }
    returnToMain();
  }

  function handlePreview() {
    // Read-only preview of the current selections; discards edits like Cancel.
    returnToMain();
  }

  function renderLevelCard(level, index) {
    var el = LM.el;
    var select = el("select", {
      class: "sf-level__select",
      onchange: function (e) { updateLevel(level.id, e.target.value); }
    }, [el("option", { value: "" }, ["--None--"])].concat(PROCESS_OPTIONS.map(function (o) {
      var opt = el("option", { value: o }, [o]);
      if (o === level.value) opt.setAttribute("selected", "selected");
      return opt;
    })));

    return el("div", { class: "sf-level" }, [
      el("div", { class: "sf-level__head" }, [
        el("span", { class: "sf-level__label" }, ["Level " + (index + 1)]),
        el("span", { class: "sf-level__grip", title: "Drag to reorder" }, ["⠿"])
      ]),
      select
    ]);
  }

  function renderProcessLevelsSection(modal) {
    var el = LM.el;

    var head = el("div", { class: "sf-modal-section__head" }, [
      el("div", { class: "sf-modal-section__title-group" }, [
        el("span", { class: "sf-modal-section__title" }, ["Process Levels"]),
        el("span", { class: "sf-modal-section__hint" }, ["The same process can be selected in more than one level. Drag a card to reorder."])
      ]),
      el("button", { class: "sf-btn sf-btn--secondary sf-btn--sm", onclick: addLevel }, ["+ Add Level"])
    ]);

    var cards = el("div", { class: "sf-level-card-row" }, modal.levels.map(renderLevelCard));

    return el("div", { class: "sf-modal-section" }, [head, cards]);
  }

  function renderPartPictureSection(modal) {
    var el = LM.el;
    var picture = modal.partPicture;

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
          el("button", { class: "sf-btn sf-btn--secondary sf-btn--sm", onclick: function () { fileInput.click(); } }, ["Change"]),
          el("button", { class: "sf-btn sf-btn--sm", onclick: removeModalPicture }, ["Remove"])
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

    var head = el("div", { class: "sf-modal-section__head" }, [
      el("div", { class: "sf-modal-section__title-group" }, [
        el("span", { class: "sf-modal-section__title" }, ["Part Picture"])
      ])
    ]);

    return el("div", { class: "sf-modal-section" }, [head, body]);
  }

  function renderExecutionTab(tab, index) {
    var el = LM.el;
    var isActive = tab.id === RFQConfig.state.partConfigModal.activeLevelId;
    return el("button", {
      class: "sf-exec-tab" + (isActive ? " sf-exec-tab--active" : ""),
      onclick: function () { setActiveTab(tab.id); }
    }, [
      el("span", { class: "sf-exec-tab__level" }, ["L" + (index + 1)]),
      el("span", { class: "sf-exec-tab__name" }, [tab.value])
    ]);
  }

  // Builds the <table>, applies any column widths the user already dragged
  // for this table (keyed by table id, since every table type — Molding
  // Raw Material, Plating Process, etc. — shares one width set across
  // levels), and wires up the drag handles for further resizing.
  function resizableTable(tableKey, colgroup, thead, tbody) {
    var table = LM.el("table", { class: "sf-table" }, [colgroup, thead, tbody]);
    var savedWidths = RFQConfig.state.columnWidths[tableKey];
    if (savedWidths) {
      var cols = colgroup.children;
      for (var i = 0; i < cols.length && i < savedWidths.length; i++) {
        cols[i].style.width = savedWidths[i] + "px";
      }
    }
    LM.enableColumnResize(table, function (widths) {
      RFQConfig.state.columnWidths[tableKey] = widths;
    });
    return table;
  }

  // A completely separate <table> (not nested inside the main Raw Material
  // table) that shows just the Total Amount row — it shares the same
  // tableKey's saved column widths so it still lines up under Amount (INR),
  // but it's a sibling element, genuinely outside the main table rather
  // than a tfoot/tbody row within it.
  function totalsTable(tableKey, colgroup, totalRow) {
    var el = LM.el;
    var table = el("table", { class: "sf-table sf-table--totals" }, [colgroup, el("tbody", {}, [totalRow])]);
    var savedWidths = RFQConfig.state.columnWidths[tableKey];
    if (savedWidths) {
      var cols = colgroup.children;
      for (var i = 0; i < cols.length && i < savedWidths.length; i++) {
        cols[i].style.width = savedWidths[i] + "px";
      }
    }
    return table;
  }

  function textCell(value, onCommit, placeholder) {
    var el = LM.el;
    return el("td", {}, [el("input", {
      class: "sf-table__input",
      type: "text",
      placeholder: placeholder || "",
      value: value,
      onchange: function (e) { onCommit(e.target.value); }
    }, [])]);
  }

  function numberCell(value, onCommit, placeholder) {
    var el = LM.el;
    return el("td", {}, [el("input", {
      class: "sf-table__input",
      type: "number",
      min: "0",
      placeholder: placeholder || "",
      value: value,
      onchange: function (e) { onCommit(e.target.value); }
    }, [])]);
  }

  // Every Raw Material table (Molding, Plating, Painting, BOP, NRP) shows
  // Price/Amount (INR) for Harish and Anurag, and Supplier/Cust. Spec (or
  // just Cust. Spec, for Plating which has no Supplier field) for Ravi.
  // Every row still carries all fields regardless of who's viewing —
  // switching persona only changes which columns are rendered, never
  // drops data.
  function showsRawMaterialPricing() {
    var role = RFQConfig.currentRole();
    return role.id === "kam" || role.id === "cop";
  }

  function rawMaterialAmountCell(row) {
    var el = LM.el;
    var qty = parseFloat(row.qty);
    var price = parseFloat(row.price);
    var amount = (!isNaN(qty) && !isNaN(price)) ? (qty * price).toFixed(2) : "";
    return el("td", {}, [el("span", { class: "sf-table__derived" }, [amount])]);
  }

  // Shared trailing-column pair for the Molding/Painting/BOP/NRP Raw
  // Material tables — always exactly 2 columns, either Supplier+Cust. Spec
  // or Price+Amount depending on persona.
  function rawMaterialTrailingHeaders(hasSupplier) {
    var el = LM.el;
    if (showsRawMaterialPricing()) return [el("th", {}, ["Price (INR)"]), el("th", {}, ["Amount (INR)"])];
    return hasSupplier
      ? [el("th", {}, ["Supplier"]), el("th", {}, ["Cust. Spec"])]
      : [el("th", {}, ["Cust. Spec"])];
  }

  function rawMaterialTrailingCells(row, levelId, updateFn, hasSupplier) {
    var el = LM.el;
    if (showsRawMaterialPricing()) {
      return [
        numberCell(row.price || "", function (v) { updateFn(levelId, row.id, "price", v); }, "Price"),
        rawMaterialAmountCell(row)
      ];
    }
    var cells = [];
    if (hasSupplier) {
      cells.push(textCell(row.supplier, function (v) { updateFn(levelId, row.id, "supplier", v); }, "Supplier"));
    }
    cells.push(textCell(row.custSpec, function (v) { updateFn(levelId, row.id, "custSpec", v); }, "Cust. Spec"));
    return cells;
  }

  // Sum of Qty × Price across a Raw Material table's rows — the number
  // other components will read back later via
  // level.rawMaterialTotalAmount.
  function computeRawMaterialTotalAmount(rows) {
    var total = 0;
    rows.forEach(function (row) {
      var qty = parseFloat(row.qty);
      var price = parseFloat(row.price);
      if (!isNaN(qty) && !isNaN(price)) total += qty * price;
    });
    return total;
  }

  function dashCell() {
    return LM.el("td", {}, [LM.el("span", { class: "sf-table__derived" }, ["—"])]);
  }

  function totalAmountLabelCell() {
    return LM.el("td", {}, [LM.el("span", { class: "sf-table__fixed-label" }, ["TOTAL AMOUNT"])]);
  }

  function totalAmountValueCell(total) {
    return LM.el("td", {}, [LM.el("span", { class: "sf-table__fixed-label" }, [total.toFixed(2)])]);
  }

  // Total Amount footer row for the "Type" Raw Material table shape
  // (Molding, Painting, NRP — Sr.No/Type/Item Code/Item Description/UOM/
  // Qty/Price/Amount/icon). Stores the total on the level as a side
  // effect, unconditionally — the persona-gated part is only whether this
  // row is rendered, never whether the total is kept up to date.
  function typeShapeTotalAmountRow(level, rows) {
    var el = LM.el;
    var total = computeRawMaterialTotalAmount(rows);
    level.rawMaterialTotalAmount = total;
    if (!showsRawMaterialPricing()) return null;
    return el("tr", { class: "sf-table__fixed-row" }, [
      el("td", { class: "sf-table__actioncol" }, []),
      dashCell(),
      dashCell(),
      totalAmountLabelCell(),
      dashCell(),
      dashCell(),
      dashCell(),
      totalAmountValueCell(total),
      el("td", { class: "sf-table__actioncol" }, [])
    ]);
  }

  // Same idea, for the "no Type column" shape (BOP — one column narrower).
  function noTypeShapeTotalAmountRow(level, rows) {
    var el = LM.el;
    var total = computeRawMaterialTotalAmount(rows);
    level.rawMaterialTotalAmount = total;
    if (!showsRawMaterialPricing()) return null;
    return el("tr", { class: "sf-table__fixed-row" }, [
      el("td", { class: "sf-table__actioncol" }, []),
      dashCell(),
      totalAmountLabelCell(),
      dashCell(),
      dashCell(),
      dashCell(),
      totalAmountValueCell(total),
      el("td", { class: "sf-table__actioncol" }, [])
    ]);
  }

  // Same idea, for Plating's shape (Sr.No/Description/UOM/Qty/[Price/
  // Amount]/icon) — Description IS the label column, no leading dash.
  function platingShapeTotalAmountRow(level, rows) {
    var el = LM.el;
    var total = computeRawMaterialTotalAmount(rows);
    level.rawMaterialTotalAmount = total;
    if (!showsRawMaterialPricing()) return null;
    return el("tr", { class: "sf-table__fixed-row" }, [
      el("td", { class: "sf-table__actioncol" }, []),
      totalAmountLabelCell(),
      dashCell(),
      dashCell(),
      dashCell(),
      totalAmountValueCell(total),
      el("td", { class: "sf-table__actioncol" }, [])
    ]);
  }

  // Process tables (Molding/Plating/Painting/BOP/NRP) show their Qty/Spec
  // (and Cust. Spec, where present) columns for every persona — Harish and
  // Anurag additionally get MHR (INR) / Amount (INR) appended after them,
  // rather than those columns replacing Qty/Spec like they used to.
  function processMhrCell(row, onUpdate) {
    return numberCell(row.mhr || "", onUpdate, "MHR");
  }

  function processAmountCell(quantityValue, row) {
    var el = LM.el;
    var qty = parseFloat(quantityValue);
    var mhr = parseFloat(row.mhr);
    var amount = (!isNaN(qty) && !isNaN(mhr)) ? (qty * mhr).toFixed(2) : "";
    return el("td", {}, [el("span", { class: "sf-table__derived" }, [amount])]);
  }

  // Trailing MHR/Amount headers appended after a Process table's base
  // columns for Harish/Anurag — same 2-column shape for every process
  // type.
  function processPricingTrailingHeaders() {
    var el = LM.el;
    return [el("th", {}, ["MHR (INR)"]), el("th", {}, ["Amount (INR)"])];
  }

  // Trailing MHR/Amount cells appended after a Process table row's base
  // cells for Harish/Anurag.
  function processPricingTrailingCells(quantityValue, row, onMhrUpdate) {
    return [processMhrCell(row, onMhrUpdate), processAmountCell(quantityValue, row)];
  }

  function computeProcessTotalAmount(rows, quantityFieldName) {
    var total = 0;
    rows.forEach(function (row) {
      var qty = parseFloat(row[quantityFieldName]);
      var mhr = parseFloat(row.mhr);
      if (!isNaN(qty) && !isNaN(mhr)) total += qty * mhr;
    });
    return total;
  }

  // Total Amount row for a Process table, shown only for Harish/Anurag.
  // `dashCount` fills every column between the label (in the Description
  // position) and the value (in the trailing Amount position) — it varies
  // per table since each one has a different number of base columns
  // (Qty/Spec only vs. Qty + Cust. Spec) ahead of the MHR/Amount pair.
  function processTotalAmountRow(level, rows, quantityFieldName, dashCount) {
    var total = computeProcessTotalAmount(rows, quantityFieldName);
    level.processTotalAmount = total;
    if (!showsRawMaterialPricing()) return null;
    var el = LM.el;
    var dashes = [];
    for (var i = 0; i < dashCount; i++) dashes.push(dashCell());
    return el("tr", { class: "sf-table__fixed-row" }, [
      el("td", { class: "sf-table__actioncol" }, []),
      totalAmountLabelCell()
    ].concat(dashes).concat([
      totalAmountValueCell(total)
    ]));
  }

  function rawMaterialTypeCell(row, levelId) {
    var el = LM.el;
    var select = el("select", {
      class: "sf-table__select",
      onchange: function (e) { updateRawMaterialRow(levelId, row.id, "type", e.target.value); }
    }, RAW_MATERIAL_TYPES.map(function (t) {
      var opt = el("option", { value: t }, [t]);
      if (t === row.type) opt.setAttribute("selected", "selected");
      return opt;
    }));
    return el("td", {}, [select]);
  }

  function rawMaterialDescriptionCell(row, levelId) {
    var el = LM.el;
    var listId = "rawmat-dl-" + levelId + "-" + row.id;
    var suggestions = MOLDING_ITEM_MASTER.filter(function (m) { return m.type === row.type; });
    var input = el("input", {
      class: "sf-table__input",
      type: "text",
      list: listId,
      placeholder: "Search item description",
      value: row.itemDescription,
      onchange: function (e) { updateRawMaterialRow(levelId, row.id, "itemDescription", e.target.value); }
    }, []);
    var datalist = el("datalist", { id: listId }, suggestions.map(function (m) {
      return el("option", { value: m.description }, []);
    }));
    return el("td", {}, [input, datalist]);
  }

  function rawMaterialRemoveCell(row, levelId) {
    var el = LM.el;
    return el("td", { class: "sf-table__actioncol" }, [
      el("button", {
        class: "sf-table__del",
        title: "Remove row",
        onclick: function () { removeRawMaterialRow(levelId, row.id); }
      }, [el("span", {
        html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
          + '<polyline points="3 6 5 6 21 6"></polyline>'
          + '<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>'
          + '<path d="M10 11v6"></path><path d="M14 11v6"></path>'
          + '<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>'
      })])
    ]);
  }

  function renderRawMaterialRow(row, index, levelId) {
    var el = LM.el;
    return el("tr", {}, [
      el("td", { class: "sf-table__actioncol" }, [el("span", { class: "sf-table__derived" }, [String(index + 1)])]),
      rawMaterialTypeCell(row, levelId),
      textCell(row.itemCode, function (v) { updateRawMaterialRow(levelId, row.id, "itemCode", v); }, "Item code"),
      rawMaterialDescriptionCell(row, levelId),
      textCell(row.uom, function (v) { updateRawMaterialRow(levelId, row.id, "uom", v); }, "UOM"),
      textCell(row.qty, function (v) { updateRawMaterialRow(levelId, row.id, "qty", v); }, "Qty")
    ].concat(rawMaterialTrailingCells(row, levelId, updateRawMaterialRow, true)).concat([
      rawMaterialRemoveCell(row, levelId)
    ]));
  }

  function renderFixedSummaryRow(label, uom, value, srNo, onCommit) {
    var el = LM.el;
    var dash = el("span", { class: "sf-table__derived" }, ["—"]);
    return el("tr", { class: "sf-table__fixed-row" }, [
      el("td", { class: "sf-table__actioncol" }, [el("span", { class: "sf-table__derived" }, [String(srNo)])]),
      el("td", {}, [dash]),
      el("td", {}, [el("span", { class: "sf-table__derived" }, ["—"])]),
      el("td", {}, [el("span", { class: "sf-table__fixed-label" }, [label])]),
      el("td", {}, [el("span", { class: "sf-table__derived" }, [uom])]),
      el("td", {}, [el("input", {
        class: "sf-table__input",
        type: "text",
        placeholder: "Qty",
        value: value,
        onchange: function (e) { onCommit(e.target.value); }
      }, [])]),
      el("td", {}, [el("span", { class: "sf-table__derived" }, ["—"])]),
      el("td", {}, [el("span", { class: "sf-table__derived" }, ["—"])]),
      el("td", { class: "sf-table__actioncol" }, [])
    ]);
  }

  function moldingColgroupCols() {
    var el = LM.el;
    return [
      el("col", { class: "sf-rm-col--icon" }, []),
      el("col", { class: "sf-rm-col--type" }, []),
      el("col", { class: "sf-rm-col--code" }, []),
      el("col", { class: "sf-rm-col--desc" }, []),
      el("col", { class: "sf-rm-col--uom" }, []),
      el("col", { class: "sf-rm-col--qty" }, []),
      el("col", { class: "sf-rm-col--supplier" }, []),
      el("col", { class: "sf-rm-col--spec" }, []),
      el("col", { class: "sf-rm-col--icon" }, [])
    ];
  }

  function renderMoldingRawMaterialTable(level) {
    var el = LM.el;
    ensureRawMaterialData(level);

    var colgroup = el("colgroup", {}, moldingColgroupCols());
    var thead = el("thead", {}, [
      el("tr", {}, [
        el("th", { class: "sf-table__actioncol" }, ["Sr. No"]),
        el("th", {}, ["Type"]),
        el("th", {}, ["Item Code"]),
        el("th", {}, ["Item Description"]),
        el("th", {}, ["UOM"]),
        el("th", {}, ["Qty"])
      ].concat(rawMaterialTrailingHeaders(true)).concat([
        el("th", { class: "sf-table__actioncol" }, [""])
      ]))
    ]);

    var itemRows = level.rawMaterialRows.map(function (row, index) { return renderRawMaterialRow(row, index, level.id); });
    var fixedRows = [
      renderFixedSummaryRow("PART WEIGHT", "G", level.partWeight, level.rawMaterialRows.length + 1, function (v) { updatePartWeight(level.id, v); }),
      renderFixedSummaryRow("REJECTION", "%", level.rejection, level.rawMaterialRows.length + 2, function (v) { updateRejection(level.id, v); })
    ];
    var totalRow = typeShapeTotalAmountRow(level, level.rawMaterialRows);

    var tbody = el("tbody", {}, itemRows.concat(fixedRows));

    var tables = [resizableTable("molding-raw", colgroup, thead, tbody)];
    if (totalRow) tables.push(totalsTable("molding-raw", el("colgroup", {}, moldingColgroupCols()), totalRow));

    return el("div", {}, [
      el("div", { class: "sf-table-wrap" }, tables),
      el("div", { class: "sf-accordion__actions" }, [
        el("button", { class: "sf-btn sf-btn--secondary sf-btn--sm", onclick: function () { addRawMaterialRow(level.id); } }, ["+ Add Item"])
      ])
    ]);
  }

  function paintingTypeCell(row, levelId) {
    var el = LM.el;
    var select = el("select", {
      class: "sf-table__select",
      onchange: function (e) { updatePaintingRow(levelId, row.id, "type", e.target.value); }
    }, PAINTING_TYPES.map(function (t) {
      var opt = el("option", { value: t }, [t]);
      if (t === row.type) opt.setAttribute("selected", "selected");
      return opt;
    }));
    return el("td", {}, [select]);
  }

  function paintingDescriptionCell(row, levelId) {
    var el = LM.el;
    var listId = "paint-dl-" + levelId + "-" + row.id;
    var suggestions = PAINTING_ITEM_MASTER.filter(function (m) { return m.type === row.type; });
    var input = el("input", {
      class: "sf-table__input",
      type: "text",
      list: listId,
      placeholder: "Search item description",
      value: row.itemDescription,
      onchange: function (e) { updatePaintingRow(levelId, row.id, "itemDescription", e.target.value); }
    }, []);
    var datalist = el("datalist", { id: listId }, suggestions.map(function (m) {
      return el("option", { value: m.description }, []);
    }));
    return el("td", {}, [input, datalist]);
  }

  function paintingRemoveCell(row, levelId) {
    var el = LM.el;
    return el("td", { class: "sf-table__actioncol" }, [
      el("button", {
        class: "sf-table__del",
        title: "Remove row",
        onclick: function () { removePaintingRow(levelId, row.id); }
      }, [el("span", {
        html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
          + '<polyline points="3 6 5 6 21 6"></polyline>'
          + '<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>'
          + '<path d="M10 11v6"></path><path d="M14 11v6"></path>'
          + '<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>'
      })])
    ]);
  }

  function renderPaintingRow(row, index, levelId) {
    var el = LM.el;
    return el("tr", {}, [
      el("td", { class: "sf-table__actioncol" }, [el("span", { class: "sf-table__derived" }, [String(index + 1)])]),
      paintingTypeCell(row, levelId),
      textCell(row.itemCode, function (v) { updatePaintingRow(levelId, row.id, "itemCode", v); }, "Item code"),
      paintingDescriptionCell(row, levelId),
      textCell(row.uom, function (v) { updatePaintingRow(levelId, row.id, "uom", v); }, "UOM"),
      textCell(row.qty, function (v) { updatePaintingRow(levelId, row.id, "qty", v); }, "Qty")
    ].concat(rawMaterialTrailingCells(row, levelId, updatePaintingRow, true)).concat([
      paintingRemoveCell(row, levelId)
    ]));
  }

  function renderPaintingRawMaterialTable(level) {
    var el = LM.el;
    ensurePaintingRawMaterialData(level);

    var colgroup = el("colgroup", {}, moldingColgroupCols());
    var thead = el("thead", {}, [
      el("tr", {}, [
        el("th", { class: "sf-table__actioncol" }, ["Sr. No"]),
        el("th", {}, ["Type"]),
        el("th", {}, ["Item Code"]),
        el("th", {}, ["Item Description"]),
        el("th", {}, ["UOM"]),
        el("th", {}, ["Qty"])
      ].concat(rawMaterialTrailingHeaders(true)).concat([
        el("th", { class: "sf-table__actioncol" }, [""])
      ]))
    ]);
    var paintingTotalRow = typeShapeTotalAmountRow(level, level.paintingRows);
    var tbody = el("tbody", {}, level.paintingRows.map(function (row, index) { return renderPaintingRow(row, index, level.id); }));

    var paintingTables = [resizableTable("painting-raw", colgroup, thead, tbody)];
    if (paintingTotalRow) paintingTables.push(totalsTable("painting-raw", el("colgroup", {}, moldingColgroupCols()), paintingTotalRow));

    return el("div", {}, [
      el("div", { class: "sf-table-wrap" }, paintingTables),
      el("div", { class: "sf-accordion__actions" }, [
        el("button", { class: "sf-btn sf-btn--secondary sf-btn--sm", onclick: function () { addPaintingRow(level.id); } }, ["+ Add Item"])
      ])
    ]);
  }

  function bopDescriptionCell(row, levelId) {
    var el = LM.el;
    var listId = "bop-dl-" + levelId + "-" + row.id;
    var input = el("input", {
      class: "sf-table__input",
      type: "text",
      list: listId,
      placeholder: "Search item description",
      value: row.itemDescription,
      onchange: function (e) { updateBopRow(levelId, row.id, "itemDescription", e.target.value); }
    }, []);
    var datalist = el("datalist", { id: listId }, BOP_ASSEMBLY_ITEM_MASTER.map(function (m) {
      return el("option", { value: m.description }, []);
    }));
    return el("td", {}, [input, datalist]);
  }

  function bopRemoveCell(row, levelId) {
    var el = LM.el;
    return el("td", { class: "sf-table__actioncol" }, [
      el("button", {
        class: "sf-table__del",
        title: "Remove row",
        onclick: function () { removeBopRow(levelId, row.id); }
      }, [el("span", {
        html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
          + '<polyline points="3 6 5 6 21 6"></polyline>'
          + '<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>'
          + '<path d="M10 11v6"></path><path d="M14 11v6"></path>'
          + '<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>'
      })])
    ]);
  }

  function renderBopRow(row, index, levelId) {
    var el = LM.el;
    return el("tr", {}, [
      el("td", { class: "sf-table__actioncol" }, [el("span", { class: "sf-table__derived" }, [String(index + 1)])]),
      textCell(row.itemCode, function (v) { updateBopRow(levelId, row.id, "itemCode", v); }, "Item code"),
      bopDescriptionCell(row, levelId),
      textCell(row.uom, function (v) { updateBopRow(levelId, row.id, "uom", v); }, "UOM"),
      textCell(row.qty, function (v) { updateBopRow(levelId, row.id, "qty", v); }, "Qty")
    ].concat(rawMaterialTrailingCells(row, levelId, updateBopRow, true)).concat([
      bopRemoveCell(row, levelId)
    ]));
  }

  function bopColgroupCols() {
    var el = LM.el;
    return [
      el("col", { class: "sf-table__col--icon" }, []),
      el("col", { class: "sf-bop-col--code" }, []),
      el("col", { class: "sf-bop-col--desc" }, []),
      el("col", { class: "sf-bop-col--uom" }, []),
      el("col", { class: "sf-bop-col--qty" }, []),
      el("col", { class: "sf-bop-col--supplier" }, []),
      el("col", { class: "sf-bop-col--spec" }, []),
      el("col", { class: "sf-table__col--icon" }, [])
    ];
  }

  function renderBopRawMaterialTable(level) {
    var el = LM.el;
    ensureBopRawMaterialData(level);

    var colgroup = el("colgroup", {}, bopColgroupCols());
    var thead = el("thead", {}, [
      el("tr", {}, [
        el("th", { class: "sf-table__actioncol" }, ["Sr. No"]),
        el("th", {}, ["Item Code"]),
        el("th", {}, ["Item Description"]),
        el("th", {}, ["UOM"]),
        el("th", {}, ["Qty"])
      ].concat(rawMaterialTrailingHeaders(true)).concat([
        el("th", { class: "sf-table__actioncol" }, [""])
      ]))
    ]);
    var bopTotalRow = noTypeShapeTotalAmountRow(level, level.bopRows);
    var tbody = el("tbody", {}, level.bopRows.map(function (row, index) { return renderBopRow(row, index, level.id); }));

    var bopTables = [resizableTable("bop-raw", colgroup, thead, tbody)];
    if (bopTotalRow) bopTables.push(totalsTable("bop-raw", el("colgroup", {}, bopColgroupCols()), bopTotalRow));

    return el("div", {}, [
      el("div", { class: "sf-table-wrap" }, bopTables),
      el("div", { class: "sf-accordion__actions" }, [
        el("button", { class: "sf-btn sf-btn--secondary sf-btn--sm", onclick: function () { addBopRow(level.id); } }, ["+ Add Item"])
      ])
    ]);
  }

  function renderBopProcessRow(row, index, levelId) {
    var el = LM.el;
    var descCell = el("td", {}, [el("span", { class: "sf-table__locked-label" }, [row.description])]);
    var cells = [
      el("td", { class: "sf-table__actioncol" }, [el("span", { class: "sf-table__derived" }, [String(index + 1)])]),
      descCell,
      el("td", {}, [el("span", { class: "sf-table__derived" }, [row.uom])]),
      textCell(row.qty, function (v) { updateBopProcessQty(levelId, row.id, v); }, "Qty")
    ];
    if (showsRawMaterialPricing()) {
      cells = cells.concat(processPricingTrailingCells(row.qty, row, function (v) { updateBopProcessMhr(levelId, row.id, v); }));
    }
    return el("tr", { class: "sf-table__fixed-row" }, cells);
  }

  function bopProcessColgroupCols() {
    var el = LM.el;
    var cols = [
      el("col", { class: "sf-bopproc-col--icon" }, []),
      el("col", { class: "sf-bopproc-col--desc" }, []),
      el("col", { class: "sf-bopproc-col--uom" }, []),
      el("col", { class: "sf-bopproc-col--qty" }, [])
    ];
    if (showsRawMaterialPricing()) {
      cols = cols.concat([
        el("col", { class: "sf-bopproc-col--qty" }, []),
        el("col", { class: "sf-bopproc-col--qty" }, [])
      ]);
    }
    return cols;
  }

  function renderBopProcessTable(level) {
    var el = LM.el;
    ensureBopProcessData(level);

    var colgroup = el("colgroup", {}, bopProcessColgroupCols());
    var thead = el("thead", {}, [
      el("tr", {}, [
        el("th", { class: "sf-table__actioncol" }, ["Sr. No"]),
        el("th", {}, ["Description"]),
        el("th", {}, ["UOM"]),
        el("th", {}, ["Qty"])
      ].concat(showsRawMaterialPricing() ? processPricingTrailingHeaders() : []))
    ]);
    var tbody = el("tbody", {}, level.bopProcessRows.map(function (row, index) { return renderBopProcessRow(row, index, level.id); }));

    var bopProcessTotalRow = processTotalAmountRow(level, level.bopProcessRows, "qty", 3);
    var bopProcessTables = [resizableTable("bop-process", colgroup, thead, tbody)];
    if (bopProcessTotalRow) bopProcessTables.push(totalsTable("bop-process", el("colgroup", {}, bopProcessColgroupCols()), bopProcessTotalRow));

    return el("div", { class: "sf-table-wrap" }, bopProcessTables);
  }

  function renderNrpProcessRow(row, index, levelId) {
    var el = LM.el;
    var descCell = el("td", {}, [el("span", { class: "sf-table__locked-label" }, [row.description])]);
    var cells = [
      el("td", { class: "sf-table__actioncol" }, [el("span", { class: "sf-table__derived" }, [String(index + 1)])]),
      descCell,
      el("td", {}, [el("span", { class: "sf-table__derived" }, [row.uom])]),
      textCell(row.qty, function (v) { updateNrpProcessQty(levelId, row.id, v); }, "Qty / Hr")
    ];
    if (showsRawMaterialPricing()) {
      cells = cells.concat(processPricingTrailingCells(row.qty, row, function (v) { updateNrpProcessMhr(levelId, row.id, v); }));
    }
    return el("tr", { class: "sf-table__fixed-row" }, cells);
  }

  function renderNrpProcessTable(level) {
    var el = LM.el;
    ensureNrpProcessData(level);

    var colgroup = el("colgroup", {}, bopProcessColgroupCols());
    var thead = el("thead", {}, [
      el("tr", {}, [
        el("th", { class: "sf-table__actioncol" }, ["Sr. No"]),
        el("th", {}, ["Item Description"]),
        el("th", {}, ["UOM"]),
        el("th", {}, ["Qty / Hr"])
      ].concat(showsRawMaterialPricing() ? processPricingTrailingHeaders() : []))
    ]);
    var tbody = el("tbody", {}, level.nrpProcessRows.map(function (row, index) { return renderNrpProcessRow(row, index, level.id); }));

    var nrpProcessTotalRow = processTotalAmountRow(level, level.nrpProcessRows, "qty", 3);
    var nrpProcessTables = [resizableTable("nrp-process", colgroup, thead, tbody)];
    if (nrpProcessTotalRow) nrpProcessTables.push(totalsTable("nrp-process", el("colgroup", {}, bopProcessColgroupCols()), nrpProcessTotalRow));

    return el("div", { class: "sf-table-wrap" }, nrpProcessTables);
  }

  function nrpTypeCell(row, levelId) {
    var el = LM.el;
    var select = el("select", {
      class: "sf-table__select",
      onchange: function (e) { updateNrpRow(levelId, row.id, "type", e.target.value); }
    }, NRP_TYPES.map(function (t) {
      var opt = el("option", { value: t }, [t]);
      if (t === row.type) opt.setAttribute("selected", "selected");
      return opt;
    }));
    return el("td", {}, [select]);
  }

  function nrpDescriptionCell(row, levelId) {
    var el = LM.el;
    var listId = "nrp-dl-" + levelId + "-" + row.id;
    var suggestions = NRP_ITEM_MASTER.filter(function (m) { return m.type === row.type; });
    var input = el("input", {
      class: "sf-table__input",
      type: "text",
      list: listId,
      placeholder: "Search item description",
      value: row.itemDescription,
      onchange: function (e) { updateNrpRow(levelId, row.id, "itemDescription", e.target.value); }
    }, []);
    var datalist = el("datalist", { id: listId }, suggestions.map(function (m) {
      return el("option", { value: m.description }, []);
    }));
    return el("td", {}, [input, datalist]);
  }

  function nrpRemoveCell(row, levelId) {
    var el = LM.el;
    return el("td", { class: "sf-table__actioncol" }, [
      el("button", {
        class: "sf-table__del",
        title: "Remove row",
        onclick: function () { removeNrpRow(levelId, row.id); }
      }, [el("span", {
        html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
          + '<polyline points="3 6 5 6 21 6"></polyline>'
          + '<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>'
          + '<path d="M10 11v6"></path><path d="M14 11v6"></path>'
          + '<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>'
      })])
    ]);
  }

  function renderNrpRow(row, index, levelId) {
    var el = LM.el;
    return el("tr", {}, [
      el("td", { class: "sf-table__actioncol" }, [el("span", { class: "sf-table__derived" }, [String(index + 1)])]),
      nrpTypeCell(row, levelId),
      textCell(row.itemCode, function (v) { updateNrpRow(levelId, row.id, "itemCode", v); }, "Item code"),
      nrpDescriptionCell(row, levelId),
      textCell(row.uom, function (v) { updateNrpRow(levelId, row.id, "uom", v); }, "UOM"),
      textCell(row.qty, function (v) { updateNrpRow(levelId, row.id, "qty", v); }, "Qty / Pack")
    ].concat(rawMaterialTrailingCells(row, levelId, updateNrpRow, true)).concat([
      nrpRemoveCell(row, levelId)
    ]));
  }

  function renderNrpRawMaterialTable(level) {
    var el = LM.el;
    ensureNrpRawMaterialData(level);

    var colgroup = el("colgroup", {}, moldingColgroupCols());
    var thead = el("thead", {}, [
      el("tr", {}, [
        el("th", { class: "sf-table__actioncol" }, ["Sr. No"]),
        el("th", {}, ["Type"]),
        el("th", {}, ["Item Code"]),
        el("th", {}, ["Item Description"]),
        el("th", {}, ["UOM"]),
        el("th", {}, ["Qty / Pack"])
      ].concat(rawMaterialTrailingHeaders(true)).concat([
        el("th", { class: "sf-table__actioncol" }, [""])
      ]))
    ]);
    var nrpTotalRow = typeShapeTotalAmountRow(level, level.nrpRows);
    var tbody = el("tbody", {}, level.nrpRows.map(function (row, index) { return renderNrpRow(row, index, level.id); }));

    var nrpTables = [resizableTable("nrp-raw", colgroup, thead, tbody)];
    if (nrpTotalRow) nrpTables.push(totalsTable("nrp-raw", el("colgroup", {}, moldingColgroupCols()), nrpTotalRow));

    return el("div", {}, [
      el("div", { class: "sf-table-wrap" }, nrpTables),
      el("div", { class: "sf-accordion__actions" }, [
        el("button", { class: "sf-btn sf-btn--secondary sf-btn--sm", onclick: function () { addNrpRow(level.id); } }, ["+ Add Item"])
      ])
    ]);
  }

  function platingDescriptionCell(row, levelId) {
    var el = LM.el;
    // Fixed area rows are always-present labels, not searchable/editable.
    if (row.fixed) {
      return el("td", {}, [el("span", { class: "sf-table__locked-label" }, [row.description])]);
    }
    var listId = "plating-dl-" + levelId + "-" + row.id;
    var input = el("input", {
      class: "sf-table__input",
      type: "text",
      list: listId,
      placeholder: "Search item description",
      value: row.description,
      onchange: function (e) { updatePlatingRow(levelId, row.id, "description", e.target.value); }
    }, []);
    var datalist = el("datalist", { id: listId }, PLATING_ITEM_MASTER.map(function (m) {
      return el("option", { value: m.description }, []);
    }));
    return el("td", {}, [input, datalist]);
  }

  function platingRemoveCell(row, levelId) {
    var el = LM.el;
    if (row.fixed) return el("td", { class: "sf-table__actioncol" }, []);
    return el("td", { class: "sf-table__actioncol" }, [
      el("button", {
        class: "sf-table__del",
        title: "Remove row",
        onclick: function () { removePlatingRow(levelId, row.id); }
      }, [el("span", {
        html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
          + '<polyline points="3 6 5 6 21 6"></polyline>'
          + '<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>'
          + '<path d="M10 11v6"></path><path d="M14 11v6"></path>'
          + '<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>'
      })])
    ]);
  }

  function renderPlatingRow(row, index, levelId) {
    var el = LM.el;
    return el("tr", { class: row.fixed ? "sf-table__fixed-row" : "" }, [
      el("td", { class: "sf-table__actioncol" }, [el("span", { class: "sf-table__derived" }, [String(index + 1)])]),
      platingDescriptionCell(row, levelId),
      textCell(row.uom, function (v) { updatePlatingRow(levelId, row.id, "uom", v); }, "UOM"),
      textCell(row.qty, function (v) { updatePlatingRow(levelId, row.id, "qty", v); }, "Qty")
    ].concat(rawMaterialTrailingCells(row, levelId, updatePlatingRow, false)).concat([
      platingRemoveCell(row, levelId)
    ]));
  }

  // Cust. Spec is a single column for Ravi, but swaps to a Price+Amount
  // *pair* for Harish/Anurag — unlike the other Raw Material tables, the
  // trailing column count itself changes, so colgroup needs an extra col.
  function platingColgroupCols() {
    var el = LM.el;
    return [
      el("col", { class: "sf-table__col--icon" }, []),
      el("col", { class: "sf-plt-col--desc" }, []),
      el("col", { class: "sf-plt-col--uom" }, []),
      el("col", { class: "sf-plt-col--qty" }, []),
      el("col", { class: "sf-plt-col--spec" }, [])
    ].concat(showsRawMaterialPricing() ? [el("col", { class: "sf-plt-col--spec" }, [])] : []).concat([
      el("col", { class: "sf-table__col--icon" }, [])
    ]);
  }

  function renderPlatingRawMaterialTable(level) {
    var el = LM.el;
    ensurePlatingRawMaterialData(level);

    var colgroup = el("colgroup", {}, platingColgroupCols());
    var thead = el("thead", {}, [
      el("tr", {}, [
        el("th", { class: "sf-table__actioncol" }, ["Sr. No"]),
        el("th", {}, ["Description"]),
        el("th", {}, ["UOM"]),
        el("th", {}, ["Qty"])
      ].concat(rawMaterialTrailingHeaders(false)).concat([
        el("th", { class: "sf-table__actioncol" }, [""])
      ]))
    ]);

    var itemRows = level.platingRows.map(function (row, index) { return renderPlatingRow(row, index, level.id); });
    var rejectionRow = renderPlatingRejectionRow("REJECTION", "%", level.platingRejection, level.platingRows.length + 1, function (v) { updatePlatingRejection(level.id, v); });
    var platingTotalRow = platingShapeTotalAmountRow(level, level.platingRows);
    var tbody = el("tbody", {}, itemRows.concat([rejectionRow]));

    var platingTables = [resizableTable("plating-raw", colgroup, thead, tbody)];
    if (platingTotalRow) platingTables.push(totalsTable("plating-raw", el("colgroup", {}, platingColgroupCols()), platingTotalRow));

    return el("div", {}, [
      el("div", { class: "sf-table-wrap" }, platingTables),
      el("div", { class: "sf-accordion__actions" }, [
        el("button", { class: "sf-btn sf-btn--secondary sf-btn--sm", onclick: function () { addPlatingRow(level.id); } }, ["+ Add Item"])
      ])
    ]);
  }

  // Same "always present, non-removable" trailing row idea as Molding's
  // renderFixedSummaryRow, but for the 5/6-column Plating table shape —
  // the trailing dash count matches whichever mode is currently showing.
  function renderPlatingRejectionRow(label, uom, value, srNo, onCommit) {
    var el = LM.el;
    var dashCount = showsRawMaterialPricing() ? 2 : 1;
    var dashCells = [];
    for (var i = 0; i < dashCount; i++) {
      dashCells.push(el("td", {}, [el("span", { class: "sf-table__derived" }, ["—"])]));
    }
    return el("tr", { class: "sf-table__fixed-row" }, [
      el("td", { class: "sf-table__actioncol" }, [el("span", { class: "sf-table__derived" }, [String(srNo)])]),
      el("td", {}, [el("span", { class: "sf-table__locked-label" }, [label])]),
      el("td", {}, [el("span", { class: "sf-table__derived" }, [uom])]),
      el("td", {}, [el("input", {
        class: "sf-table__input",
        type: "text",
        placeholder: "Qty",
        value: value,
        onchange: function (e) { onCommit(e.target.value); }
      }, [])])
    ].concat(dashCells).concat([
      el("td", { class: "sf-table__actioncol" }, [])
    ]));
  }

  // Anurag/Harish drop Cust. Spec entirely instead of appending MHR/Amount
  // after it — their Plating Process table is Sr.No/Description/UOM/Qty/
  // MHR (INR)/Amount (INR) only. Ravi keeps Cust. Spec, no MHR/Amount.
  function renderPlatingProcessRow(row, index, levelId) {
    var el = LM.el;
    var descCell = el("td", {}, [el("span", { class: "sf-table__locked-label" }, [row.description])]);
    var qtyCell = textCell(row.qty, function (v) { updatePlatingProcessRow(levelId, row.id, "qty", v); }, "Qty");
    var cells = [
      el("td", { class: "sf-table__actioncol" }, [el("span", { class: "sf-table__derived" }, [String(index + 1)])]),
      descCell,
      el("td", {}, [el("span", { class: "sf-table__derived" }, [row.uom])]),
      qtyCell
    ];
    if (showsRawMaterialPricing()) {
      cells = cells.concat(processPricingTrailingCells(row.qty, row, function (v) { updatePlatingProcessRow(levelId, row.id, "mhr", v); }));
    } else {
      cells.push(textCell(row.custSpec, function (v) { updatePlatingProcessRow(levelId, row.id, "custSpec", v); }, "Cust. Spec"));
    }
    return el("tr", { class: "sf-table__fixed-row" }, cells);
  }

  function platingProcessColgroupCols() {
    var el = LM.el;
    var cols = [
      el("col", { class: "sf-pltproc-col--icon" }, []),
      el("col", { class: "sf-pltproc-col--desc" }, []),
      el("col", { class: "sf-pltproc-col--uom" }, []),
      el("col", { class: "sf-pltproc-col--qty" }, [])
    ];
    if (showsRawMaterialPricing()) {
      cols = cols.concat([
        el("col", { class: "sf-pltproc-col--spec" }, []),
        el("col", { class: "sf-pltproc-col--spec" }, [])
      ]);
    } else {
      cols.push(el("col", { class: "sf-pltproc-col--spec" }, []));
    }
    return cols;
  }

  function renderPlatingProcessTable(level) {
    var el = LM.el;
    ensurePlatingProcessData(level);

    var colgroup = el("colgroup", {}, platingProcessColgroupCols());
    var baseHeaders = [
      el("th", { class: "sf-table__actioncol" }, ["Sr. No"]),
      el("th", {}, ["Description"]),
      el("th", {}, ["UOM"]),
      el("th", {}, ["Qty"])
    ];
    var thead = el("thead", {}, [
      el("tr", {}, showsRawMaterialPricing()
        ? baseHeaders.concat(processPricingTrailingHeaders())
        : baseHeaders.concat([el("th", {}, ["Cust. Spec"])]))
    ]);
    var tbody = el("tbody", {}, level.platingProcessRows.map(function (row, index) { return renderPlatingProcessRow(row, index, level.id); }));

    var platingProcessTotalRow = processTotalAmountRow(level, level.platingProcessRows, "qty", 3);
    var platingProcessTables = [resizableTable("plating-process", colgroup, thead, tbody)];
    if (platingProcessTotalRow) platingProcessTables.push(totalsTable("plating-process", el("colgroup", {}, platingProcessColgroupCols()), platingProcessTotalRow));

    return el("div", { class: "sf-table-wrap" }, platingProcessTables);
  }

  function renderProcessRow(row, index, levelId) {
    var el = LM.el;
    var descCell = el("td", {}, [el("span", { class: "sf-table__derived" }, [row.description])]);
    var cells = [
      el("td", { class: "sf-table__actioncol" }, [el("span", { class: "sf-table__derived" }, [String(index + 1)])]),
      descCell,
      el("td", {}, [el("span", { class: "sf-table__derived" }, [row.uom])]),
      el("td", {}, [el("input", {
        class: "sf-table__input",
        type: "text",
        placeholder: "Spec",
        value: row.spec,
        onchange: function (e) { updateProcessSpec(levelId, row.id, e.target.value); }
      }, [])])
    ];
    if (showsRawMaterialPricing()) {
      cells = cells.concat(processPricingTrailingCells(row.spec, row, function (v) { updateProcessRowMhr(levelId, row.id, v); }));
    }
    return el("tr", {}, cells);
  }

  function moldingProcessColgroupCols() {
    var el = LM.el;
    var cols = [
      el("col", { class: "sf-proc-col--icon" }, []),
      el("col", { class: "sf-proc-col--desc" }, []),
      el("col", { class: "sf-proc-col--uom" }, []),
      el("col", { class: "sf-proc-col--spec" }, [])
    ];
    if (showsRawMaterialPricing()) {
      cols = cols.concat([
        el("col", { class: "sf-proc-col--spec" }, []),
        el("col", { class: "sf-proc-col--spec" }, [])
      ]);
    }
    return cols;
  }

  function renderMoldingProcessTable(level) {
    var el = LM.el;
    ensureProcessData(level);

    var colgroup = el("colgroup", {}, moldingProcessColgroupCols());
    var thead = el("thead", {}, [
      el("tr", {}, [
        el("th", { class: "sf-table__actioncol" }, ["Sr. No"]),
        el("th", {}, ["Item Description"]),
        el("th", {}, ["UOM"]),
        el("th", {}, ["Spec"])
      ].concat(showsRawMaterialPricing() ? processPricingTrailingHeaders() : []))
    ]);
    var tbody = el("tbody", {}, level.processRows.map(function (row, index) { return renderProcessRow(row, index, level.id); }));

    var totalRow = processTotalAmountRow(level, level.processRows, "spec", 3);
    var tables = [resizableTable("molding-process", colgroup, thead, tbody)];
    if (totalRow) tables.push(totalsTable("molding-process", el("colgroup", {}, moldingProcessColgroupCols()), totalRow));

    return el("div", { class: "sf-table-wrap" }, tables);
  }

  // Anurag/Harish drop Spec entirely instead of appending MHR/Amount after
  // it — their Painting Process table is Sr.No/Description/UOM/Qty/MHR
  // (INR)/Amount (INR) only. Ravi keeps Spec, no MHR/Amount.
  function renderPaintingProcessRow(row, index, levelId) {
    var el = LM.el;
    var descCell = el("td", {}, [el("span", { class: "sf-table__locked-label" }, [row.description])]);
    var cells = [
      el("td", { class: "sf-table__actioncol" }, [el("span", { class: "sf-table__derived" }, [String(index + 1)])]),
      descCell,
      el("td", {}, [el("span", { class: "sf-table__derived" }, [row.uom])]),
      textCell(row.qty, function (v) { updatePaintingProcessRow(levelId, row.id, "qty", v); }, "Qty")
    ];
    if (showsRawMaterialPricing()) {
      cells = cells.concat(processPricingTrailingCells(row.qty, row, function (v) { updatePaintingProcessRow(levelId, row.id, "mhr", v); }));
    } else {
      cells.push(textCell(row.spec, function (v) { updatePaintingProcessRow(levelId, row.id, "spec", v); }, "Spec"));
    }
    return el("tr", { class: "sf-table__fixed-row" }, cells);
  }

  function paintingProcessColgroupCols() {
    var el = LM.el;
    var cols = [
      el("col", { class: "sf-pltproc-col--icon" }, []),
      el("col", { class: "sf-pltproc-col--desc" }, []),
      el("col", { class: "sf-pltproc-col--uom" }, []),
      el("col", { class: "sf-pltproc-col--qty" }, [])
    ];
    if (showsRawMaterialPricing()) {
      cols = cols.concat([
        el("col", { class: "sf-pltproc-col--spec" }, []),
        el("col", { class: "sf-pltproc-col--spec" }, [])
      ]);
    } else {
      cols.push(el("col", { class: "sf-pltproc-col--spec" }, []));
    }
    return cols;
  }

  function renderPaintingProcessTable(level) {
    var el = LM.el;
    ensurePaintingProcessData(level);

    var colgroup = el("colgroup", {}, paintingProcessColgroupCols());
    var baseHeaders = [
      el("th", { class: "sf-table__actioncol" }, ["Sr. No"]),
      el("th", {}, ["Description"]),
      el("th", {}, ["UOM"]),
      el("th", {}, ["Qty"])
    ];
    var thead = el("thead", {}, [
      el("tr", {}, showsRawMaterialPricing()
        ? baseHeaders.concat(processPricingTrailingHeaders())
        : baseHeaders.concat([el("th", {}, ["Spec"])]))
    ]);
    var tbody = el("tbody", {}, level.paintingProcessRows.map(function (row, index) { return renderPaintingProcessRow(row, index, level.id); }));

    var paintingProcessTotalRow = processTotalAmountRow(level, level.paintingProcessRows, "qty", 3);
    var paintingProcessTables = [resizableTable("painting-process", colgroup, thead, tbody)];
    if (paintingProcessTotalRow) paintingProcessTables.push(totalsTable("painting-process", el("colgroup", {}, paintingProcessColgroupCols()), paintingProcessTotalRow));

    return el("div", { class: "sf-table-wrap" }, paintingProcessTables);
  }

  function renderPaintShopTypePicklist(level) {
    var el = LM.el;
    var placeholder = el("option", { value: "" }, ["--None--"]);
    placeholder.setAttribute("disabled", "disabled");
    placeholder.setAttribute("hidden", "hidden");
    if (!level.paintShopType) placeholder.setAttribute("selected", "selected");

    var select = el("select", {
      class: "sf-accordion__select",
      onclick: function (e) { e.stopPropagation(); },
      onchange: function (e) { updatePaintShopType(level.id, e.target.value); }
    }, [placeholder].concat(PAINT_SHOP_TYPES.map(function (o) {
      var opt = el("option", { value: o }, [o]);
      if (o === level.paintShopType) opt.setAttribute("selected", "selected");
      return opt;
    })));

    return el("div", { class: "sf-accordion__select-group" }, [
      el("span", { class: "sf-accordion__select-label" }, ["Type of Paint Shop"]),
      select
    ]);
  }

  function renderAccordion(title, levelValue, rowCount, extraControl, isOpen, onToggle, body) {
    var el = LM.el;
    var rightChildren = [];
    if (extraControl) rightChildren.push(extraControl);
    if (rowCount != null) rightChildren.push(el("span", { class: "sf-accordion__count" }, [String(rowCount) + (rowCount === 1 ? " Item" : " Items")]));

    var head = el("div", {
      class: "sf-accordion__head",
      onclick: onToggle
    }, [
      el("span", { class: "sf-accordion__chevron" + (isOpen ? " sf-accordion__chevron--open" : "") }, ["▾"]),
      el("span", { class: "sf-accordion__title" }, [title]),
      el("span", { class: "sf-accordion__level-label" }, [levelValue]),
      rightChildren.length ? el("div", { class: "sf-accordion__right" }, rightChildren) : null
    ]);

    var children = [head];
    if (isOpen) children.push(el("div", { class: "sf-accordion__body" }, [body]));
    return el("div", { class: "sf-accordion" }, children);
  }

  function renderExecutionPanel(modal, tab) {
    var el = LM.el;
    var state = panelState(modal, tab.id);
    var rawCount = null;
    var rawBody;
    var processCount = null;
    var processBody;
    var processExtra = null;

    if (tab.value === "MOLDING") {
      ensureRawMaterialData(tab);
      // Includes the two fixed PART WEIGHT / REJECTION rows, which are
      // always present alongside the user-added item rows.
      rawCount = tab.rawMaterialRows.length + 2;
      rawBody = renderMoldingRawMaterialTable(tab);

      ensureProcessData(tab);
      processCount = tab.processRows.length;
      processBody = renderMoldingProcessTable(tab);
    } else if (tab.value === "PLATING") {
      ensurePlatingRawMaterialData(tab);
      // Includes the trailing, always-present REJECTION row.
      rawCount = tab.platingRows.length + 1;
      rawBody = renderPlatingRawMaterialTable(tab);

      ensurePlatingProcessData(tab);
      processCount = tab.platingProcessRows.length;
      processBody = renderPlatingProcessTable(tab);
    } else if (tab.value === "PAINTING") {
      ensurePaintingRawMaterialData(tab);
      rawCount = tab.paintingRows.length;
      rawBody = renderPaintingRawMaterialTable(tab);

      ensurePaintingProcessData(tab);
      processCount = tab.paintingProcessRows.length;
      processBody = renderPaintingProcessTable(tab);
      processExtra = renderPaintShopTypePicklist(tab);
    } else if (tab.value === "BOP ASSEMBLY") {
      ensureBopRawMaterialData(tab);
      rawCount = tab.bopRows.length;
      rawBody = renderBopRawMaterialTable(tab);

      ensureBopProcessData(tab);
      processCount = tab.bopProcessRows.length;
      processBody = renderBopProcessTable(tab);
    } else if (tab.value === "NON RETURNABLE PACKAGING") {
      ensureNrpRawMaterialData(tab);
      rawCount = tab.nrpRows.length;
      rawBody = renderNrpRawMaterialTable(tab);

      ensureNrpProcessData(tab);
      processCount = tab.nrpProcessRows.length;
      processBody = renderNrpProcessTable(tab);
    } else {
      rawBody = el("div", { class: "sf-table__empty" }, ["Raw material columns for " + tab.value + " will appear here."]);
      processBody = el("div", { class: "sf-table__empty" }, ["Process columns for " + tab.value + " will appear here."]);
    }

    return el("div", { class: "sf-exec-panel" }, [
      renderAccordion("Raw Material", tab.value, rawCount, null, state.rawOpen, function () { toggleRawMaterial(tab.id); }, rawBody),
      renderAccordion("Process", tab.value, processCount, processExtra, state.processOpen, function () { toggleProcess(tab.id); }, processBody)
    ]);
  }

  function renderProcessExecutionSection(modal) {
    var el = LM.el;
    var tabs = executionTabs(modal);

    var head = el("div", {
      class: "sf-modal-section__head sf-modal-section__head--clickable",
      onclick: toggleExecutionExpanded
    }, [
      el("div", { class: "sf-modal-section__title-group" }, [
        el("span", { class: "sf-modal-section__chevron" + (modal.executionExpanded ? " sf-modal-section__chevron--open" : "") }, ["▾"]),
        el("span", { class: "sf-modal-section__bar" }),
        el("span", { class: "sf-modal-section__title" }, ["Process Execution"]),
        el("span", { class: "sf-modal-section__hint" }, ["One tab per process level. Fill the Remark on every required row before saving."])
      ])
    ]);

    if (!modal.executionExpanded) {
      return el("div", { class: "sf-modal-section" }, [head]);
    }

    var activeTab = tabs.filter(function (t) { return t.id === modal.activeLevelId; })[0];

    var body = tabs.length
      ? el("div", {}, [
          el("div", { class: "sf-exec-tabs" }, tabs.map(renderExecutionTab)),
          activeTab ? renderExecutionPanel(modal, activeTab) : null
        ])
      : el("div", { class: "sf-table__empty" }, ["Select a process for at least one level to see it here."]);

    return el("div", { class: "sf-modal-section" }, [head, body]);
  }

  RFQConfig.renderPartConfigScreen = function renderPartConfigScreen() {
    var el = LM.el;
    var modal = RFQConfig.state.partConfigModal;

    var head = el("div", { class: "sf-modal__head" }, [
      el("h2", { class: "sf-modal__title" }, [modal.componentMaterial + " Configuration"])
    ]);

    var foot = el("div", { class: "sf-modal__foot" }, [
      el("button", { class: "sf-btn", onclick: handlePreview }, ["Preview"]),
      el("button", { class: "sf-btn", onclick: returnToMain }, ["Cancel"]),
      el("button", { class: "sf-btn sf-btn--brand", onclick: handleSave }, ["Save"])
    ]);

    var card = el("section", { class: "sf-card sf-config-screen" }, [
      head,
      el("div", { class: "sf-modal__body" }, [
        renderProcessLevelsSection(modal),
        renderPartPictureSection(modal),
        el("hr", { class: "sf-section-divider sf-modal-section-divider" }, []),
        renderProcessExecutionSection(modal)
      ]),
      foot
    ]);

    return el("div", { class: "sf-main sf-config-main" }, [card]);
  };
})(window.RFQConfig, window.LM);
