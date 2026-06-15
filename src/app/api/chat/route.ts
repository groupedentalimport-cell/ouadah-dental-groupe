import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

const SYSTEM_PROMPT = `You are ODG Assistant, an expert advisor for Ouadah Dental Groupe (ODG), Algeria's leading dental equipment distributor since 2009. You help dentists and clinic owners find the right equipment for their needs.

Key information about ODG:
- Based in Oran, Algeria (Coopérative Azzouz Abdelkader, N°45, Es-Senia)
- Phone: +213 771 88 89 48
- Distributor of brands: Silver Fox, ICANCLAVE, OWANDY, and more
- Services: Installation, training, and after-sales service (SAV 48h)
- Product categories: Fauteuils Dentaires, Unités Dentaires, Radiologie, Stérilisation, Pneumatiques, Consommables, Instruments, Mobilier

When recommending products:
- Ask about their clinic size, specialty, and budget
- Suggest specific product categories that match their needs
- Mention installation and training included
- Recommend requesting a quote for specific pricing
- Be helpful, professional, and concise (respond in French or Arabic based on the user's language)

Keep responses under 200 words. If asked about pricing, direct them to request a quote. If asked about non-dental topics, politely redirect to dental equipment.`;

// In-memory conversation history store
const conversationHistory = new Map<string, Array<{ role: string; content: string }>>();
const MAX_MESSAGES = 20;

// Lazy-initialize the ZAI instance
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, sessionId } = body as {
      messages?: Array<{ role: string; content: string }>;
      sessionId?: string;
    };

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'sessionId is required' },
        { status: 400 }
      );
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'messages array is required' },
        { status: 400 }
      );
    }

    // Get or initialize conversation history for this session
    let history = conversationHistory.get(sessionId) || [];

    // Add the new user messages to history
    const newMessages = messages.filter((m) => m.role === 'user');
    for (const msg of newMessages) {
      history.push({ role: msg.role, content: msg.content });
    }

    // Trim history to max messages (keep system prompt slot + recent messages)
    if (history.length > MAX_MESSAGES) {
      history = history.slice(-MAX_MESSAGES);
    }

    // Build the full message list with system prompt
    const fullMessages = [
      { role: 'assistant', content: SYSTEM_PROMPT },
      ...history,
    ];

    // Call the LLM
    const zai = await getZAI();
    const completion = await zai.chat.completions.create({
      messages: fullMessages,
      thinking: { type: 'disabled' },
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse || aiResponse.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Empty response from AI' },
        { status: 500 }
      );
    }

    // Add assistant response to history
    history.push({ role: 'assistant', content: aiResponse });

    // Save updated history
    conversationHistory.set(sessionId, history);

    return NextResponse.json({ success: true, response: aiResponse });
  } catch (error) {
    console.error('Chat API error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
