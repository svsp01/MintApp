import dbConnect from '@/DataBase/dbConnect';
import CategoryModel from '@/models/Category';
import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/middle/authMiddleware';

export async function GET(request: NextRequest) {
  const authResult = await authenticate(request);
  
  // Ensure proper response handling for authentication
  if ('success' in authResult && !authResult.success) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }

  try {
    await dbConnect();
    const categories = await CategoryModel.find({});
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const categories = await request.json();

    // Validate and sanitize input
    if (!Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json(
        { message: "Invalid input: An array of categories is required" },
        { status: 400 }
      );
    }

    const invalidCategories = categories.filter((category: any) => {
      return !category.name || !Array.isArray(category.items) || category.items.some((item: any) => !item.emoji || !item.label || item.defaultPrice === undefined);
    });

    if (invalidCategories.length > 0) {
      return NextResponse.json(
        { message: "Invalid category data", errors: invalidCategories },
        { status: 400 }
      );
    }

    // Insert categories into the database
    const result = await CategoryModel.insertMany(categories);

    return NextResponse.json(
      { message: "Categories created successfully", data: result },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating categories:', error);
    return NextResponse.json(
      { error: "An error occurred while creating categories" },
      { status: 500 }
    );
  }
}
