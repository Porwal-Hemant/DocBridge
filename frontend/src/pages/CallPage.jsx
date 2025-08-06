import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext"; //  Import AppContext
import axios from 'axios'; //  Import axios for consistency
import toast from "react-hot-toast";
// import PageLoader from "../components/ChatLoader";
import ChatLoader from '../components/ChatLoader'; // Replace with <p>Loading...</p> if not available
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const { userData, token, backendUrl } = useContext(AppContext); //  Use AppContext
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(true); //  Renamed for clarity

  useEffect(() => {
    // Exit if essential data is not yet available
    if (!userData || !token || !callId || !backendUrl) {
      return;
    }

    const initCall = async () => {
      try {
        //  Use axios and construct the full URL, just like in ChatPage
        const { data } = await axios.get(
          `${backendUrl}/api/chat/tokenVideoUser`,
          {
            headers: { token }, // Pass auth token in headers
          }
        );

        if (!data.token) {
          throw new Error("No video token received from server");
        }

        // The user object for Stream Video Client
        const user = {
          id: userData._id,
          name: userData.name,
          image: userData.image,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: data.token,
        });

        const callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });

        setClient(videoClient);
        setCall(callInstance);

      } catch (error) {
        console.error("Error initializing video call:", error);
        toast.error("Could not join the call. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initCall();

    // Cleanup function to leave the call and disconnect the user
    return () => {
      if (call) {
        call.leave();
      }
      if (client) {
        client.disconnectUser();
      }
    };
  // Updated dependencies
  }, [userData, token, callId, backendUrl]);

  // Use a unified loading check
  if (loading || !userData) {
    return <ChatLoader />;
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative w-full h-full">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// This component remains the same, but it's good practice to keep it
const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      navigate("/"); // Navigate home (or to a more appropriate page) after leaving
    }
  }, [callingState, navigate]);

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls onLeave={() => navigate('/')} /> {/* You can add an onLeave handler */}
    </StreamTheme>
  );
};

export default CallPage;

