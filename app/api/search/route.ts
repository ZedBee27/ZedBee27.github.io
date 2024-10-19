import { NextResponse } from 'next/server';
import  {prisma}  from '@/utils/db'; 
import { Prisma } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const { keyword = '', difficultyLevel = '', subject = '', topic = '' } = await request.json();

    const query: Prisma.QuestionWhereInput = {};

    if (subject) {
      query.subject = { equals: subject };
    }
    if (topic) {
      query.topic = { equals: topic };
    }
    if (difficultyLevel) {
      query.difficulty = { equals: difficultyLevel };
    }
    if (keyword) {
      query.OR = [
        { question: { contains: keyword, mode: 'insensitive' } },
        { subject: { contains: keyword, mode: 'insensitive' } },
        { topic: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    // Fetch the filtered questions from the database
    console.log('Query:', query);
    const filteredQuestions = await prisma.question.findMany({
      where: query,
    });
    console.log('Filtered questions:', filteredQuestions);

    return NextResponse.json({ questions: filteredQuestions });
  } catch (error) {
    console.error('Error handling search request:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
  }
}
