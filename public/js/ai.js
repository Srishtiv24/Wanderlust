let chatHistory = [];
let isThinking = false;

// ─────────────────────────────────────────────
// Typewriter — calls onDone callback when done
// ─────────────────────────────────────────────
function typeWriterEffect(element, text, speed = 16, onDone) {
  let i = 0;
  const msgs = document.getElementById("aiMessages");
  function type() {
    if (i <= text.length) {
      element.innerHTML = formatMarkdown(text.slice(0, i));
      i++;
      msgs.scrollTop = msgs.scrollHeight;
      setTimeout(type, speed);
    } else {
      if (typeof onDone === "function") onDone();
    }
  }
  type();
}

// ─────────────────────────────────────────────
// Export bot reply as a formatted PDF
// ─────────────────────────────────────────────
function exportItinerary(rawText) {
  const formatted = formatMarkdownForPrint(rawText);
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  const destination = (window.autoDestination || "Your Destination")
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>${escapeHtml(destination)} Itinerary · Wanderlust</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', sans-serif;
      background: #fff;
      color: #1a1a1a;
    }

    /* ── COVER ── */
    .cover {
      min-height: 100vh;
      background: linear-gradient(135deg, #e8392a 95%, #ff6b5b 5%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: 5rem 4.5rem;
      position: relative;
      overflow: hidden;
      page-break-after: always;
    }

    .cover::after {
      content: '✦';
      position: absolute;
      bottom: 3rem; right: 4rem;
      font-size: 14rem;
      color: rgba(255,255,255,0.08);
      line-height: 1;
    }

    .cover-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.3);
      color: #fff;
      font-size: 0.6rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      padding: 0.45rem 1.1rem;
      border-radius: 50px;
      margin-bottom: 2.5rem;
    }

    .cover-for {
      font-size: 0.9rem;
      font-weight: 500;
      color: rgba(255,255,255,0.75);
      letter-spacing: 0.04em;
      margin-bottom: 0.5rem;
    }

    .cover-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(3.5rem, 9vw, 5.5rem);
      font-weight: 900;
      color: #fff;
      line-height: 1.05;
      letter-spacing: -0.02em;
      margin-bottom: 0.6rem;
    }

    .cover-tagline {
      font-family: 'Playfair Display', serif;
      font-size: 1.1rem;
      font-weight: 700;
      color: rgba(255,255,255,0.7);
      margin-bottom: 2.5rem;
    }

    .cover-divider {
      width: 60px;
      height: 3px;
      background: rgba(255,255,255,0.5);
      border-radius: 2px;
      margin-bottom: 2rem;
    }

    .cover-meta {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }

    .cover-meta-item {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      font-size: 0.8rem;
      color: rgba(255,255,255,0.7);
    }

    .cover-meta-item .dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #fff;
      flex-shrink: 0;
    }

    .cover-bottom {
      position: absolute;
      bottom: 3rem; left: 4.5rem;
      font-family: 'Playfair Display', serif;
      font-size: 0.85rem;
      font-weight: 700;
      color: rgba(255,255,255,0.25);
      letter-spacing: 0.2em;
      text-transform: uppercase;
    }

    /* ── CONTENT ── */
    .content {
      padding: 3.5rem 4.5rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .content h3 {
      font-family: 'Playfair Display', serif;
      font-size: 1.2rem;
      font-weight: 700;
      color: #1a1a1a;
      margin: 2.5rem 0 0.8rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .content h3::before {
      content: '';
      display: block;
      width: 4px;
      height: 1.1em;
      background: linear-gradient(180deg, #e8392a, #ff6b5b);
      border-radius: 2px;
      flex-shrink: 0;
    }

    .content h3:first-child { margin-top: 0; }

    .content p {
      font-size: 0.88rem;
      line-height: 1.85;
      color: #444;
      margin-bottom: 0.75rem;
    }

    .content ul {
      list-style: none;
      padding: 0;
      margin: 0.5rem 0 1rem;
    }

    .content li {
      font-size: 0.86rem;
      line-height: 1.75;
      color: #444;
      padding: 0.3rem 0 0.3rem 1.5rem;
      position: relative;
    }

    .content li::before {
      content: '→';
      position: absolute;
      left: 0;
      color: #e8392a;
      font-weight: 700;
    }

    .content strong { color: #1a1a1a; font-weight: 600; }
    .content em     { color: #888; font-style: italic; }

    /* ── TIME SLOTS ── */
    .time-slot {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 1.1rem 0 0.4rem;
      padding: 0.5rem 0.8rem;
      background: #fff;
      border-radius: 8px;
      border: 1px solid rgba(232,57,42,0.15);
    }

    .time-icon { font-size: 1rem; }

    .time-label {
      font-size: 0.78rem;
      font-weight: 700;
      color: #e8392a;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    /* ── DAY CARDS ── */
    .day-block {
      background: #fff;
      border: 1px solid rgba(232,57,42,0.12);
      border-radius: 14px;
      padding: 0;
      margin: 1.5rem 0;
      break-inside: avoid;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(232,57,42,0.06);
    }

    .day-block-header {
      display: flex;
      align-items: center;
      gap: 0.9rem;
      background: linear-gradient(135deg, #e8392a, #ff6b5b);
      padding: 1rem 1.5rem;
    }

    .day-number-badge {
      width: 32px; height: 32px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      color: #fff;
      font-size: 0.85rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-family: 'Playfair Display', serif;
    }

    .day-block-header h3 {
      margin: 0;
      font-size: 1rem;
      color: #fff;
      font-family: 'Playfair Display', serif;
      font-weight: 700;
    }

    .day-block-header h3::before { display: none; }

    .day-block-body {
      padding: 1.2rem 1.5rem 1.4rem;
    }

    .day-block-body p   { margin-bottom: 0.5rem; }
    .day-block-body ul  { margin-top: 0.3rem; }
    .day-block-body li  { font-size: 0.84rem; }

    /* ── SECTION HEADINGS ── */
    .section-heading {
      font-family: 'Playfair Display', serif;
      font-size: 1.15rem;
      color: #1a1a1a;
      margin: 2rem 0 0.6rem;
      padding-bottom: 0.4rem;
      border-bottom: 2px solid rgba(232,57,42,0.15);
    }

    /* ── SUB HEADINGS ── */
    .sub-heading {
      font-weight: 700;
      color: #e8392a;
      font-size: 0.82rem;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      margin: 1rem 0 0.3rem;
    }

    /* ── FOOTER ── */
    .footer {
      margin-top: 3rem;
      padding: 1.4rem 4.5rem;
      background: linear-gradient(135deg, #e8392a 0%, #ff6b5b 100%);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer-brand {
      font-family: 'Playfair Display', serif;
      font-size: 1rem;
      font-weight: 700;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .footer-note {
      font-size: 0.62rem;
      color: rgba(255,255,255,0.6);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    @media print {
      @page    { margin: 0; size: A4; }
      body         { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .cover        { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .footer       { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .day-block    { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .day-block-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .time-slot    { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>

  <div class="cover">
    <div class="cover-badge">✦ &nbsp; Wanderlust AI Travel Planner</div>
    <div class="cover-for">Your personalized itinerary for</div>
    <div class="cover-title">${escapeHtml(destination)}</div>
    <div class="cover-tagline">Smart Itinerary, Planned by AI ✦</div>
    <div class="cover-divider"></div>
    <div class="cover-meta">
      <div class="cover-meta-item"><div class="dot"></div>Generated on ${dateStr}</div>
      <div class="cover-meta-item"><div class="dot"></div>Crafted by Wanderlust AI Assistant</div>
    </div>
    <div class="cover-bottom">W A N D E R L U S T</div>
  </div>

  <div class="content">
    ${formatted}
  </div>

  <div class="footer">
    <div class="footer-brand">✦ Wanderlust</div>
    <div class="footer-note">Generated by Wanderlust AI · wanderlust.com</div>
  </div>

  <script>
    window.addEventListener('load', () => setTimeout(() => window.print(), 500));
  <\/script>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) { alert("Please allow pop-ups to export the itinerary."); return; }
  win.document.write(html);
  win.document.close();
}

// Convert markdown to clean HTML suitable for the print page
function formatMarkdownForPrint(text) {
  const lines = text.split("\n");
  const output = [];
  let inList = false;
  let inDayBlock = false;

  for (let raw of lines) {
    let line = raw.trim();

    if (inList && !line.startsWith("- ") && !line.startsWith("• ")) {
      output.push("</ul>");
      inList = false;
    }

    if (!line) {
      output.push("<div style='height:0.5rem'></div>");
      continue;
    }

    // ── Day headers ──
    if (/^(\*\*)?day\s*\d+/i.test(line)) {
      if (inDayBlock) output.push("</div></div>");
      const clean = line.replace(/\*\*/g, "").replace(/^#+\s*/, "");
      output.push(`
        <div class="day-block">
          <div class="day-block-header">
            <div class="day-number-badge">${clean.match(/\d+/)?.[0] || "·"}</div>
            <h3>${escapeHtml(clean)}</h3>
          </div>
          <div class="day-block-body">`);
      inDayBlock = true;
      continue;
    }

    // ── Morning / Afternoon / Evening ──
    if (/^(\*\*)?(morning|afternoon|evening|night)(\*\*)?[:\s]/i.test(line)) {
      const clean = line.replace(/\*\*/g, "");
      const icon = /morning/i.test(clean) ? "🌅" : /afternoon/i.test(clean) ? "☀️" : "🌙";
      output.push(`<div class="time-slot"><span class="time-icon">${icon}</span><span class="time-label">${escapeHtml(clean)}</span></div>`);
      continue;
    }

    // ── ### heading ──
    if (line.startsWith("### ")) {
      const clean = line.slice(4).replace(/\*\*/g, "");
      output.push(`<h4 class="section-heading">${escapeHtml(clean)}</h4>`);
      continue;
    }

    // ── ## heading ──
    if (line.startsWith("## ")) {
      if (inDayBlock) { output.push("</div></div>"); inDayBlock = false; }
      const clean = line.slice(3).replace(/\*\*/g, "");
      output.push(`<h3 class="section-heading">${escapeHtml(clean)}</h3>`);
      continue;
    }

    // ── # heading ──
    if (line.startsWith("# ")) {
      if (inDayBlock) { output.push("</div></div>"); inDayBlock = false; }
      const clean = line.slice(2).replace(/\*\*/g, "");
      output.push(`<h3 class="section-heading">${escapeHtml(clean)}</h3>`);
      continue;
    }

    // ── Bullet list ──
    if (line.startsWith("- ") || line.startsWith("• ")) {
      if (!inList) { output.push("<ul>"); inList = true; }
      const item = line.slice(2)
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>");
      output.push(`<li>${item}</li>`);
      continue;
    }

    // ── Bold-only line → sub heading ──
    if (/^\*\*[^*]+\*\*[:\s]*$/.test(line)) {
      const clean = line.replace(/\*\*/g, "").replace(/:$/, "");
      output.push(`<p class="sub-heading">${escapeHtml(clean)}</p>`);
      continue;
    }

    // ── Normal paragraph ──
    const para = line
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");
    output.push(`<p>${para}</p>`);
  }

  if (inList) output.push("</ul>");
  if (inDayBlock) output.push("</div></div>");

  return output.join("\n");
}
// ─────────────────────────────────────────────
// Build listing card HTML string
// ─────────────────────────────────────────────
function buildCardHTML(l, index) {
  const price = Number(l.price).toLocaleString("en-IN");
  const title = escapeHtml(l.title);
  const location = escapeHtml(l.location);
  const country = escapeHtml(l.country);
  const imgUrl = l.image
    ? escapeHtml(typeof l.image === "object" ? l.image.url || "" : l.image)
    : "";
  const imgStyle = imgUrl ? `background-image:url('${imgUrl}');` : "";

  return `
    <a class="aic" href="/listings/${l._id}" target="_blank"
       style="animation-delay:${index * 70}ms">
      <div class="aic-photo ${
        imgUrl ? "" : "aic-photo--fallback"
      }" style="${imgStyle}">
        <div class="aic-overlay"></div>
        <div class="aic-photo-top">
          <span class="aic-country-badge">${country}</span>
        </div>
        <div class="aic-photo-bottom">
          <span class="aic-price-tag">₹${price}<span class="aic-per">/night</span></span>
        </div>
      </div>
      <div class="aic-body">
        <p class="aic-title">${title}</p>
        <p class="aic-loc">
          <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
            <path d="M4 0C1.79 0 0 1.79 0 4c0 3 4 6 4 6s4-3 4-6c0-2.21-1.79-4-4-4Zm0 5.5A1.5 1.5 0 1 1 4 2.5a1.5 1.5 0 0 1 0 3Z" fill="currentColor"/>
          </svg>
          ${location}
        </p>
      </div>
      <div class="aic-footer">
        <span class="aic-cta">
          View listing
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </div>
    </a>`;
}

// ─────────────────────────────────────────────
// Append listing cards strip after a reference element
// ─────────────────────────────────────────────
function appendListingCards(listings, afterEl) {
  if (!listings || listings.length === 0) return;

  const msgs = document.getElementById("aiMessages");
  const strip = document.createElement("div");
  strip.className = "aic-strip";

  strip.innerHTML = `
    <div class="aic-strip-inner">
      <div class="aic-strip-header">
        <span class="aic-strip-label">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <rect x=".5" y=".5" width="4" height="4" rx="1" fill="currentColor"/>
            <rect x="6.5" y=".5" width="4" height="4" rx="1" fill="currentColor"/>
            <rect x=".5" y="6.5" width="4" height="4" rx="1" fill="currentColor"/>
            <rect x="6.5" y="6.5" width="4" height="4" rx="1" fill="currentColor"/>
          </svg>
          ${listings.length} matching listing${listings.length !== 1 ? "s" : ""}
        </span>
        <span class="aic-strip-hint">swipe to explore</span>
      </div>
      <div class="aic-scroll-track">
        ${listings.map((l, i) => buildCardHTML(l, i)).join("")}
      </div>
    </div>`;

  if (afterEl && afterEl.nextSibling) {
    msgs.insertBefore(strip, afterEl.nextSibling);
  } else {
    msgs.appendChild(strip);
  }
  msgs.scrollTop = msgs.scrollHeight;
}

// ─────────────────────────────────────────────
// Preset buttons
// ─────────────────────────────────────────────
function sendPreset(btn) {
  const span = btn.querySelector("span");
  const text = span ? span.textContent.trim() : btn.textContent.trim();
  document.getElementById("aiInput").value = text;
  sendMessage();
}

// ─────────────────────────────────────────────
// New chat
// ─────────────────────────────────────────────
function newChat() {
  chatHistory = [];
  document.getElementById("aiMessages").innerHTML = `
    <div class="ai-welcome" id="aiWelcome">
      <div class="ai-welcome-inner">
        <div class="ai-welcome-star">✦</div>
        <h2>New conversation</h2>
        <p>Ask me to plan a trip, find stays, or get travel advice.</p>
      </div>
    </div>`;
  setReady();
}

// ─────────────────────────────────────────────
// Keyboard + textarea
// ─────────────────────────────────────────────
function handleKey(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}
function autoResize(el) {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 140) + "px";
}

// ─────────────────────────────────────────────
// Status indicators
// ─────────────────────────────────────────────
function setReady() {
  document.getElementById("aiDot").className = "ai-dot";
  document.getElementById("aiStatusText").textContent = "Ready";
}
function setBusy() {
  document.getElementById("aiDot").className = "ai-dot busy";
  document.getElementById("aiStatusText").textContent = "Thinking…";
}

// ─────────────────────────────────────────────
// Append a chat bubble — now with export button on bot replies
// ─────────────────────────────────────────────
function appendMsg(text, role, isTemp = false, rawText = "") {
  const welcome = document.getElementById("aiWelcome");
  if (welcome) welcome.remove();

  const row = document.createElement("div");
  row.className = `ai-msg-row ${role === "bot" ? "bot-row" : "user-row"}${
    isTemp ? " ai-thinking-row" : ""
  }`;

  const avatar =
    role === "bot"
      ? `<div class="ai-orb-avatar">✦</div>`
      : `<div class="ai-user-avatar"><i class="fa-solid fa-user"></i></div>`;

  const body = isTemp
    ? `<div class="ai-msg-text ai-thinking">
         <div class="ai-dots"><span></span><span></span><span></span></div>
         Thinking...
       </div>`
    : `<div class="ai-msg-text">${
        role === "bot" ? formatMarkdown(text) : escapeHtml(text)
      }</div>`;

  row.innerHTML = `
    <div class="ai-msg-inner">
      <div class="ai-msg-avatar">${avatar}</div>
      <div class="ai-msg-content">
        <div class="ai-msg-label">${role === "bot" ? "Assistant" : "You"}</div>
        ${body}
      </div>
    </div>`;

  if (rawText) row.dataset.raw = rawText;

  document.getElementById("aiMessages").appendChild(row);
  document.getElementById("aiMessages").scrollTop = 99999;
  return row;
}

// ─────────────────────────────────────────────
// Markdown + escaping helpers
// ─────────────────────────────────────────────
function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n- (.+)/g, "<br>• $1")
    .replace(/\n/g, "<br>");
}

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─────────────────────────────────────────────
// Action buttons — copy (all) + export PDF (itinerary only)
// ─────────────────────────────────────────────
function appendActionButtons(msgContent, rawText, isItinerary) {
  const bar = document.createElement("div");
  bar.className = "ai-action-bar";

  // ── Copy button (always shown) ──
  const copyBtn = document.createElement("button");
  copyBtn.className = "ai-action-btn";
  copyBtn.title = "Copy response";
  copyBtn.innerHTML = `
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="4.5" y="4.5" width="7" height="7" rx="1.2" stroke="currentColor" stroke-width="1.3"/>
      <path d="M2.5 8.5H2A1.5 1.5 0 0 1 .5 7V2A1.5 1.5 0 0 1 2 .5h5A1.5 1.5 0 0 1 8.5 2v.5"
        stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
    </svg>
    Copy`;

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(rawText).then(() => {
      copyBtn.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M2 6.5L5 9.5L11 3.5" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Copied!`;
      copyBtn.classList.add("ai-action-btn--success");
      setTimeout(() => {
        copyBtn.innerHTML = `
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <rect x="4.5" y="4.5" width="7" height="7" rx="1.2" stroke="currentColor" stroke-width="1.3"/>
            <path d="M2.5 8.5H2A1.5 1.5 0 0 1 .5 7V2A1.5 1.5 0 0 1 2 .5h5A1.5 1.5 0 0 1 8.5 2v.5"
              stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
          Copy`;
        copyBtn.classList.remove("ai-action-btn--success");
      }, 2000);
    });
  });

  bar.appendChild(copyBtn);

  // ── Export PDF button (itinerary only) ──
  if (isItinerary) {
    const exportBtn = document.createElement("button");
    exportBtn.className = "ai-action-btn ai-action-btn--pdf";
    exportBtn.title = "Export as PDF";
    exportBtn.innerHTML = `
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M2 9v2.5A.5.5 0 0 0 2.5 12h8a.5.5 0 0 0 .5-.5V9M6.5 1v7M4 6l2.5 2.5L9 6"
          stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Export PDF`;
    exportBtn.addEventListener("click", () => exportItinerary(rawText));
    bar.appendChild(exportBtn);
  }

  msgContent.appendChild(bar);
}

// ─────────────────────────────────────────────
// Intent classification — runs client-side so
// the backend gets ready-made search params
// ─────────────────────────────────────────────
const CATEGORY_KEYWORDS = {
  beach: [
    "beach",
    "coastal",
    "seaside",
    "ocean",
    "shore",
    "surf",
    "bay",
    "island",
  ],
  mountain: [
    "mountain",
    "hill",
    "alpine",
    "highland",
    "peak",
    "valley",
    "trek",
  ],
  heritage: [
    "heritage",
    "haveli",
    "historic",
    "palace",
    "fort",
    "colonial",
    "ancient",
    "old city",
  ],
  luxury: [
    "luxury",
    "villa",
    "resort",
    "suite",
    "premium",
    "penthouse",
    "mansion",
  ],
  budget: [
    "budget",
    "hostel",
    "backpacker",
    "affordable",
    "cheap",
    "guesthouse",
  ],
  forest: ["forest", "jungle", "wildlife", "nature", "eco", "treehouse"],
  desert: ["desert", "dune", "arid", "sahara", "thar", "sand"],
  urban: ["apartment", "city", "downtown", "metro", "urban", "studio", "loft"],
  romantic: ["romantic", "honeymoon", "couple", "intimate", "cozy", "charming"],
  artdeco: ["art deco", "art-deco", "vintage", "retro", "1920", "glamour"],
  pool: ["pool", "swimming", "infinity pool"],
};

function extractLocations(text) {
  const locations = new Set();
  // Patterns: "trip to Jaipur", "in Rajasthan", "visit Mumbai", "5 days in Goa"
  const patterns = [
    /\b(?:in|to|visit(?:ing)?|trip to|travel(?:ling)? to|going to|explore|near|around|holiday in|vacation in|days? in|week(?:end)? in)\s+([A-Z][a-zA-Z]+(?: [A-Z][a-zA-Z]+)?)/g,
    /([A-Z][a-zA-Z]+(?: [A-Z][a-zA-Z]+)?)\s+(?:trip|tour|itinerary|vacation|holiday|travel)/g,
  ];
  for (const pat of patterns) {
    let m;
    while ((m = pat.exec(text)) !== null) {
      const loc = m[1].trim();
      if (loc.length > 1 && loc.length < 40) locations.add(loc);
    }
  }
  return [...locations];
}

function classifyIntent(messages) {
  // Combine last 3 user turns for context
  const recentText = messages
    .filter((m) => m.role === "user")
    .slice(-3)
    .map((m) => m.content)
    .join(" ");

  const lower = recentText.toLowerCase();

  // Itinerary intent
  const isItineraryQuery = [
    "itinerary",
    "plan",
    "trip to",
    "travel to",
    "visit",
    "going to",
    "days in",
    "week in",
    "weekend in",
    "holiday in",
    "vacation in",
    "tour of",
    "places to see",
    "what to do in",
  ].some((t) => lower.includes(t));

  // Listing title hint — quoted or "find X listing/stay/property"
  const titleMatch =
    recentText.match(/"([^"]+)"/) ||
    recentText.match(/find (?:the )?(.+?) (?:listing|stay|property|place)/i) ||
    recentText.match(/show (?:me )?(?:the )?(.+?) (?:listing|stay|property)/i);

  // Locations
  const locations = extractLocations(recentText);

  // Categories
  const categories = Object.entries(CATEGORY_KEYWORDS)
    .filter(([, kws]) => kws.some((kw) => lower.includes(kw)))
    .map(([cat]) => cat);

  return {
    isItineraryQuery,
    locations,
    titleHint: titleMatch ? titleMatch[1].trim() : null,
    categories,
  };
}

// ─────────────────────────────────────────────
// MAIN — send message
// ─────────────────────────────────────────────
async function sendMessage() {
  const input = document.getElementById('aiInput');
  const message = input.value.trim();
  if (!message || isThinking) return;

  chatHistory.push({ role: 'user', content: message });
  input.value = '';
  autoResize(input);

  appendMsg(message, 'user');
  const thinkingRow = appendMsg('', 'bot', true);
  setBusy();
  isThinking = true;

  try {
    const res = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: chatHistory,                   
        destination: window.autoDestination || '', 
      }),
    });

    const data = await res.json();
    const reply = data.reply || 'Something went wrong.';

    // Add assistant reply to history
    chatHistory.push({ role: 'assistant', content: reply });  // ✅

    thinkingRow.remove();

    // Append empty bot bubble
    const botRow = appendMsg('', 'bot', false, reply);
    const textEl = botRow.querySelector('.ai-msg-text');
    
    // Type the reply, then show cards + buttons when done
    typeWriterEffect(textEl, reply, 16, () => {
      appendListingCards(data.listings, botRow);
      appendActionButtons(
        botRow.querySelector('.ai-msg-content'),
        reply,
        data.isItinerary
      );
    });
  } catch (err) {
    console.error(err);
    thinkingRow.remove();
    appendMsg('Server error — please try again.', 'bot');
  } finally {
    isThinking = false;
    setReady();
  }
}

// ─────────────────────────────────────────────
// Autofocus
// ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("aiInput").focus();
});
