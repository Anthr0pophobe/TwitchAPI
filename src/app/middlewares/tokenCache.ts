import { Request, Response, NextFunction } from "express";
import fetch from "node-fetch";
import { sendToken } from "./mongo";
import { getTokenFromDB } from "./mongo";

let cachedToken: { access_token: string; expires_at: number } | null = null;


export const setCachedToken = (token: { access_token: string; expires_at: number }) => {
  cachedToken = token;
};
export const getCachedToken = () => cachedToken;

// get the acces_token from twitch API retourne l'objet brut
export const generateTokenTwitch = async() => {
  try {
    const api_client = process.env.TWITCH_CLIENT;
    const api_secret = process.env.TWITCH_SECRET;

    if(!api_client || !api_secret){
      throw new Error("Missing API KEY");
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
    return data;
  }
  catch (error: unknown){
    throw new Error(`Failed to generate Twitch token: ${(error as Error).message}`);
  }
};

// update the token
export const updateToken = async (newToken: { access_token: string; expires_at: number }) => {

  // update the local token
  setCachedToken(newToken);

  // convert expires_in from expires_at
  const expiresIn = Math.floor((newToken.expires_at - Date.now()) / 1000);

  // right format for the token
  const tokenToSave = {
    access_token: newToken.access_token,
    expires_in: expiresIn, // Twitch utilise expires_in, pas expires_at
    token_type: "bearer", // Valeur par défaut si non fournie
  };

  // update in mongo
  try {
    await sendToken(tokenToSave);
    console.log("✅ Token mis à jour en base de données !");
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du token en base :", error);
  }
};

// Update local and db if outdated token
export const checkAndRefreshToken = async () => {
  const twitchToken = getCachedToken();
  if (!twitchToken || twitchToken.expires_at < Date.now()) {
      const newToken = await generateTokenTwitch();
      setCachedToken({
          access_token: newToken.access_token,
          expires_at: new Date(Date.now() + newToken.expires_in * 1000).getTime(),
      });
      await sendToken(newToken);
  }
  return getCachedToken();
};



