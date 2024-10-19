'use client';
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { StreamChat, Channel as StreamChannel } from 'stream-chat';
import { Chat, Channel, Window, MessageList, MessageInput, ChannelList, ChannelPreviewMessenger, ChannelHeader, Thread } from "stream-chat-react";

const SupportAdmin = () => {
  const [channel, setChannel] = useState<StreamChannel | null>(null);
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const { toast } = useToast();
  const isDarkMode = useTheme().theme === 'dark';

  useEffect(() => {
    const loadChatClient = async () => {
      try {
        const response = await fetch('/api/adminChat', { method: 'GET' });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error: ${response.status} - ${errorText}`);
        }

        const { adminToken, streamApiKey, adminName } = await response.json();
        const chatClientInstance = new StreamChat(streamApiKey);

        await chatClientInstance.connectUser(
          {
            id: adminName,
            name: 'Administrator',
          },
          adminToken,
        );

        const channelInstance = chatClientInstance.channel('messaging', 'livechat');
        await channelInstance.watch();

          setChatClient(chatClientInstance);
          setChannel(channelInstance);

      } catch (error) {
        if (error instanceof Error) {
          toast({ title: error.name, description: error.message });
        } else {
          toast({ title: 'An error occurred', description: String(error) });
        }
      }
    };

    loadChatClient();

  }, [toast]);

  if (!channel) {
    return <div>Loading...</div>;
  }

  return (
    chatClient && (
      <Chat
        client={chatClient}
        theme={isDarkMode ? "str-chat__theme-dark" : "str-chat__theme-light"}
      >
        <div className="flex flex-row h-[100vh]">
        <div className="w-1/2">
          <ChannelList sort={{ last_message_at: -1 }} Preview={ChannelPreviewMessenger} />
        </div>
        <div className="w-full ">
        <Channel>
          <Window>
            <ChannelHeader  />
            <MessageList  />
            <MessageInput/>
          </Window>
          <Thread />
          </Channel>
        </div>
        </div>
      </Chat>
    )
  );
};

export default SupportAdmin;
