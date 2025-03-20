import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { checkAndRefreshToken } from "../middlewares/tokenCache";

dotenv.config();  // Charge les variables d'environnement

// Fonction pour s'abonner au webhook de Twitch pour stream.online
export const subscribeToTwitchWebhook = async() =>{
    const callbackUrl = "http://localhost:3008/webhooks/callback";  // URL de ton callback webhook
    const broadcasterUserId = "134774232";  // Remplace par l'ID du streamer que tu surveilles
    const twitchToken = await checkAndRefreshToken();
    const api_client = process.env.TWITCH_CLIENT;

    if(!api_client || !twitchToken?.access_token){
        return console.error({ success: false, message:"Missing API KEY"});
      }
    const body = {
        type: "stream.online",
        version: "1",
        condition: {
            broadcaster_user_id: broadcasterUserId,
        },
        transport: {
            method: "webhook",
            callback: callbackUrl,
            secret: process.env.TWITCH_WEBHOOK_SECRET || 's3cRe7m334g3', // Secret pour vérifier l'intégrité
        }
    };

    try {
        const response = await fetch('https://api.twitch.tv/helix/webhooks/eventsub/subscriptions', {
            method: 'POST',
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT as string,
                'Authorization': `Bearer ${twitchToken.access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Abonnement réussi !", data);
        } else {
            console.error("Erreur lors de l'abonnement :", data);
        }
    } catch (error) {
        console.error("Erreur lors de la requête d'abonnement Twitch :", error);
    }
}
