
import { NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';

let vertex_ai: VertexAI | null = null;
let generativeModel: any = null;

function getModel() {
  if (!vertex_ai) {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || process.env.GCP_PROJECT_ID;
    const location = process.env.GOOGLE_CLOUD_LOCATION || process.env.GCP_LOCATION || 'us-central1';

    if (!projectId) {
      throw new Error("Google Cloud Project ID is not set.");
    }

    vertex_ai = new VertexAI({
      project: projectId,
      location: location,
    });

    generativeModel = vertex_ai.getGenerativeModel({
      model: 'gemini-1.5-flash-001',
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 1,
        topP: 0.95,
      },
    });
  }
  return generativeModel;
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new NextResponse('Prompt is required', { status: 400 });
    }

    const model = getModel();
    const chat = model.startChat({});
    const streamResult = await chat.sendMessageStream(prompt);

    // For this initial implementation, we will consume the stream and return the full response.
    // In a future update, we can stream the response to the client.
    let responseText = '';
    for await (const item of streamResult.stream) {
      if (item.candidates && item.candidates[0].content && item.candidates[0].content.parts) {
        responseText += item.candidates[0].content.parts.map((part: any) => part.text).join('');
      }
    }

    return NextResponse.json({ response: responseText });

  } catch (error: any) {
    console.error('Error with Vertex AI:', error);
    return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
  }
}
