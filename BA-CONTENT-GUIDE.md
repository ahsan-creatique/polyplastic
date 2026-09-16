# Editing the Website Content — Guide for Business Analysts

This website (the Module 1–10 "Lead to Invoice" journey pages) is driven
entirely by **one plain-text file**:

```
js/modules-content.js
```

Everything you see on the site — module names, descriptions, step titles,
step text, feature bullet lists, outcomes, approval branches — comes from
that file. **You do not need to know HTML, CSS or JavaScript to change it.**
Open it in Notepad (or any plain text editor), edit the words, save, and
refresh the website in your browser.

No developer needs to create a new page when you add a module or a
sub-module — the website builds the page automatically from what's in the
file.

---

## 1. The golden rules

1. **Only change the text after a colon (`:`).** Everything to the right of
   a label like `Title:`, `Text:`, `Name:` is yours to edit freely.
2. **Never delete or rename the ALL-CAPS structure words** — `MODULE`,
   `END MODULE`, `STEP`, `END STEP`, `SUBMODULE`, `END SUBMODULE`, `CYCLE`,
   `END CYCLE`. These are how the website finds where one block ends and
   the next begins. If you delete one, the site will stop rendering
   correctly from that point down.
3. **Every block you open, you must close.** Every `STEP` needs a matching
   `END STEP` below it, every `MODULE 7` needs an `END MODULE`, and so on.
   The easiest way to avoid mistakes: **copy an existing block and edit
   the copy**, rather than typing a new one from scratch.
4. **Keep each field on a single line.** Don't press Enter in the middle
   of a `Text:` or `Desc:` sentence — long lines are fine, they'll wrap
   in the editor.
5. **Don't use the `|` (pipe) character** inside any text you write — a
   couple of fields use `|` internally to separate two pieces of
   information on one line (see Links and Branches below).
6. **Save as plain text, UTF-8.** Notepad's default "Save" is fine. Don't
   save it as a `.docx` or "Rich Text" — it must stay a plain `.js` file.
7. **Lines starting with `#` are notes/comments** — the website ignores
   them completely. Use them to leave yourself reminders.

After saving, refresh the website in your browser to see the change.

---

## 2. The building blocks

The file is made of nested blocks. Here's the shape:

```
MODULE <number>              ← a top-level module (e.g. "MODULE 5")
  Icon: ...
  Name: ...
  Short: ...
  Desc: ...

  STEP                       ← a simple journey module has STEP blocks...
    ...
  END STEP

  SUBMODULE <number>         ← ...OR a module has SUBMODULE blocks (like Module 3)...
    ...
    CYCLE                    ← ...and each sub-module has CYCLE blocks
      ...
    END CYCLE
  END SUBMODULE

  CYCLE                      ← ...OR a module has CYCLE blocks directly (like Module 4)
    ...
  END CYCLE

END MODULE
```

A module is normally **one** of: a list of `STEP`s (a simple journey, e.g.
Module 1, 2, 5–10), a list of `SUBMODULE`s (Module 3 today), or a list of
`CYCLE`s directly (Module 4). Don't mix `STEP` and `SUBMODULE`/`CYCLE`
inside the same module.

---

## 3. Field reference

### MODULE fields
| Field | Meaning |
|---|---|
| `Icon:` | One emoji shown as the module's icon |
| `Name:` | The module's title |
| `Short:` | One-line summary shown on the home page card |
| `Desc:` | Longer paragraph shown at the top of the module page |

### STEP fields (used in simple journey modules)
| Field | Meaning |
|---|---|
| `Icon:` | Emoji for this step |
| `Phase:` | Short phase label (e.g. "Capture", "Qualify") |
| `Group:` | *(optional)* A section heading printed above this step — use it on the first step of a new "part" of the journey |
| `Title:` | Step heading |
| `Text:` | The step's description paragraph |
| `Features:` | A bullet list — one `- item` per line underneath |
| `Outcome:` | The "so what" line shown at the bottom of the step card |
| `Sap:` | *(optional)* Write `Sap: yes` if this step touches SAP — shows a "⇄ SAP" tag |

### SUBMODULE fields
| Field | Meaning |
|---|---|
| `Icon:` / `Name:` / `Short:` | Same meaning as the module-level fields |

### CYCLE fields (used inside a SUBMODULE, or directly inside a module like Module 4)
| Field | Meaning |
|---|---|
| `Icon:` | Emoji for this stage |
| `Actor:` | Who performs this stage (e.g. "Marketing User", "Engineering Team") |
| `ActorIcon:` | *(optional)* Override the default 👤 icon next to the actor name |
| `Group:` | *(optional)* Section heading printed above this stage |
| `Title:` | Stage heading |
| `Text:` | The stage's description paragraph |
| `Chips:` | *(optional)* A bullet list of short highlight tags — one `- item` per line |
| `Links:` | *(optional)* One or more buttons — see format below |
| `Branch OK:` | *(optional, repeatable)* A green "success" outcome box — see format below |
| `Branch NO:` | *(optional, repeatable)* A red "rejection" outcome box — see format below |
| `Sap:` | *(optional)* Write `Sap: yes` for a SAP touchpoint |

**Links** — one per line, under a `Links:` header:
```
    Links:
      - rfq-ui-template.html | Old UI Template | secondary
      - https://example.com/screen | Open the Screen
```
Format: `web address | button text` — add `| secondary` at the end to make
it a lighter/ghost button instead of the main solid button.

**Branches** — each is one line, format `label | explanation text`:
```
    Branch OK: Approved | The KAM is notified and the quote moves to the customer.
    Branch NO: Rejected | The submitter is notified with the rejection reason.
```
`Branch OK:` renders with a green ✔, `Branch NO:` renders with a red ✖.
You can have more than one of each on a single cycle stage.

---

## 4. Common edits, step by step

### Change existing wording
Find the block, edit the text after the colon, save, refresh. That's it.

### Add a bullet to a Features/Chips list
Add a new `- Your new bullet text` line under the existing `Features:` or
`Chips:` list, keeping the same indentation as the lines above it.

### Add a new STEP to a module (e.g. add a 6th step to Module 1)
Copy one whole `STEP … END STEP` block, paste it in the right position,
and edit its fields:
```
  STEP
    Icon: 📞
    Phase: Follow-Up
    Title: Post-Enquiry Callback
    Text: A follow-up call is logged within 24 hours of every new enquiry.
    Features:
      - Callback scheduling
      - Outcome capture
    Outcome: No enquiry goes more than a day without a human follow-up.
  END STEP
```

### Add a new SUB-MODULE (e.g. Module 3.9)
Copy a whole `SUBMODULE … END SUBMODULE` block (including its `CYCLE`
blocks inside), paste it after the last sub-module in that module, and
give it the next number:
```
  SUBMODULE 9
    Icon: 📮
    Name: Supplier Confirmation
    Short: Final supplier sign-off before production release

    CYCLE
      Icon: ✅
      Actor: Supplier
      Title: Confirm Final Terms
      Text: The supplier confirms the final agreed cost and lead time.
    END CYCLE
  END SUBMODULE
```
It will automatically appear in the module's sub-module grid, get its own
working page, and get Previous/Next navigation — nothing else to configure.

### Add a whole new MODULE (e.g. Module 11)
Copy an entire `MODULE … END MODULE` block, paste it at the end of the
file (after the last `END MODULE`), and change its number and content:
```
MODULE 11
  Icon: 🛡️
  Name: Warranty Management
  Short: One-line summary for the home page card
  Desc: Longer description shown on the module page.

  STEP
    Icon: 📝
    Phase: Register
    Title: Warranty Claim Logged
    Text: ...
    Features:
      - ...
    Outcome: ...
  END STEP

END MODULE
```
It will automatically appear on the home page journey list, get a working
page at `modules/module.html?m=11`, and link into Previous/Next navigation
with Module 10. **Module numbers must be whole numbers and shouldn't skip
or repeat** — number new modules sequentially after the last one.

---

## 5. One block you should generally leave alone

Module 4 (Quotation & Approval) has one special block called `DFD` — it's
the flow-diagram graphic under the approval cycle. It's written in raw
HTML rather than the simple format above, so it's easy to break by
accident. If you need wording changed inside that diagram, either edit
only the plain text between the `>` and `<` symbols very carefully, or
ask a developer to make that change for you.

---

## 6. If something looks broken after an edit

- The most common cause is a missing `END STEP` / `END CYCLE` /
  `END SUBMODULE` / `END MODULE`, or a block that got copy-pasted with a
  duplicate number (e.g. two `SUBMODULE 3`s).
- Undo your last change (Ctrl+Z in your editor, or restore the previous
  saved version) and try again more incrementally.
- If the project is tracked in Git, ask your developer to run `git diff
  js/modules-content.js` to see exactly what changed — that usually makes
  the mistake obvious immediately.

---

## 7. For developers

`js/content-parser.js` reads `js/modules-content.js` and turns it into the
same `MODULES` array the site used to hard-code in `js/data.js` (now
removed). `main.js` and `module.js` were not changed in how they consume
`MODULES` — only in how they build links (`modules/module.html?m=X&s=Y`
instead of one static file per module/sub-module), so any new module or
sub-module added to the text file gets a working page with zero additional
files. The old per-module filenames (`modules/module-3.html`, etc.) are
kept as redirect stubs to the new URLs so existing bookmarks/links don't
break.
