import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STEAM_API_KEY;

const apiSecret = process.env.STEAM_API_SECRET;

if (!apiKey || !apiSecret) 
{

    console.error("Stream API key or Secret is missing");

}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);  // with the help of this streamclient we can communicate and interact with the stream application 

// some particular user instance will call this function  
export const upsertStreamUser = async (userData) => 
{

  try 
  {
    
    // create or update
    await streamClient.upsertUsers([userData]);
    return userData ;

  } 
  catch (error) 
  {

    console.error("Error upserting Stream user:", error);

  }
  

};


// generating stream token is left 

export const generateStreamToken = (userId) => 
{

  try 
  {

    // ensure userId is a string
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);

  } 
  catch (error) 
  {

    console.error("Error generating Stream token:", error);

  }

};

export { streamClient };
