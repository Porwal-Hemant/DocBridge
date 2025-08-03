// import { generateStreamToken } from '../config/stream.js';

// export async function getStreamToken(req, res) 
// {

//     try 
//     {

//         const token = generateStreamToken(req.user.id);

//         res.status(200).json({ token });

//     } 

//     catch (error) 
//     {

//         console.log("Error in getStreamToken controller:", error.message);

//         res.status(500).json({ message: "Internal Server Error" });

//     }

// }

// import { generateStreamToken } from '../config/stream.js';

// export async function getStreamToken(req, res) {
//   try {
//     // Support both formats
//     const userId = req.user?.id || req.body?.userId;

//     if (!userId) {
//       return res.status(400).json({ message: "User ID not found in request." });
//     }

//     const token = generateStreamToken(userId);

//     res.status(200).json({ token });
//   } catch (error) {
//     console.error("Error in getStreamToken controller:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }




import { generateStreamToken, streamClient } from '../config/stream.js';
import User from '../models/userModel.js';  
import doctorModel from '../models/doctorModel.js';  // Make sure this has `.js` at the end if you're using ESM

export async function getStreamToken(req, res) {
  try {
    const userId = req.body.userId; // extracted by auth middleware
    const targetUserId = req.query.targetUserId;

    // Upsert current user (from userModel)
    const currentUser = await User.findById(userId);
    if (currentUser) {
      await streamClient.upsertUser({
        id: currentUser._id.toString(),
        name: currentUser.fullName,
        image: currentUser.profilePic,
      });
    }

    // Upsert target user (from doctorModel)
    const targetUser = await doctorModel.findById(targetUserId);  // ✅ Corrected
    if (targetUser) {
      await streamClient.upsertUser({
        id: targetUser._id.toString(),
        name: targetUser.fullName,
        image: targetUser.profilePic,
      });
    }

    const token = generateStreamToken(userId);
    res.status(200).json({ token });

  } catch (error) {
    console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
