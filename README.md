# 🚀 Troopod AI Personalizer

<div align="center">

**Align your landing page to any ad creative instantly.**

Convert higher with AI-powered personalized landing pages that match your ad copy along with instant landing page preview enhancement.

![Troopod AI Personalizer Demo](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop)

[📖 Documentation](#documentation) • [🎯 Features](#features) • [⚡ Quick Start](#quick-start) • [🔗 GitHub](https://github.com/anjaliushadubey/AI_Personalizer)

</div>

---

## ✨ Features

- 🤖 **AI-Powered Copy Generation** – Generate conversion-optimized headlines, subheadlines, and CTAs using Groq's `llama-3.3-70b-versatile` model
- 🎨 **Landing Page Enhancement** – Automatically inject personalized copy into your landing page HTML in real-time
- 📱 **Live Preview** – See your enhanced landing page with personalized copy instantly in an embedded iframe
- ⚡ **Lightning Fast** – Powered by Groq's edge infrastructure for near-instantaneous responses
- 🔒 **Privacy Focused** – Your landing page data stays secure; no external tracking
- 💰 **Free Tier Ready** – Works with Groq's free API tier (100 requests/day)

---

## 🎯 How It Works

1. **Input**: Provide a landing page URL and ad image URL
2. **AI Processing**: Groq analyzes the content and generates CRO-optimized copy
3. **Enhancement**: Personalized copy is injected into your landing page
4. **Preview**: See the transformed page in real-time with an interactive iframe

```
Ad Creative + Landing Page URL → Groq AI → Personalized Copy + Enhanced HTML Preview
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Groq API Key (free at [console.groq.com](https://console.groq.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/anjaliushadubey/AI_Personalizer.git
cd AI_Personalizer

# Install dependencies
npm install

# Add your Groq API key
echo "GROQ_API_KEY=your_api_key_here" > .env.local
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser and start personalizing!

---

## 📖 Documentation

For detailed documentation, see:
- **[QUICKSTART.md](./QUICKSTART.md)** – Setup and usage guide
- **[SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md)** – Technical architecture and design decisions
- **[COMPLETION_CHECKLIST.md](./COMPLETION_CHECKLIST.md)** – Feature checklist

---

## 🛠️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | React-based framework with API routes |
| **React 19** | Dynamic UI and component management |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Responsive, modern styling |
| **Groq SDK** | AI API integration for LLM calls |
| **Vercel** | Production deployment |

---

## 📊 API Endpoint

### POST `/api/transform`

**Request:**
```json
{
  "imageUrl": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
  "landingPageUrl": "https://www.notion.so"
}
```

**Response:**
```json
{
  "personalized": {
    "headline": "Notion: The All-in-One Workspace for Modern Teams",
    "subheadline": "One tool for docs, databases, and collaboration",
    "cta": "Start Your Free Workspace Today"
  },
  "enhancedHtml": "<html>...</html>",
  "adHook": "Powered by Groq AI"
}
```

---

## 🧪 Test Examples

Try these combinations to see the personalizer in action:

| Landing Page | Ad Image |
|--------------|----------|
| [Notion](https://www.notion.so) | [Photo 1](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800) |
| [Figma](https://www.figma.com) | [Photo 2](https://images.unsplash.com/photo-1552664730-d307ca884978?w=800) |
| [GitHub](https://www.github.com) | [Photo 3](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800) |
| [Asana](https://www.asana.com) | [Photo 4](https://images.unsplash.com/photo-1611537773850-be5fb819ba57?w=800) |

---

## 🤖 AI Model

- **Model**: `llama-3.3-70b-versatile` (Meta Llama 3.3 70B)
- **Provider**: Groq Cloud
- **Speed**: ~280 tokens/second
- **Context Window**: 131,072 tokens
- **Max Output**: 32,768 tokens

---

## 📈 Performance

- **API Response Time**: 2-5 seconds (real Groq API)
- **Frontend Load**: < 1 second
- **Daily Limit**: 100 requests (free tier)

---

## 🔐 Environment Variables

```bash
GROQ_API_KEY=your_groq_api_key
```

Get your free API key at [console.groq.com](https://console.groq.com/keys)

---

## 📦 Project Structure

```
troopod-ai-pm/
├── app/
│   ├── page.tsx                 # Frontend React UI
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Global styles
│   └── api/
│       └── transform/
│           └── route.tsx        # AI transformation API
├── public/                      # Static assets
├── .env.local                   # Environment variables
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── next.config.ts              # Next.js config
└── README.md                   # This file
```

---

## 🚀 Deployment

### Deploy on Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# Deploy from Vercel Dashboard
# https://vercel.com/new
```

The app is production-ready and fully compatible with Vercel's edge networking.

---

## 💡 Use Cases

- **E-commerce**: Personalize product pages for different ad campaigns
- **SaaS**: Match landing page copy to campaign messaging
- **Agencies**: Scale personalization across multiple client campaigns
- **A/B Testing**: Generate variations for testing and optimization
- **Rapid Iteration**: Instantly change messaging without design revisions

---

## 🤝 Contributing

Contributions welcome! Please feel free to submit PRs or open issues.

---

## 📄 License

MIT License – feel free to use this for personal or commercial projects.

---

## 📞 Support

- **GitHub Issues**: [Report bugs](https://github.com/anjaliushadubey/AI_Personalizer/issues)
- **Documentation**: See [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md)
- **Groq Docs**: [console.groq.com/docs](https://console.groq.com/docs)

---

<div align="center">

**Built with ❤️ using Groq AI**

[Star this repo ⭐](https://github.com/anjaliushadubey/AI_Personalizer) if you find it useful!

</div>
