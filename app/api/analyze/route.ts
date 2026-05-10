import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;

    if (!image) return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    if (image.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'Image too large (max 10MB)' }, { status: 400 });

    const bytes = await image.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const mediaType = image.type as 'image/jpeg' | 'image/png' | 'image/webp';

    const response = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:${mediaType};base64,${base64}` }
            },
            {
              type: 'text',
              text: `You are a senior frontend architect and design systems expert.

Analyze this UI screenshot with extreme care. Your job is to reverse-engineer the component structure.

INSTRUCTIONS:
1. Identify every distinct UI component, section, and pattern
2. Detect repeated elements (e.g. 4 identical product cards = count: 4, NOT Card1/Card2/Card3/Card4)
3. Create semantic PascalCase names (PricingCard not Box1, SidebarNav not Nav, HeroSection not Section)
4. Infer layout type for each: flex-row | flex-col | grid | stack | inline | absolute
5. Extract design tokens: dominant colors (hex), font size scale, spacing scale, border-radius, shadows
6. Write a 2-3 sentence explanation of why you structured it this way
7. List all repeated patterns you detected

Return ONLY valid JSON (no markdown, no backticks, no explanation outside the JSON):

{
  "tree": {
    "name": "Page",
    "layout": "flex-col",
    "count": 1,
    "description": "Root page wrapper",
    "children": [
      {
        "name": "Navbar",
        "layout": "flex-row",
        "count": 1,
        "description": "Top navigation with logo, links, and CTA",
        "children": [
          { "name": "Logo", "layout": "flex-row", "count": 1, "description": "Brand logo mark and wordmark", "children": [] },
          { "name": "NavLinks", "layout": "flex-row", "count": 1, "description": "Primary navigation links", "children": [] },
          { "name": "CTAButton", "layout": "inline", "count": 1, "description": "Primary call-to-action button", "children": [] }
        ]
      }
    ]
  },
  "tokens": {
    "colors": [
      { "name": "Primary", "hex": "#6366F1", "usage": "buttons, links, accents" },
      { "name": "Background", "hex": "#FFFFFF", "usage": "page background" }
    ],
    "fontSizes": ["12px", "14px", "16px", "24px", "36px"],
    "spacing": ["4px", "8px", "16px", "24px", "48px"],
    "borderRadius": ["4px", "8px", "12px"],
    "shadows": ["0 1px 3px rgba(0,0,0,0.1)"]
  },
  "explanation": "The page follows a standard marketing layout with a sticky navbar, hero section, and feature grid. The 3 feature cards were grouped as FeatureCard × 3 because they share identical padding, typography scale, and icon+title+description structure. The pricing section uses a two-column layout with a highlighted card indicating a recommended tier.",
  "componentCount": 14,
  "repeatedPatterns": ["FeatureCard × 3", "NavLink × 5", "TestimonialCard × 2"]
}`
            }
          ]
        }
      ]
    });

    const raw = response.choices[0]?.message?.content || '';

    // Clean and parse — Groq sometimes wraps in markdown
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No valid JSON in response');

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Analysis failed';
    console.error('Analysis error:', err);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export const maxDuration = 60; // Vercel: allow up to 60s for vision
