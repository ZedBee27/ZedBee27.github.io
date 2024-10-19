'use client'
import { getCurrentUser } from "@/utils/userClient";
import MagicBell, { FloatingNotificationInbox } from "@magicbell/magicbell-react";
import { Spinner } from "@nextui-org/spinner";
import { User } from "@prisma/client";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";


interface NotificationProps {
  user: User;
}

const Notification = (props: NotificationProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isDarkMode = useTheme().theme === 'dark';

  // Update the user state when props.user changes
  useEffect(() => {
    if (props.user) {
      setUser(props.user);
      setLoading(false); // Stop loading once user is set
    }
  }, [props.user]);


  if (loading || !user) return null  

  return (
    <>
      <MagicBell
        apiKey={process.env.NEXT_PUBLIC_MAGICBELL_API_KEY as string}
        userEmail={user.email}
        theme={{
          icon: {
            borderColor: isDarkMode ? '#EFF6FF' : '#050505',
          },
          header: {
            backgroundColor: '#FFFFFF',
            backgroundOpacity: 0,
            borderRadius: '16px',
            fontSize: '15px',
            textColor: '#172554',
          },
          footer: {
            backgroundColor: '#FFFFFF',
            backgroundOpacity: 1,
            borderRadius: '16px',
            fontSize: '15px',
            textColor: '#172554',
          },
          container: {
            backgroundColor: '#FFFFFF',
            textColor: '#172554',
          },
          notification: {
            default: {
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              textColor: '#1E3A8A',
              hover: {
                backgroundColor: '#DBEAFE',
              },
            },
            unread: {
              backgroundColor: '#EFF6FF',
              backgroundOpacity: 0.75,
              textColor: '#1E3A8A',
              hover: {
                backgroundColor: '#DBEAFE',
              },
              state: {
                color: '#172554',
              },
            },
            unseen: {
              backgroundColor: '#EFF6FF',
              backgroundOpacity: 0.2,
              textColor: '#1E3A8A',
              hover: {
                backgroundColor: '#DBEAFE',
              },
              state: {
                color: '#172554',
              },
            },
          },
          banner: {
            backgroundColor: '#EFF6FF',
            textColor: '#1E3A8A',
            fontSize: '14px',
          },
        }}
      >
        {(props) => (
          <FloatingNotificationInbox
            height={500}
            width={400}
            {...props}
          />
        )}
      </MagicBell>
    </>
  );
};

export default Notification;
