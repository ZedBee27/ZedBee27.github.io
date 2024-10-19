'use client';

import * as React from "react";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, ResponsiveContainer } from "recharts";
import { Spinner } from "@nextui-org/spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Question, QuestionPerformance } from "@prisma/client";

const COLORS = [
    "#4caf50", // Green
    "#f44336", // Red
];



const QuestionPerformanceChart: React.FC = () => {
    const [questionPerformance, setQuestionPerformance] = useState<Record<string, QuestionPerformance[]>>({});
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const questionsResponse = await fetch('/api/questions');
                const questionsData: Question[] = await questionsResponse.json();
                setQuestions(questionsData);

                const performanceResponse = await fetch('/api/questionPerformance');
                const performanceData: QuestionPerformance[] = await performanceResponse.json();

                const performanceByQuestion: Record<string, QuestionPerformance[]> = performanceData.reduce((acc: any, usage: QuestionPerformance) => {
                    if (!acc[usage.question_id]) {
                        acc[usage.question_id] = [];
                    }
                    acc[usage.question_id].push(usage);
                    return acc;
                }, {});

                setQuestionPerformance(performanceByQuestion);

                
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        // Run the fetch only once when the component mounts
        fetchData();
    }, []); // Empty dependency array ensures the effect runs only once

    if (loading) {
        return <Spinner className="h-full flex items-center justify-center" />;
    }

    // Define chart data with colors
    const chartData = questions.map((q, index) => ({
        question: q.question,
        correctAnswers: questionPerformance[q.id]?.filter((q) =>  q.isCorrect === true ).length || 0,
        incorrectAnswers: questionPerformance[q.id]?.filter((q) =>  q.isCorrect == false ).length || 0
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Individual Question Performance</CardTitle>
                <CardDescription>
                    Correct vs Incorrect Answers for each question
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="mx-auto aspect-[2/1] max-h-[250px]">
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="question" 
                                tickFormatter={(question) => question.length > 10 ? `${question.substring(0, 7)}...` : question} 
                            />
                            <YAxis />
                            <Tooltip 
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="custom-tooltip bg-slate-50 rounded-lg p-1">
                                                <p className="label text-gray-700">{`Question: ${label}`}</p>
                                                <p className="intro text-green-600">{`Correct Answers: ${payload[0].value}`}</p>
                                                <p className="intro text-red-600">{`Incorrect Answers: ${payload[1].value}`}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }} 
                                cursor={false}
                            />
                            <Legend />
                            <Bar dataKey="correctAnswers" fill="#4caf50" name="Correct Answers">
                                <LabelList dataKey="correctAnswers" position="top" />
                            </Bar>
                            <Bar dataKey="incorrectAnswers" fill="#f44336" name="Incorrect Answers">
                                <LabelList dataKey="incorrectAnswers" position="top" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default QuestionPerformanceChart;