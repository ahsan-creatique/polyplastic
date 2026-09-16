/* ============================================================
   Creatique Technologies — Polyplastics Solution
   MODULE / SUB-MODULE CONTENT — edit this file to change what the
   website shows. No coding knowledge required.

   HOW TO EDIT THIS FILE
   ----------------------------------------------------------------
   1. Open this file in Notepad (or any plain text editor).
   2. Find the module/step you want to change and edit the text
      after the colon. Do not touch the words in ALL CAPS
      (MODULE, STEP, CYCLE, END STEP, etc.) — those are structure
      markers the website uses to find each block.
   3. Save the file, then refresh the website in your browser.

   Full instructions, with copy-paste examples for adding a new
   step, a new sub-module, or a whole new module, are in:
       BA-CONTENT-GUIDE.md   (in the project’s main folder)

   Do not delete the backtick characters ( ` ) on the very first
   and very last line of this file — everything you edit must stay
   BETWEEN them.
   ============================================================ */

const MODULES_TEXT = `
MODULE 1
  Icon: 🧲
  Name: Lead & Pre-RFQ Management
  Short: New customer enquiry, pre-RFQ visits, MOM capture
  Desc: The journey begins here — every new business opportunity is captured, qualified and nurtured before it ever becomes an RFQ. Field visits and customer meetings are documented so no insight is lost.

  STEP
    Icon: 📩
    Phase: Capture
    Title: New Account/Customer Enquiry
    Text: Every enquiry — from email, phone, exhibitions or the website — lands in one system as a structured lead with source tracking.
    Features:
      - Multi-channel enquiry capture
      - Lead source & campaign tagging
      - Duplicate lead detection
      - Auto-assignment to sales owner
    Outcome: A qualified lead record, owned and trackable from day one.
  END STEP

  STEP
    Icon: 🎯
    Phase: Qualify
    Title: Lead Qualification
    Text: Sales evaluates business potential — product fit, volumes, customer credibility — and moves the lead through a defined qualification stage path.
    Features:
      - Qualification checklist
      - Potential value estimation
      - Stage-wise lead pipeline
      - Disqualification with reason codes
    Outcome: Only genuine opportunities move forward — no noise in the pipeline.
  END STEP

  STEP
    Icon: 🚗
    Phase: Engage
    Title: Pre-RFQ Visit Planning
    Text: Customer visits before the RFQ stage are planned, scheduled and logged — with agenda, participants and objectives defined upfront.
    Features:
      - Visit calendar & scheduling
      - Visit agenda & objective capture
      - Participant tracking
      - Visit history per customer
    Outcome: Structured customer engagement with a complete visit trail.
  END STEP

  STEP
    Icon: 📝
    Phase: Document
    Title: MOM Capture
    Text: Minutes of Meeting are recorded directly against the lead — decisions, action items, owners and due dates — so commitments are never forgotten.
    Features:
      - MOM templates
      - Action items with owners & due dates
      - Attachment of photos / documents
      - Follow-up reminders & escalation
    Outcome: Every commitment documented, assigned and followed up.
  END STEP

  STEP
    Icon: 🔀
    Phase: Convert
    Title: Lead Conversion
    Text: A qualified lead converts into an Account, Contact and Opportunity in one click — carrying its full history into the RFQ stage.
    Features:
      - One-click conversion
      - Full history carried forward
      - Auto-creation of Account & Contact
      - Handshake into RFQ module
    Outcome: Seamless handover into Account & RFQ management — zero re-entry.
  END STEP

END MODULE


MODULE 2
  Icon: 🏢
  Name: Account & Contact Management
  Short: Customer master, contact hierarchy, SAP customer code sync
  Desc: The customer journey runs on two tracks — onboarding a New Customer (from lead conversion to SAP creation) and governing changes to an Existing Customer through a controlled Customer Change Request with KAM and CMO approvals.

  STEP
    Icon: 🔀
    Phase: New Account/Customer · Step 1
    Group: Part 1 — New Customer Journey
    Title: Lead Conversion & Account Setup
    Text: A converted lead becomes an Account, Contact and Opportunity in Salesforce. The user can modify any account details freely at this stage, create multiple opportunities under the same new customer, and log Visits or MOMs against the customer.
    Features:
      - Lead → Account, Contact & Opportunity
      - Account details editable before SAP sync
      - Multiple opportunities per customer
      - Visits & MOM capture on the customer
    Outcome: A fully working customer workspace — open for edits until SAP sync.
  END STEP

  STEP
    Icon: 🚦
    Phase: New Customer · Step 2
    Title: DO Approval & SAP-Ready Status
    Text: When a Development Order is created in Salesforce, it routes through multiple approvals. Once the final approver gives approval, the DO status field is set to Approved — and only then, and only for a NEW customer, a 'Sync with SAP' button appears on the DO.
    Features:
      - Multi-level DO approval chain
      - Status field updates to 'Approved'
      - 'Sync with SAP' button appears on approval
      - Button visible for new customers only
    Outcome: SAP sync is unlocked only by the final DO approval.
  END STEP

  STEP
    Icon: 🔄
    Phase: New Customer · Step 3
    Title: Sync with SAP
    Text: The user clicks 'Sync with SAP' — an API call creates the customer in SAP, and the SAP Customer ID is written back onto the Salesforce customer record. The button is then disabled so the sync can never be fired twice.
    Features:
      - One-click API call to SAP
      - Customer created in SAP
      - SAP Customer ID updated on the record
      - Button auto-disabled after sync
    Outcome: One customer, one SAP code — created once, never duplicated.
    Sap: yes
  END STEP

  STEP
    Icon: 🗓️
    Phase: Update Customer · Step 1
    Group: Part 2 — Update (Existing) Customer Journey
    Title: Ongoing Engagement
    Text: Exactly like a new customer, users continue to create Visits and MOMs on the existing customer — day-to-day engagement is never blocked.
    Features:
      - Visits on existing customers
      - MOM capture & follow-ups
      - Full activity history retained
    Outcome: Relationship activity continues without restriction.
  END STEP

  STEP
    Icon: 🔒
    Phase: Update Customer · Step 2
    Title: Customer Master Locked After Sync
    Text: Once a customer is synced with SAP, users can no longer update customer information directly — protecting CRM–SAP alignment from uncontrolled edits.
    Features:
      - Direct edit disabled post-sync
      - Master data integrity protected
      - All changes forced through change control
    Outcome: No silent edits — CRM and SAP can never drift apart.
  END STEP

  STEP
    Icon: 📝
    Phase: Update Customer · Step 3
    Title: Customer Change Request (CCR)
    Text: To change customer information, the user raises a Customer Change Request — a replica of the customer record — entering the reason for the change and the new field values. On creation, an approval request with email and notification goes to the KAM named on the customer. If the KAM rejects, the requester is notified with the rejection reason.
    Features:
      - CCR record — replica of the customer
      - Mandatory reason for change
      - Approval + email + notification to KAM
      - KAM rejection → requester notified with reason
    Outcome: Every change starts with a reason and a KAM's judgement.
  END STEP

  STEP
    Icon: 👔
    Phase: Update Customer · Step 4
    Title: CMO Approval
    Text: If the KAM approves, the request moves to the next approver — the CMO. If the CMO rejects, both the requester and the KAM receive a notification with the reason of rejection.
    Features:
      - Two-level chain: KAM → CMO
      - CMO rejection → requester + KAM notified
      - Rejection reason always captured
    Outcome: Senior sign-off before any customer master change.
  END STEP

  STEP
    Icon: 🛰️
    Phase: Update Customer · Step 5
    Title: Customer Updated & SAP Sync
    Text: On CMO approval, the changed fields from the CCR are applied to the customer in Salesforce — and an API call immediately updates the same information on the SAP customer.
    Features:
      - Approved values applied to customer
      - Automatic API call to SAP
      - SAP customer updated in real time
      - Full audit trail of the change
    Outcome: Approved changes land in Salesforce and SAP together — always in sync.
    Sap: yes
  END STEP

END MODULE


MODULE 3
  Icon: ⚙️
  Name: RFQ Configuration Management
  Short: Opportunity creation, NEP auto-numbering, feasibility, dynamic fields, supplier inputs
  Desc: The second-largest module of the solution — the complete RFQ engine, organised into 7 sub-modules. Each sub-module has its own execution cycle, from RFQ registration and process-level definition through feasibility, supplier inputs and approvals, up to versioned PDF generation.

  SUBMODULE 1
    Icon: 📝
    Name: RFQ Registration
    Short: Opportunity / RFQ creation by Marketing with dynamic process levels

    CYCLE
      Icon: 💼
      Actor: Marketing User
      Title: Create the RFQ / Opportunity
      Text: The Marketing user creates the RFQ as an Opportunity in Salesforce and defines the process levels of the product.
    END CYCLE

    CYCLE
      Icon: 🎚️
      Actor: Marketing User
      Title: Define the 6 Default Process Levels
      Text: The Opportunity carries six default Level dropdown fields. Every dropdown offers the same set of manufacturing process options:
      Chips:
        - Injection Moulding
        - Painting
        - Plating
        - Assembly
        - Pad/Screen/Laser Printing
        - Pad/Screen Printing
        - Vacuum Metallizing (PVD)
        - Hot Stamping
        - Film Forming/Trimming
        - Film Printing
        - Aluminium Anodising
        - 3D Flexible Badge
    END CYCLE

    CYCLE
      Icon: ➕
      Actor: Marketing User
      Title: Add Level — Dynamic Expansion
      Text: If the product needs more than six processes, the user clicks the 'Add Level' button and additional level dropdowns are added dynamically.
    END CYCLE

    CYCLE
      Icon: 🔃
      Actor: Marketing User
      Title: Re-Sequence Levels by Drag & Drop
      Text: The user can change the sequence of the levels simply by dragging them — for example, if Level 2 is Painting and Level 3 is Plating, dragging one over the other swaps their positions instantly.
      Chips:
        - Drag & drop re-ordering
        - Example: Level 2 Painting ⇄ Level 3 Plating
        - Sequence saved on the Opportunity
    END CYCLE

    CYCLE
      Icon: 🛤️
      Actor: System
      Title: Workflow Routes by Selected Levels
      Text: The RFQ workflow proceeds based on the selected process levels and their sequence — every downstream screen adapts to the levels chosen here.
    END CYCLE

    CYCLE
      Icon: 🛠️
      Actor: Engineering Team
      Title: Tooling Feasibility
      Text: Engineering cross-verifies tooling feasibility across part assembly components — configuring the process-wise list of tooling (molds, cooling fixtures, checking fixtures, masking jigs) and component material specifications.
      Chips:
        - List of Tooling per Component
        - Tooling Construction & Material Information
        - Cavity, Mold Size & Mold Weight Assessment
      Links:
        - ../salesforce-testing-feasibility-schema.html | Salesforce Schema & ERD — Part Formation Line & Testing Feasibility
        - ../lightning-modules/rfq-configuration/index.html?tab=tooling-feasibility | Open Tooling Feasibility UI | secondary
    END CYCLE

    CYCLE
      Icon: 🖥️
      Actor: Live Screen
      Title: RFQ Registration UI Template
      Text: See the actual Opportunity screen — the record form, dynamic process levels with Add Level, tooling table and costing tabs — exactly as the user will experience it.
      Links:
        - ../lightning-modules/rfq-configuration/index.html | Open RFQ Configuration Template
        - rfq-ui-template.html | Old UI Template | secondary
    END CYCLE

  END SUBMODULE

  SUBMODULE 2
    Icon: 📄
    Name: Product Requirement
    Short: Customer requirement capture, AI-powered summary and auto-update of the Opportunity

    CYCLE
      Icon: 📥
      Actor: Marketing User
      Title: Receive Customer Requirements
      Text: The Marketing user receives the customer's product requirements along with the relevant product documents.
    END CYCLE

    CYCLE
      Icon: 📤
      Actor: Marketing User
      Title: Upload Documents to Salesforce
      Text: The Marketing team user uploads all requirement documents to Salesforce using the document uploader — everything stored against the Opportunity.
    END CYCLE

    CYCLE
      Icon: 🤖
      Actor: AI Agent
      Title: AI Reads the Customer Input
      Text: An AI agent processes the uploaded customer input, extracts the relevant information and builds a summary — which is displayed directly on the Opportunity.
      Chips:
        - Automatic document reading
        - Relevant information extraction
        - AI summary shown on the Opportunity
    END CYCLE

    CYCLE
      Icon: ✍️
      Actor: AI Agent
      Title: Product Information Auto-Captured
      Text: The product information found in the customer input is also captured and updated straight into the Opportunity record — no manual re-typing by the Marketing team.
    END CYCLE

  END SUBMODULE

  SUBMODULE 3
    Icon: 🖥️
    Name: Polyplastics Server Integration
    Short: CAD upload to the Polyplastics Server via API with public link on the Opportunity

    CYCLE
      Icon: 📐
      Actor: Marketing User
      Title: Upload CAD via Salesforce
      Text: The user uploads the CAD file to the Polyplastics Server using Salesforce — the transfer happens through an API integration.
    END CYCLE

    CYCLE
      Icon: 🔗
      Actor: System
      Title: Public Link Generated
      Text: Once the upload completes, a public link to the file is generated and automatically updated on the Opportunity.
      Chips:
        - API-based upload
        - Auto-generated public link
        - Link stored on the Opportunity
    END CYCLE

    CYCLE
      Icon: 🚀
      Actor: Marketing User
      Title: 'Send for Product Feasibility'
      Text: With the CAD uploaded and all required information entered, the user clicks 'Send for Product Feasibility' — a notification goes to the Product Feasibility team and its associated members.
    END CYCLE

  END SUBMODULE

  SUBMODULE 4
    Icon: 🧪
    Name: Product Feasibility
    Short: Engineering cross-verification of customer input and process levels

    CYCLE
      Icon: 🔔
      Actor: Engineering Team
      Title: Notification Received — Review Customer Input
      Text: The Engineering team receives the notification and reviews the customer input in detail against the Opportunity.
    END CYCLE

    CYCLE
      Icon: 🧩
      Actor: System
      Title: Level-Dependent Parameters Appear
      Text: Based on the process levels selected at registration, multiple dependent parameters are displayed — only the fields relevant to those processes.
    END CYCLE

    CYCLE
      Icon: 🔍
      Actor: Engineering Team
      Title: Cross-Verify the Opportunity Levels
      Text: Engineering cross-verifies the levels of the Opportunity against the actual product. If anything is not relevant to the product, they connect with the customer and get the requirement changed.
      Branch NO: Mismatch Found | Engineering connects with the customer, the requirement is corrected, and the Opportunity is updated.
      Branch OK: Everything Relevant | Technical fields are completed per the product specifications — ready to send to the supplier.
    END CYCLE

    CYCLE
      Icon: 📨
      Actor: Engineering Team
      Title: Send Information to Supplier
      Text: With the requirement verified and feasibility data complete, the information is sent onward to the supplier (Sub-Module 3.5).
    END CYCLE

  END SUBMODULE

  SUBMODULE 5
    Icon: 🤝
    Name: Supplier Inputs
    Short: Three-tab supplier screen, dynamic link email and tooling cost submission

    CYCLE
      Icon: 🖥️
      Actor: Engineering Team
      Title: 'Send to Supplier' — 3-Tab Screen Opens
      Text: The Engineering team clicks the 'Send to Supplier' button and a screen opens with three tabs of information for the supplier package.
      Chips:
        - Tab 1 · Product Tooling Information
        - Tab 2 · Product Information
        - Tab 3 · Product Picture
    END CYCLE

    CYCLE
      Icon: 🧾
      Actor: Tab 1
      ActorIcon: 🗂️
      Title: Product Tooling Information
      Text: A tooling table with columns for the List of Tooling name, Quantity and Unit Cost — the Total Cost is auto-calculated as Quantity × Unit Cost. In this tab, the supplier fills only the Unit Cost.
      Chips:
        - Tooling Name
        - Quantity
        - Unit Cost — supplier entry only
        - Total Cost = Qty × Unit Cost (auto)
    END CYCLE

    CYCLE
      Icon: 📋
      Actor: Tab 2
      ActorIcon: 🗂️
      Title: Product Information
      Text: The product information tab is editable by all users except the supplier — the supplier can view it but cannot change anything, including the quantity.
    END CYCLE

    CYCLE
      Icon: 🖼️
      Actor: Tab 3
      ActorIcon: 🗂️
      Title: Product Picture
      Text: The third tab displays the product picture, giving the supplier full visual context of the part.
    END CYCLE

    CYCLE
      Icon: ✉️
      Actor: Engineering Team
      Title: Send — Email with Dynamic Link
      Text: When the Engineering team user sends this information, the supplier receives an email with a dynamic link attached that opens the supplier screen.
    END CYCLE

    CYCLE
      Icon: 💵
      Actor: Supplier
      Title: Supplier Fills Unit Price & Submits
      Text: The supplier opens the link, fills in the Unit Price and submits the tooling cost.
      Branch OK: On Submission | A notification is sent to the Associate Engineering user and Ravi Sir.
    END CYCLE

  END SUBMODULE

  SUBMODULE 6
    Icon: 🛠️
    Name: Tooling Feasibility
    Short: Supplier submission, verification and two-level approval

    CYCLE
      Icon: 📬
      Actor: Engineering Associate
      Title: Supplier Submits — Associate Notified
      Text: When the supplier submits the tooling feasibility, a notification goes first to the Engineering Associate.
    END CYCLE

    CYCLE
      Icon: 🔍
      Actor: Engineering Associate
      Title: Verify & Update Supplier Inputs
      Text: The associate reviews and verifies the supplier's inputs, updates anything that needs changing, and submits for approval to Ravi Sir.
    END CYCLE

    CYCLE
      Icon: 🧐
      Actor: Ravi Sir
      Title: Full Technical & Pricing Review
      Text: Ravi Sir reviews the complete Opportunity — all technical details and pricing — then forwards it to Rakesh Sir for final approval.
      Branch NO: Ravi Sir Rejects | The Engineering Associate receives a notification to make the required changes.
    END CYCLE

    CYCLE
      Icon: 👑
      Actor: Rakesh Sir
      Title: Final Approval Decision
      Text: Rakesh Sir takes the final decision on the Opportunity.
      Branch OK: Approved | A notification and approval are sent to the Costing team for adding the production cost — the journey continues in Sub-Module 3.7 Internal Product Costing & Margins.
      Branch NO: Rejected | Ravi Sir and the Engineering Associate receive a rejection notification.
    END CYCLE

    CYCLE
      Icon: 🖥️
      Actor: Live Screen
      Title: Tooling Feasibility UI
      Text: Experience the actual Tooling Feasibility interface — with the interactive List of Tooling, component quantities, and Tooling Construction specifications.
      Links:
        - ../salesforce-testing-feasibility-schema.html | Salesforce Schema & ERD — Part Formation Line & Testing Feasibility
        - ../lightning-modules/rfq-configuration/index.html?tab=tooling-feasibility | Open Tooling Feasibility UI | secondary
    END CYCLE

  END SUBMODULE

  SUBMODULE 7
    Icon: 🧮
    Name: Internal Product Costing & Margins
    Short: Costing team production cost and KAM margins after final approval

    CYCLE
      Icon: 📨
      Actor: System
      Title: Approval Triggers the Costing Team
      Text: As soon as Rakesh Sir approves the request, an approval and a notification are sent to the Costing team on the Opportunity.
    END CYCLE

    CYCLE
      Icon: 🧾
      Actor: Costing Team
      Title: Review & Fill Production Cost
      Text: The Costing team user reviews the Opportunity and fills in the production cost against it.
    END CYCLE

    CYCLE
      Icon: 🧐
      Actor: Rakesh Sir
      Title: Costing Approval by Rakesh Sir
      Text: Once the Costing team fills the costing, it first goes to Rakesh Sir for approval of the production cost.
      Branch OK: Approved | The Opportunity moves forward to the KAM of the customer.
    END CYCLE

    CYCLE
      Icon: 📤
      Actor: Costing Team
      Title: Send to the Customer's KAM
      Text: After Rakesh Sir's approval, the Opportunity is sent to the KAM of the customer.
    END CYCLE

    CYCLE
      Icon: 💹
      Actor: KAM
      Title: Add Margins — Ready for Quotation
      Text: The KAM adds the margins on top of the production cost and marks the status as Ready for Quotation.
      Chips:
        - Margins added by KAM
        - Status → Ready for Quotation
    END CYCLE

  END SUBMODULE

  SUBMODULE 8
    Icon: 🗎
    Name: PDF Generation
    Short: Versioned Product & Tooling Feasibility PDFs

    CYCLE
      Icon: 📑
      Actor: User
      Title: Generate Two PDF Documents — At Any Stage
      Text: Once Product and Tooling Feasibility are completed, the user can generate the Product Feasibility PDF and the Tooling Feasibility PDF at any stage of the Opportunity.
      Chips:
        - Product Feasibility PDF
        - Tooling Feasibility PDF
        - Available at any stage after feasibility
    END CYCLE

    CYCLE
      Icon: 🗂️
      Actor: System
      Title: Automatic Versioning
      Text: Both PDFs support versioning — if the Opportunity is modified and the PDF is generated again, a new version is created automatically while all previous versions are preserved.
    END CYCLE

  END SUBMODULE

END MODULE


MODULE 4
  Icon: 💰
  Name: Quotation & Approval
  Short: Surface-finish based quote generation, revision control, KAM → CMO approval and customer submission
  Desc: Costing and approval as one connected engine — the quote is generated from the SURFACE FINISH logic in the client's own Excel format, locked with strict revision control, routed through the KAM → CMO conditional approval cycle, and tracked through every customer status until final approval.

  CYCLE
    Icon: 🔓
    Actor: Marketing User
    Group: Part 1 — Costing & Quote Generation
    Title: 'Generate Quote' Unlocked
    Text: Once the Opportunity status is Ready for Quotation (set by the KAM in Sub-Module 3.7), the 'Generate Quote' button becomes visible on the Quotation.
    Chips:
      - Trigger: status = Ready for Quotation
      - 'Generate Quote' button appears
  END CYCLE

  CYCLE
    Icon: ✨
    Actor: System
    Title: SURFACE FINISH Auto-Calculated
    Text: The quote is driven by the SURFACE FINISH field on the Opportunity — calculated automatically from the combination of process levels. The combination logic is provided by the client.
    Chips:
      - Derived from level combination
      - Combination matrix from client
  END CYCLE

  CYCLE
    Icon: 📊
    Actor: System
    Title: Two Excel Formats Generated per Quote
    Text: When the quotation is created, two Excel documents are generated. First, the internal approval format — selected from the template library below based on the SURFACE FINISH value (the combination of process levels). Second, the customer format quotation. When the quote is sent for approval, the CMO receives both formats.
    Chips:
      - Generic_COP
      - Aluminum Anodized Badges
      - Film Decorative Products
      - Glowing Logo
      - 3D Flexible Technology
      - Electroplated Product
      - Painting Product
      - Hot Stamping Cost
    Branch OK: Excel 1 — Internal Approval | Template auto-selected by SURFACE FINISH from the 8 client-provided templates — used for the internal approval cycle.
    Branch OK: Excel 2 — Customer Format | The customer-facing quotation format — the CMO receives it along with the internal format during approval.
  END CYCLE

  CYCLE
    Icon: 🔢
    Actor: System
    Title: Quote Naming & Revisions
    Text: The first quotation is named Quote + V1. Every time the user clicks 'Generate Quote' again, the new quotation is named with the next revision — based on how many revisions are already associated with the Opportunity.
    Chips:
      - First quote → Name + V1
      - Then → Name + R1, R2, R3…
      - Revision counter per Opportunity
  END CYCLE

  CYCLE
    Icon: 🔒
    Actor: Business Rule
    ActorIcon: ⚖️
    Title: Quotation Locked After Creation
    Text: Once a quotation is created, no value on it can be changed — except the Status field. If anything needs to change, the user first changes it on the Opportunity and then generates a new quote (next revision).
  END CYCLE

  CYCLE
    Icon: 📮
    Actor: Executive / Sr. Executive
    Group: Part 2 — Internal Approval Cycle (flow diagram below)
    Title: Path 1 — Send for Approval → KAM
    Text: The Executive or Sr. Executive clicks 'Send for Approval' on the quote. It goes first to the KAM defined on the Customer, with a notification.
    Branch NO: KAM Rejects | The submitter receives a notification with the rejection reason — revises the quote and sends it to the KAM again.
    Branch OK: KAM Approves | The submitter is notified that the KAM approved — and the approval moves to the CMO with a notification.
  END CYCLE

  CYCLE
    Icon: 🚀
    Actor: KAM
    Title: Path 2 — KAM Submits Directly
    Text: If the KAM sends the quote for approval, the notification goes straight to the CMO — no intermediate step.
  END CYCLE

  CYCLE
    Icon: 👔
    Actor: CMO
    Title: CMO — Final Internal Decision
    Text: The CMO takes the final internal decision on the quotation — receiving both Excel formats: the internal approval template and the customer format quotation.
    Branch NO: CMO Rejects | The submitter (Executive / Sr. Executive) and the KAM are notified with the reason. If the Executive corrects the quote → approval goes to KAM, then CMO again. If the KAM corrects and generates a new quote → it goes directly to the CMO.
    Branch OK: CMO Approves | The KAM is notified: the quote is internally approved and can now be sent to the customer.
  END CYCLE

  CYCLE
    Icon: 📧
    Actor: User
    Group: Part 3 — Customer Submission & Status Tracking
    Title: Convert to Customer Format & Send
    Text: The internally approved quote is converted into the customer-specific Excel format attached on the Customer record, then sent by email or through the customer's portal. If the customer has no specific format, the Polyplastics default format is used.
    Chips:
      - Customer-specific Excel format
      - Polyplastics default as fallback
      - Send via email or customer portal
  END CYCLE

  CYCLE
    Icon: 📊
    Actor: User
    Title: Status: In Review → Negotiation
    Text: When the quote is sent, the user marks its status as In Review. If the customer argues on pricing, the status moves to Negotiation.
  END CYCLE

  CYCLE
    Icon: 🤝
    Actor: Customer
    Title: Customer Decision
    Text: The customer's final response closes the loop.
    Branch NO: Rejected on Pricing | The quote status is set to Rejected with the customer's reason. The user corrects the pricing and the quote re-enters the internal approval cycle — the same flow repeats.
    Branch OK: Approved by Customer | The Executive / Sr. Executive marks the quote status as Approved — and a notification is sent to the KAM.
  END CYCLE

  DFD

      <div class="dfd">
        <div class="dfd-node start">🧾 Quotation Generated <small>(V1, then R1 / R2 / R3…)</small></div>
        <div class="dfd-arrow">▼</div>
        <div class="dfd-node decision">Who submits the quote for approval?</div>
        <div class="dfd-branches">
          <div class="dfd-col">
            <div class="dfd-edge">Path 1 · Executive / Sr. Executive</div>
            <div class="dfd-node">👤 KAM Review <small>notification to KAM</small></div>
            <div class="dfd-out no">✖ KAM rejects → submitter notified with reason ↺ revise &amp; resubmit to KAM</div>
            <div class="dfd-out ok">✔ KAM approves → submitter notified → forwarded to CMO</div>
          </div>
          <div class="dfd-col">
            <div class="dfd-edge">Path 2 · KAM submits</div>
            <div class="dfd-node">Straight to CMO <small>notification to CMO</small></div>
          </div>
        </div>
        <div class="dfd-arrow">▼</div>
        <div class="dfd-node">👔 CMO — Final Internal Decision</div>
        <div class="dfd-branches">
          <div class="dfd-col">
            <div class="dfd-out no">✖ CMO rejects → submitter + KAM notified with reason ↺ Executive corrects → KAM → CMO again · If KAM corrects → new quote → directly to CMO</div>
          </div>
          <div class="dfd-col">
            <div class="dfd-out ok">✔ CMO approves → KAM notified — quote internally approved, ready for the customer</div>
          </div>
        </div>
        <div class="dfd-arrow">▼</div>
        <div class="dfd-node">📧 Convert to customer's Excel format (or Polyplastics default) → send via email / customer portal → status <b>In Review</b></div>
        <div class="dfd-arrow">▼</div>
        <div class="dfd-node decision">Customer decision</div>
        <div class="dfd-branches three">
          <div class="dfd-out mid">💬 Price discussion → status <b>Negotiation</b></div>
          <div class="dfd-out no">✖ Rejected on pricing → status <b>Rejected</b> + reason ↺ correct pricing → internal approval cycle repeats</div>
          <div class="dfd-out ok">✔ Customer approves → status <b>Approved</b> by Exec / Sr. Exec → KAM notified</div>
        </div>
      </div>
  END DFD

END MODULE


MODULE 5
  Icon: 📋
  Name: Development Order
  Short: DO creation, internal routing, SAP customer code trigger
  Desc: The moment a quotation is won, the Development Order formalises internal commitment — routing work to every department and triggering the SAP customer code so downstream execution can begin.

  STEP
    Icon: 🏁
    Phase: Create
    Title: DO Creation
    Text: A won quotation converts into a Development Order carrying the NEP number, agreed price, volumes and timeline — the internal contract to execute.
    Features:
      - Auto-creation from won quote
      - NEP-linked DO record
      - Commercial terms snapshot
      - Customer PO reference capture
    Outcome: A single formal trigger that starts development.
  END STEP

  STEP
    Icon: 🔀
    Phase: Route
    Title: Internal Routing
    Text: The DO routes to engineering, tooling, quality, purchase and planning with department-wise tasks and acknowledgements.
    Features:
      - Department-wise task routing
      - Acknowledgement tracking
      - Responsibility matrix
      - Kick-off checklist
    Outcome: Every department knows its scope from day one.
  END STEP

  STEP
    Icon: 🔗
    Phase: Integrate
    Title: SAP Customer Code Trigger
    Text: DO confirmation automatically triggers customer code creation in SAP (if not already present) — no manual master-data requests.
    Features:
      - Auto customer-code request
      - Status tracking of SAP creation
      - Error handling & retry
      - Code write-back to CRM
    Outcome: SAP is execution-ready the moment the DO is confirmed.
    Sap: yes
  END STEP

  STEP
    Icon: 📊
    Phase: Track
    Title: DO Monitoring
    Text: A live dashboard of every open DO — stage, ageing, responsible department and bottlenecks.
    Features:
      - DO status dashboard
      - Ageing & bottleneck alerts
      - Department performance view
      - Handshake into NPD project
    Outcome: Development commitments visible and on schedule.
  END STEP

END MODULE


MODULE 6
  Icon: 🧱
  Name: BOM & LOT Management
  Short: Preliminary/Final BOM, List of Tooling, SAP BOM sync
  Desc: Engineering truth, structured — the Bill of Materials evolves from preliminary to final under version control, the List of Tooling is managed alongside, and the released BOM syncs straight into SAP.

  STEP
    Icon: 🌱
    Phase: Draft
    Title: Preliminary BOM
    Text: An early BOM is drafted from RFQ and feasibility data — enough structure to drive costing and early procurement decisions.
    Features:
      - Multi-level BOM structure
      - Material & grade capture
      - Preliminary weights & usage
      - Linked to CBD costing
    Outcome: Early clarity on product structure and cost drivers.
  END STEP

  STEP
    Icon: 🏆
    Phase: Finalise
    Title: Final BOM
    Text: As design matures, the BOM is frozen with full revision control — every change from preliminary to final is tracked and approved.
    Features:
      - BOM freeze & release workflow
      - Revision comparison view
      - Change history & approvals
      - Effectivity dates
    Outcome: A single approved BOM as the manufacturing reference.
  END STEP

  STEP
    Icon: 🧰
    Phase: Tooling
    Title: List of Tooling (LOT)
    Text: Every tool, die, jig, fixture and gauge needed for the part is catalogued with cost, supplier, and delivery status.
    Features:
      - Tool master with specifications
      - Tool cost & PO tracking
      - Tool trial status
      - Tool life monitoring
    Outcome: Complete tooling visibility from order to first-off approval.
  END STEP

  STEP
    Icon: 📡
    Phase: Integrate
    Title: SAP BOM Sync
    Text: The released BOM pushes to SAP automatically — material masters and BOM structures land in SAP without re-keying.
    Features:
      - Auto BOM push on release
      - Material master mapping
      - Sync validation & error log
      - Revision sync on ECN
    Outcome: SAP production data always mirrors the engineering release.
    Sap: yes
  END STEP

END MODULE


MODULE 7
  Icon: 🚀
  Name: NPD Project Management
  Short: Phase-gate tracking, development purchase, milestone management
  Desc: New Product Development run with discipline — phase-gate governance, milestone tracking and development purchases managed against the project, so launches happen on time.

  STEP
    Icon: 🚪
    Phase: Govern
    Title: Phase-Gate Setup
    Text: The project is structured into phases — kick-off, design, tooling, trials, PPAP, SOP — each with defined gate criteria and deliverables.
    Features:
      - Configurable phase-gate model
      - Gate criteria checklists
      - Deliverable tracking per phase
      - Gate review & sign-off
    Outcome: No phase advances until its gate criteria are truly met.
  END STEP

  STEP
    Icon: 🎯
    Phase: Plan
    Title: Milestone Management
    Text: Key dates — tool order, T0/T1 trials, sample submission, PPAP, SOP — planned, tracked and compared against customer timelines.
    Features:
      - Milestone plan vs actual
      - Customer timeline alignment
      - Delay alerts & recovery plans
      - Gantt-style progress view
    Outcome: Launch dates protected by early visibility of slippage.
  END STEP

  STEP
    Icon: 🛒
    Phase: Procure
    Title: Development Purchase
    Text: Development-stage buying — tools, gauges, trial material — is raised and tracked against the project budget.
    Features:
      - Dev purchase requisitions
      - Budget vs actual tracking
      - Supplier delivery tracking
      - Cost booking to project
    Outcome: Development spend controlled and fully attributable.
  END STEP

  STEP
    Icon: 📈
    Phase: Track
    Title: Project Dashboard
    Text: Portfolio-level view of all NPD projects — health, phase, risks and upcoming gates — for management review meetings.
    Features:
      - Portfolio health dashboard
      - RAG status per project
      - Risk & issue register
      - Management review reports
    Outcome: One screen answers 'where is every project today?'
  END STEP

END MODULE


MODULE 8
  Icon: 📦
  Name: Packaging Module
  Short: Customer and internal packaging, approval, communication tracking
  Desc: Packaging treated as a deliverable, not an afterthought — customer packaging standards and internal packaging designs defined, approved and communicated with a full trail.

  STEP
    Icon: 📐
    Phase: Define
    Title: Customer Packaging Specification
    Text: Customer-mandated packaging — bins, trolleys, quantities per pack, labelling — captured as a controlled specification per part.
    Features:
      - Per-part packaging spec
      - Returnable / one-way definition
      - Labelling & barcode standards
      - Customer standard documents
    Outcome: Customer packaging requirements locked and unambiguous.
  END STEP

  STEP
    Icon: 🎨
    Phase: Design
    Title: Internal Packaging Design
    Text: Internal packaging for in-plant movement and dispatch is designed with quantities, protection method and cost per pack.
    Features:
      - Internal pack design record
      - Packing quantity & cost
      - Protection & handling method
      - Trial pack validation
    Outcome: Optimised packaging cost with protected parts.
  END STEP

  STEP
    Icon: 🖊️
    Phase: Approve
    Title: Packaging Approval
    Text: Both customer and internal packaging pass through formal approval — quality, logistics and the customer sign off before SOP.
    Features:
      - Multi-party approval flow
      - Customer sign-off capture
      - Revision on rejection
      - Approval linked to PPAP
    Outcome: No launch with unapproved packaging.
  END STEP

  STEP
    Icon: 📨
    Phase: Communicate
    Title: Communication Tracking
    Text: Every packaging discussion with the customer — emails, trials, feedback — is logged against the packaging record.
    Features:
      - Communication log per spec
      - Customer feedback tracking
      - Open point follow-up
      - Full packaging history
    Outcome: Complete traceability of every packaging decision.
  END STEP

END MODULE


MODULE 9
  Icon: 🔁
  Name: Change Management (ECN)
  Short: Engineering Change Notice, version/revision tracking
  Desc: Change without chaos — every engineering change flows through a formal ECN with impact assessment, approvals and synchronized version control across BOM, tooling, costing and SAP.

  STEP
    Icon: 📣
    Phase: Initiate
    Title: ECN Initiation
    Text: Any change — customer drawing revision, process improvement, cost reduction — starts as a formal ECN with reason and scope.
    Features:
      - ECN request form
      - Change reason classification
      - Affected part identification
      - Customer / internal origin tag
    Outcome: Every change enters through one controlled front door.
  END STEP

  STEP
    Icon: 🔍
    Phase: Assess
    Title: Impact Assessment
    Text: Cross-functional teams assess impact on BOM, tooling, cost, quality, stock and timelines before anything changes.
    Features:
      - Multi-department impact review
      - Cost impact estimation
      - Stock & WIP disposition
      - Tooling modification needs
    Outcome: Changes approved with eyes open — no downstream surprises.
  END STEP

  STEP
    Icon: 🧾
    Phase: Control
    Title: Version / Revision Tracking
    Text: On approval, part and BOM revisions increment automatically — old versions archived, new versions released with effectivity.
    Features:
      - Auto revision increment
      - Revision history & comparison
      - Document re-release
      - Effectivity date management
    Outcome: One current revision — everywhere, always.
  END STEP

  STEP
    Icon: 🛰️
    Phase: Implement
    Title: ECN Implementation & SAP Update
    Text: Implementation tasks are tracked to closure and the revised BOM/master data syncs to SAP, closing the loop.
    Features:
      - Implementation task tracking
      - SAP revision sync
      - Closure verification
      - ECN cycle-time analytics
    Outcome: Approved changes reach the shop floor and SAP — verified.
    Sap: yes
  END STEP

END MODULE


MODULE 10
  Icon: 🔗
  Name: SAP Integration
  Short: Customer master, BOM, invoice, and order sync with SAP
  Desc: The bridge that completes lead-to-invoice — CRM and SAP exchange customer masters, BOMs, orders and invoices automatically, so commercial and execution worlds stay in lockstep.

  STEP
    Icon: 🏢
    Phase: Master Data
    Title: Customer Master Sync
    Text: Customer creation and changes flow between CRM and SAP — one identity, two systems, zero re-keying.
    Features:
      - Bi-directional customer sync
      - Field-level mapping
      - Change replication
      - Duplicate prevention
    Outcome: A single customer identity across CRM and SAP.
    Sap: yes
  END STEP

  STEP
    Icon: 🧱
    Phase: Engineering
    Title: BOM Sync
    Text: Released and revised BOMs push to SAP with material masters — production always builds to the current engineering release.
    Features:
      - BOM push on release
      - Material master creation
      - Revision-level sync
      - Validation & error queue
    Outcome: Engineering release equals SAP production data.
    Sap: yes
  END STEP

  STEP
    Icon: 📑
    Phase: Commercial
    Title: Order Sync
    Text: Customer orders and development orders reflect in SAP as sales orders — schedules and amendments stay aligned.
    Features:
      - Sales order creation in SAP
      - Schedule line sync
      - Amendment handling
      - Order status write-back
    Outcome: What sales committed is exactly what SAP executes.
    Sap: yes
  END STEP

  STEP
    Icon: 🧾
    Phase: Finance
    Title: Invoice Sync
    Text: SAP invoices flow back to CRM — sales sees billing status, payments and the true commercial closure of every project.
    Features:
      - Invoice data pull from SAP
      - Billing status per order
      - Revenue realisation view
      - Lead-to-invoice traceability
    Outcome: The journey closes: from first enquiry to final invoice — traced end-to-end.
    Sap: yes
  END STEP

END MODULE


`;
