
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DoctorContext } from "../../context/DoctorContext";
import axios from "axios";
import toast from "react-hot-toast";
import ChatLoader from "../../components/ChatLoader";

import {
  StreamVideo,
  StreamVideoClient,   // Creates the video client with user/token info.
  StreamCall,          // Represents an active video call session.
  CallControls,        // Default call buttons (leave, mute, camera, etc.).
  SpeakerLayout,       // Shows participants in a speaker-focused layout.
  StreamTheme,
  CallingState,
  useCallStateHooks,    // For checking the call status (e.g., JOINED, LEFT).
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";

// import "../index.css" ;

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const DoctorCallPage = () => {
  const { id: callId } = useParams();
  const navigate = useNavigate();

  const { profileData, dToken, backendUrl , getProfileData } = useContext(DoctorContext);

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileData && getProfileData) {
      console.log("Fetching doctor profile...");
      getProfileData();
      // If profileData is not available on initial render (e.g., on page refresh), it calls getProfileData() to fetch it again.
    }
  }, [profileData, getProfileData]);
  // to conditionally fetch the profile data only once when the component mounts (or when dependencies change), preventing redundant or infinite fetches.


  useEffect(() => {
    console.log(" DoctorCallPage mounted");

    if (!profileData || !dToken || !callId || !backendUrl) {
      console.warn(" Missing required data:", {
        profileData,
        dToken,
        callId,
        backendUrl,
      });
      return;
    }

    const initDoctorCall = async () => {
      try {
        console.log("Initializing video call for doctor...");

        console.log(" Requesting video token from backend...");
        const { data } = await axios.get(`${backendUrl}/api/chat/tokenVideoDoctor`, {
          headers: { dtoken: dToken },
        });

        if (!data.token) {
          throw new Error(" No video token received from server for doctor");
        }

        console.log("Received video token:", data.token);
        
        // videoClient is initialized with the doctor’s data and token
        const user = {
          id: profileData._id,
          name: profileData.name,
          image: profileData.image,
        };

        console.log(" Initializing StreamVideoClient for doctor:", user);
        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: data.token,
        });

        // Joins (or creates) a Stream call using the callId from the URL
        const callInstance = videoClient.call("default", callId);
        console.log(" Joining call with callId:", callId);

        await callInstance.join({ create: true });
        console.log(" Successfully joined the call");

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error(" Error during call initialization:", error);
        toast.error("Could not join the call. Please try again.");
      } finally {
        console.log(" Finished call initialization");
        setLoading(false);
      }
    };

    initDoctorCall();
   // If the component unmounts (e.g., navigate away), it ensures the call is gracefully exited and client is disconnected
    return () => {
      console.log(" Cleaning up: Leaving call and disconnecting client...");
      if (call) {
        call.leave().then(() => console.log(" Left the call"));
      }
      if (client) {
        client.disconnectUser().then(() => console.log(" Disconnected Stream client"));
      }
    };
  }, [profileData, dToken, callId, backendUrl]);

  if (loading || !profileData) 
  {
    console.log(" Loading or waiting for profile data...");
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
            <p className="text-red-500 font-semibold">
               Could not initialize call. Please refresh or try again later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  // when user will leave the call this useEffect will be triggered
  // and it will redirect the user to the dashboard
  useEffect(() => {
    console.log(" Call state changed:", callingState);
    if (callingState === CallingState.LEFT) {
      console.log(" Call ended. Redirecting to dashboard...");
      navigate("/");
      // this useEffect will be executed first
    }
  }, [callingState, navigate]);

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls onLeave={() => {
        console.log(" Leave button clicked. Redirecting to dashboard...");
        navigate('/');
      }} />
    </StreamTheme>
  ); 
};

export default DoctorCallPage;
