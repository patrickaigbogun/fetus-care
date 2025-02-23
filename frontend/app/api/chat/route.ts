import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, model: 'meditron:7b' }),
    });

    if (!ollamaResponse.body) {
      return NextResponse.json({ error: 'No response body from Ollama' }, { status: 500 });
    }

    const reader = ollamaResponse.body.getReader();
    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          try {
            const json = JSON.parse(chunk);
            if (json.response) {
              controller.enqueue(new TextEncoder().encode(json.response));
            }
          } catch (e) {
            console.error('JSON parse error:', e);
          }
        }
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
