let chatHistory = [];
let isThinking = false;

function sendPreset(btn) {
  const span = btn.querySelector('span');
  const text = span ? span.textContent.trim() : btn.textContent.trim();
  document.getElementById('aiInput').value = text;
  sendMessage();
}

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

function setReady() {
  document.getElementById('aiDot').className = 'ai-dot';
  document.getElementById('aiStatusText').textContent = 'Ready';
}

function setBusy() {
  document.getElementById('aiDot').className = 'ai-dot busy';
  document.getElementById('aiStatusText').textContent = 'Thinking…';
}

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

function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n- (.+)/g, '<br>• $1')
    .replace(/\n/g, '<br>');
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

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

  // ✅ Only ONE thinking message
  const botMsgEl = appendMsg("", "bot", true);

  try {
    const res = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatHistory })
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = "";
    let fullText = "";
    let started = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let parts = buffer.split("\n\n");
      buffer = parts.pop();

      for (let part of parts) {
        const line = part.trim();
        if (!line.startsWith("data:")) continue;

        const data = line.replace("data:", "").trim();
        if (data === "[DONE]") break;

        try {
          const json = JSON.parse(data);
          const token = json.choices?.[0]?.delta?.content;

          if (token) {
            // first token → remove thinking UI
            if (!started) {
              botMsgEl.classList.remove("ai-thinking-row");
              botMsgEl.querySelector(".ai-msg-text").innerHTML = "";
              started = true;
            }

            fullText += token;

            botMsgEl.querySelector(".ai-msg-text").innerHTML =
              formatMarkdown(fullText);

            const msgs = document.getElementById('aiMessages');
            msgs.scrollTop = msgs.scrollHeight;
          }
        } catch (e) {
          console.error("Parse error", e);
        }
      }
    }

    chatHistory.push({ role: "assistant", content: fullText });

  } catch (err) {
    botMsgEl.querySelector(".ai-msg-text").innerHTML = "Connection error.";
  }

  isThinking = false;
  setReady();
  document.getElementById('aiSendBtn').disabled = false;
  input.focus();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('aiInput').focus();
});