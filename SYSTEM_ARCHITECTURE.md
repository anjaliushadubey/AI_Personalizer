# Troopod AI PM - System Architecture & Design

## Overview
Troopod AI Personalizer is an AI-powered workflow that automatically aligns existing landing pages to ad creatives using CRO (Conversion Rate Optimization) principles. The system analyzes ad visuals and generates personalized copy that matches the emotional hook and value proposition.

---

## System Flow

### 1. **User Input Stage**
```
User Interface (Frontend)
  ↓
[Input 1] Landing Page URL
[Input 2] Ad Image URL (link or file)
  ↓
Submit Request
```

### 2. **Ad Analysis Agent (Vision AI)**
```
Frontend → API Endpoint
  ↓
OpenAI Vision Model (GPT-4o)
  ↓
Extract:
  - Emotional hooks (aspirations, pain points)
  - Main offer/value proposition
  - Target audience signals
  - Visual tone & messaging
  ↓
Output: Ad Hook Summary
```

### 3. **CRO Agent (Copy Generation)**
```
Ad Hook + Landing Page URL
  ↓
OpenAI GPT-4o (With system prompt)
  ↓
Generate JSON with:
  - Headline (optimized for ad hook alignment)
  - Subheadline (value prop + urgency)
  - CTA (benefit-driven call-to-action)
  ↓
Validation → Response Quality Check
```

### 4. **Landing Page Enhancement**
```
Fetch existing landing page HTML
  ↓
Parse DOM structure
  ↓
Replace key elements:
  - <h1>, <h2>, <h3> tags → AI headlines
  - CTA buttons → AI-generated CTAs
  - First <p> tag → AI subheadline
  ↓
Return enhanced HTML for preview
```

### 5. **Output & Preview**
```
Display:
  [1] AI-Generated Copy
  [2] Enhanced Landing Page Preview (iframe)
  [3] Ad Analysis Summary
  ↓
User can implement changes on their live page
```

---

## Key Components & Architecture

### **Frontend** (`app/page.tsx`)
- **Input Validation**: Ensures URLs and image sources are provided
- **Error Handling**: Displays user-friendly error messages
- **State Management**: Tracks loading, data, and error states
- **Preview Rendering**: Shows personalized copy + enhanced HTML (iframe)
- **UI Components**: Icons, gradients, animations for professional look

### **Backend API** (`app/api/transform/route.tsx`)

#### **Core Functions:**
1. **`validateResponse()`** - Type guard ensuring AI returns valid JSON
2. **`fetchLandingPage()`** - Safely retrieves HTML with timeout & error handling
3. **`enhanceLandingPage()`** - DOM replacement using regex patterns

#### **Request Flow:**
```typescript
POST /api/transform
└─ Input: { imageUrl, landingPageUrl }
└─ Process:
   ├─ Analyze ad (OpenAI Vision)
   ├─ Generate optimized copy (OpenAI GPT-4o)
   ├─ Validate response format
   ├─ Fetch landing page HTML
   ├─ Enhance with personalized copy
   └─ Return complete response
└─ Output: { personalized, enhancedHtml, adHook }
```

---

## Handling Edge Cases & Robustness

### **1. Hallucinations & Invalid Responses**

**Problem**: AI may generate invalid JSON, missing fields, or nonsensical content

**Solution**:
```typescript
function validateResponse(data) {
  Check for:
  - Valid JSON structure
  - All required fields present
  - Fields are strings (not null/undefined)
  - Content length validation (>0 chars)
  - Return type-safe boolean
}
```

**Action**: Reject response and return 500 error with clear message

### **2. Broken/Inaccessible Landing Pages**

**Problem**: URL doesn't exist, returns 404, or times out

**Solution**:
```typescript
async function fetchLandingPage(url) {
  - Set 5s timeout (prevent hanging)
  - Check HTTP status (200-299 range)
  - Try/catch with detailed error messages
  - Return meaningful error to user
}
```

**User Experience**: 
- Show personalized copy anyway (still useful)
- Inform user landing page couldn't be fetched
- Suggest manual implementation option

### **3. HTML Structure Inconsistencies**

**Problem**: No `<h1>` tags, irregular structure, malformed HTML

**Solution**:
```
Enhanced via regex patterns targeting:
  - Multiple heading levels (<h1>, <h2>, <h3>)
  - Button classes ("btn", "cta", "action")
  - Multiple CTA patterns
  - Fallback to <p> tags if headings missing
```

**Graceful Degradation**: 
- Replace what's found, skip what's missing
- Return both copy + enhanced HTML where possible
- Never crash, always return actionable output

### **4. Input Validation & Security**

**Problem**: Invalid URLs, malicious inputs, injection attacks

**Solution**:
```
- Require both inputs before processing
- Validate URL format (basic check)
- User-Agent header for fetch requests
- Escape all user inputs
- No direct command execution
```

### **5. Random/Inconsistent Outputs**

**Problem**: Same input produces different results (temperature randomness)

**Solution**:
```typescript
// Prompt engineering to ensure consistency
System prompt: "Return JSON with exactly..."
Response format: { type: "json_object" } (strict format)
Character limits: Keep all content <100 chars (predictable)
```

**Note**: Some variation is expected & beneficial (A/B testing potential)

### **6. Broken UI / Rendering Issues**

**Problem**: Enhanced HTML contains invalid syntax, crashes iframe

**Solution**:
```
- Try/catch wrapper around enhancement
- Return original on enhancement failure
- Iframe sandbox prevents page crashes
- Fallback text when preview unavailable
```

---

## Error Handling Strategy

| Error Type | User Message | Backend Action |
|---|---|---|
| No input | "Please enter both URLs" | Early validation |
| Invalid URL | "Failed to fetch landing page" | HTTP error catch |
| API timeout | "Processing failed: Timeout" | 5s limit enforced |
| Invalid AI response | "Invalid response format from AI" | Type validation |
| Network error | "Connection error" | Try/catch network |
| Missing ad analysis | "Failed to analyze ad" | Check content null |

---

## AI Prompt Engineering

### **Ad Analysis Prompt**
```
"Identify the emotional hook and main offer in this ad. Be concise."
→ Forces concise analysis, avoids hallucinations
→ Focuses on key elements only
```

### **CRO Agent Prompt**
```
"You are a CRO expert. Return JSON with exactly: 
{
  "headline": "string",
  "subheadline": "string", 
  "cta": "string"
}
Keep all under 100 chars. Align landing page to ad hook."
→ Strict format requirement
→ Character limits for realism
→ Context: alignment with ad
→ Role clarity: CRO expert
```

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS | UI/UX & state management |
| **Backend** | Next.js 16 API Routes, TypeScript | Serverless API |
| **AI** | OpenAI GPT-4o + Vision | Copy generation & image analysis |
| **Infrastructure** | Vercel (deployment ready) | Hosting & edge functions |

---

## Assumptions & Limitations

✅ **What We Assume**:
- Users have valid, accessible URLs
- Ad images are clear and publicly accessible
- Landing pages have standard HTML structure
- OpenAI API key is configured

⚠️ **Known Limitations**:
- Only updates straightforward text elements (not JS-rendered content)
- Single-language support (English)
- No database persistence (stateless)
- Image analysis limited to what GPT-4 Vision can see

💡 **Future Improvements**:
- Multi-language support
- Database to store results & A/B test results
- Client-side image upload instead of URL
- More sophisticated DOM parsing
- Batch processing for multiple pages
- Analytics dashboard

---

## Deployment

The app is designed to run on Vercel or any Node.js environment:

```bash
npm install
npm run dev          # Local development
npm run build        # Production build
npm start            # Production start
```

**Environment Variables Required**:
```
OPENAI_API_KEY=your_key_here
```

---

## Testing Recommendations

1. **Happy Path**: Valid URLs + accessible ad image
2. **Error Cases**: 404 URLs, invalid images, timeouts
3. **Edge Cases**: Pages with no headings, complex HTML
4. **Consistency**: Run same input 3x, verify reasonable variation
5. **Performance**: Measure API response times, optimize timeouts

---

**Last Updated**: April 17, 2026
**Version**: 1.0
**Author**: Troopod AI PM
