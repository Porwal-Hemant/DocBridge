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





// export async function getStreamToken(req, res) {
//   try 
//   {
//     const userId = req.body.userId; // given by auth middleware
//     // req.body.userId = token_decode.id
//     const targetUserId = req.query.targetUserId;    // this will be extracted by the URL  

//     // Upsert current user ( from userModel )
//     const currentUser = await User.findById(userId)  ;
//     if (currentUser) 
//     {
//       await streamClient.upsertUser({
//         id: currentUser._id.toString(),
//         name: currentUser.name,
//         image: currentUser.image,
//       });
//     }
    
//     // there might be issues in how i am upserting user
//     // Upsert target user (from doctorModel)

//     // targetUserId is basically containing doctor as well 
//     const targetUser = await doctorModel.findById(targetUserId);  
//     if (targetUser) {
//       await streamClient.upsertUser({
//         id: targetUser._id.toString(),
//         name: targetUser.name,
//         image: targetUser.image,
//       });
//     }

//     const token = generateStreamToken(userId);
//     res.status(200).json({ token });

//   } 
//   catch (error) 
//   {
//     console.log("Error in getStreamToken controller:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }

import { generateStreamToken, streamClient } from '../config/stream.js';
import User from '../models/userModel.js';  
import doctorModel from '../models/doctorModel.js';  


export async function getStreamToken(req, res) {
  try {
    const userId = req.body.userId; // from auth middleware
    const targetUserId = req.query.targetUserId; // from URL

    // Fetch current user from User model
    const currentUser = await User.findById(userId);

    // Fetch target user from doctorModel first, fallback to User model
    let targetUser = await doctorModel.findById(targetUserId);
    if (!targetUser) {
      targetUser = await User.findById(targetUserId);
    }

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    //  Upsert both users to Stream (with name and image)
    await streamClient.upsertUsers([
      {
        id: currentUser._id.toString(),
        name: currentUser.name || "User",
        image: currentUser.image || "",
      },
      {
        id: targetUser._id.toString(),
        name: targetUser.name || "User",
        image: targetUser.image || "",
      },
    ]);

    console.log(" Upserted users to Stream:", {
      currentUser: {
        id: currentUser._id.toString(),
        name: currentUser.name,
        image: currentUser.image,
      },
      targetUser: {
        id: targetUser._id.toString(),
        name: targetUser.name,
        image: targetUser.image,
      },
    });

    const token = generateStreamToken(userId);
    res.status(200).json({ token });

  } catch (error) {
    console.error("Error in getStreamToken controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getStreamTokenForDoctor(req, res) 
{
  try 
  {
    const doctorId = req.body.docId; // from authDoctor middleware
    const targetUserId = req.query.targetUserId; // patient ID from URL query

    // Fetch authenticated doctor
    const currentDoctor = await doctorModel.findById(doctorId);

    // Fetch target patient from User model
    const targetUser = await User.findById(targetUserId);

    if (!currentDoctor || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Upsert both users into Stream
    await streamClient.upsertUsers([
      {
        id: currentDoctor._id.toString(),
        name: currentDoctor.name || "Doctor",
        image: currentDoctor.image || "",
      },
      {
        id: targetUser._id.toString(),
        name: targetUser.name || "User",
        image: targetUser.image || "",
      },
    ]);

    console.log("Upserted doctor and user to Stream:", {
      currentDoctor: {
        id: currentDoctor._id.toString(),
        name: currentDoctor.name,
        image: currentDoctor.image,
      },
      targetUser: {
        id: targetUser._id.toString(),
        name: targetUser.name,
        image: targetUser.image,
      },
    });

    const token = generateStreamToken(doctorId);
    res.status(200).json({ token });

  } 
  catch (error) 
  {
    console.error("Error in getStreamTokenForDoctor controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}



export async function getStreamTokenVideoUser(req, res) 
{

    try 
    {

        const token = generateStreamToken( req.body.userId );

        res.status(200).json({ token });

    } 

    catch (error) 
    {

        console.log("Error in getStreamToken controller:", error.message);

        res.status(500).json({ message: "Internal Server Error" });

    }

}

export async function getStreamTokenVideoDoctor(req, res) 
{

    try 
    {

        const token = generateStreamToken( req.body.docId );

        res.status(200).json({ token });

    } 

    catch (error) 
    {

        console.log("Error in getStreamToken controller:", error.message);

        res.status(500).json({ message: "Internal Server Error" });

    }

}



