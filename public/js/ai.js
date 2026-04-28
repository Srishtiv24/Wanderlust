let chatHistory = [];
let isThinking = false;

// ✅ Typewriter effect
function typeWriterEffect(element, text, speed = 40) {
  let i = 0;

  function type() {
    if (i <= text.length) {
      element.innerHTML = formatMarkdown(text.slice(0, i));
      i++;

      const msgs = document.getElementById('aiMessages');
      msgs.scrollTop = msgs.scrollHeight;

      setTimeout(type, speed);
    }
  }

  type();
}

// ✅ preset buttons
function sendPreset(btn) {
  const span = btn.querySelector('span');
  const text = span ? span.textContent.trim() : btn.textContent.trim();
  document.getElementById('aiInput').value = text;
  sendMessage();
}

// ✅ new chat
function newChat() {
  chatHistory = [];
  const msgs = document.getElementById('aiMessages');

  msgs.innerHTML = `
    <div class="ai-welcome" id="aiWelcome">
      <div class="ai-welcome-inner">
        <div class="ai-orb-avatar">✦</div>
        <h2>New conversation</h2>
        <p>Ask me to plan a trip, find stays, or get travel advice.</p>
      </div>
    </div>`;

  setReady();
}

// ✅ enter key
function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

// ✅ textarea resize
function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 140) + 'px';
}

// ✅ status
function setReady() {
  document.getElementById('aiDot').className = 'ai-dot';
  document.getElementById('aiStatusText').textContent = 'Ready';
}

function setBusy() {
  document.getElementById('aiDot').className = 'ai-dot busy';
  document.getElementById('aiStatusText').textContent = 'Thinking…';
}

// ✅ append message
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

  const msgs = document.getElementById('aiMessages');
  msgs.appendChild(row);
  msgs.scrollTop = msgs.scrollHeight;

  return row;
}

// ✅ markdown formatting
function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n- (.+)/g, '<br>• $1')
    .replace(/\n/g, '<br>');
}

// ✅ escape html
function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ✅ MAIN FUNCTION (FIXED)
async function sendMessage() {
  if (isThinking) return;

  const input = document.getElementById('aiInput');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  input.style.height = 'auto';

  appendMsg(text, 'user');
  chatHistory.push({ role: 'user', content: text });

  isThinking = true;
  setBusy();
  document.getElementById('aiSendBtn').disabled = true;

  const botMsgEl = appendMsg("", "bot", true);

  try {
    const res = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatHistory })
    });

    if (!res.ok) throw new Error("API failed");

    const data = await res.json();
    const reply = data.reply || "No response";

    // remove thinking UI
    botMsgEl.classList.remove("ai-thinking-row");

    const target = botMsgEl.querySelector(".ai-msg-text");

    // clear thinking text
    target.innerHTML = "";

    // ✨ typewriter animation
    typeWriterEffect(target, reply);

    chatHistory.push({ role: "assistant", content: reply });

  } catch (err) {
    botMsgEl.classList.remove("ai-thinking-row");
    botMsgEl.querySelector(".ai-msg-text").innerHTML =
      "⚠️ Connection error.";
    console.error(err);
  }

  isThinking = false;
  setReady();
  document.getElementById('aiSendBtn').disabled = false;
  input.focus();
}

// ✅ autofocus
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('aiInput').focus();
});