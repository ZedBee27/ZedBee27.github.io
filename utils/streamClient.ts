// app/streamClient.ts
import { StreamChat } from 'stream-chat';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
const client = StreamChat.getInstance(apiKey);

export default client;
