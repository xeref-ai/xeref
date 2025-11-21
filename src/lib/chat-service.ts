
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { enhancePrompt } from '@/ai/flows/enhance-prompt';

export interface Message {
  id?: string;
  text: string;
  sender: 'user' | 'bot';
  createdAt: Date;
  model?: string;
}

export const getMessages = (callback: (messages: Message[]) => void) => {
  const q = query(collection(db, "messages"), orderBy("createdAt"));
  return onSnapshot(q, (querySnapshot) => {
    const messages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
    callback(messages);
  });
};

export const sendMessage = async (message: Message, useEnhancer: boolean) => {
  if (useEnhancer) {
    message.text = await enhancePrompt(message.text);
  }

  let endpoint = '/api/chat/vertex';
  if (message.model?.startsWith('GPT')) {
    endpoint = '/api/chat/openai';
  } else if (message.model === 'Gemini CLI') {
    endpoint = '/api/chat/gemini-cli';
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt: message.text, model: message.model }),
  });

  const { response: responseText } = await response.json();
  const botMessage: Message = {
    text: responseText,
    sender: 'bot',
    createdAt: new Date(),
    model: message.model,
  };
  await addDoc(collection(db, "messages"), botMessage);

  await addDoc(collection(db, "messages"), message);
};
