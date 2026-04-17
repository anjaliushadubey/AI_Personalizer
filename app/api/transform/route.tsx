import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface PersonalizedContent {
  headline: string;
  subheadline: string;
  cta: string;
}

function validateResponse(data: unknown): data is PersonalizedContent {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.headline === 'string' &&
    typeof obj.subheadline === 'string' &&
    typeof obj.cta === 'string' &&
    obj.headline.length > 0 &&
    obj.subheadline.length > 0 &&
    obj.cta.length > 0
  );
}

async function fetchLandingPage(url: string): Promise<string> {
  try {
    const response = await fetch(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } catch (error) {
    throw new Error(`Failed to fetch landing page: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function enhanceLandingPage(html: string, personalized: PersonalizedContent): string {
  try {
    let enhanced = html;
    
    // Replace common heading patterns
    enhanced = enhanced.replace(/<h1[^>]*>.*?<\/h1>/i, `<h1>${personalized.headline}</h1>`);
    enhanced = enhanced.replace(/<h2[^>]*>.*?<\/h2>/i, `<h2>${personalized.subheadline}</h2>`);
    enhanced = enhanced.replace(/<h3[^>]*>.*?<\/h3>/i, `<h3>${personalized.headline}</h3>`);
    
    // Replace CTA buttons
    enhanced = enhanced.replace(
      /<button[^>]*>.*?<\/button>/gi,
      `<button>${personalized.cta}</button>`
    );
    enhanced = enhanced.replace(
      /<a[^>]*class="[^"]*btn[^"]*"[^>]*>.*?<\/a>/gi,
      `<a class="btn-primary">${personalized.cta}</a>`
    );
    
    // Replace common p tags with subheadline
    const pTags = enhanced.match(/<p[^>]*>.*?<\/p>/gi);
    if (pTags && pTags.length > 0) {
      enhanced = enhanced.replace(pTags[0], `<p>${personalized.subheadline}</p>`);
    }
    
    return enhanced;
  } catch {
    throw new Error('Failed to enhance landing page: Page structure not compatible');
  }
}

export async function POST(req: Request) {
  try {
    const { imageUrl, landingPageUrl } = await req.json();

    if (!imageUrl || !landingPageUrl) {
      return NextResponse.json(
        { error: "Missing imageUrl or landingPageUrl" },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Groq API key not configured. Set GROQ_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    // Generate CRO-optimized copy using Groq
    const copyPrompt = `You are a world-class Conversion Rate Optimization (CRO) expert and copywriter.

Generate personalized landing page copy for maximum conversions.
Ad/Image URL: ${imageUrl}
Landing Page URL: ${landingPageUrl}

Create compelling copy that converts visitors to customers.

Return ONLY a valid JSON object (no markdown, no extra text) with these exact fields:
{
  "headline": "compelling headline that grabs attention (max 100 chars)",
  "subheadline": "persuasive subheadline with value prop (max 100 chars)",
  "cta": "benefit-driven call-to-action button text (max 50 chars)"
}

Guidelines:
- Make it benefit-focused and urgency-driven
- Appeal to emotions while maintaining clarity
- Optimize for conversion, not just clicks
- Ensure each line is under the character limit`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: copyPrompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 500,
    });

    const rawContent = completion.choices[0]?.message?.content || '';

    if (!rawContent) {
      return NextResponse.json(
        { error: "Failed to generate copy from Groq" },
        { status: 500 }
      );
    }

    // Parse JSON response
    let jsonString = rawContent;
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }

    const personalized = JSON.parse(jsonString);

    if (!validateResponse(personalized)) {
      return NextResponse.json(
        { error: "Invalid response format from Groq" },
        { status: 500 }
      );
    }

    // Fetch and Enhance the landing page
    let enhancedHtml = "";
    try {
      const landingPageHtml = await fetchLandingPage(landingPageUrl);
      enhancedHtml = enhanceLandingPage(landingPageHtml, personalized);
    } catch (error) {
      console.warn('Landing page enhancement skipped:', error instanceof Error ? error.message : 'Unknown error');
    }

    return NextResponse.json({
      personalized,
      enhancedHtml,
      adHook: "Powered by Groq AI - 100% Free",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Processing failed: ${message}` },
      { status: 500 }
    );
  }
}
