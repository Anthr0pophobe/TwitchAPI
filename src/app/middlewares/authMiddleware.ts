import { Request, Response, NextFunction } from "express";
import fetch from "node-fetch";
import { sendToken } from './mongo';

// generate a twitch token
export const getToken = async(_req: Request, res: Response, next: NextFunction) => {
  try {
    const api_client = process.env.TWITCH_CLIENT;
    const api_secret = process.env.TWITCH_SECRET;

    if(!api_client || !api_secret){
      return res.status(400).json({ success: false, message:"Missing API KEY"});
    }

    const params = new URLSearchParams();
    params.append('client_id', api_client);         
    params.append('client_secret', api_secret); 
    params.append('grant_type', 'client_credentials');

    const response = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      body:params.toString(),
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const data = await response.json();
    const sentToken = await sendToken(data);
    return sentToken;
  }
  catch (error: unknown){
    const err = error as Error;
    return res.json({ success: false, message: err.message });
  }
};