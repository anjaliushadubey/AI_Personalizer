# Troopod AI Personalizer - Quick Start Guide

## What It Does

Troopod AI Personalizer automatically aligns your landing pages to match ad creatives using AI and CRO principles. Input an ad image and landing page URL, and get A/B test-ready personalized copy + enhanced page preview.

## How to Use

### 1. **Start the App**
```bash
npm install        # First time only
npm run dev        # Start development server
```
Access at `http://localhost:3000`

### 2. **Use the Interface**

**Input Fields:**
- **Landing Page URL**: The page you want to personalize (e.g., `https://example.com`)
- **Ad Image URL**: Link to the ad creative (e.g., `https://example.com/ad.jpg`)

**Output:**
1. 🎯 **Personalized Copy** - AI-generated headline, subheadline, and CTA
2. 📄 **Enhanced Page Preview** - Your landing page with proposed changes
3. 🔍 **Ad Analysis** - What the AI detected in the ad

### 3. **Example Testing**

**Test URL**: Any public landing page
```
https://www.example.com
```

**Test Ad Image**: Public image URL
```
https://images.unsplash.com/photo-...
```

## Setup Requirements

### Environment Variables

Create a `.env.local` file:
```
GROQ_API_KEY=gsk_your-groq-api-key-here
```

Get your API key from [Groq Console](https://console.groq.com/keys)

### Dependencies
- Node.js 18+
- npm or yarn

## Files Overview

```
troopod-ai-pm/
├── app/
│   ├── page.tsx                 # Main UI component
│   ├── api/
│   │   └── transform/
│   │       └── route.tsx        # API endpoint for personalization
│   ├── layout.tsx               # React layout wrapper
│   └── globals.css              # Tailwind styles
├── SYSTEM_ARCHITECTURE.md       # Detailed technical documentation
├── package.json                 # Dependencies
└── README.md                    # This file
```

## Key Features

✅ **Vision AI Analysis** - Extracts ad hooks and value props from images
✅ **CRO Agent** - Generates conversion-optimized copy
✅ **Real Landing Page Enhancement** - Modifies actual HTML with AI suggestions
✅ **Error Resilience** - Handles broken URLs, invalid inputs gracefully
✅ **Type-Safe** - Full TypeScript for reliability
✅ **Responsive UI** - Works on desktop and mobile

## API Documentation

### POST `/api/transform`

**Request:**
```json
{
  "imageUrl": "https://example.com/ad.jpg",
  "landingPageUrl": "https://example.com"
}
```

**Response (Success):**
```json
{
  "personalized": {
    "headline": "AI-generated headline",
    "subheadline": "Value proposition",
    "cta": "Call to action button text"
  },
  "enhancedHtml": "<html>...</html>",
  "adHook": "Analysis of what the ad communicates"
}
```

**Response (Error):**
```json
{
  "error": "Descriptive error message"
}
```

## Troubleshooting

**Problem**: `OPENAI_API_KEY not set`
- **Solution**: Add `.env.local` file with your API key

**Problem**: `Failed to fetch landing page`
- **Solution**: Ensure URL is public and accessible (not behind login)

**Problem**: `Invalid response format from AI`
- **Solution**: Usually temporary; try again. AI sometimes returns malformed JSON

**Problem**: Server not reloading changes
- **Solution**: 
  ```bash
  Ctrl+C  # Stop server
  npm run dev  # Restart
  ```

## Building for Production

```bash
npm run build        # Creates optimized production build
npm start            # Runs production server
```

Deploy to Vercel (recommended):
```bash
vercel deploy
```

## Testing Recommendations

### Happy Path
1. Go to typical SaaS landing page (e.g. notion.com/home)
2. Use a clear ad image (ad.jpg from a successful campaign)
3. Click "Generate Personalized Page"
4. Verify you get copy + enhanced page preview

### Edge Cases
- Try non-existent URL (should still show copy)
- Try broken image URL (should show error gracefully)
- Try pages with unusual HTML structure
- Test on mobile browser

## Performance

- **Ad Analysis**: ~2-3 seconds (Vision API)
- **Copy Generation**: ~2-3 seconds (GPT-4)  
- **Landing Page Fetch**: ~1-2 seconds
- **Total**: ~5-8 seconds typical

## Support & Questions

📧 Contact: nj@troopod.io
📋 Documentation: See `SYSTEM_ARCHITECTURE.md` for detailed technical specs

---

**Version**: 1.0
**Last Updated**: April 17, 2026
**Status**: ✅ Ready for Production
