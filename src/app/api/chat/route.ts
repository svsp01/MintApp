import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/DataBase/dbConnect';
import { verifyToken } from '@/middle/verifyToken';
import { Client } from "@gradio/client";
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

// Function to fetch schema based on collection and userId
async function fetchUserSchema(userId: string): Promise<Record<string, any>> {
  const collections = ['transactions', 'users'];
  const schemas: Record<string, any> = {};

  try {
    for (const collectionName of collections) {
      const collection = mongoose.connection.collection(collectionName);
      const query = collectionName === 'transactions'
        ? { userId: new ObjectId(userId) }
        : { _id: new ObjectId(userId) };

      const sampleDocument = await collection.findOne(query);
      if (sampleDocument) {
        schemas[collectionName] = Object.keys(sampleDocument).reduce((acc, key) => {
          acc[key] = typeof sampleDocument[key];
          return acc;
        }, {} as Record<string, string>);
      }
    }
  } catch (error) {
    console.error('Error fetching schema:', error);
    throw new Error('Failed to fetch schema');
  }

  return schemas;
}

// Apply template to results
function applyTemplate(template: string, data: any): string {
  return template.replace(/{(\w+)}/g, (_, key) => {
    return data[key] || `{${key}}`;
  });
}

// Determine if the question is about general financial advice
function isGeneralFinancialAdvice(message: string): boolean {
  // Expanded list of keywords and phrases
  const financialKeywords = [
    'advice', 'tips', 'suggestions', 'recommendations', 'how to',
    'investment', 'financial', 'budget', 'savings', 'retirement',
    'loan', 'debt', 'income', 'expenses', 'tax', 'portfolio',
    'stocks', 'bonds', 'real estate', 'wealth', 'insurance',
    'credit', 'capital', 'fund', 'economic'
  ];

  // Convert message to lowercase for case-insensitive matching
  const lowerCaseMessage = message.toLowerCase();

  // Check for any of the keywords or phrases in the message
  return financialKeywords.some(keyword => lowerCaseMessage.includes(keyword));
}

// Main handler function
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Verify user token and get user ID
    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json({ reply: 'Unauthorized' }, { status: 401 });
    }

    // Get the message from the request
    const { message } = await request.json();
    if (!message) {
      return NextResponse.json({ reply: 'Message is required' }, { status: 400 });
    }

    // Fetch schema information
    const schemas = await fetchUserSchema(userId);

    // Determine if the message is related to general financial advice or specific data retrieval
    const generalAdvice = !isGeneralFinancialAdvice(message);

    const prompt = generalAdvice
      ? `
You are a Mint Financial Advisor. Provide a suitable response based on the schema provided below.

User message: "${message}"

Schemas:
\`\`\`json
${JSON.stringify(schemas, null, 2)}
\`\`\`

Please provide your response in the following format:
- Collection: Name of the collection that might contain the answer
- Template: A template string with placeholders corresponding to the keys in the schema. Use curly braces to denote placeholders.

Here are some examples:

1. **Example 1:**
   - **User message:** "What is my total spending for this month?"
   - **Collection:** transactions
   - **Template:** "Your total spending for this month is {totalSpending}."

2. **Example 2:**
   - **User message:** "How much did I spend on groceries last week?"
   - **Collection:** expenses
   - **Template:** "Your spending on groceries last week was {totalGroceriesSpending}."

3. **Example 3:**
   - **User message:** "What is my current savings balance?"
   - **Collection:** savings
   - **Template:** "Your current savings balance is {currentBalance}."

If the user's question does not pertain to finance, respond with: 
"I am a Mint Financial Advisor, and I only provide advice on financial matters. Please ask me a question related to finance."
  `
      : `You are a Mint Financial Advisor. You only respond to finance-related questions. If the user's question is related to finance, provide a suitable response based on the question provided below.

User message: "${message}"

Otherwise, respond with: "I am a Mint Financial Advisor, and I only provide advice on financial matters. Please ask me a question related to finance."`

    const client = await Client.connect("srikanthkaraka/chatbot-lama3.1");
    const aiResponse: any = await client.predict("/chat", { user_input: prompt });

    console.log(aiResponse, ">>>>")

    if (!aiResponse || !aiResponse.data[0]) {
      return NextResponse.json({ reply: 'AI response is invalid' }, { status: 500 });
    }

    const aiResult = aiResponse.data[0].trim();
    const collectionMatch = aiResult.match(/- \*?Collection:\s*([^\n]+)/i);
    const templateMatch = aiResult.match(/- \*?Template:\s*"([^"]*)"/i);
    console.log(collectionMatch, ">>>")
    console.log(templateMatch, ">>>")

    
    if (collectionMatch && templateMatch) {
      const collectionName = collectionMatch[1];
      const templateString = templateMatch[1];

      const collection = mongoose.connection.collection(collectionName);
      const query = collectionName === 'users'
        ? { _id: new ObjectId(userId) }
        : { userId: new ObjectId(userId) };

      const results = await collection.find(query).toArray();

      // Format results using the template string
      const formattedResults = results.map(result => applyTemplate(templateString, result)).join(', ');

      // Format results for the response
      const responseMessage = results.length > 0
        ? `Found ${results.length} record(s). Details: ${formattedResults}`
        : 'No data found.';

      return NextResponse.json({
        result: {
          type: 'data',
          time: new Date().toISOString(),
          data: [responseMessage],
          endpoint: '/chat',
          fn_index: 9
        }
      }, { status: 200 });
    } else {
      return NextResponse.json({
        result: aiResponse
      }, { status: 200 });
    }

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ reply: 'Failed to process message' }, { status: 500 });
  }
}
