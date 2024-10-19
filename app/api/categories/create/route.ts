import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function POST(request: Request) {
  try {

    const data = await request.json();

    const newCategory = await prisma.category.create({
      data: {
        name: data.name,
        type: data.type,
        noOfQuestions: data.noOfQuestions || 0,
      }
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);

    return NextResponse.json(
      { error: 'Failed to create category. Please try again later.' },
      { status: 500 }
    );
  }
}
