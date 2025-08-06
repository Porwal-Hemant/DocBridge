import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DoctorContext } from "../../context/DoctorContext";
import { toast } from "react-hot-toast";

import {
    Chat,
    Channel,
    MessageInput,
    MessageList,
    Thread,
    Window,
    useChannelStateContext,
    Avatar,
} from "stream-chat-react";

import { StreamChat } from "stream-chat";
import ChatLoader from "../../components/ChatLoader";
import CallButton from "../../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

//  Updated Header component with CallButton inside
const CustomChannelHeader = ({ currentUserId, handleVideoCall }) => {
    const { channel } = useChannelStateContext();
    const [receiver, setReceiver] = useState(null);

    useEffect(() => {
        if (!channel?.state?.members) return;

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
                    {receiver.name || "Unknown User"}
                </div>
            </div>

            {/*  Call button positioned to the right */}
            <CallButton handleVideoCall={handleVideoCall} />
        </div>
    );
};

const ChatPage = () => {
    const { id: targetUserId } = useParams();
    const [chatClient, setChatClient] = useState(null);
    const [channel, setChannel] = useState(null);
    const [loading, setLoading] = useState(true);

    const { profileData, dToken, backendUrl, getProfileData } = useContext(DoctorContext);

    useEffect(() => {
        if (!profileData && getProfileData) {
            console.log("Fetching doctor profile...");
            getProfileData();
        }
    }, [profileData, getProfileData]);

    useEffect(() => {
        const initializeChat = async () => {
            try {
                if (!profileData || !dToken || !targetUserId) {
                    console.warn("Missing data to initialize chat.");
                    return;
                }

                console.log("Getting Stream token for doctor...");
                const { data } = await axios.get(
                    `${backendUrl}/api/chat/token-for-doctor?targetUserId=${targetUserId}`,
                    { headers: { dtoken: dToken } }
                );

                const streamToken = data.token;
                const client = StreamChat.getInstance(STREAM_API_KEY);

                if (client.userID) {
                    console.log("Disconnecting existing Stream user...");
                    await client.disconnectUser();
                }

                console.log("Connecting doctor to Stream...");
                await client.connectUser(
                    {
                        id: profileData._id,
                        name: profileData.name,
                        image: profileData.image,
                    },
                    streamToken
                );

                const channelId = [profileData._id, targetUserId].sort().join("-");
                const chatChannel = client.channel("messaging", channelId, {
                    members: [profileData._id, targetUserId],
                });

                console.log("📡 Watching chat channel...");
                await chatChannel.watch();

                setChatClient(client);
                setChannel(chatChannel);
            } catch (error) {
                console.error("Error initializing doctor chat:", error);
            } finally {
                setLoading(false);
            }
        };

        initializeChat();
    }, [profileData, dToken, targetUserId, backendUrl]);

    if (loading || !chatClient || !channel) {
        return <ChatLoader />;
    }

    //   const handleVideoCall = () => {
    //     if (channel) {
    //       const callUrl = `${window.location.origin}/call/${channel.id}`;
    //       const callPatient =  `${import.meta.env.VITE_DOCTOR_APP_BASE_URL}/call/${channel.id}`;
    //       console.log("📹 Sending video call link to patient:", callPatient);
    //       channel.sendMessage({
    //         text: `Doctor Link->: ${callUrl}`,

    //       });

    //       toast.success("Video call link sent successfully!");
    //     }
    //   };
    const handleVideoCall = () => {
        if (channel) {
            const callUrl = `${window.location.origin}/call/${channel.id}`; // For doctor
            const callPatient = `${import.meta.env.VITE_DOCTOR_APP_BASE_URL}/call/${channel.id}`; // For user

            console.log("📹 Sending video call links...");
            console.log("Doctor Link:", callUrl);
            console.log("User Link:", callPatient);

            // Send message with doctor link
            channel.sendMessage({
                text: `Doctor Link → ${callUrl}`,
            });

            // Send message with user link
            channel.sendMessage({
                text: `User Link → ${callPatient}`,
            });

            toast.success("Video call links sent successfully!");
        }
    };

    return (
        <div className="h-[93vh] w-full px-4 pr-6">
            <Chat client={chatClient}>
                <Channel channel={channel}>
                    <Window>
                        {/*  Passing handleVideoCall to header */}
                        <CustomChannelHeader
                            currentUserId={profileData._id}
                            handleVideoCall={handleVideoCall}
                        // handleVideoCall in the {} is the actual function through which i am creating link 
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
