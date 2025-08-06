// import { VideoIcon } from "lucide-react";

// function CallButton({ handleVideoCall }) {
//   return (
//     <div className="p-3 border-b flex items-center justify-end max-w-7xl mx-auto w-full absolute top-0">
//       <button onClick={handleVideoCall} className="btn btn-success btn-sm text-white">
//         <VideoIcon className="size-6" />
//       </button>
//     </div>
//   );
// }

// export default CallButton;

// import { VideoIcon } from "lucide-react";

// function CallButton({ handleVideoCall }) {
//   return (
//     <div className="absolute top-4 right-4 z-50">
//       <button
//         onClick={handleVideoCall}
//         className="btn btn-success btn-sm text-white flex items-center gap-2 shadow-md hover:shadow-lg"
//       >
//         <VideoIcon className="size-5" />
//         <span>Call</span>
//       </button>
//     </div>
//   );
// }

// export default CallButton;
// import { VideoIcon } from "lucide-react";

// function CallButton({ handleVideoCall }) {
//   return (
//     <div className="absolute top-4 right-4 z-50">
//       <button
//         onClick={handleVideoCall}
//         className="btn btn-success btn-sm text-white flex items-center gap-2 shadow-md hover:shadow-lg"
//       >
//         <VideoIcon className="size-5" />
//         <span>Call</span>
//       </button>
//     </div>
//   );
// }

// export default CallButton;


// import { VideoIcon } from "lucide-react";

// function CallButton({ handleVideoCall }) {
//   return (
//     <div className="absolute top-4 right-4 z-50">
//       <button
//         onClick={handleVideoCall}
//         className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition duration-200"
//         title="Start Video Call"
//       >
//         <VideoIcon className="w-5 h-5" />
//       </button>
//     </div>
//   );
// }

// export default CallButton;


import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall }) {
  return (
    <button
      onClick={handleVideoCall}
      // this is the onClick link generation functionality
      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-md transition duration-200"
      title="Start Video Call"
    >
      <VideoIcon className="w-5 h-5" />
    </button>
  );
}

export default CallButton;
