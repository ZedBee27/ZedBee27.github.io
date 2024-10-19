// components/ui/chart/ScoreDistributionChart.tsx

"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from "recharts";
import { Spinner } from "@nextui-org/spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface ScoreDistributionData {
    range: string;
    count: number;
}

const ScoreDistributionChart: React.FC = () => {
    const [data, setData] = useState<ScoreDistributionData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/performance/scoreDistribution');
                const result: ScoreDistributionData[] = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Spinner className="h-full flex items-center justify-center" />;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
                <CardDescription>
                    Distribution of scores across different ranges.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="mx-auto aspect-[2/1] max-h-[400px]">
                    <BarChart width={800} height={400} data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent hideLabel />} />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8">
                            <LabelList dataKey="count" position="top" />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default ScoreDistributionChart;
