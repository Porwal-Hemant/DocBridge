// import { useEffect, useState, useContext } from "react";
// import { AppContext } from "../context/AppContext";
// import { useParams } from "react-router-dom";
// import axios from 'axios';

// import {
//   Channel,
//   ChannelHeader,
//   Chat,
//   MessageInput,
//   MessageList,
//   Thread,
//   Window,
// } from "stream-chat-react";

// import { StreamChat } from 'stream-chat';

// import ChatLoader from '../components/ChatLoader';   // if you have this component

// const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
// // const backendUrl = import.meta.env.VITE_BACKEND_URL;   // assuming you have this in your .env file

// const ChatPage = () => {

//   const { id: targetUserId } = useParams();

//   const [chatClient, setChatClient] = useState(null);
//   const [channel, setChannel] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [streamToken, setStreamToken] = useState(null);

//   const { userData, token, backendUrl } = useContext(AppContext);

//   useEffect(() => {

//     const fetchStreamTokenAndInitChat = async () => {

//       try {

//         // STEP 1 - Fetch stream token
//         const { data } = await axios.get(
//           `${backendUrl}/api/chat/token?targetUserId=${targetUserId}`,
//           {
//             headers: {
//               token,
//             },
//           }
//         );

//         console.log("Calling:", `${backendUrl}/api/chat/token`);

//         console.log("Stream Token:", data.token);
//         setStreamToken(data.token);

//         // STEP 2 - Initialize stream chat client
//         console.log("Initializing StreamChat client...");
//         const client = StreamChat.getInstance(STREAM_API_KEY);

//         /* 
        
//         the SDK stores the id of the connected user in a private variable, and exposes it as:
 
//         client.userID

//        */

//         if (client.userID) {
//           await client.disconnectUser();
//         }

//         await client.connectUser(
//           {
//             id: userData._id,
//             name: userData.fullName,
//             image: userData.profilePic,
//           },
//           data.token
//         );

//         console.log("Connected user:", userData._id);

//         // STEP 3 - Create channel
//         const channelId = [userData._id, targetUserId].sort().join("-");

//         console.log("Creating channel with ID:", channelId);

//         const currChannel = client.channel("messaging", channelId, {
//           members: [userData._id, targetUserId],
//         });

//         await currChannel.watch();

//         console.log("Channel ready.");

//         // STEP 4 - Set states
//         setChatClient(client);
//         setChannel(currChannel);

//       } catch (error) {
//         console.error("Error initializing chat:", error);
//       } finally {
//         setLoading(false);
//       }

//     };

//     // Only run if token and userData are available
//     if (token && userData) {
//       fetchStreamTokenAndInitChat();
//     }

//   }, [token, userData, targetUserId]);

//   // Loading state
//   if (loading || !chatClient || !channel) {
//     return <ChatLoader />;   // If you don't have ChatLoader, replace with <p>Loading chat...</p>
//   }

//   // Final UI once chat is ready
//   return (
//     <div className="h-[93vh]">
//       <Chat client={chatClient}>
//         <Channel channel={channel}>
//           <div className="w-full relative">
//             <Window>
//               <ChannelHeader />
//               <MessageList />
//               <MessageInput focus />
//             </Window>
//           </div>
//           <Thread />
//         </Channel>
//       </Chat>
//     </div>
//   );

// };

// export default ChatPage;



import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import axios from 'axios';

import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
  Avatar,
  useChannelStateContext,
} from "stream-chat-react";

import { StreamChat } from 'stream-chat';
import ChatLoader from '../components/ChatLoader';   // If you don't have this, replace with <p>Loading...</p>

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CustomChannelHeader = ({ currentUserId }) => {
  const { channel } = useChannelStateContext();
  const [receiver, setReceiver] = useState(null);

  useEffect(() => {
    if (!channel || !channel.state?.members) return;

    // Get the other member (receiver)
    const members = Object.values(channel.state.members);
    const otherUser = members.find(m => m.user?.id !== currentUserId)?.user;

    setReceiver(otherUser);
  }, [channel, currentUserId]);

  if (!receiver) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-300 bg-white">
      <Avatar image={receiver.image} name={receiver.name || receiver.id} size={40} />
      <div className="text-lg font-semibold">{receiver.name || "Dr Pratap"}</div>
    </div>
  );
};

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [streamToken, setStreamToken] = useState(null);

  const { userData, token, backendUrl } = useContext(AppContext);

  useEffect(() => {
    const fetchStreamTokenAndInitChat = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/chat/token?targetUserId=${targetUserId}`,
          { headers: { token } }
        );

        setStreamToken(data.token);
        const client = StreamChat.getInstance(STREAM_API_KEY);

        if (client.userID) {
          await client.disconnectUser();
        }

        await client.connectUser(
          {
            id: userData._id,
            name: userData.fullName,
            image: userData.profilePic,
          },
          data.token
        );

        const channelId = [userData._id, targetUserId].sort().join("-");
        const currChannel = client.channel("messaging", channelId, {
          members: [userData._id, targetUserId],
        });

        await currChannel.watch();
        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token && userData) {
      fetchStreamTokenAndInitChat();
    }
  }, [token, userData, targetUserId]);

  if (loading || !chatClient || !channel) {
    return <ChatLoader />; // Replace with <p>Loading chat...</p> if needed
  }

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <Window>
              <CustomChannelHeader currentUserId={userData._id} />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;


