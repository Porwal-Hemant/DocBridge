import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import axios from "axios";

import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
  useChannelStateContext,
  Avatar,
} from "stream-chat-react";

import { StreamChat } from "stream-chat";
import ChatLoader from "../components/ChatLoader"; // Replace with <p>Loading...</p> if not available
import CallButton from "../components/CallButton";
import { toast } from "react-hot-toast";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

// 🔹 Custom Header with receiver info and video call button
const CustomChannelHeader = ({ currentUserId, handleVideoCall }) => {
  const { channel } = useChannelStateContext();
  const [receiver, setReceiver] = useState(null);

  useEffect(() => {
    if (!channel || !channel.state?.members) return;

    const members = Object.values(channel.state.members);
    const otherUser = members.find((m) => m.user?.id !== currentUserId)?.user;
    setReceiver(otherUser);
  }, [channel, currentUserId]);

  if (!receiver) return null;

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar image={receiver.image} name={receiver.name || receiver.id} size={40} />
        <div className="text-lg font-semibold text-gray-800">
          {receiver.name || "User"}
        </div>
      </div>

      {/*  Video call button with emoji */}
      <CallButton handleVideoCall={handleVideoCall} />
    </div>
  );
};

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userData, token, backendUrl } = useContext(AppContext);

  useEffect(() => {
    const fetchStreamTokenAndInitChat = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/chat/token?targetUserId=${targetUserId}`,
          { headers: { token } }
        );

        const streamToken = data.token;
        const client = StreamChat.getInstance(STREAM_API_KEY);

        if (client.userID) {
          await client.disconnectUser();
        }

        await client.connectUser(
          {
            id: userData._id,
            name: userData.name,
            image: userData.image,
          },
          streamToken
        );

        const channelId = [userData._id, targetUserId].sort().join("-");
        const chatChannel = client.channel("messaging", channelId, {
          members: [userData._id, targetUserId],
        });

        await chatChannel.watch();

        setChatClient(client);
        setChannel(chatChannel);
      } catch (error) {
        console.error("Failed to initialize chat:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token && userData) {
      fetchStreamTokenAndInitChat();
    }
  }, [token, userData, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${import.meta.env.VITE_USER_APP_BASE_URL}/call/${channel.id}`;
      channel.sendMessage({
        text: ` I've started a video call. Join here: ${callUrl}`,
      });
      toast.success("Video call link sent!");
    }
  };

  if (loading || !chatClient || !channel) {
    return <ChatLoader />; // or <p>Loading chat...</p>
  }

  return (
    <div className="h-[93vh] w-full px-4 pr-6">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <Window>
            <CustomChannelHeader
              currentUserId={userData._id}
              handleVideoCall={handleVideoCall}
            />
            <MessageList />
            <MessageInput focus />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
