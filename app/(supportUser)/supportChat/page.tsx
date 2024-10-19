'use client'
import { useToast } from "@/components/ui/use-toast";
import React from "react";
import { useEffect, useState } from "react";
import { StreamChat, Channel as StreamChannel, DevToken } from 'stream-chat';
import { Chat, Channel, Window, MessageList, MessageInput, TypingIndicator, MessageInputFlat, ChannelHeader } from "stream-chat-react";
import withAuth from "@/hoc/withAuthUser";
import { useTheme } from "next-themes";


const SupportChat = () => {
    const [channel, setChannel] = useState<StreamChannel | null>(null);
    const [chatClient, setChatClient] = useState<StreamChat | null>(null);
    const { toast } = useToast();
    const isDarkMode = useTheme().theme === 'dark';


    useEffect(() => {
        const loadChatClient = async () => {
        try {
            const response = await fetch('/api/chat', { method: 'GET' });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }
            const { firstName, customerId, customerToken, channelId, streamApiKey } = await response.json();
            const chatClient = new StreamChat(streamApiKey);
        
            await chatClient.connectUser(
                {
                    id: customerId,
                    name: firstName,
                },
                customerToken,
            );
        
            const channel = chatClient.channel('messaging', channelId, {
                name: `Chat with Administrator`,
            });
        
            await channel.watch;
            setChannel(channel);
            setChatClient(chatClient);
                    
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
    
    if (!channel || !chatClient) {
        return <div>Loading...</div>;
    }

    return ( 
        <>
            {chatClient && (
                <Chat
                    client={chatClient}
                    theme={isDarkMode ? "str-chat__theme-dark" : "str-chat__theme-light"}
                >
                    <Channel channel={channel}>
                        <Window>
                        <ChannelHeader  />
                        <MessageList />
                        <MessageInput Input={MessageInputFlat} focus />
                        </Window>
                    </Channel>
                </Chat>
            )}
        </>
     );
}
 
export default withAuth(SupportChat);
