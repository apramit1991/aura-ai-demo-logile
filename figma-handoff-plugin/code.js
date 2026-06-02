(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

  // figma-handoff-plugin/code.ts
  var PANEL_W = 420;
  var FRAME_GAP = 80;
  var C = {
    white: { r: 1, g: 1, b: 1 },
    chatBody: { r: 0.969, g: 0.973, b: 0.984 },
    // #f7f8fb
    assistBubble: { r: 0.902, g: 0.941, b: 0.984 },
    // #E6F0FB
    userBubble: { r: 0.957, g: 0.961, b: 0.98 },
    // #F4F5FA
    successBg: { r: 0.925, g: 0.992, b: 0.953 },
    // #ecfdf3
    successBdr: { r: 0.722, g: 0.894, b: 0.784 },
    // #b8e4c8
    successTxt: { r: 0.086, g: 0.396, b: 0.204 },
    // #166534
    cardBdr: { r: 0.847, g: 0.863, b: 0.902 },
    // #d8dce6
    hdrBdr: { r: 0.898, g: 0.906, b: 0.922 },
    // #e5e7eb
    compBdr: { r: 0.788, g: 0.796, b: 0.824 },
    // #c9cbd2
    primary: { r: 0.039, g: 0.408, b: 0.859 },
    // #0a68db
    txtDark: { r: 0.067, g: 0.098, b: 0.165 },
    // #111827
    txtBody: { r: 0.2, g: 0.2, b: 0.2 },
    // #333333
    txtMuted: { r: 0.361, g: 0.361, b: 0.361 },
    // #5c5c5c
    txtPlaceholder: { r: 0.533, g: 0.533, b: 0.533 },
    // #888888
    txtSlate: { r: 0.392, g: 0.455, b: 0.545 },
    // #64748B
    typingDot: { r: 0.435, g: 0.478, b: 0.553 },
    // #6f7a8d
    sparkleBg: { r: 0.914, g: 0.961, b: 1 },
    // #e9f5ff
    sparkleIcon: { r: 0.031, g: 0.408, b: 0.859 },
    // #0868db
    emptyCircle: { r: 0.945, g: 0.961, b: 0.976 },
    // #f1f5f9
    gradStart: { r: 0.2, g: 0.78, b: 0.918 },
    // #33C7EA
    gradEnd: { r: 0.165, g: 0.176, b: 0.733 },
    // #2A2DBB
    recCardBg: { r: 0.941, g: 0.945, b: 0.965 },
    // #f0f1f6
    summaryBdr: { r: 0.812, g: 0.827, b: 0.867 },
    // #cfd3dd
    tblHdrBdr: { r: 0.902, g: 0.914, b: 0.941 },
    // #e6e9f0
    rowSep: { r: 0.933, g: 0.941, b: 0.957 },
    // #eef0f4
    annBg: { r: 1, g: 0.95, b: 0.8 },
    // warm yellow
    annBdr: { r: 0.9, g: 0.82, b: 0.5 },
    purple: { r: 0.357, g: 0.165, b: 0.851 },
    // #5b2ad9
    compTopBdr: { r: 0.886, g: 0.898, b: 0.925 }
    // #e2e5ec
  };
  function solid(c, opacity) {
    const p = { type: "SOLID", color: c };
    if (opacity !== void 0) p.opacity = opacity;
    return p;
  }
  var FF = "Inter";
  var HAS_MEDIUM = false;
  var HAS_BOLD = false;
  function fontName(weight) {
    if (weight === "Medium" && !HAS_MEDIUM) return { family: FF, style: "Regular" };
    if (weight === "Bold" && !HAS_BOLD) return { family: FF, style: "Regular" };
    return { family: FF, style: weight };
  }
  async function loadFonts() {
    const families = ["Inter", "Roboto"];
    for (const fam of families) {
      try {
        await figma.loadFontAsync({ family: fam, style: "Regular" });
        FF = fam;
        console.log("Loaded font: " + fam);
        break;
      } catch (e) {
        console.log("Could not load " + fam + " Regular, trying next...");
      }
    }
    try {
      await figma.loadFontAsync({ family: FF, style: "Medium" });
      HAS_MEDIUM = true;
    } catch (e) {
      console.log("No Medium for " + FF);
    }
    try {
      await figma.loadFontAsync({ family: FF, style: "Bold" });
      HAS_BOLD = true;
    } catch (e) {
      console.log("No Bold for " + FF);
    }
    console.log("Font ready: " + FF + " Medium=" + HAS_MEDIUM + " Bold=" + HAS_BOLD);
  }
  function txt(content, size, color, weight = "Regular", width) {
    const t = figma.createText();
    t.fontName = fontName(weight);
    t.characters = content;
    t.fontSize = size;
    t.fills = [solid(color)];
    if (width) {
      t.resize(width, 1);
      t.textAutoResize = "HEIGHT";
    }
    t.lineHeight = { value: size + 6, unit: "PIXELS" };
    return t;
  }
  function rect(w, h, fill) {
    const r = figma.createRectangle();
    r.resize(w, h);
    r.fills = [solid(fill)];
    return r;
  }
  function autoFrame(name, dir, gap, pt, pr, pb, pl) {
    const f = figma.createFrame();
    f.name = name;
    f.layoutMode = dir;
    f.itemSpacing = gap;
    f.paddingTop = pt;
    f.paddingRight = pr;
    f.paddingBottom = pb;
    f.paddingLeft = pl;
    f.fills = [];
    f.primaryAxisSizingMode = "AUTO";
    f.counterAxisSizingMode = "AUTO";
    return f;
  }
  function fixedAutoFrame(name, dir, gap, pt, pr, pb, pl, w) {
    const f = autoFrame(name, dir, gap, pt, pr, pb, pl);
    f.counterAxisSizingMode = "FIXED";
    f.resize(w, 10);
    return f;
  }
  function assistantBubble(text) {
    const b = autoFrame("Assistant Bubble", "VERTICAL", 0, 8, 12, 8, 12);
    b.fills = [solid(C.assistBubble)];
    b.cornerRadius = 8;
    b.appendChild(txt(text, 14, C.txtBody, "Regular", 330));
    return b;
  }
  function userBubble(text) {
    const b = autoFrame("User Bubble", "VERTICAL", 0, 8, 12, 8, 12);
    b.fills = [solid(C.userBubble)];
    b.cornerRadius = 8;
    b.appendChild(txt(text, 14, C.txtDark, "Regular", 300));
    return b;
  }
  function typingIndicator() {
    const c = autoFrame("Typing Indicator", "HORIZONTAL", 4, 10, 12, 10, 12);
    c.fills = [solid(C.assistBubble)];
    c.cornerRadius = 8;
    for (let i = 0; i < 3; i++) {
      const d = figma.createEllipse();
      d.name = "Dot";
      d.resize(6, 6);
      d.fills = [solid(C.typingDot)];
      c.appendChild(d);
    }
    return c;
  }
  function tableRow(day, time, hours, hoursColor = C.primary) {
    const row = fixedAutoFrame("Row " + day, "HORIZONTAL", 0, 2, 0, 2, 0, 356);
    row.primaryAxisAlignItems = "SPACE_BETWEEN";
    row.counterAxisAlignItems = "CENTER";
    const d = txt(day, 14, C.txtBody);
    d.layoutGrow = 1;
    row.appendChild(d);
    row.appendChild(txt(time, 14, C.txtMuted));
    const h = txt(hours, 14, hoursColor, "Regular");
    h.textAlignHorizontal = "RIGHT";
    h.resize(36, h.height);
    row.appendChild(h);
    return row;
  }
  function tableCard(title, rows, sumHrs, sumDays) {
    const card = fixedAutoFrame("Table: " + title, "VERTICAL", 0, 0, 0, 0, 0, 380);
    card.fills = [solid(C.white)];
    card.cornerRadius = 8;
    card.strokes = [solid(C.cardBdr)];
    card.strokeWeight = 1;
    const hdr = fixedAutoFrame("Header", "HORIZONTAL", 0, 8, 12, 8, 12, 380);
    hdr.appendChild(txt(title, 14, C.txtBody, "Bold"));
    card.appendChild(hdr);
    const hSep = rect(380, 1, C.tblHdrBdr);
    hSep.name = "hdr-sep";
    card.appendChild(hSep);
    const body = fixedAutoFrame("Rows", "VERTICAL", 6, 12, 12, 4, 12, 380);
    for (const r of rows) body.appendChild(tableRow(r.day, r.time, r.hours));
    card.appendChild(body);
    const sDv = rect(356, 1, C.cardBdr);
    sDv.name = "sum-div";
    const sumWrap = fixedAutoFrame("SumWrap", "VERTICAL", 0, 0, 12, 0, 12, 380);
    sumWrap.appendChild(sDv);
    card.appendChild(sumWrap);
    const sum = fixedAutoFrame("Summary", "HORIZONTAL", 16, 8, 12, 8, 12, 380);
    sum.appendChild(txt("\u23F1 " + sumHrs, 13, C.txtMuted, "Medium"));
    sum.appendChild(txt("\u{1F4C5} " + sumDays, 13, C.txtMuted, "Medium"));
    card.appendChild(sum);
    return card;
  }
  function statusBubble(text) {
    const b = autoFrame("Status Bubble", "VERTICAL", 0, 10, 12, 10, 12);
    b.fills = [solid(C.successBg)];
    b.cornerRadius = 8;
    b.strokes = [solid(C.successBdr)];
    b.strokeWeight = 1;
    b.appendChild(txt(text, 14, C.successTxt, "Medium", 340));
    return b;
  }
  function confirmCard(showBtns = true) {
    const card = autoFrame("Confirm Card", "VERTICAL", 12, 12, 12, 12, 12);
    card.fills = [solid(C.white)];
    card.cornerRadius = 8;
    card.strokes = [solid(C.cardBdr)];
    card.strokeWeight = 1;
    card.appendChild(txt("Please confirm if you want to submit this availability request to your manager.", 14, C.txtBody, "Regular", 340));
    if (showBtns) {
      const btns = autoFrame("Buttons", "HORIZONTAL", 8, 0, 0, 0, 0);
      const sBtn = autoFrame("Submit Btn", "HORIZONTAL", 0, 6, 16, 6, 16);
      sBtn.fills = [solid(C.primary)];
      sBtn.cornerRadius = 40;
      sBtn.appendChild(txt("Submit", 13, C.white, "Medium"));
      btns.appendChild(sBtn);
      const nBtn = autoFrame("Not Now Btn", "HORIZONTAL", 0, 6, 16, 6, 16);
      nBtn.fills = [solid(C.white)];
      nBtn.cornerRadius = 40;
      nBtn.strokes = [solid(C.cardBdr)];
      nBtn.strokeWeight = 1;
      nBtn.appendChild(txt("Not now", 13, C.txtBody, "Medium"));
      btns.appendChild(nBtn);
      card.appendChild(btns);
    }
    return card;
  }
  function panelHeader(title) {
    const h = fixedAutoFrame("Header", "HORIZONTAL", 0, 0, 20, 0, 20, PANEL_W);
    h.resize(PANEL_W, 60);
    h.primaryAxisSizingMode = "FIXED";
    h.fills = [solid(C.white)];
    h.primaryAxisAlignItems = "SPACE_BETWEEN";
    h.counterAxisAlignItems = "CENTER";
    const left = autoFrame("Left", "HORIZONTAL", 8, 0, 0, 0, 0);
    left.counterAxisAlignItems = "CENTER";
    left.appendChild(txt("\u2039", 18, C.txtMuted));
    if (title === "Your Chats") {
      left.appendChild(txt("Your Chats", 16, C.txtDark, "Bold"));
    } else {
      const ic = autoFrame("AuraIcon", "HORIZONTAL", 0, 4, 4, 4, 4);
      ic.fills = [solid(C.sparkleBg)];
      ic.cornerRadius = 12;
      ic.resize(24, 24);
      ic.primaryAxisSizingMode = "FIXED";
      ic.counterAxisSizingMode = "FIXED";
      ic.counterAxisAlignItems = "CENTER";
      ic.primaryAxisAlignItems = "CENTER";
      ic.appendChild(txt("\u2726", 12, C.sparkleIcon));
      left.appendChild(ic);
      left.appendChild(txt("AURA", 16, C.txtDark, "Bold"));
    }
    h.appendChild(left);
    const right = autoFrame("Controls", "HORIZONTAL", 10, 0, 0, 0, 0);
    right.counterAxisAlignItems = "CENTER";
    if (title !== "Your Chats") {
      right.appendChild(txt("+", 16, C.txtMuted));
      right.appendChild(txt("\u2922", 16, C.txtMuted));
    }
    right.appendChild(txt("\u2715", 14, C.txtMuted));
    h.appendChild(right);
    const bdr = rect(PANEL_W, 1, C.hdrBdr);
    bdr.name = "hdr-border";
    bdr.layoutPositioning = "ABSOLUTE";
    bdr.x = 0;
    bdr.y = 59;
    h.appendChild(bdr);
    return h;
  }
  function composer() {
    const outer = fixedAutoFrame("Composer", "VERTICAL", 0, 0, 16, 16, 16, PANEL_W);
    outer.fills = [solid(C.white)];
    const topB = rect(PANEL_W, 1, C.compTopBdr);
    topB.name = "comp-top-border";
    topB.layoutPositioning = "ABSOLUTE";
    topB.x = 0;
    topB.y = 0;
    outer.appendChild(topB);
    const form = fixedAutoFrame("Form", "HORIZONTAL", 8, 8, 12, 8, 12, 388);
    form.cornerRadius = 40;
    form.strokes = [solid(C.compBdr)];
    form.strokeWeight = 1;
    form.fills = [solid(C.white)];
    form.resize(388, 56);
    form.primaryAxisSizingMode = "FIXED";
    form.counterAxisAlignItems = "CENTER";
    form.appendChild(txt("\u{1F4CE}", 16, C.txtMuted));
    const ph = txt("Ask AURA", 16, C.txtPlaceholder);
    ph.layoutGrow = 1;
    form.appendChild(ph);
    const sendCirc = figma.createEllipse();
    sendCirc.name = "Send";
    sendCirc.resize(42, 42);
    sendCirc.fills = [solid(C.primary, 0.4)];
    form.appendChild(sendCirc);
    outer.appendChild(form);
    return outer;
  }
  function panel(title, body, showComposer = true) {
    const p = fixedAutoFrame("Panel", "VERTICAL", 0, 0, 0, 0, 0, PANEL_W);
    p.fills = [solid(C.white)];
    p.cornerRadius = 12;
    p.strokes = [solid(C.cardBdr)];
    p.strokeWeight = 1;
    p.effects = [{
      type: "DROP_SHADOW",
      visible: true,
      blendMode: "NORMAL",
      color: { r: 0.059, g: 0.09, b: 0.165, a: 0.22 },
      offset: { x: 0, y: 16 },
      radius: 60,
      spread: 0
    }];
    p.appendChild(panelHeader(title));
    p.appendChild(body);
    if (showComposer) p.appendChild(composer());
    return p;
  }
  function chatBody(msgs) {
    const b = fixedAutoFrame("ChatBody", "VERTICAL", 12, 20, 20, 20, 20, PANEL_W);
    b.fills = [solid(C.chatBody)];
    for (const m of msgs) {
      const wrapper = fixedAutoFrame(m.role === "user" ? "UserMsg" : "AssistMsg", "HORIZONTAL", 0, 0, 0, 0, 0, PANEL_W - 40);
      wrapper.primaryAxisAlignItems = m.role === "user" ? "MAX" : "MIN";
      wrapper.appendChild(m.node);
      b.appendChild(wrapper);
    }
    return b;
  }
  function convFrame(name, msgs) {
    const body = chatBody(msgs);
    const p = panel("AURA", body, true);
    p.name = name;
    return p;
  }
  function historyRow(title, preview, date) {
    const row = fixedAutoFrame("Chat: " + title, "HORIZONTAL", 12, 12, 16, 12, 16, 388);
    row.counterAxisAlignItems = "MIN";
    const ic = autoFrame("Icon", "HORIZONTAL", 0, 8, 8, 8, 8);
    ic.fills = [solid(C.sparkleBg)];
    ic.cornerRadius = 18;
    ic.resize(36, 36);
    ic.primaryAxisSizingMode = "FIXED";
    ic.counterAxisSizingMode = "FIXED";
    ic.counterAxisAlignItems = "CENTER";
    ic.primaryAxisAlignItems = "CENTER";
    ic.appendChild(txt("\u2726", 14, C.sparkleIcon));
    row.appendChild(ic);
    const col = autoFrame("Text", "VERTICAL", 2, 0, 0, 0, 0);
    col.layoutGrow = 1;
    col.appendChild(txt(title, 14, C.txtDark, "Bold"));
    col.appendChild(txt(preview, 13, C.txtSlate, "Regular", 220));
    row.appendChild(col);
    row.appendChild(txt(date, 12, C.txtSlate, "Medium"));
    return row;
  }
  function historyDefault() {
    const body = fixedAutoFrame("HistoryBody", "VERTICAL", 12, 12, 16, 12, 16, PANEL_W);
    body.fills = [solid(C.chatBody)];
    const search = fixedAutoFrame("Search", "HORIZONTAL", 0, 8, 12, 8, 36, 388);
    search.fills = [solid(C.white)];
    search.cornerRadius = 6;
    search.strokes = [solid(C.compBdr)];
    search.strokeWeight = 1;
    search.resize(388, 36);
    search.primaryAxisSizingMode = "FIXED";
    search.counterAxisAlignItems = "CENTER";
    const sIcon = txt("\u{1F50D}", 14, C.txtMuted);
    sIcon.layoutPositioning = "ABSOLUTE";
    sIcon.x = 10;
    sIcon.y = 8;
    search.appendChild(sIcon);
    search.appendChild(txt("Search chats", 15, C.txtPlaceholder));
    body.appendChild(search);
    const items = [
      { title: "Availability Request", preview: "Request sent to manager.", date: "Today" },
      { title: "Skill Gap Ask Aura", preview: "Availability requests sent for Sarah Johnson and Emily Carter.", date: "3 days ago" },
      { title: "Cross-training Request", preview: "Cross-training requests prepared.", date: "4 days ago" },
      { title: "Availability Approval", preview: "Requests approved successfully.", date: "1 week ago" }
    ];
    const list = fixedAutoFrame("List", "VERTICAL", 0, 0, 0, 0, 0, 388);
    list.fills = [solid(C.white)];
    list.cornerRadius = 8;
    list.strokes = [solid(C.hdrBdr)];
    list.strokeWeight = 1;
    for (let i = 0; i < items.length; i++) {
      list.appendChild(historyRow(items[i].title, items[i].preview, items[i].date));
      if (i < items.length - 1) {
        const sep = rect(388, 1, C.rowSep);
        sep.name = "sep";
        sep.layoutAlign = "STRETCH";
        list.appendChild(sep);
      }
    }
    body.appendChild(list);
    return body;
  }
  function historyEmpty() {
    const body = fixedAutoFrame("HistoryEmpty", "VERTICAL", 12, 12, 16, 12, 16, PANEL_W);
    body.fills = [solid(C.chatBody)];
    const search = fixedAutoFrame("Search", "HORIZONTAL", 0, 8, 12, 8, 36, 388);
    search.fills = [solid(C.white)];
    search.cornerRadius = 6;
    search.strokes = [solid(C.compBdr)];
    search.strokeWeight = 1;
    search.resize(388, 36);
    search.primaryAxisSizingMode = "FIXED";
    search.counterAxisAlignItems = "CENTER";
    const sIcon = txt("\u{1F50D}", 14, C.txtMuted);
    sIcon.layoutPositioning = "ABSOLUTE";
    sIcon.x = 10;
    sIcon.y = 8;
    search.appendChild(sIcon);
    search.appendChild(txt("xyz meeting", 15, C.txtBody));
    const clr = txt("\u2715", 13, C.txtMuted);
    search.appendChild(clr);
    body.appendChild(search);
    const empty = fixedAutoFrame("EmptyState", "VERTICAL", 12, 32, 24, 32, 24, 388);
    empty.fills = [solid(C.white)];
    empty.cornerRadius = 8;
    empty.strokes = [solid(C.hdrBdr)];
    empty.strokeWeight = 1;
    empty.counterAxisAlignItems = "CENTER";
    const eic = autoFrame("EIcon", "HORIZONTAL", 0, 10, 10, 10, 10);
    eic.fills = [solid(C.emptyCircle)];
    eic.cornerRadius = 20;
    eic.resize(40, 40);
    eic.primaryAxisSizingMode = "FIXED";
    eic.counterAxisSizingMode = "FIXED";
    eic.counterAxisAlignItems = "CENTER";
    eic.primaryAxisAlignItems = "CENTER";
    eic.appendChild(txt("\u{1F50D}", 15, C.txtSlate));
    empty.appendChild(eic);
    const et = txt("No chats found", 14, C.txtDark, "Bold");
    et.textAlignHorizontal = "CENTER";
    empty.appendChild(et);
    const ed = txt("Try searching by request type, employee name, or status.", 13, C.txtSlate, "Regular", 260);
    ed.textAlignHorizontal = "CENTER";
    empty.appendChild(ed);
    body.appendChild(empty);
    return body;
  }
  function launcherBtn() {
    const l = autoFrame("AURA Launcher", "HORIZONTAL", 8, 12, 20, 12, 20);
    l.cornerRadius = 24;
    l.counterAxisAlignItems = "CENTER";
    l.fills = [{
      type: "GRADIENT_LINEAR",
      gradientTransform: [[1, 0, 0], [0, 1, 0]],
      gradientStops: [
        { position: 0, color: __spreadProps(__spreadValues({}, C.gradStart), { a: 1 }) },
        { position: 1, color: __spreadProps(__spreadValues({}, C.gradEnd), { a: 1 }) }
      ]
    }];
    l.effects = [
      { type: "DROP_SHADOW", visible: true, blendMode: "NORMAL", color: { r: 0.165, g: 0.176, b: 0.733, a: 0.35 }, offset: { x: 0, y: 12 }, radius: 28, spread: 0 },
      { type: "DROP_SHADOW", visible: true, blendMode: "NORMAL", color: { r: 0.2, g: 0.78, b: 0.918, a: 0.28 }, offset: { x: 0, y: 0 }, radius: 24, spread: 0 }
    ];
    l.appendChild(txt("\u2726", 14, C.white));
    l.appendChild(txt("AURA AI", 15, C.white, "Bold"));
    l.appendChild(txt("\u25B2", 10, C.white));
    return l;
  }
  function launcherTooltip() {
    const t = fixedAutoFrame("Tooltip", "VERTICAL", 4, 12, 16, 12, 16, 286);
    t.fills = [solid(C.white)];
    t.cornerRadius = 8;
    t.strokes = [solid(C.cardBdr)];
    t.strokeWeight = 1;
    t.effects = [{ type: "DROP_SHADOW", visible: true, blendMode: "NORMAL", color: { r: 0, g: 0, b: 0, a: 0.15 }, offset: { x: 0, y: 8 }, radius: 24, spread: 0 }];
    t.appendChild(txt("AURA AI", 13, C.purple, "Bold"));
    t.appendChild(txt("Suggest schedules, check rules, explain gaps, and guide next steps.", 15, C.txtDark, "Bold", 254));
    return t;
  }
  function ann(label, value) {
    const a = autoFrame("Ann", "HORIZONTAL", 4, 3, 8, 3, 8);
    a.fills = [solid(C.annBg)];
    a.cornerRadius = 4;
    a.strokes = [solid(C.annBdr)];
    a.strokeWeight = 1;
    a.appendChild(txt(label, 10, C.txtMuted, "Medium"));
    a.appendChild(txt(value, 10, C.txtBody, "Bold"));
    return a;
  }
  function annBlock(items) {
    const b = autoFrame("Annotations", "VERTICAL", 4, 0, 0, 0, 0);
    for (const [l, v] of items) b.appendChild(ann(l, v));
    return b;
  }
  var curRows = [
    { day: "Monday", time: "10:00a - 8:00p", hours: "10h" },
    { day: "Wednesday", time: "10:00a - 8:00p", hours: "10h" },
    { day: "Thursday", time: "9:00a - 5:00p", hours: "8h" },
    { day: "Friday", time: "10:00a - 8:00p", hours: "10h" },
    { day: "Saturday", time: "10:00a - 8:00p", hours: "10h" }
  ];
  var finRows = [
    { day: "Sunday", time: "9:00a - 2:00p", hours: "5h" },
    { day: "Monday", time: "10:00a - 8:00p", hours: "10h" },
    { day: "Wednesday", time: "10:00a - 8:00p", hours: "10h" },
    { day: "Thursday", time: "3:00p - 8:00p", hours: "5h" },
    { day: "Friday", time: "10:00a - 8:00p", hours: "10h" },
    { day: "Saturday", time: "10:00a - 8:00p", hours: "10h" }
  ];
  async function main() {
    console.log("AURA Handoff: Starting...");
    await loadFonts();
    console.log("AURA Handoff: Fonts loaded, generating frames...");
    const page = figma.currentPage;
    page.name = "AURA Chat Panel";
    let x = 0;
    const secLabel1 = txt("CONVERSATION STATES", 24, C.txtBody, "Bold");
    secLabel1.x = 0;
    secLabel1.y = -60;
    page.appendChild(secLabel1);
    console.log("Frame 01...");
    const f01 = convFrame("01 \u2014 Greeting", [
      { role: "assistant", node: assistantBubble("Hello Jennings, How are you ! What can I do for you ?") }
    ]);
    f01.x = x;
    f01.y = 0;
    page.appendChild(f01);
    x += PANEL_W + FRAME_GAP;
    console.log("Frame 02...");
    const f02 = convFrame("02 \u2014 User Request + Suggest", [
      { role: "assistant", node: assistantBubble("Hello Jennings, How are you ! What can I do for you ?") },
      { role: "user", node: userBubble("Hey, I wanted to see if something can be done as I am not available on Tuesday and Thursday.") },
      { role: "assistant", node: assistantBubble("Sure. Do you want me to update your availability and suggest an option that could still work within the rules?") }
    ]);
    f02.x = x;
    f02.y = 0;
    page.appendChild(f02);
    x += PANEL_W + FRAME_GAP;
    console.log("Frame 03...");
    const f03 = convFrame("03 \u2014 Duration Question", [
      { role: "assistant", node: assistantBubble("Hello Jennings, How are you ! What can I do for you ?") },
      { role: "user", node: userBubble("Hey, I wanted to see if something can be done as I am not available on Tuesday and Thursday.") },
      { role: "assistant", node: assistantBubble("Sure. Do you want me to update your availability and suggest an option that could still work within the rules?") },
      { role: "user", node: userBubble("Yes") },
      { role: "assistant", node: assistantBubble("What duration will you be unavailable for? Will it be the full day or only part of the day?") }
    ]);
    f03.x = x;
    f03.y = 0;
    page.appendChild(f03);
    x += PANEL_W + FRAME_GAP;
    console.log("Frame 04...");
    const f04 = convFrame("04 \u2014 Current Availability Table", [
      { role: "assistant", node: assistantBubble("Sure. Do you want me to update your availability and suggest an option that could still work within the rules?") },
      { role: "user", node: userBubble("Yes") },
      { role: "assistant", node: assistantBubble("What duration will you be unavailable for? Will it be the full day or only part of the day?") },
      { role: "user", node: userBubble("Tuesday will be the whole day, and on Thursday I won't be available for 6 hours.") },
      { role: "assistant", node: assistantBubble("Great, sounds like you've got plans. Here is your current availability.") },
      { role: "assistant", node: tableCard("Current Availability (48h)", curRows, "48 hrs total", "5 days/week") }
    ]);
    f04.x = x;
    f04.y = 0;
    page.appendChild(f04);
    x += PANEL_W + FRAME_GAP;
    console.log("Frame 05...");
    const f05 = convFrame("05 \u2014 Coverage Warning + Recommendation", [
      { role: "assistant", node: assistantBubble("Great, sounds like you've got plans. Here is your current availability.") },
      { role: "assistant", node: tableCard("Current Availability (48h)", curRows, "48 hrs total", "5 days/week") },
      { role: "user", node: userBubble("Okay, yes I am aware. Tell me how this changes as per what I said.") },
      { role: "assistant", node: assistantBubble("You might not meet the full requirement for this week. This change may create a gap in coverage during this time period.") },
      { role: "assistant", node: assistantBubble("If you can work Sunday 9:00a\u20132:00p, your request has a 95% chance of approval. Without this adjustment, the chance of manager approval may reduce to 30%.") }
    ]);
    f05.x = x;
    f05.y = 0;
    page.appendChild(f05);
    x += PANEL_W + FRAME_GAP;
    console.log("Frame 06...");
    const f06 = convFrame("06 \u2014 Final Availability Matrix", [
      { role: "user", node: userBubble("Okay, let's go with the first option. I will work something out.") },
      { role: "assistant", node: assistantBubble("Sure, that looks good. Here is your final availability matrix for this week.") },
      { role: "assistant", node: tableCard("Final Availability Matrix", finRows, "50 hrs total", "6 days/week") }
    ]);
    f06.x = x;
    f06.y = 0;
    page.appendChild(f06);
    x += PANEL_W + FRAME_GAP;
    console.log("Frame 07...");
    const cf7 = confirmCard(true);
    const f07 = convFrame("07 \u2014 Submit Confirmation", [
      { role: "user", node: userBubble("Yup, this looks good. Send it to my manager.") },
      { role: "assistant", node: cf7 }
    ]);
    f07.x = x;
    f07.y = 0;
    page.appendChild(f07);
    x += PANEL_W + FRAME_GAP;
    console.log("Frame 08...");
    const f08 = convFrame("08 \u2014 Success", [
      { role: "user", node: userBubble("Submit") },
      { role: "assistant", node: statusBubble("Done \u2014 sent to your manager.\n\nYour request ID is 437862374.") }
    ]);
    f08.x = x;
    f08.y = 0;
    page.appendChild(f08);
    x += PANEL_W + FRAME_GAP + 60;
    console.log("History frames...");
    const secLabel2 = txt("CHAT HISTORY STATES", 24, C.txtBody, "Bold");
    secLabel2.x = x;
    secLabel2.y = -60;
    page.appendChild(secLabel2);
    const f09 = panel("Your Chats", historyDefault(), false);
    f09.name = "09 \u2014 Chat History \u2014 Default";
    f09.x = x;
    f09.y = 0;
    page.appendChild(f09);
    x += PANEL_W + FRAME_GAP;
    const f10 = panel("Your Chats", historyEmpty(), false);
    f10.name = "10 \u2014 Chat History \u2014 No Results";
    f10.x = x;
    f10.y = 0;
    page.appendChild(f10);
    x += PANEL_W + FRAME_GAP + 100;
    console.log("Component reference...");
    const secLabel3 = txt("COMPONENT REFERENCE", 24, C.txtBody, "Bold");
    secLabel3.x = x;
    secLabel3.y = -60;
    page.appendChild(secLabel3);
    const compData = [
      {
        label: "Assistant Bubble",
        builder: () => assistantBubble("Hello Jennings, How are you ! What can I do for you ?"),
        anns: [["bg", "#E6F0FB"], ["text", "#333333 \xB7 14px"], ["radius", "8px"], ["padding", "8px 12px"]]
      },
      {
        label: "User Bubble",
        builder: () => userBubble("Yes, apply"),
        anns: [["bg", "#F4F5FA"], ["text", "#111827 \xB7 14px"], ["radius", "8px"], ["align", "right (ml-auto)"]]
      },
      {
        label: "Typing Indicator",
        builder: typingIndicator,
        anns: [["bg", "#E6F0FB"], ["dots", "#6f7a8d \xB7 6px"], ["animation", "aura-typing-pulse 3s"], ["gap", "4px"]]
      },
      {
        label: "Table Card",
        builder: () => tableCard("Current Availability (48h)", curRows, "48 hrs total", "5 days/week"),
        anns: [["bg", "#FFFFFF"], ["border", "#d8dce6 \xB7 1px"], ["radius", "8px"], ["hours", "#0a68db (primary)"], ["summary", "#5c5c5c \xB7 13px Medium"]]
      },
      {
        label: "Status Bubble (Success)",
        builder: () => statusBubble("Done \u2014 sent to your manager.\n\nYour request ID is 437862374."),
        anns: [["bg", "#ecfdf3"], ["border", "#b8e4c8 \xB7 1px"], ["text", "#166534 \xB7 14px Medium"], ["radius", "8px"]]
      },
      {
        label: "Confirmation Card",
        builder: () => confirmCard(true),
        anns: [["bg", "#FFFFFF"], ["border", "#d8dce6 \xB7 1px"], ["Submit btn", "#0a68db radius 40px"], ["Not now btn", "#FFF border #d8dce6"], ["btn text", "13px Medium"]]
      },
      {
        label: "History Row",
        builder: () => historyRow("Availability Request", "Request sent to manager.", "Today"),
        anns: [["icon bg", "#e9f5ff \xB7 36px circle"], ["icon", "#0868db sparkle"], ["title", "#111827 \xB7 14px Bold"], ["preview", "#64748B \xB7 13px"], ["date", "#64748B \xB7 12px Medium"]]
      },
      { label: "Search Empty State", builder: () => {
        const e = autoFrame("EmptyComp", "VERTICAL", 12, 32, 24, 32, 24);
        e.fills = [solid(C.white)];
        e.cornerRadius = 8;
        e.strokes = [solid(C.hdrBdr)];
        e.strokeWeight = 1;
        e.counterAxisAlignItems = "CENTER";
        e.resize(380, 180);
        e.counterAxisSizingMode = "FIXED";
        e.primaryAxisSizingMode = "FIXED";
        const eic = autoFrame("EI", "HORIZONTAL", 0, 10, 10, 10, 10);
        eic.fills = [solid(C.emptyCircle)];
        eic.cornerRadius = 20;
        eic.resize(40, 40);
        eic.primaryAxisSizingMode = "FIXED";
        eic.counterAxisSizingMode = "FIXED";
        eic.counterAxisAlignItems = "CENTER";
        eic.primaryAxisAlignItems = "CENTER";
        eic.appendChild(txt("\u{1F50D}", 15, C.txtSlate));
        e.appendChild(eic);
        const et = txt("No chats found", 14, C.txtDark, "Bold");
        et.textAlignHorizontal = "CENTER";
        e.appendChild(et);
        const ed = txt("Try searching by request type, employee name, or status.", 13, C.txtSlate, "Regular", 260);
        ed.textAlignHorizontal = "CENTER";
        e.appendChild(ed);
        return e;
      }, anns: [["icon bg", "#f1f5f9 \xB7 40px"], ["title", "#111827 \xB7 14px Bold"], ["desc", "#64748B \xB7 13px"], ["min height", "180px"]] },
      {
        label: "AURA Launcher Button",
        builder: launcherBtn,
        anns: [["gradient", "#33C7EA \u2192 #2A2DBB"], ["radius", "24px (pill)"], ["shadow", "0 12px 28px rgba(42,45,187,0.35)"], ["text", "#FFF \xB7 15px Bold"], ["height", "48px"]]
      },
      {
        label: "Launcher Tooltip",
        builder: launcherTooltip,
        anns: [["bg", "#FFFFFF"], ["border", "#d8dce6"], ["radius", "8px"], ["AURA AI", "#5b2ad9 \xB7 13px Bold"], ["message", "#1f2937 \xB7 15px Bold"], ["width", "286px"]]
      }
    ];
    let cy = 0;
    for (const comp of compData) {
      const lbl = txt(comp.label, 14, C.txtMuted, "Bold");
      lbl.x = x;
      lbl.y = cy;
      page.appendChild(lbl);
      cy += 24;
      const node = comp.builder();
      node.x = x;
      node.y = cy;
      page.appendChild(node);
      const anns = annBlock(comp.anns);
      anns.x = x + 420;
      anns.y = cy;
      page.appendChild(anns);
      cy += Math.max(node.height, 50) + 32;
    }
    console.log("Token sheet...");
    const tokenY = Math.max(800, cy + 60);
    const tokenTitle = txt("DESIGN TOKEN REFERENCE", 24, C.txtBody, "Bold");
    tokenTitle.x = 0;
    tokenTitle.y = tokenY;
    page.appendChild(tokenTitle);
    const tokens = [
      "Panel max-width: clamp(360px, 28vw, 420px)",
      "Header height: 60px  |  Header bg: #FFFFFF  |  border: #e5e7eb",
      "Chat body bg: #f7f8fb  |  padding: 20px",
      "Assistant bubble: bg #E6F0FB  |  text #333333  |  14px  |  radius 8px",
      "User bubble: bg #F4F5FA  |  text #111827  |  14px  |  radius 8px  |  right-aligned",
      "Success bubble: bg #ecfdf3  |  border #b8e4c8  |  text #166534  |  14px Medium",
      "Confirm card: bg #FFFFFF  |  border #d8dce6  |  radius 8px",
      "Submit button: bg #0a68db  |  text white  |  13px Medium  |  radius 40px",
      "Not now button: bg #FFFFFF  |  border #d8dce6  |  text #333333  |  radius 40px",
      "Table card: bg #FFFFFF  |  border #d8dce6  |  header border #e6e9f0  |  radius 8px",
      "Table hours color: #0a68db (primary)  |  summary: #5c5c5c 13px Medium",
      "Composer: bg #FFFFFF  |  border #c9cbd2  |  radius 40px  |  placeholder #888888",
      "Primary: #0a68db  |  Hover: #0858b9",
      "Launcher gradient: #33C7EA \u2192 #2A2DBB",
      "Font family: Roboto (fallback: Inter)",
      "Typing dots: #6f7a8d  |  6px  |  gap 4px  |  aura-typing-pulse 3s"
    ];
    let ty = tokenY + 40;
    for (const tok of tokens) {
      const t = txt(tok, 13, C.txtBody, "Regular", 700);
      t.x = 0;
      t.y = ty;
      page.appendChild(t);
      ty += 24;
    }
    figma.viewport.scrollAndZoomIntoView(page.children);
    figma.notify("\u2705 AURA Dev Handoff complete \u2014 10 frames + 10 components + tokens");
    console.log("AURA Handoff: DONE!");
  }
  main().then(() => figma.closePlugin()).catch((err) => {
    console.error("AURA Handoff ERROR:", err);
    figma.notify("\u274C Error: " + String(err), { error: true });
    figma.closePlugin();
  });
})();
