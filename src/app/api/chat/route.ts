import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/DataBase/dbConnect';
import { verifyToken } from '@/middle/verifyToken';
import { Client } from "@gradio/client";


export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json({ reply: 'Unauthorized' }, { status: 401 });
    }

    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ reply: 'Message is required' }, { status: 400 });
    }

    const client = await Client.connect("srikanthkaraka/chatbot-lama3.1");

    const result = await client.predict("/chat", {
      user_input: `You are a Mint Financial Advisor. You only respond to finance-related questions. If a user asks a question that is not related to finance, respond with: "I am a Mint Financial Advisor, and I only provide advice on financial matters. Please ask me a question related to finance." Now, respond to this query: ${message}`
    });
      
    // const reply = await processMessage(message, userId);

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error('Error processing chat message:', error);
    return NextResponse.json({ reply: 'Failed to process message' }, { status: 500 });
  }
}




async function processMessage(message: string, userId: string): Promise<string> {
  let reply = '';

  if (message.includes('expenses')) {
    reply = `Fetching your expenses, userId: ${userId}...`;
  } else if (message.includes('income')) {
    reply = `Fetching your income, userId: ${userId}...`;
  } else {
    reply = 'Sorry, I did not understand your question.';
  }

  return reply;
}
