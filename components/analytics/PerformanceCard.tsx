'use client'
import AverageScoresChart from '@/components/analytics/AverageScoresChart';
import ScoreDistributionChart from './ScoreDistributionChart';
import QuestionPerformanceChart from './QuestionPerformanceChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

const DashboardPage = () => {
  return (
    <>
        <Card className="bg-blue-50">
            <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col lg:flex-row xl:flex-row justify-center items-center">
                    <div>
                        <AverageScoresChart  />              
                    </div>
                    <div>
                        <ScoreDistributionChart/>
                    </div>
                </div>
                    <div>
                        <QuestionPerformanceChart/>
                    </div>
            </CardContent>
        </Card>
    </>
  );
};

export default DashboardPage;
