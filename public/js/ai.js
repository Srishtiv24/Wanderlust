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
// Build one card's HTML
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
          <svg width="8" height="10" viewBox="0 0 8 10" fill="none" aria-hidden="true">
            <path d="M4 0C1.79 0 0 1.79 0 4c0 3 4 6 4 6s4-3 4-6c0-2.21-1.79-4-4-4Zm0 5.5A1.5 1.5 0 1 1 4 2.5a1.5 1.5 0 0 1 0 3Z" fill="currentColor"/>
          </svg>
          ${location}
        </p>
      </div>
      <div class="aic-footer">
        <span class="aic-cta">
          View listing
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </div>
    </a>`;
}

// ─────────────────────────────────────────────
// Append cards strip AFTER a given element
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
// Keyboard + textarea helpers
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
// Append a chat bubble row
// ─────────────────────────────────────────────
function appendMsg(text, role, isTemp = false) {
  const welcome = document.getElementById('aiWelcome');
  if (welcome) welcome.remove();

  const row = document.createElement('div');
  row.className = `ai-msg-row ${role === 'bot' ? 'bot-row' : 'user-row'}${isTemp ? ' ai-thinking-row' : ''}`;

  const avatar = role === 'bot'
    ? `<div class="ai-orb-avatar">✦</div>`
    : `<div class="ai-user-avatar"><i class="fa-solid fa-user"></i></div>`;

  const body = isTemp
    ? `<div class="ai-msg-text ai-thinking">
         <div class="ai-dots"><span></span><span></span><span></span></div>
         Thinking...
       </div>`
    : `<div class="ai-msg-text">${role === 'bot' ? formatMarkdown(text) : escapeHtml(text)}</div>`;

  row.innerHTML = `
    <div class="ai-msg-inner">
      <div class="ai-msg-avatar">${avatar}</div>
      <div class="ai-msg-content">
        <div class="ai-msg-label">${role === 'bot' ? 'Assistant' : 'You'}</div>
        ${body}
      </div>
    </div>`;

  document.getElementById('aiMessages').appendChild(row);
  document.getElementById('aiMessages').scrollTop = 99999;
  return row;
}

// ─────────────────────────────────────────────
// Markdown + escaping
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

  // 2 — thinking placeholder
  const botMsgEl = appendMsg('', 'bot', true);

  try {
    const res = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatHistory }),
    });

    if (!res.ok) throw new Error('API failed');

    const data  = await res.json();
    const reply = data.reply || 'No response.';

    // 3 — replace thinking bubble with typewriter
    botMsgEl.classList.remove('ai-thinking-row');
    const target = botMsgEl.querySelector('.ai-msg-text');
    target.innerHTML = '';

    // 4 — inject cards AFTER typewriter finishes
    typeWriterEffect(target, reply, 16, () => {
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
