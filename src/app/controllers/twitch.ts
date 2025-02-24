import { Request, Response, NextFunction } from "express";
import { checkAndRefreshToken } from "../middlewares/tokenCache";
import { TwitchUser } from "../models/twitch.model";
import { batchFetchSchedules, filterSuccessfulResults } from "../middlewares/twitch";
import dotenv from "dotenv";
dotenv.config();


const getLiveStatic = async (_req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const twitchToken = await checkAndRefreshToken();
    const api_client = process.env.TWITCH_CLIENT;

    if(!api_client || !twitchToken?.access_token){
        return res.status(400).json({ success: false, message:"Missing API KEY"});
      }

    const response = await fetch("https://api.twitch.tv/helix/streams?user_login=Anthr0pophobe&user_login=rvflash_&user_login=bmsjoel", {
        method:"GET",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${twitchToken.access_token}`,
            "Client-Id": api_client
        },
    });
    const data = await response.json();
    return res.status(200).json({ success: true, message: data });

} catch (error: unknown) {
    next(error);
    const err = error as Error;
    return res.status(400).json({ success: false, message: err.message });
}  
};

const getLiveUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const twitchToken = await checkAndRefreshToken();
  const api_client = process.env.TWITCH_CLIENT;
  const {
    params:{
      username
    }
  } = req;
  try {
    if(!api_client || !twitchToken?.access_token){
        return res.status(400).json({ success: false, message:"Missing API KEY"});
      }

    const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${username}`, {
        method:"GET",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${twitchToken.access_token}`,
            "Client-Id": api_client
        },
    });
    const data = await response.json();
    return res.status(200).json({ success: true, message: data });

  } catch (error: unknown) {
      next(error);
      const err = error as Error;
      return res.json({ success: false, message: err.message });
  }  
};


const getUserInfosStatic = async (_req: Request, res: Response, next: NextFunction): Promise<any> => {
  const twitchToken = await checkAndRefreshToken();
  const api_client = process.env.TWITCH_CLIENT;
  try {
    if(!api_client || !twitchToken?.access_token){
        return res.status(400).json({ success: false, message:"Missing API KEY"});
      }

    const response = await fetch(`https://api.twitch.tv/helix/users?login=Anthr0pophobe&login=rvflash_&login=Bazzbarge`, {
        method:"GET",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${twitchToken.access_token}`,
            "Client-Id": api_client
        },
    });
    const data = await response.json();
    return res.json({ success: true, message: data });

  } catch (error: unknown) {
      next(error);
      const err = error as Error;
      return res.status(200).json({ success: false, message: err.message });
  }  
};

const getUserInfos = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const twitchToken = await checkAndRefreshToken();
  const api_client = process.env.TWITCH_CLIENT;
  const {
    params:{
      username
    }
  } = req;
  try {
    if(!api_client || !twitchToken?.access_token){
        return res.status(400).json({ success: false, message:"Missing API KEY"});
      }

    const response = await fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
        method:"GET",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${twitchToken.access_token}`,
            "Client-Id": api_client
        },
    });
    const data = await response.json();
    return res.json({ success: true, message: data });

  } catch (error: unknown) {
      next(error);
      const err = error as Error;
      return res.status(200).json({ success: false, message: err.message });
  }  
};

const getScheduleInfos = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const twitchToken = await checkAndRefreshToken();
  const api_client = process.env.TWITCH_CLIENT;
  const {
    params:{
      broadcasterId
    }
  } = req;
  try {
    if(!api_client || !twitchToken?.access_token){
        return res.status(400).json({ success: false, message:"Missing API KEY"});
      };

    const response = await fetch(`https://api.twitch.tv/helix/schedule?broadcaster_id=${broadcasterId}`, {
        method:"GET",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${twitchToken.access_token}`,
            "Client-Id": api_client
        },
    });
    const data = await response.json();
    return res.status(200).json({ success: true, message: data });

  } catch (error: unknown) {
      next(error);
      const err = error as Error;
      return res.status(400).json({ success: false, message: err.message });
  }  
};

const getScheduleFromUsernameStatic = async (_req: Request, res: Response, next: NextFunction): Promise<any> =>{
  try {
    const twitchToken = await checkAndRefreshToken();
    const api_client = process.env.TWITCH_CLIENT;

    if(!api_client || !twitchToken?.access_token){
        return res.status(400).json({ success: false, message:"Missing API KEY"});
      }

    const response = await fetch("https://api.twitch.tv/helix/users?login=Anthr0pophobe&login=rvflash_&login=Bazzbarge", {
        method:"GET",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${twitchToken.access_token}`,
            "Client-Id": api_client
        },
    });
    const userData = await response.json();
    if(!userData.data || userData.data.length === 0){
      return res.status(404).json({success: false, message:"User not found."});
    };

    const broadcastIds = userData.data.map((elem: TwitchUser) => elem.id);
    const results = await batchFetchSchedules(broadcastIds, twitchToken.access_token, api_client);
    const fulteredResults = filterSuccessfulResults(results);
    return res.status(200).json({ success: true, data:fulteredResults });
  }
    catch (error: unknown){
      next(error);
      const err = error as Error;
      return res.status(400).json({ success: false, message: err.message });
    }
}

const getScheduleFromUsername = async (req: Request, res: Response, next: NextFunction): Promise<any> =>{
  const twitchToken = await checkAndRefreshToken();
  const api_client = process.env.TWITCH_CLIENT;
  const {
    params:{
      username
    }
  } = req;
  try{
    if(!api_client || !twitchToken?.access_token){
      return res.status(400).json({ success: false, message:"Missing API KEY"});
    };
    const userResponse = await fetch(`https://api.twitch.tv/helix/users?broadcaster_id=${username}`, {
      method:"GET",
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${twitchToken.access_token}`,
          "Client-Id": api_client
      },
  });

  const userData = await userResponse.json();
  if(!userData.data || userData.data.length === 0){
    return res.status(404).json({success: false, message:"User not found."});
  };

  const {
    broadcaster_id
  } = userData[0];

  const scheduleResponse = await  fetch(`https://api.twitch.tv/helix/schedule?broadcaster_id=${broadcaster_id}`, {
    method:"GET",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${twitchToken.access_token}`,
        "Client-Id": api_client
      },
    });

  const scheduleData = await scheduleResponse.json();
  if(scheduleData.data.length === 0){
    return res.status(200).json({success: true, schedule:[], message:"Empty schedule", })
  }
  return res.status(200).json({ success: true, schedule: scheduleData });
  }
  catch (error: unknown){
    next(error);
    const err = error as Error;
    return res.status(400).json({ success: false, message: err.message });
  }
}



export default { 
  getLiveStatic,
  getLiveUser,
  getUserInfosStatic,
  getUserInfos,
  getScheduleInfos,
  getScheduleFromUsername,
  getScheduleFromUsernameStatic
};
