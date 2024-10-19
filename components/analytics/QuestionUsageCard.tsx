import QuestionUsageLevelWise from "@/components/analytics/QuestionUsageLevelWise";
import QuestionUsageSubjectWise from "@/components/analytics/QuestionUsageSubjectWise";
import QuestionUsageTopicWise from "@/components/analytics/QuestionUsageTopicWise";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const QuestionUsageCard = () => {
    return ( 
        <>
            <Card className="bg-blue-50">
                <CardHeader>
                    <CardTitle>Question Usage</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col lg:flex-row xl:flex-row justify-center items-center">
                        <div>
                            <QuestionUsageTopicWise />
                        </div>
                        <div>
                            <QuestionUsageSubjectWise />
                        </div>
                        <div>
                            <QuestionUsageLevelWise />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
     );
}
 
export default QuestionUsageCard;