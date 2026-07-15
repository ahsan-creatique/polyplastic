/* ============================================================
   Creatique Technologies — Polyplastic Solution
   Module journey data (Lead ➜ Invoice)
   ============================================================ */

const MODULES = [
  {
    id: 1,
    icon: "🧲",
    name: "Lead & Pre-RFQ Management",
    short: "New customer enquiry, pre-RFQ visits, MOM capture",
    desc: "The journey begins here — every new business opportunity is captured, qualified and nurtured before it ever becomes an RFQ. Field visits and customer meetings are documented so no insight is lost.",
    steps: [
      {
        icon: "📩", phase: "Capture",
        title: "New Customer Enquiry",
        text: "Every enquiry — from email, phone, exhibitions or the website — lands in one system as a structured lead with source tracking.",
        features: ["Multi-channel enquiry capture", "Lead source & campaign tagging", "Duplicate lead detection", "Auto-assignment to sales owner"],
        outcome: "A qualified lead record, owned and trackable from day one."
      },
      {
        icon: "🎯", phase: "Qualify",
        title: "Lead Qualification",
        text: "Sales evaluates business potential — product fit, volumes, customer credibility — and moves the lead through a defined qualification stage path.",
        features: ["Qualification checklist", "Potential value estimation", "Stage-wise lead pipeline", "Disqualification with reason codes"],
        outcome: "Only genuine opportunities move forward — no noise in the pipeline."
      },
      {
        icon: "🚗", phase: "Engage",
        title: "Pre-RFQ Visit Planning",
        text: "Customer visits before the RFQ stage are planned, scheduled and logged — with agenda, participants and objectives defined upfront.",
        features: ["Visit calendar & scheduling", "Visit agenda & objective capture", "Participant tracking", "Visit history per customer"],
        outcome: "Structured customer engagement with a complete visit trail."
      },
      {
        icon: "📝", phase: "Document",
        title: "MOM Capture",
        text: "Minutes of Meeting are recorded directly against the lead — decisions, action items, owners and due dates — so commitments are never forgotten.",
        features: ["MOM templates", "Action items with owners & due dates", "Attachment of photos / documents", "Follow-up reminders & escalation"],
        outcome: "Every commitment documented, assigned and followed up."
      },
      {
        icon: "🔀", phase: "Convert",
        title: "Lead Conversion",
        text: "A qualified lead converts into an Account, Contact and Opportunity in one click — carrying its full history into the RFQ stage.",
        features: ["One-click conversion", "Full history carried forward", "Auto-creation of Account & Contact", "Handshake into RFQ module"],
        outcome: "Seamless handover into Account & RFQ management — zero re-entry."
      }
    ]
  },
  {
    id: 2,
    icon: "🏢",
    name: "Account & Contact Management",
    short: "Customer master, contact hierarchy, SAP customer code sync",
    desc: "The customer journey runs on two tracks — onboarding a New Customer (from lead conversion to SAP creation) and governing changes to an Existing Customer through a controlled Customer Change Request with KAM and CMO approvals.",
    steps: [
      {
        icon: "🔀", phase: "New Customer · Step 1", group: "Part 1 — New Customer Journey",
        title: "Lead Conversion & Account Setup",
        text: "A converted lead becomes an Account, Contact and Opportunity in Salesforce. The user can modify any account details freely at this stage, create multiple opportunities under the same new customer, and log Visits or MOMs against the customer.",
        features: ["Lead → Account, Contact & Opportunity", "Account details editable before SAP sync", "Multiple opportunities per customer", "Visits & MOM capture on the customer"],
        outcome: "A fully working customer workspace — open for edits until SAP sync."
      },
      {
        icon: "🚦", phase: "New Customer · Step 2",
        title: "DO Approval & SAP-Ready Status",
        text: "When a Development Order is created in Salesforce, it routes through multiple approvals. Once the final approver gives approval, the DO status field is set to Approved — and only then, and only for a NEW customer, a 'Sync with SAP' button appears on the DO.",
        features: ["Multi-level DO approval chain", "Status field updates to 'Approved'", "'Sync with SAP' button appears on approval", "Button visible for new customers only"],
        outcome: "SAP sync is unlocked only by the final DO approval."
      },
      {
        icon: "🔄", phase: "New Customer · Step 3", sap: true,
        title: "Sync with SAP",
        text: "The user clicks 'Sync with SAP' — an API call creates the customer in SAP, and the SAP Customer ID is written back onto the Salesforce customer record. The button is then disabled so the sync can never be fired twice.",
        features: ["One-click API call to SAP", "Customer created in SAP", "SAP Customer ID updated on the record", "Button auto-disabled after sync"],
        outcome: "One customer, one SAP code — created once, never duplicated."
      },
      {
        icon: "🗓️", phase: "Update Customer · Step 1", group: "Part 2 — Update (Existing) Customer Journey",
        title: "Ongoing Engagement",
        text: "Exactly like a new customer, users continue to create Visits and MOMs on the existing customer — day-to-day engagement is never blocked.",
        features: ["Visits on existing customers", "MOM capture & follow-ups", "Full activity history retained"],
        outcome: "Relationship activity continues without restriction."
      },
      {
        icon: "🔒", phase: "Update Customer · Step 2",
        title: "Customer Master Locked After Sync",
        text: "Once a customer is synced with SAP, users can no longer update customer information directly — protecting CRM–SAP alignment from uncontrolled edits.",
        features: ["Direct edit disabled post-sync", "Master data integrity protected", "All changes forced through change control"],
        outcome: "No silent edits — CRM and SAP can never drift apart."
      },
      {
        icon: "📝", phase: "Update Customer · Step 3",
        title: "Customer Change Request (CCR)",
        text: "To change customer information, the user raises a Customer Change Request — a replica of the customer record — entering the reason for the change and the new field values. On creation, an approval request with email and notification goes to the KAM named on the customer. If the KAM rejects, the requester is notified with the rejection reason.",
        features: ["CCR record — replica of the customer", "Mandatory reason for change", "Approval + email + notification to KAM", "KAM rejection → requester notified with reason"],
        outcome: "Every change starts with a reason and a KAM's judgement."
      },
      {
        icon: "👔", phase: "Update Customer · Step 4",
        title: "CMO Approval",
        text: "If the KAM approves, the request moves to the next approver — the CMO. If the CMO rejects, both the requester and the KAM receive a notification with the reason of rejection.",
        features: ["Two-level chain: KAM → CMO", "CMO rejection → requester + KAM notified", "Rejection reason always captured"],
        outcome: "Senior sign-off before any customer master change."
      },
      {
        icon: "🛰️", phase: "Update Customer · Step 5", sap: true,
        title: "Customer Updated & SAP Sync",
        text: "On CMO approval, the changed fields from the CCR are applied to the customer in Salesforce — and an API call immediately updates the same information on the SAP customer.",
        features: ["Approved values applied to customer", "Automatic API call to SAP", "SAP customer updated in real time", "Full audit trail of the change"],
        outcome: "Approved changes land in Salesforce and SAP together — always in sync."
      }
    ]
  },
  {
    id: 3,
    icon: "⚙️",
    name: "RFQ Configuration Management",
    short: "Opportunity creation, NEP auto-numbering, feasibility, dynamic fields, supplier inputs",
    desc: "The second-largest module of the solution — the complete RFQ engine, organised into 7 sub-modules. Each sub-module has its own execution cycle, from RFQ registration and process-level definition through feasibility, supplier inputs and approvals, up to versioned PDF generation.",
    steps: [],
    submodules: [
      {
        id: 1, icon: "📝",
        name: "RFQ Registration",
        short: "Opportunity / RFQ creation by Marketing with dynamic process levels",
        cycle: [
          {
            icon: "💼", actor: "Marketing User",
            title: "Create the RFQ / Opportunity",
            text: "The Marketing user creates the RFQ as an Opportunity in Salesforce and defines the process levels of the product."
          },
          {
            icon: "🎚️", actor: "Marketing User",
            title: "Define the 6 Default Process Levels",
            text: "The Opportunity carries six default Level dropdown fields. Every dropdown offers the same set of manufacturing process options:",
            chips: ["Injection Moulding", "Painting", "Plating", "Assembly", "Pad/Screen/Laser Printing", "Pad/Screen Printing", "Vacuum Metallizing (PVD)", "Hot Stamping", "Film Forming/Trimming", "Film Printing", "Aluminium Anodising", "3D Flexible Badge"]
          },
          {
            icon: "➕", actor: "Marketing User",
            title: "Add Level — Dynamic Expansion",
            text: "If the product needs more than six processes, the user clicks the 'Add Level' button and additional level dropdowns are added dynamically."
          },
          {
            icon: "🔃", actor: "Marketing User",
            title: "Re-Sequence Levels by Drag & Drop",
            text: "The user can change the sequence of the levels simply by dragging them — for example, if Level 2 is Painting and Level 3 is Plating, dragging one over the other swaps their positions instantly.",
            chips: ["Drag & drop re-ordering", "Example: Level 2 Painting ⇄ Level 3 Plating", "Sequence saved on the Opportunity"]
          },
          {
            icon: "🛤️", actor: "System",
            title: "Workflow Routes by Selected Levels",
            text: "The RFQ workflow proceeds based on the selected process levels and their sequence — every downstream screen adapts to the levels chosen here."
          }
        ]
      },
      {
        id: 2, icon: "📄",
        name: "Product Requirement",
        short: "Customer requirement capture, AI-powered summary and auto-update of the Opportunity",
        cycle: [
          {
            icon: "📥", actor: "Marketing User",
            title: "Receive Customer Requirements",
            text: "The Marketing user receives the customer's product requirements along with the relevant product documents."
          },
          {
            icon: "📤", actor: "Marketing User",
            title: "Upload Documents to Salesforce",
            text: "The Marketing team user uploads all requirement documents to Salesforce using the document uploader — everything stored against the Opportunity."
          },
          {
            icon: "🤖", actor: "AI Agent",
            title: "AI Reads the Customer Input",
            text: "An AI agent processes the uploaded customer input, extracts the relevant information and builds a summary — which is displayed directly on the Opportunity.",
            chips: ["Automatic document reading", "Relevant information extraction", "AI summary shown on the Opportunity"]
          },
          {
            icon: "✍️", actor: "AI Agent",
            title: "Product Information Auto-Captured",
            text: "The product information found in the customer input is also captured and updated straight into the Opportunity record — no manual re-typing by the Marketing team."
          }
        ]
      },
      {
        id: 3, icon: "🖥️",
        name: "Polyplastics Server Integration",
        short: "CAD upload to the Polyplastics Server via API with public link on the Opportunity",
        cycle: [
          {
            icon: "📐", actor: "Marketing User",
            title: "Upload CAD via Salesforce",
            text: "The user uploads the CAD file to the Polyplastics Server using Salesforce — the transfer happens through an API integration."
          },
          {
            icon: "🔗", actor: "System",
            title: "Public Link Generated",
            text: "Once the upload completes, a public link to the file is generated and automatically updated on the Opportunity.",
            chips: ["API-based upload", "Auto-generated public link", "Link stored on the Opportunity"]
          },
          {
            icon: "🚀", actor: "Marketing User",
            title: "'Send for Product Feasibility'",
            text: "With the CAD uploaded and all required information entered, the user clicks 'Send for Product Feasibility' — a notification goes to the Product Feasibility team and its associated members."
          }
        ]
      },
      {
        id: 4, icon: "🧪",
        name: "Product Feasibility",
        short: "Engineering cross-verification of customer input and process levels",
        cycle: [
          {
            icon: "🔔", actor: "Engineering Team",
            title: "Notification Received — Review Customer Input",
            text: "The Engineering team receives the notification and reviews the customer input in detail against the Opportunity."
          },
          {
            icon: "🧩", actor: "System",
            title: "Level-Dependent Parameters Appear",
            text: "Based on the process levels selected at registration, multiple dependent parameters are displayed — only the fields relevant to those processes."
          },
          {
            icon: "🔍", actor: "Engineering Team",
            title: "Cross-Verify the Opportunity Levels",
            text: "Engineering cross-verifies the levels of the Opportunity against the actual product. If anything is not relevant to the product, they connect with the customer and get the requirement changed.",
            branches: [
              { type: "no", label: "Mismatch Found", text: "Engineering connects with the customer, the requirement is corrected, and the Opportunity is updated." },
              { type: "ok", label: "Everything Relevant", text: "Technical fields are completed per the product specifications — ready to send to the supplier." }
            ]
          },
          {
            icon: "📨", actor: "Engineering Team",
            title: "Send Information to Supplier",
            text: "With the requirement verified and feasibility data complete, the information is sent onward to the supplier (Sub-Module 3.5)."
          }
        ]
      },
      {
        id: 5, icon: "🤝",
        name: "Supplier Inputs",
        short: "Three-tab supplier screen, dynamic link email and tooling cost submission",
        cycle: [
          {
            icon: "🖥️", actor: "Engineering Team",
            title: "'Send to Supplier' — 3-Tab Screen Opens",
            text: "The Engineering team clicks the 'Send to Supplier' button and a screen opens with three tabs of information for the supplier package.",
            chips: ["Tab 1 · Product Tooling Information", "Tab 2 · Product Information", "Tab 3 · Product Picture"]
          },
          {
            icon: "🧾", actor: "Tab 1", actorIcon: "🗂️",
            title: "Product Tooling Information",
            text: "A tooling table with columns for the List of Tooling name, Quantity and Unit Cost — the Total Cost is auto-calculated as Quantity × Unit Cost. In this tab, the supplier fills only the Unit Cost.",
            chips: ["Tooling Name", "Quantity", "Unit Cost — supplier entry only", "Total Cost = Qty × Unit Cost (auto)"]
          },
          {
            icon: "📋", actor: "Tab 2", actorIcon: "🗂️",
            title: "Product Information",
            text: "The product information tab is editable by all users except the supplier — the supplier can view it but cannot change anything, including the quantity."
          },
          {
            icon: "🖼️", actor: "Tab 3", actorIcon: "🗂️",
            title: "Product Picture",
            text: "The third tab displays the product picture, giving the supplier full visual context of the part."
          },
          {
            icon: "✉️", actor: "Engineering Team",
            title: "Send — Email with Dynamic Link",
            text: "When the Engineering team user sends this information, the supplier receives an email with a dynamic link attached that opens the supplier screen."
          },
          {
            icon: "💵", actor: "Supplier",
            title: "Supplier Fills Unit Price & Submits",
            text: "The supplier opens the link, fills in the Unit Price and submits the tooling cost.",
            branches: [
              { type: "ok", label: "On Submission", text: "A notification is sent to the Associate Engineering user and Ravi Sir." }
            ]
          }
        ]
      },
      {
        id: 6, icon: "🛠️",
        name: "Tooling Feasibility",
        short: "Supplier submission, verification and two-level approval",
        cycle: [
          {
            icon: "📬", actor: "Engineering Associate",
            title: "Supplier Submits — Associate Notified",
            text: "When the supplier submits the tooling feasibility, a notification goes first to the Engineering Associate."
          },
          {
            icon: "🔍", actor: "Engineering Associate",
            title: "Verify & Update Supplier Inputs",
            text: "The associate reviews and verifies the supplier's inputs, updates anything that needs changing, and submits for approval to Ravi Sir."
          },
          {
            icon: "🧐", actor: "Ravi Sir",
            title: "Full Technical & Pricing Review",
            text: "Ravi Sir reviews the complete Opportunity — all technical details and pricing — then forwards it to Rakesh Sir for final approval.",
            branches: [
              { type: "no", label: "Ravi Sir Rejects", text: "The Engineering Associate receives a notification to make the required changes." }
            ]
          },
          {
            icon: "👑", actor: "Rakesh Sir",
            title: "Final Approval Decision",
            text: "Rakesh Sir takes the final decision on the Opportunity.",
            branches: [
              { type: "ok", label: "Approved", text: "The Opportunity Owner (Marketing user) is notified that the Opportunity is ready for quotation." },
              { type: "no", label: "Rejected", text: "Ravi Sir and the Engineering Associate receive a rejection notification." }
            ]
          }
        ]
      },
      {
        id: 7, icon: "🗎",
        name: "PDF Generation",
        short: "Versioned Product & Tooling Feasibility PDFs",
        cycle: [
          {
            icon: "📑", actor: "User",
            title: "Generate Two PDF Documents — At Any Stage",
            text: "Once Product and Tooling Feasibility are completed, the user can generate the Product Feasibility PDF and the Tooling Feasibility PDF at any stage of the Opportunity.",
            chips: ["Product Feasibility PDF", "Tooling Feasibility PDF", "Available at any stage after feasibility"]
          },
          {
            icon: "🗂️", actor: "System",
            title: "Automatic Versioning",
            text: "Both PDFs support versioning — if the Opportunity is modified and the PDF is generated again, a new version is created automatically while all previous versions are preserved."
          }
        ]
      }
    ]
  },
  {
    id: 4,
    icon: "💰",
    name: "Costing & Quotation",
    short: "CBD, customer quotation formats, multi-level costing",
    desc: "From engineering data to a customer-ready price — a structured Cost Break Down engine with multi-level costing, and quotations generated in the exact format each customer expects.",
    steps: [
      {
        icon: "🧮", phase: "Cost",
        title: "Cost Break Down (CBD)",
        text: "A structured CBD built from RFQ data — raw material, process, tooling amortisation, overheads and margin — every element visible and defendable.",
        features: ["Material, process & overhead heads", "Tooling amortisation logic", "Rejection & handling factors", "Margin & landed cost view"],
        outcome: "A transparent, audit-ready cost for every part."
      },
      {
        icon: "🏗️", phase: "Cost",
        title: "Multi-Level Costing",
        text: "Assemblies are costed level by level — child parts roll up into parent costs automatically, mirroring the product structure.",
        features: ["Parent-child cost roll-up", "Bought-out part costs from suppliers", "Version-wise cost comparison", "What-if cost simulation"],
        outcome: "Accurate assembly costs without spreadsheet gymnastics."
      },
      {
        icon: "📄", phase: "Quote",
        title: "Customer Quotation Formats",
        text: "One click renders the approved cost into the customer's own quotation template — each OEM sees the format they mandate.",
        features: ["Per-customer quotation templates", "Auto-populated from CBD", "Commercial terms library", "PDF generation & branding"],
        outcome: "Professional quotations in the customer's mandated format."
      },
      {
        icon: "🗃️", phase: "Govern",
        title: "Quotation Versioning",
        text: "Every revision of price or terms creates a new quotation version — history preserved, negotiations traceable.",
        features: ["Version & revision tracking", "Negotiation history", "Validity date control", "Won / lost price analytics"],
        outcome: "Full commercial memory of every negotiation."
      }
    ]
  },
  {
    id: 5,
    icon: "✅",
    name: "Approval Management",
    short: "Multi-level parallel approvals for Opportunity and Quotation",
    desc: "Governance without delay — opportunities and quotations route through configurable multi-level approval matrices, with parallel approvers, escalations and a complete audit trail.",
    steps: [
      {
        icon: "🗺️", phase: "Define",
        title: "Approval Matrix Setup",
        text: "Approval rules are configured by value, customer, product line or margin — who approves what, in which sequence, is defined once and enforced always.",
        features: ["Value & margin-based rules", "Role-based approver mapping", "Sequential + parallel stages", "Delegation & out-of-office rules"],
        outcome: "The right approvers, automatically — every single time."
      },
      {
        icon: "🚦", phase: "Route",
        title: "Opportunity Approval",
        text: "Before an RFQ is committed, the opportunity itself passes through management approval — feasibility, capacity and strategic fit reviewed.",
        features: ["Go / No-Go decision gate", "Feasibility & capacity review", "Comments & conditions capture", "Approval SLA tracking"],
        outcome: "Management commits capacity consciously, not by accident."
      },
      {
        icon: "⚡", phase: "Route",
        title: "Parallel Quotation Approval",
        text: "Costing, sales head and finance can approve simultaneously — parallel approval lanes crush turnaround time without weakening control.",
        features: ["Parallel approval lanes", "Mobile / email approvals", "Auto-reminders & escalation", "Rejection with mandatory reason"],
        outcome: "Faster quotes to customer with full financial control."
      },
      {
        icon: "📜", phase: "Audit",
        title: "Audit Trail & Compliance",
        text: "Every approve, reject and resubmit is time-stamped with user and comments — an audit trail that satisfies any review.",
        features: ["Complete approval history", "Time-stamped actions", "Pending-approval dashboards", "Cycle-time analytics"],
        outcome: "Zero-dispute governance with measurable approval speed."
      }
    ]
  },
  {
    id: 6,
    icon: "📋",
    name: "Development Order",
    short: "DO creation, internal routing, SAP customer code trigger",
    desc: "The moment a quotation is won, the Development Order formalises internal commitment — routing work to every department and triggering the SAP customer code so downstream execution can begin.",
    steps: [
      {
        icon: "🏁", phase: "Create",
        title: "DO Creation",
        text: "A won quotation converts into a Development Order carrying the NEP number, agreed price, volumes and timeline — the internal contract to execute.",
        features: ["Auto-creation from won quote", "NEP-linked DO record", "Commercial terms snapshot", "Customer PO reference capture"],
        outcome: "A single formal trigger that starts development."
      },
      {
        icon: "🔀", phase: "Route",
        title: "Internal Routing",
        text: "The DO routes to engineering, tooling, quality, purchase and planning with department-wise tasks and acknowledgements.",
        features: ["Department-wise task routing", "Acknowledgement tracking", "Responsibility matrix", "Kick-off checklist"],
        outcome: "Every department knows its scope from day one."
      },
      {
        icon: "🔗", phase: "Integrate", sap: true,
        title: "SAP Customer Code Trigger",
        text: "DO confirmation automatically triggers customer code creation in SAP (if not already present) — no manual master-data requests.",
        features: ["Auto customer-code request", "Status tracking of SAP creation", "Error handling & retry", "Code write-back to CRM"],
        outcome: "SAP is execution-ready the moment the DO is confirmed."
      },
      {
        icon: "📊", phase: "Track",
        title: "DO Monitoring",
        text: "A live dashboard of every open DO — stage, ageing, responsible department and bottlenecks.",
        features: ["DO status dashboard", "Ageing & bottleneck alerts", "Department performance view", "Handshake into NPD project"],
        outcome: "Development commitments visible and on schedule."
      }
    ]
  },
  {
    id: 7,
    icon: "🧱",
    name: "BOM & LOT Management",
    short: "Preliminary/Final BOM, List of Tooling, SAP BOM sync",
    desc: "Engineering truth, structured — the Bill of Materials evolves from preliminary to final under version control, the List of Tooling is managed alongside, and the released BOM syncs straight into SAP.",
    steps: [
      {
        icon: "🌱", phase: "Draft",
        title: "Preliminary BOM",
        text: "An early BOM is drafted from RFQ and feasibility data — enough structure to drive costing and early procurement decisions.",
        features: ["Multi-level BOM structure", "Material & grade capture", "Preliminary weights & usage", "Linked to CBD costing"],
        outcome: "Early clarity on product structure and cost drivers."
      },
      {
        icon: "🏆", phase: "Finalise",
        title: "Final BOM",
        text: "As design matures, the BOM is frozen with full revision control — every change from preliminary to final is tracked and approved.",
        features: ["BOM freeze & release workflow", "Revision comparison view", "Change history & approvals", "Effectivity dates"],
        outcome: "A single approved BOM as the manufacturing reference."
      },
      {
        icon: "🧰", phase: "Tooling",
        title: "List of Tooling (LOT)",
        text: "Every tool, die, jig, fixture and gauge needed for the part is catalogued with cost, supplier, and delivery status.",
        features: ["Tool master with specifications", "Tool cost & PO tracking", "Tool trial status", "Tool life monitoring"],
        outcome: "Complete tooling visibility from order to first-off approval."
      },
      {
        icon: "📡", phase: "Integrate", sap: true,
        title: "SAP BOM Sync",
        text: "The released BOM pushes to SAP automatically — material masters and BOM structures land in SAP without re-keying.",
        features: ["Auto BOM push on release", "Material master mapping", "Sync validation & error log", "Revision sync on ECN"],
        outcome: "SAP production data always mirrors the engineering release."
      }
    ]
  },
  {
    id: 8,
    icon: "🚀",
    name: "NPD Project Management",
    short: "Phase-gate tracking, development purchase, milestone management",
    desc: "New Product Development run with discipline — phase-gate governance, milestone tracking and development purchases managed against the project, so launches happen on time.",
    steps: [
      {
        icon: "🚪", phase: "Govern",
        title: "Phase-Gate Setup",
        text: "The project is structured into phases — kick-off, design, tooling, trials, PPAP, SOP — each with defined gate criteria and deliverables.",
        features: ["Configurable phase-gate model", "Gate criteria checklists", "Deliverable tracking per phase", "Gate review & sign-off"],
        outcome: "No phase advances until its gate criteria are truly met."
      },
      {
        icon: "🎯", phase: "Plan",
        title: "Milestone Management",
        text: "Key dates — tool order, T0/T1 trials, sample submission, PPAP, SOP — planned, tracked and compared against customer timelines.",
        features: ["Milestone plan vs actual", "Customer timeline alignment", "Delay alerts & recovery plans", "Gantt-style progress view"],
        outcome: "Launch dates protected by early visibility of slippage."
      },
      {
        icon: "🛒", phase: "Procure",
        title: "Development Purchase",
        text: "Development-stage buying — tools, gauges, trial material — is raised and tracked against the project budget.",
        features: ["Dev purchase requisitions", "Budget vs actual tracking", "Supplier delivery tracking", "Cost booking to project"],
        outcome: "Development spend controlled and fully attributable."
      },
      {
        icon: "📈", phase: "Track",
        title: "Project Dashboard",
        text: "Portfolio-level view of all NPD projects — health, phase, risks and upcoming gates — for management review meetings.",
        features: ["Portfolio health dashboard", "RAG status per project", "Risk & issue register", "Management review reports"],
        outcome: "One screen answers 'where is every project today?'"
      }
    ]
  },
  {
    id: 9,
    icon: "📦",
    name: "Packaging Module",
    short: "Customer and internal packaging, approval, communication tracking",
    desc: "Packaging treated as a deliverable, not an afterthought — customer packaging standards and internal packaging designs defined, approved and communicated with a full trail.",
    steps: [
      {
        icon: "📐", phase: "Define",
        title: "Customer Packaging Specification",
        text: "Customer-mandated packaging — bins, trolleys, quantities per pack, labelling — captured as a controlled specification per part.",
        features: ["Per-part packaging spec", "Returnable / one-way definition", "Labelling & barcode standards", "Customer standard documents"],
        outcome: "Customer packaging requirements locked and unambiguous."
      },
      {
        icon: "🎨", phase: "Design",
        title: "Internal Packaging Design",
        text: "Internal packaging for in-plant movement and dispatch is designed with quantities, protection method and cost per pack.",
        features: ["Internal pack design record", "Packing quantity & cost", "Protection & handling method", "Trial pack validation"],
        outcome: "Optimised packaging cost with protected parts."
      },
      {
        icon: "🖊️", phase: "Approve",
        title: "Packaging Approval",
        text: "Both customer and internal packaging pass through formal approval — quality, logistics and the customer sign off before SOP.",
        features: ["Multi-party approval flow", "Customer sign-off capture", "Revision on rejection", "Approval linked to PPAP"],
        outcome: "No launch with unapproved packaging."
      },
      {
        icon: "📨", phase: "Communicate",
        title: "Communication Tracking",
        text: "Every packaging discussion with the customer — emails, trials, feedback — is logged against the packaging record.",
        features: ["Communication log per spec", "Customer feedback tracking", "Open point follow-up", "Full packaging history"],
        outcome: "Complete traceability of every packaging decision."
      }
    ]
  },
  {
    id: 10,
    icon: "🔁",
    name: "Change Management (ECN)",
    short: "Engineering Change Notice, version/revision tracking",
    desc: "Change without chaos — every engineering change flows through a formal ECN with impact assessment, approvals and synchronized version control across BOM, tooling, costing and SAP.",
    steps: [
      {
        icon: "📣", phase: "Initiate",
        title: "ECN Initiation",
        text: "Any change — customer drawing revision, process improvement, cost reduction — starts as a formal ECN with reason and scope.",
        features: ["ECN request form", "Change reason classification", "Affected part identification", "Customer / internal origin tag"],
        outcome: "Every change enters through one controlled front door."
      },
      {
        icon: "🔍", phase: "Assess",
        title: "Impact Assessment",
        text: "Cross-functional teams assess impact on BOM, tooling, cost, quality, stock and timelines before anything changes.",
        features: ["Multi-department impact review", "Cost impact estimation", "Stock & WIP disposition", "Tooling modification needs"],
        outcome: "Changes approved with eyes open — no downstream surprises."
      },
      {
        icon: "🧾", phase: "Control",
        title: "Version / Revision Tracking",
        text: "On approval, part and BOM revisions increment automatically — old versions archived, new versions released with effectivity.",
        features: ["Auto revision increment", "Revision history & comparison", "Document re-release", "Effectivity date management"],
        outcome: "One current revision — everywhere, always."
      },
      {
        icon: "🛰️", phase: "Implement", sap: true,
        title: "ECN Implementation & SAP Update",
        text: "Implementation tasks are tracked to closure and the revised BOM/master data syncs to SAP, closing the loop.",
        features: ["Implementation task tracking", "SAP revision sync", "Closure verification", "ECN cycle-time analytics"],
        outcome: "Approved changes reach the shop floor and SAP — verified."
      }
    ]
  },
  {
    id: 11,
    icon: "🔗",
    name: "SAP Integration",
    short: "Customer master, BOM, invoice, and order sync with SAP",
    desc: "The bridge that completes lead-to-invoice — CRM and SAP exchange customer masters, BOMs, orders and invoices automatically, so commercial and execution worlds stay in lockstep.",
    steps: [
      {
        icon: "🏢", phase: "Master Data", sap: true,
        title: "Customer Master Sync",
        text: "Customer creation and changes flow between CRM and SAP — one identity, two systems, zero re-keying.",
        features: ["Bi-directional customer sync", "Field-level mapping", "Change replication", "Duplicate prevention"],
        outcome: "A single customer identity across CRM and SAP."
      },
      {
        icon: "🧱", phase: "Engineering", sap: true,
        title: "BOM Sync",
        text: "Released and revised BOMs push to SAP with material masters — production always builds to the current engineering release.",
        features: ["BOM push on release", "Material master creation", "Revision-level sync", "Validation & error queue"],
        outcome: "Engineering release equals SAP production data."
      },
      {
        icon: "📑", phase: "Commercial", sap: true,
        title: "Order Sync",
        text: "Customer orders and development orders reflect in SAP as sales orders — schedules and amendments stay aligned.",
        features: ["Sales order creation in SAP", "Schedule line sync", "Amendment handling", "Order status write-back"],
        outcome: "What sales committed is exactly what SAP executes."
      },
      {
        icon: "🧾", phase: "Finance", sap: true,
        title: "Invoice Sync",
        text: "SAP invoices flow back to CRM — sales sees billing status, payments and the true commercial closure of every project.",
        features: ["Invoice data pull from SAP", "Billing status per order", "Revenue realisation view", "Lead-to-invoice traceability"],
        outcome: "The journey closes: from first enquiry to final invoice — traced end-to-end."
      }
    ]
  }
];
