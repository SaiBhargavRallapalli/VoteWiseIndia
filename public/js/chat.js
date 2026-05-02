import { escHtml, mdToHtml } from './utils.js';
import { logEvent } from './firebase.js';

let chatHistory = [];
let isBotTyping = false;

export function setupChat() {
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  
  if (sendBtn) {
    sendBtn.addEventListener('click', () => sendMessage(chatInput?.value));
  }

  if (chatInput) {
    chatInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(chatInput.value); }
    });

    chatInput.addEventListener('input', () => {
      chatInput.style.height = 'auto';
      chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + 'px';
    });
  }

  document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('[data-panel="chat"]')?.click();
      setTimeout(() => sendMessage(btn.dataset.q), 100);
    });
  });
}

function appendMsg(role, text) {
  const messagesEl = document.getElementById('chat-messages');
  if (!messagesEl) return;

  const div = document.createElement('div');
  div.className = `msg ${role}`;
  div.setAttribute('role', 'article');
  div.setAttribute('aria-label', `${role === 'bot' ? 'AI' : 'Your'} message`);
  div.innerHTML = `
    <div class="msg-av" aria-hidden="true">${role === 'bot' ? 'AI' : 'ME'}</div>
    <div class="msg-bubble">${mdToHtml(escHtml(text))}</div>
  `;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function showTyping() {
  const messagesEl = document.getElementById('chat-messages');
  if (!messagesEl) return;

  const div = document.createElement('div');
  div.className = 'msg bot'; div.id = 'typing';
  div.setAttribute('aria-label', 'AI is typing');
  div.innerHTML = `<div class="msg-av" aria-hidden="true">AI</div><div class="msg-bubble typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('typing');
  if (el) el.remove();
}

export async function sendMessage(text) {
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');

  if (!text || isBotTyping) return;
  const trimmed = text.trim();
  if (!trimmed) return;

  appendMsg('user', trimmed);
  if (chatInput) {
    chatInput.value = ''; 
    chatInput.style.height = 'auto';
  }
  
  isBotTyping = true; 
  if (sendBtn) sendBtn.disabled = true;
  showTyping();

  logEvent('chat_message', { message_length: trimmed.length });

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: trimmed, history: chatHistory }),
    });
    const data = await res.json();
    removeTyping();

    if (data.error) {
      appendMsg('bot', '⚠️ ' + data.error);
    } else {
      appendMsg('bot', data.reply);
      chatHistory.push({ role: 'user', text: trimmed });
      chatHistory.push({ role: 'model', text: data.reply });
      if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
    }
  } catch (e) {
    removeTyping();
    appendMsg('bot', '⚠️ Network error. Please try again.');
  } finally {
    isBotTyping = false; 
    if (sendBtn) sendBtn.disabled = false;
  }
}
