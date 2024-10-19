import PerformanceCard from "@/components/analytics/PerformanceCard";
import QuestionUsageCard from "@/components/analytics/QuestionUsageCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";

const Analytics = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <h3 className="text-3xl pt-1 pb-3 font-semibold">Performance Analytics</h3>
        </CardHeader>
        <CardContent>
          <div className="m-0.5">
            <QuestionUsageCard/>
          </div>
          <div className="m-0.5">
            <PerformanceCard/>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Analytics;
