// Configuration for development vs production
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// DEVELOPMENT ONLY: Add your API key here for local testing
// Get your key from: https://console.groq.com
const DEV_API_KEY = window.LOCAL_CONFIG?.GROQ_API_KEY || "YOUR_GROQ_API_KEY_HERE"; // Load from config.local.js or use placeholder

const messagesContainer = document.getElementById("messages")
const userInput = document.getElementById("userInput")
const historyList = document.getElementById("historyList")
let isTyping = false;
let currentChatId = null;
let chatHistory = [];

// Load chat history from localStorage on page load
function loadChatHistory() {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
        chatHistory = JSON.parse(saved);
    }
    renderChatHistory();
}

// Save chat history to localStorage
function saveChatHistory() {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

// Render chat history in sidebar
function renderChatHistory() {
    historyList.innerHTML = '';

    if (chatHistory.length === 0) {
        historyList.innerHTML = '<div style="padding: 12px; color: var(--text-secondary); font-size: 13px; text-align: center;">No chat history yet</div>';
        return;
    }

    // Sort by last updated (most recent first)
    const sorted = [...chatHistory].sort((a, b) => b.lastUpdated - a.lastUpdated);

    sorted.forEach(chat => {
        const item = document.createElement('div');
        item.className = 'history-item';
        if (chat.id === currentChatId) {
            item.style.background = '#18181b';
        }

        item.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>${chat.title}</span>
        `;

        item.onclick = () => loadChat(chat.id);
        historyList.appendChild(item);
    });
}

// Load a specific chat
function loadChat(chatId) {
    const chat = chatHistory.find(c => c.id === chatId);
    if (!chat) return;

    currentChatId = chatId;
    messagesContainer.innerHTML = '';

    // Render all messages from this chat
    chat.messages.forEach(msg => {
        const wrapper = document.createElement("div");
        wrapper.className = `message-wrapper ${msg.sender} fade-in`;

        const inner = document.createElement("div");
        inner.className = "message-inner";

        const avatar = document.createElement("div");
        avatar.className = `avatar ${msg.sender}`;

        if (msg.sender === "user") {
            avatar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
        } else {
            avatar.innerHTML = `<div class="orb"></div>`;
        }

        const content = document.createElement("div");
        content.className = `message-content ${msg.sender}`;

        if (msg.sender === 'user') {
            content.innerHTML = `<p>${msg.text}</p>`;
        } else {
            if (typeof marked !== 'undefined') {
                content.innerHTML = marked.parse(msg.text);
            } else {
                content.innerHTML = formatText(msg.text);
            }
        }

        // Add copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy
        `;
        copyBtn.onclick = () => copyToClipboard(msg.text, copyBtn);

        inner.appendChild(avatar);
        inner.appendChild(content);
        inner.appendChild(copyBtn);
        wrapper.appendChild(inner);
        messagesContainer.appendChild(wrapper);
    });

    scrollToBottom();
    renderChatHistory();
}

// Save current message to chat history
function saveMessage(text, sender) {
    if (!currentChatId) {
        // Create new chat
        currentChatId = 'chat-' + Date.now();
        const title = text.length > 40 ? text.substring(0, 40) + '...' : text;

        chatHistory.push({
            id: currentChatId,
            title: title,
            messages: [],
            created: Date.now(),
            lastUpdated: Date.now()
        });
    }

    const chat = chatHistory.find(c => c.id === currentChatId);
    if (chat) {
        chat.messages.push({ text, sender, timestamp: Date.now() });
        chat.lastUpdated = Date.now();
        saveChatHistory();
        renderChatHistory();
    }
}

// Copy to clipboard function
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalHTML = button.innerHTML;
        button.classList.add('copied');
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copied!
        `;

        setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = originalHTML;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Error
        `;
    });
}

// Handle auto-resize of input
userInput.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    if (this.value === '') this.style.height = 'auto';
});

async function sendMessage() {
    if (isTyping) return; // Prevent sending while typing

    const message = userInput.value.trim()

    if (!message) return

    // Add user message to chat
    addMessage(message, "user")
    saveMessage(message, "user")
    userInput.value = ""
    userInput.style.height = 'auto';
    scrollToBottom()

    // Show typing indicator
    const typingId = showTypingIndicator()
    isTyping = true;

    try {
        let response, data;

        if (isDevelopment) {
            // DEVELOPMENT MODE: Direct API call
            console.log('🔧 Running in development mode - using direct API call');
            response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${DEV_API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful AI. Format your answers neatly using Markdown. Use clear headings (## or ###), bullet points for lists to make points clear, and bold text for emphasis. Avoid long paragraphs. Use icons or emojis where appropriate to make it look neat and modern."
                        },
                        { role: "user", content: message }
                    ],
                    temperature: 0.7,
                    max_tokens: 1024
                })
            });
            data = await response.json();
        } else {
            // PRODUCTION MODE: Use serverless function
            console.log('🚀 Running in production mode - using serverless function');
            response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message })
            });
            data = await response.json();
        }

        // Remove typing indicator
        removeTypingIndicator(typingId)

        if (!response.ok) {
            const errorMsg = "Error: " + (data.error || data.error?.message || "API request failed");
            addMessage(errorMsg, "bot", true)
            saveMessage(errorMsg, "bot")
            isTyping = false;
            return
        }

        if (data.choices && data.choices[0] && data.choices[0].message) {
            const botMessage = data.choices[0].message.content
            // Type out the message
            await typeMessage(botMessage)
            saveMessage(botMessage, "bot")
        } else {
            const errorMsg = "Error: Unable to get response";
            addMessage(errorMsg, "bot", true)
            saveMessage(errorMsg, "bot")
        }
    } catch (error) {
        removeTypingIndicator(typingId)
        const errorMsg = "Error: " + error.message;
        addMessage(errorMsg, "bot", true)
        saveMessage(errorMsg, "bot")
    } finally {
        isTyping = false;
        scrollToBottom()
    }
}

function addMessage(text, sender, isError = false) {
    const wrapper = document.createElement("div")
    wrapper.className = `message-wrapper ${sender} fade-in`
    if (isError) wrapper.classList.add('error-message');

    const inner = document.createElement("div")
    inner.className = "message-inner"

    // Avatar
    const avatar = document.createElement("div")
    avatar.className = `avatar ${sender}`

    if (sender === "user") {
        avatar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
    } else {
        avatar.innerHTML = `<div class="orb"></div>`
    }

    // Message Content
    const content = document.createElement("div")
    content.className = `message-content ${sender}`
    if (isError) content.style.color = '#ef4444';

    // Format text
    if (sender === 'user') {
        content.innerHTML = `<p>${text}</p>`; // Basic user text
    } else {
        // Use marked for bot if available, else fallback
        if (typeof marked !== 'undefined') {
            content.innerHTML = marked.parse(text);
        } else {
            content.innerHTML = formatText(text);
        }
    }

    // Add copy button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        Copy
    `;
    copyBtn.onclick = () => copyToClipboard(text, copyBtn);

    inner.appendChild(avatar)
    inner.appendChild(content)
    inner.appendChild(copyBtn)
    wrapper.appendChild(inner)
    messagesContainer.appendChild(wrapper)
    scrollToBottom()
}

// Typing effect function
async function typeMessage(text) {
    const wrapper = document.createElement("div")
    wrapper.className = `message-wrapper bot fade-in`

    const inner = document.createElement("div")
    inner.className = "message-inner"

    const avatar = document.createElement("div")
    avatar.className = `avatar bot`
    avatar.innerHTML = `<div class="orb"></div>`

    const content = document.createElement("div")
    content.className = `message-content bot`

    inner.appendChild(avatar)
    inner.appendChild(content)
    wrapper.appendChild(inner)
    messagesContainer.appendChild(wrapper)

    // Smooth typing logic
    const p = document.createElement("div");
    p.style.whiteSpace = "pre-wrap";
    content.appendChild(p);

    let currentText = "";
    const speed = 5;

    for (let i = 0; i < text.length; i++) {
        currentText += text[i];
        p.textContent = currentText;

        if (i % 50 === 0) scrollToBottom();
        if (i % 2 === 0) await new Promise(r => setTimeout(r, speed));
    }


    // Replace with fully rendered markdown
    if (typeof marked !== 'undefined') {
        content.innerHTML = marked.parse(text);
    } else {
        content.innerHTML = formatText(text)
    }

    // Add copy button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        Copy
    `;
    copyBtn.onclick = () => copyToClipboard(text, copyBtn);
    inner.appendChild(copyBtn);

    scrollToBottom();
}

function formatText(text) {
    // Fallback if marked didn't load
    let formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>')
        .replace(/```([\s\S]*?)```/g, '<div class="code-block"><pre><code>$1</code></pre></div>');

    return formatted.split(/\n\n+/).map(para => `<p>${para.trim()}</p>`).join('');
}

function showTypingIndicator() {
    const id = 'typing-' + Date.now();
    const wrapper = document.createElement("div")
    wrapper.className = "typing-wrapper fade-in"
    wrapper.id = id

    const avatar = document.createElement("div")
    avatar.className = "avatar bot"
    avatar.innerHTML = `<div class="orb"></div>`

    const content = document.createElement("div")
    content.className = "msg typing"

    for (let i = 0; i < 3; i++) {
        const span = document.createElement("span")
        content.appendChild(span)
    }

    wrapper.appendChild(avatar)
    wrapper.appendChild(content)
    messagesContainer.appendChild(wrapper)
    scrollToBottom()
    return id;
}

function removeTypingIndicator(id) {
    const typing = document.getElementById(id)
    if (typing) typing.remove()
}

function handleKeyPress(e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight
}

function newChat() {
    currentChatId = null;
    messagesContainer.innerHTML = '';
    const wrapper = document.createElement("div")
    wrapper.className = `message-wrapper bot fade-in`
    const inner = document.createElement("div")
    inner.className = "message-inner"
    const avatar = document.createElement("div")
    avatar.className = `avatar bot`
    avatar.innerHTML = `<div class="orb"></div>`
    const content = document.createElement("div")
    content.className = `message-content bot`
    const welcomeText = "👋 Hello! I'm your AI assistant. How can I help you today?";
    content.innerHTML = `<p>${welcomeText}</p>`

    // Add copy button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        Copy
    `;
    copyBtn.onclick = () => copyToClipboard(welcomeText, copyBtn);

    inner.appendChild(avatar)
    inner.appendChild(content)
    inner.appendChild(copyBtn)
    wrapper.appendChild(inner)
    messagesContainer.appendChild(wrapper)

    userInput.value = ""
    userInput.focus()
    renderChatHistory();
}

// Show development mode indicator
if (isDevelopment) {
    console.log('%c🔧 Development Mode', 'background: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold');
    console.log('Using direct API calls. Deploy to Vercel for production serverless functions.');
}

// Initialize on page load
loadChatHistory();
