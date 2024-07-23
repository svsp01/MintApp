

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/DataBase/dbConnect';
import { verifyToken } from '@/middle/verifyToken';
import { getAllCollectionNames } from '@/DataBase/queryCollection';
import OpenAI from 'openai';
import mongoose from 'mongoose';
import path from 'path';
import { promises as fs } from 'fs';


const openai = new OpenAI({
});
// Function to dynamically import and register all models
async function registerModels() {
  const modelPath = path.join(process.cwd(), 'src', 'models');
  const registeredModels = [];
  try {
    const files = await fs.readdir(modelPath);
    for (const file of files) {
      if (file.endsWith('.js') || file.endsWith('.ts')) {
        const modelName = path.parse(file).name;
        try {
          await import(`@/models/${modelName}`);
          console.log(`Model ${modelName} registered successfully`);
          registeredModels.push(modelName);
        } catch (error) {
          console.error(`Error registering model ${modelName}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Error reading models directory:', error);
  }
  return registeredModels;
}


// Call registerModels at the module level
registerModels().catch(console.error);
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const registeredModels = await registerModels();
    console.log("Registered models:", registeredModels);

    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json({ reply: 'Unauthorized' }, { status: 401 });
    }

    const { message } = await request.json();
    if (!message) {
      return NextResponse.json({ reply: 'Message is required' }, { status: 400 });
    }

    const reply = await processMessage(message, userId);
    return NextResponse.json({ reply }, { status: 200 });
  } catch (error) {
    console.error('Error processing chat message:', error);
    return NextResponse.json({ reply: 'An error occurred while processing your request. Please try again later.' }, { status: 500 });
  }
}


async function processMessage(message: string, userId: string): Promise<string> {
  try {
    const schema = await getDBSchemaWithSampleData();
    console.log(schema, ">>>>>>>>>")
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {role: "system", content: `You are an AI assistant that generates MongoDB queries based on natural language questions. Use the following schema with sample data:\n${JSON.stringify(schema, null, 2)}\n\nRespond with a JSON object containing:
        1. collection: the name of the collection to query
        2. operation: the type of operation (find, aggregate, count)
        3. query: the MongoDB query object
        4. options: any additional options like sort or limit
        5. explanation: a brief explanation of what the query does`},
        {role: "user", content: message}
      ],
    });

    const queryPlan = JSON.parse(`${response.choices[0].message.content}`);
    console.log("Generated query plan:", queryPlan);

    return await executeQuery(queryPlan, userId);
  } catch (error) {
    console.error('Error in processMessage:', error);
    return 'I apologize, but I encountered an error while processing your request. Could you please rephrase your question or try again later?';
  }
}

async function getDBSchemaWithSampleData() {
  try {
    const collectionNames = await getAllCollectionNames();
    console.log("Collection names retrieved:", collectionNames);
    const schema:any = {};

    for (const collectionName of collectionNames) {
      try {
        console.log(`Processing collection: ${collectionName}`);
        if (mongoose.models[collectionName]) {
          const model = mongoose.models[collectionName];
          console.log(`Model found for ${collectionName}`);
          const paths = model.schema.paths;
          console.log(`Paths for ${collectionName}:`, Object.keys(paths));
          
          const sampleData:any = {};
          for (const [key, value] of Object.entries(paths)) {
            sampleData[key] = generateSampleData(value);
          }

          schema[collectionName] = {
            fields: Object.keys(paths),
            sampleDocument: sampleData
          };
          console.log(`Schema for ${collectionName} added:`, schema[collectionName]);
        } else {
          console.warn(`Model for collection ${collectionName} not found in mongoose.models`);
        }
      } catch (modelError) {
        console.error(`Error processing model for collection ${collectionName}:`, modelError);
      }
    }

    console.log("Final schema object:", schema);
    return schema;
  } catch (error) {
    console.error('Error in getDBSchemaWithSampleData:', error);
    throw new Error('Failed to retrieve database schema');
  }
}




function generateSampleData(schemaType: any): any {
  try {
    switch (schemaType.instance) {
      case 'String':
        return 'Sample String';
      case 'Number':
        return 123;
      case 'Date':
        return new Date().toISOString();
      case 'Boolean':
        return true;
      case 'ObjectID':
        return new mongoose.Types.ObjectId().toString();
      case 'Array':
        return schemaType.caster ? [generateSampleData(schemaType.caster)] : ['Sample Array Item'];
      case 'Map':
      case 'Object':
        const nestedSample: Record<string, any> = {};
        if (schemaType.schema && schemaType.schema.paths) {
          for (const [key, value] of Object.entries(schemaType.schema.paths)) {
            nestedSample[key] = generateSampleData(value);
          }
        }
        return nestedSample;
      default:
        return null;
    }
  } catch (error) {
    console.error('Error in generateSampleData:', error);
    return 'Sample Data';
  }
}

async function executeQuery(queryPlan: any, userId: string): Promise<string> {
  try {
    const { collection, operation, query, options, explanation } = queryPlan;
    
    // Ensure userId is part of the query for security
    query.userId = userId;

    let model;
    try {
      model = mongoose.models[collection] || mongoose.model(collection);
    } catch (modelError) {
      console.error(`Error getting model for collection ${collection}:`, modelError);
      return `I'm sorry, but I couldn't find the requested data collection. Could you please check the collection name and try again?`;
    }

    let result;

    switch (operation) {
      case 'find':
        result = await model.find(query, null, options).exec();
        break;
      case 'aggregate':
        // Add $match stage to ensure userId filter
        const pipeline = [{ $match: { userId } }, ...query];
        result = await model.aggregate(pipeline).exec();
        break;
      case 'count':
        result = await model.countDocuments(query).exec();
        break;
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }

    // Format the result into a readable string, but limit the amount of data returned
    let formattedResult = '';
    if (Array.isArray(result)) {
      formattedResult = `Found ${result.length} documents. Here are up to 5 results: ` + 
        result.slice(0, 5).map(doc => JSON.stringify(doc)).join(', ');
    } else {
      formattedResult = JSON.stringify(result);
    }

    return `${explanation}\n\nResult: ${formattedResult}`;
  } catch (error) {
    console.error('Error in executeQuery:', error);
    return 'I apologize, but I encountered an error while trying to retrieve the information. Could you please try rephrasing your question?';
  }
}
