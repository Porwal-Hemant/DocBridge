import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall }) {
  return (
    <button
      onClick={handleVideoCall}
      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-md transition duration-200"
      title="Start Video Call"
    >
      <VideoIcon className="w-5 h-5" />
    </button>
  );
}

export default CallButton;