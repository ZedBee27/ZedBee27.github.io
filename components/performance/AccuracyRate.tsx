"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from "recharts";
import { Spinner } from "@nextui-org/spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Exam } from "@prisma/client";
import { getCurrentUser } from "@/utils/userClient";

const COLORS = ['#0088FE'];

interface AverageScoreData {
    _avg: {
        score: number,
        accuracyRate: number,
        timeTaken: number,
    };
    user_id: string;
}

interface AverageScoresChartProps {
    userID: string
}

const AccuracyRateChart: React.FC<AverageScoresChartProps> = ({userID}) => {
    const [data, setData] = useState<AverageScoreData[]>([]);
    const [loading, setLoading] = useState(true);
    const [exams, setExams] = useState<Exam[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/performanceUser/averageScores/${userID}`); // Adjust the API endpoint as needed
                const { averageScores, exams } = await response.json();
                console.log(averageScores);
                setData(averageScores);
                setExams(exams);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userID]);

    if (loading) {
        return <Spinner className="h-full flex items-center justify-center" />;
    }

    // Map data to include exam names if available
    const chartData = data.map((entry, index) => ({
        exam: exams.find(e => e.id === entry.user_id)?.name,
        accuracyRate: entry._avg.accuracyRate,
        totalMarks: 100,
        fill: COLORS[0],
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Average Exams Accuracy Rate</CardTitle>
                <CardDescription>
                    Distribution of average accuracy rate across different exams
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="mx-auto aspect-[2/1] max-h-[250px]">
                    <BarChart width={800} height={400} data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="exam" />
                        <YAxis dataKey="totalMarks"/>
                        <Tooltip content={<ChartTooltipContent hideLabel />} />
                        <Legend />
                        <Bar dataKey="accuracyRate" fill="#0088FE">
                            <LabelList dataKey="accuracyRate" position="top" />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default AccuracyRateChart;