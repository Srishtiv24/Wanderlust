let chatHistory = [];
let isThinking = false;

// ─────────────────────────────────────────────
// Typewriter — calls onDone callback when done
// ─────────────────────────────────────────────
function typeWriterEffect(element, text, speed = 16, onDone) {
  let i = 0;
  const msgs = document.getElementById('aiMessages');
  function type() {
    if (i <= text.length) {
      element.innerHTML = formatMarkdown(text.slice(0, i));
      i++;
      msgs.scrollTop = msgs.scrollHeight;
      setTimeout(type, speed);
    } else {
      if (typeof onDone === 'function') onDone();
    }
  }
  type();
}

// ─────────────────────────────────────────────
// Export bot reply as a formatted PDF
// ─────────────────────────────────────────────
function exportItinerary(rawText) {
  const formatted = formatMarkdownForPrint(rawText);
  const now       = new Date();
  const dateStr   = now.toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  // Detect a trip title from the first line, fall back gracefully
  const firstLine = rawText.split('\n')[0].replace(/\*\*/g, '').trim();
  const title     = firstLine.length > 4 && firstLine.length < 80
    ? firstLine
    : 'Your Travel Itinerary';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>${escapeHtml(title)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'DM Sans', sans-serif;
      color: #1a1a1a;
      background: #fff;
      padding: 0;
    }

    /* ── Cover strip ── */
    .cover {
      background: linear-gradient(135deg, #e8392a 0%, #ff7a18 100%);
      color: #fff;
      padding: 2.8rem 3rem 2.4rem;
      position: relative;
      overflow: hidden;
    }
    .cover::after {
      content: '✦';
      position: absolute;
      right: 2.5rem; top: 50%;
      transform: translateY(-50%);
      font-size: 6rem;
      opacity: 0.12;
      line-height: 1;
    }
    .cover-eyebrow {
      font-size: 0.62rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      opacity: 0.75;
      margin-bottom: 0.55rem;
    }
    .cover-title {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 1.9rem;
      font-weight: 800;
      line-height: 1.2;
      letter-spacing: -0.02em;
      max-width: 72%;
    }
    .cover-meta {
      margin-top: 1.2rem;
      font-size: 0.72rem;
      opacity: 0.7;
      display: flex;
      gap: 1.5rem;
    }
    .cover-meta span { display: flex; align-items: center; gap: 0.3rem; }

    /* ── Content area ── */
    .content {
      padding: 2.6rem 3rem;
      max-width: 780px;
    }

    /* Typography */
    .content h3 {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 1.05rem;
      font-weight: 700;
      color: #1a1a1a;
      margin: 1.6rem 0 0.55rem;
      padding-bottom: 0.35rem;
      border-bottom: 2px solid #f0f0f0;
      letter-spacing: -0.01em;
    }
    .content h3:first-child { margin-top: 0; }

    .content h4 {
      font-size: 0.88rem;
      font-weight: 700;
      color: #e8392a;
      margin: 1rem 0 0.3rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 0.72rem;
    }

    .content p {
      font-size: 0.875rem;
      line-height: 1.75;
      color: #333;
      margin-bottom: 0.6rem;
    }

    .content ul, .content ol {
      padding-left: 1.25rem;
      margin: 0.4rem 0 0.8rem;
    }
    .content li {
      font-size: 0.875rem;
      line-height: 1.7;
      color: #333;
      margin-bottom: 0.3rem;
    }

    .content strong { font-weight: 700; color: #1a1a1a; }
    .content em     { color: #666; font-style: italic; }

    /* Day blocks — each bold "Day X" becomes a card */
    .day-block {
      border: 1px solid #f0f0f0;
      border-radius: 10px;
      padding: 1.1rem 1.2rem;
      margin-bottom: 0.9rem;
      break-inside: avoid;
    }
    .day-block h3 {
      border-bottom: none;
      margin-top: 0;
      font-size: 0.96rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .day-block h3::before {
      content: '';
      display: inline-block;
      width: 8px; height: 8px;
      border-radius: 50%;
      background: #e8392a;
      flex-shrink: 0;
    }

    /* ── Footer ── */
    .footer {
      margin-top: 2rem;
      padding: 1rem 3rem 1.4rem;
      border-top: 1px solid #f0f0f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .footer-brand {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 0.78rem;
      font-weight: 700;
      color: #e8392a;
      display: flex; align-items: center; gap: 0.35rem;
    }
    .footer-note {
      font-size: 0.65rem;
      color: #aaa;
    }

    /* Print */
    @media print {
      @page { margin: 0; size: A4; }
      body   { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .cover { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>

  <div class="cover">
    <div class="cover-eyebrow">✦ Wanderlust · Travel Itinerary</div>
    <div class="cover-title">${escapeHtml(title)}</div>
    <div class="cover-meta">
      <span>📅 Generated on ${dateStr}</span>
      <span>✈ Planned by AI Travel Assistant</span>
    </div>
  </div>

  <div class="content">
    ${formatted}
  </div>

  <div class="footer">
    <div class="footer-brand">✦ Wanderlust</div>
    <div class="footer-note">Generated by Wanderlust AI Assistant · wanderlust.com</div>
  </div>

  <script>
    window.addEventListener('load', () => {
      setTimeout(() => window.print(), 400);
    });
  <\/script>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (!win) {
    alert('Please allow pop-ups to export the itinerary.');
    return;
  }
  win.document.write(html);
  win.document.close();
}

// Convert markdown to clean HTML suitable for the print page
function formatMarkdownForPrint(text) {
  const lines  = text.split('\n');
  const output = [];
  let inList   = false;

  for (let raw of lines) {
    let line = raw.trim();

    // Close open list before non-list lines
    if (inList && !line.startsWith('- ') && !line.startsWith('• ')) {
      output.push('</ul>');
      inList = false;
    }

    if (!line) {
      output.push('<br>');
      continue;
    }

    // Day headers → styled day-block open
    if (/^(day\s*\d+|day\s*[one|two|three|four|five|six|seven])/i.test(line.replace(/\*\*/g, ''))) {
      const clean = line.replace(/\*\*/g, '');
      output.push(`<div class="day-block"><h3>${escapeHtml(clean)}</h3>`);
      // Close day block at next blank or at end — simpler: wrap whole text, close at </div> below
      output.push(`</div>`); // self-contained; content will inline-flow
      continue;
    }

    // ### heading
    if (line.startsWith('### ')) {
      output.push(`<h3>${escapeHtml(line.slice(4)).replace(/\*\*/g, '')}</h3>`);
      continue;
    }

    // ## heading
    if (line.startsWith('## ')) {
      output.push(`<h3>${escapeHtml(line.slice(3)).replace(/\*\*/g, '')}</h3>`);
      continue;
    }

    // # heading
    if (line.startsWith('# ')) {
      output.push(`<h3>${escapeHtml(line.slice(2)).replace(/\*\*/g, '')}</h3>`);
      continue;
    }

    // Bullet list
    if (line.startsWith('- ') || line.startsWith('• ')) {
      if (!inList) { output.push('<ul>'); inList = true; }
      const item = line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      output.push(`<li>${item}</li>`);
      continue;
    }

    // Normal paragraph
    const para = line
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
    output.push(`<p>${para}</p>`);
  }

  if (inList) output.push('</ul>');
  return output.join('\n');
}

// ─────────────────────────────────────────────
// Build listing card HTML string
// ─────────────────────────────────────────────
function buildCardHTML(l, index) {
  const price    = Number(l.price).toLocaleString('en-IN');
  const title    = escapeHtml(l.title);
  const location = escapeHtml(l.location);
  const country  = escapeHtml(l.country);
  const imgUrl   = l.image
    ? escapeHtml(typeof l.image === 'object' ? (l.image.url || '') : l.image)
    : '';
  const imgStyle = imgUrl ? `background-image:url('${imgUrl}');` : '';

  return `
    <a class="aic" href="/listings/${l._id}" target="_blank"
       style="animation-delay:${index * 70}ms">
      <div class="aic-photo ${imgUrl ? '' : 'aic-photo--fallback'}" style="${imgStyle}">
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

  const msgs  = document.getElementById('aiMessages');
  const strip = document.createElement('div');
  strip.className = 'aic-strip';

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
          ${listings.length} matching listing${listings.length !== 1 ? 's' : ''}
        </span>
        <span class="aic-strip-hint">swipe to explore</span>
      </div>
      <div class="aic-scroll-track">
        ${listings.map((l, i) => buildCardHTML(l, i)).join('')}
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
  const span = btn.querySelector('span');
  const text = span ? span.textContent.trim() : btn.textContent.trim();
  document.getElementById('aiInput').value = text;
  sendMessage();
}

// ─────────────────────────────────────────────
// New chat
// ─────────────────────────────────────────────
function newChat() {
  chatHistory = [];
  document.getElementById('aiMessages').innerHTML = `
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
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}
function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 140) + 'px';
}

// ─────────────────────────────────────────────
// Status indicators
// ─────────────────────────────────────────────
function setReady() {
  document.getElementById('aiDot').className = 'ai-dot';
  document.getElementById('aiStatusText').textContent = 'Ready';
}
function setBusy() {
  document.getElementById('aiDot').className = 'ai-dot busy';
  document.getElementById('aiStatusText').textContent = 'Thinking…';
}

// ─────────────────────────────────────────────
// Append a chat bubble — now with export button on bot replies
// ─────────────────────────────────────────────
function appendMsg(text, role, isTemp = false, rawText = '') {
  const welcome = document.getElementById('aiWelcome');
  if (welcome) welcome.remove();

  const row = document.createElement('div');
  row.className = `ai-msg-row ${role === 'bot' ? 'bot-row' : 'user-row'}${isTemp ? ' ai-thinking-row' : ''}`;

  const avatar = role === 'bot'
    ? `<div class="ai-orb-avatar">✦</div>`
    : `<div class="ai-user-avatar"><i class="fa-solid fa-user"></i></div>`;

  // Export button — only on completed bot messages, not on the thinking placeholder
  const exportBtn = (role === 'bot' && !isTemp)
    ? `<button class="ai-export-btn" title="Export as PDF"
         onclick="exportItinerary(this.closest('.ai-msg-row').dataset.raw)">
         <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
           <path d="M2 9v2.5A.5.5 0 0 0 2.5 12h8a.5.5 0 0 0 .5-.5V9M6.5 1v7M4 6l2.5 2.5L9 6"
             stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>
         </svg>
         Export PDF
       </button>`
    : '';

  const body = isTemp
    ? `<div class="ai-msg-text ai-thinking">
         <div class="ai-dots"><span></span><span></span><span></span></div>
         Thinking...
       </div>`
    : `<div class="ai-msg-text">${role === 'bot' ? formatMarkdown(text) : escapeHtml(text)}</div>
       ${exportBtn}`;

  row.innerHTML = `
    <div class="ai-msg-inner">
      <div class="ai-msg-avatar">${avatar}</div>
      <div class="ai-msg-content">
        <div class="ai-msg-label">${role === 'bot' ? 'Assistant' : 'You'}</div>
        ${body}
      </div>
    </div>`;

  // Store raw text on the row so the export button can read it
  if (rawText) row.dataset.raw = rawText;

  document.getElementById('aiMessages').appendChild(row);
  document.getElementById('aiMessages').scrollTop = 99999;
  return row;
}

// ─────────────────────────────────────────────
// Markdown + escaping helpers
// ─────────────────────────────────────────────
function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n- (.+)/g, '<br>• $1')
    .replace(/\n/g, '<br>');
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─────────────────────────────────────────────
// Action buttons — copy (all) + export PDF (itinerary only)
// ─────────────────────────────────────────────
function appendActionButtons(msgContent, rawText, isItinerary) {
  const bar = document.createElement('div');
  bar.className = 'ai-action-bar';

  // ── Copy button (always shown) ──
  const copyBtn = document.createElement('button');
  copyBtn.className = 'ai-action-btn';
  copyBtn.title     = 'Copy response';
  copyBtn.innerHTML = `
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="4.5" y="4.5" width="7" height="7" rx="1.2" stroke="currentColor" stroke-width="1.3"/>
      <path d="M2.5 8.5H2A1.5 1.5 0 0 1 .5 7V2A1.5 1.5 0 0 1 2 .5h5A1.5 1.5 0 0 1 8.5 2v.5"
        stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
    </svg>
    Copy`;

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(rawText).then(() => {
      copyBtn.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M2 6.5L5 9.5L11 3.5" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Copied!`;
      copyBtn.classList.add('ai-action-btn--success');
      setTimeout(() => {
        copyBtn.innerHTML = `
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <rect x="4.5" y="4.5" width="7" height="7" rx="1.2" stroke="currentColor" stroke-width="1.3"/>
            <path d="M2.5 8.5H2A1.5 1.5 0 0 1 .5 7V2A1.5 1.5 0 0 1 2 .5h5A1.5 1.5 0 0 1 8.5 2v.5"
              stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
          Copy`;
        copyBtn.classList.remove('ai-action-btn--success');
      }, 2000);
    });
  });

  bar.appendChild(copyBtn);

  // ── Export PDF button (itinerary only) ──
  if (isItinerary) {
    const exportBtn = document.createElement('button');
    exportBtn.className = 'ai-action-btn ai-action-btn--pdf';
    exportBtn.title     = 'Export as PDF';
    exportBtn.innerHTML = `
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M2 9v2.5A.5.5 0 0 0 2.5 12h8a.5.5 0 0 0 .5-.5V9M6.5 1v7M4 6l2.5 2.5L9 6"
          stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Export PDF`;
    exportBtn.addEventListener('click', () => exportItinerary(rawText));
    bar.appendChild(exportBtn);
  }

  msgContent.appendChild(bar);
}

// ─────────────────────────────────────────────
// Intent classification — runs client-side so
// the backend gets ready-made search params
// ─────────────────────────────────────────────
const CATEGORY_KEYWORDS = {
  beach:    ['beach', 'coastal', 'seaside', 'ocean', 'shore', 'surf', 'bay', 'island'],
  mountain: ['mountain', 'hill', 'alpine', 'highland', 'peak', 'valley', 'trek'],
  heritage: ['heritage', 'haveli', 'historic', 'palace', 'fort', 'colonial', 'ancient', 'old city'],
  luxury:   ['luxury', 'villa', 'resort', 'suite', 'premium', 'penthouse', 'mansion'],
  budget:   ['budget', 'hostel', 'backpacker', 'affordable', 'cheap', 'guesthouse'],
  forest:   ['forest', 'jungle', 'wildlife', 'nature', 'eco', 'treehouse'],
  desert:   ['desert', 'dune', 'arid', 'sahara', 'thar', 'sand'],
  urban:    ['apartment', 'city', 'downtown', 'metro', 'urban', 'studio', 'loft'],
  romantic: ['romantic', 'honeymoon', 'couple', 'intimate', 'cozy', 'charming'],
  artdeco:  ['art deco', 'art-deco', 'vintage', 'retro', '1920', 'glamour'],
  pool:     ['pool', 'swimming', 'infinity pool'],
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
    .filter(m => m.role === 'user')
    .slice(-3)
    .map(m => m.content)
    .join(' ');

  const lower = recentText.toLowerCase();

  // Itinerary intent
  const isItineraryQuery = [
    'itinerary', 'plan', 'trip to', 'travel to', 'visit', 'going to',
    'days in', 'week in', 'weekend in', 'holiday in', 'vacation in',
    'tour of', 'places to see', 'what to do in',
  ].some(t => lower.includes(t));

  // Listing title hint — quoted or "find X listing/stay/property"
  const titleMatch =
    recentText.match(/"([^"]+)"/) ||
    recentText.match(/find (?:the )?(.+?) (?:listing|stay|property|place)/i) ||
    recentText.match(/show (?:me )?(?:the )?(.+?) (?:listing|stay|property)/i);

  // Locations
  const locations = extractLocations(recentText);

  // Categories
  const categories = Object.entries(CATEGORY_KEYWORDS)
    .filter(([, kws]) => kws.some(kw => lower.includes(kw)))
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
  if (isThinking) return;

  const input = document.getElementById('aiInput');
  const text  = input.value.trim();
  if (!text) return;

  input.value = '';
  input.style.height = 'auto';

  // 1 — user bubble
  appendMsg(text, 'user');
  chatHistory.push({ role: 'user', content: text });

  isThinking = true;
  setBusy();
  document.getElementById('aiSendBtn').disabled = true;

  // 2 — thinking placeholder (no export btn yet)
  const botMsgEl = appendMsg('', 'bot', true);

  try {
    const res = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages:    chatHistory,
        // Destination set by ai.ejs from the ?destination= URL param
        // sent by itinerary page — reliable, no regex extraction needed
        destination: window._autoDestination || null,
      }),
    });

    if (!res.ok) throw new Error('API failed');

    const data  = await res.json();
    const reply = data.reply || 'No response.';

    // 3 — swap thinking for typewriter
    botMsgEl.classList.remove('ai-thinking-row');
    const msgContent = botMsgEl.querySelector('.ai-msg-content');
    const target     = botMsgEl.querySelector('.ai-msg-text');
    target.innerHTML = '';

    // 4 — after typewriter done: add action buttons + listing cards
    typeWriterEffect(target, reply, 16, () => {
      appendActionButtons(msgContent, reply, data.isItinerary);

      if (data.listings && data.listings.length > 0) {
        appendListingCards(data.listings, botMsgEl);
      }
    });

    chatHistory.push({ role: 'assistant', content: reply });

  } catch (err) {
    botMsgEl.classList.remove('ai-thinking-row');
    botMsgEl.querySelector('.ai-msg-text').innerHTML =
      '⚠️ Connection error. Please try again.';
    console.error('[AI error]', err);
  }

  isThinking = false;
  setReady();
  document.getElementById('aiSendBtn').disabled = false;
  input.focus();
}

// ─────────────────────────────────────────────
// Autofocus
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('aiInput').focus();
});