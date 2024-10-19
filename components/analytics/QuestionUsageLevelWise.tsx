"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import { useState, useEffect } from "react";
import { Spinner } from "@nextui-org/spinner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Category, Question, QuestionPerformance } from "@prisma/client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const COLORS = [
    "#FF8042", // Orange
    "#00C49F", // Green
    "#FFBB28", // Yellow
    "#0088FE", // Blue
    "#FF6347", // Tomato
    "#FF6347", // Light Blue
    "#B3B3CC", // Light Grey
    "#FFD700", // Gold
    "#FFA07A", // Light Salmon
];

const QuestionUsageLevelWise = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [questionUsage, setQuestionUsage] = useState<Record<string, QuestionPerformance[]>>({});
    const [loading, setLoading] = useState(true);
    const [selectedLevel, setSelectedLevel] = useState<string>(""); 

    const levelCategory = [
        { id: 1, name: 'EASY' },
        { id: 2, name: 'MEDIUM' },
        { id: 3, name: 'HARD' }
    ];

    useEffect(() => {
        const fetchQuestionsAndUsage = async () => {
            try {
                const questionsResponse = await fetch('/api/questions');
                const questionsData: Question[] = await questionsResponse.json();
                setQuestions(questionsData);

                const usageResponse = await fetch('/api/questionPerformance');
                const usageData = await usageResponse.json();

                const usageByQuestion: Record<string, QuestionPerformance[]> = usageData.reduce((acc: any, usage: QuestionPerformance) => {
                    if (!acc[usage.question_id]) {
                        acc[usage.question_id] = [];
                    }
                    acc[usage.question_id].push(usage);
                    return acc;
                }, {});
                setQuestionUsage(usageByQuestion);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestionsAndUsage();
    }, []);

    if (loading) {
        return <Spinner className="h-full flex items-center justify-center" />;
    }

    // Filter questions by selected level
    const filteredQuestions = selectedLevel 
        ? questions.filter((q) => q.difficulty === selectedLevel) 
        : questions;

    // Prepare chart data for PieChart
    const chartData = filteredQuestions.map((q, index) => ({
        question: q.question,
        usage: questionUsage[q.id]?.length || 0,
        fill: COLORS[index % COLORS.length], // Assign colors from the COLORS array
    }));

    // Calculate total usage
    const totalUsage = chartData.reduce((acc, curr) => acc + curr.usage, 0);

    // Calculate total questions with performance
    const totalQuestionsWithPerformance = filteredQuestions.filter((q) => questionUsage[q.id]?.length > 0).length;

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>
                    Level Wise Pie Chart
                </CardTitle>
                <CardDescription>
                    Overall Analysis
                </CardDescription>
                <Select 
                    value={selectedLevel} 
                    onValueChange={(value) => setSelectedLevel(value)} 
                >
                    <SelectTrigger className='outline-none'>
                        <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                        {levelCategory.map((level) => (
                            <SelectItem key={level.id} value={level.name}>
                                {level.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <h4 className="pt-2 text-xl font-semibold text-center">
                    Total Questions: {totalQuestionsWithPerformance}
                </h4>
                <ChartContainer config={{}} className="mx-auto aspect-square max-h-[250px]">
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="usage"
                            nameKey="question"
                            innerRadius={60}
                            outerRadius={80}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalUsage.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Usage
                                                </tspan>
                                            </text>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default QuestionUsageLevelWise;
