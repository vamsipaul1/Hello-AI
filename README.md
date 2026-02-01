# Hello AI 🤖

A beautiful, modern AI chat interface powered by Groq's LLaMA 3.3 70B model.

## Features ✨

- 💬 **Real-time Chat** - Smooth typing animations and instant responses
- 📝 **Chat History** - All conversations saved in localStorage
- 📋 **Copy Messages** - One-click copy for any message
- 🎨 **Premium UI** - Glassmorphism, gradients, and smooth animations
- 🌐 **Secure** - API keys hidden in serverless functions
- 📱 **Responsive** - Works on all devices

## Quick Start 🚀

### Deploy to Vercel (Recommended)

#### Option 1: Deploy Button
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vamsipaul1/Hello-AI)

#### Option 2: Manual Deployment

1. **Fork this repository**

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Import your forked repository

3. **Add Environment Variable:**
   - In Vercel project settings, go to "Environment Variables"
   - Add: `GROQ_API_KEY` = `your_groq_api_key_here`
   - Get your key from: [console.groq.com](https://console.groq.com)

4. **Deploy!** 🎉

#### Option 3: CLI Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

Then add your environment variable in Vercel dashboard.

## Local Development 💻

1. **Clone the repository:**
```bash
git clone https://github.com/vamsipaul1/Hello-AI.git
cd Hello-AI
```

2. **Install Vercel CLI:**
```bash
npm install -g vercel
```

3. **Create `.env` file:**
```bash
cp .env.example .env
```

4. **Add your API key to `.env`:**
```
GROQ_API_KEY=your_groq_api_key_here
```

5. **Run locally:**
```bash
vercel dev
```

6. **Open:** `http://localhost:3000`

## Getting a Groq API Key 🔑

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy and save it securely

## Project Structure 📁

```
Hello-AI/
├── api/
│   └── chat.js          # Serverless function for API calls
├── index.html           # Main HTML file
├── script.js            # Frontend JavaScript
├── vercel.json          # Vercel configuration
├── .env.example         # Environment variables template
└── .gitignore          # Git ignore rules
```

## Tech Stack 🛠️

- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend:** Vercel Serverless Functions
- **AI:** Groq API (LLaMA 3.3 70B)
- **Markdown:** Marked.js
- **Fonts:** Google Fonts (Inter, JetBrains Mono)

## Features in Detail 🎯

### Chat History
- Automatically saves all conversations
- Click any chat in sidebar to load it
- Sorted by most recent

### Copy Functionality
- Hover over any message to see copy button
- Visual feedback when copied
- Copies plain text (perfect for pasting)

### Premium Design
- Glassmorphism effects
- Smooth animations
- Gradient backgrounds
- Ambient lighting effects
- Custom glowing AI orb avatar

## Security 🔒

- API keys stored securely as environment variables
- Never exposed in client-side code
- Serverless functions handle all API calls
- GitHub secret scanning protection

## License 📄

MIT License - feel free to use for your own projects!

## Support 💬

If you have issues or questions, please open an issue on GitHub.

## Credits 👏

Built with ❤️ using:
- [Groq AI](https://groq.com)
- [Vercel](https://vercel.com)
- [Marked.js](https://marked.js.org)

---

Made with ✨ by [Your Name]
