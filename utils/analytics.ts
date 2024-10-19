import { User } from '@prisma/client';
import { AnalyticsBrowser } from '@segment/analytics-next';
import { NextResponse } from 'next/server';

export const analytics = AnalyticsBrowser.load({
  writeKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY as string,
});

// Identify user in analytics
export const getAnalyticsUser = (user: User) => {
  analytics.identify(user.id, {
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
  });
};