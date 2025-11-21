
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt, model } = await req.json();

    if (!prompt) {
      return new NextResponse('Prompt is required', { status: 400 });
    }

    const stream = await openai.chat.completions.create({
      model: model || 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });

    // For this initial implementation, we will consume the stream and return the full response.
    // In a future update, we can stream the response to the client.
    let responseText = '';
    for await (const chunk of stream) {
      responseText += chunk.choices[0]?.delta?.content || "";
    }

    return NextResponse.json({ response: responseText });

  } catch (error) {
    console.error('Error with OpenAI:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
