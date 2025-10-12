
import { VertexAI } from '@google-cloud/vertexai';
import { GoogleAuth } from 'google-auth-library';

// This is the correct, centralized way to initialize the Vertex AI client.
// It will use Application Default Credentials (ADC) in production and your
// local `gcloud` credentials during development.
const getVertexAIClient = () => {
  // Check if we're in a server-side environment
  if (typeof window === 'undefined') {
    const project = process.env.GCP_PROJECT_ID || 'xerefai-prod';
    const location = process.env.GCP_LOCATION || 'us-central1';
    
    return new VertexAI({ project, location });
  }
  return null; // Return null on the client-side to prevent errors
};

// Singleton instance for the server-side
export const vertexAI = getVertexAIClient();

// Placeholder for any other AI-related exports.
// This structure allows you to expand with other models or clients in the future.
export const ai = {
  getGenerativeModel: (modelName: string) => {
    if (!vertexAI) {
      throw new Error("Vertex AI client is not available on the client-side.");
    }
    return vertexAI.getGenerativeModel({ model: modelName });
  }
};

// Deprecated placeholder, kept for compatibility until all imports are updated.
export const genAI = {};
