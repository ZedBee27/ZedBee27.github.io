import BackButton from '@/components/BackButton';
import Breadcrumbs from '@/components/Breadcrumbs';
import AccuracyRateChart from '@/components/performance/AccuracyRate';
import AverageScoresChart from '@/components/performance/AverageScoresChart';
import TimeTakenChart from '@/components/performance/TimeTaken';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserProgress from '@/components/users/UserProgress';
import { getCurrentUser } from '@/utils/user';
import { redirect } from 'next/navigation';

interface UserProgressPageProps {
    params: {
        id: string;
    }
}

const UserProgresPage = async ({ params }: UserProgressPageProps) => {
    
    return ( 
        <>
            <div className="w-1/6">
                <BackButton text="Go Back" link="/dashboard/users" />
            </div>
            <Breadcrumbs mainPage="User Progress" homePage="Home" homeLink="/dashboard/" secondLink='/dashboard/users' secondPage='Users' />
            <div className="m-2">
                <Card className="bg-blue-50">
                    <CardHeader>
                        <CardTitle>User Overall Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex  justify-center items-center">
                            <div>
                                <AverageScoresChart userID={params.id} />              
                            </div>
                            <div>
                                <AccuracyRateChart userID={params.id} />
                            </div>
                            <div>
                                <TimeTakenChart  userID={params.id} />
                            </div>
                        </div>
                        <div className='mt-2'>
                            <UserProgress userID={params.id} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
     );
}
 
export default UserProgresPage;