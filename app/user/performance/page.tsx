'use client'
import BackButton from "@/components/BackButton";
import  Breadcrumb  from "@/components/Breadcrumbs";
import { analytics } from "@/utils/analytics";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AverageScoresChart from "@/components/performance/AverageScoresChart";
import AccuracyRateChart from "@/components/performance/AccuracyRate";
import TimeTakenChart from "@/components/performance/TimeTaken";
import { User } from "@prisma/client";
import { getCurrentUser } from "@/utils/userClient";
import withAuth from "@/hoc/withAuthUser";
import { Spinner } from "@nextui-org/spinner";

const PerformancePage = () => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getCurrentUser()
                setUser(user);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser()
    }, [])

    if (loading || !user) return <Spinner className='flex h-full justify-center items-center'/>;
    return ( 
        <>
            <div className='w-1/12'>
                <BackButton text="Go Back" link="/user" />
            </div>
            <Breadcrumb mainPage="Performance" homeLink="/user" homePage="Home" />

            <div className="m-2">
                <Card className="bg-blue-50">
                    <CardHeader>
                        <CardTitle>Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex  justify-center items-center">
                            <div>
                                <AverageScoresChart userID={user?.id as string} />              
                            </div>
                            <div>
                                <AccuracyRateChart  userID={user?.id  as string} />
                            </div>
                            <div>
                                <TimeTakenChart  userID={user?.id  as string} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="m-2">
                <Card className="bg-blue-50">
                    <CardHeader>
                        <CardTitle>Performance Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="ml-11 w-1/3">
                            <ul className="list-disc">
                                <li>
                                    <Link
                                        href={`/user/performance/questionPerformance`}
                                    >
                                        <button
                                            onClick={() => analytics.track("View Question Performance Record")}
                                            className="focus:outline-none hover:underline hover:text-blue-600"
                                        >
                                            View Question Performance Record
                                        </button>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={`/user/performance/examPerformance`}
                                    >
                                        <button
                                            onClick={() => analytics.track("View Exam Performance Record")}
                                            className="focus:outline-none hover:underline hover:text-blue-600"
                                        >
                                            View Exam Performance Record
                                        </button>
                                    </Link>
                                </li>
                            </ul>                    
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
     );
}
 
export default withAuth(PerformancePage);