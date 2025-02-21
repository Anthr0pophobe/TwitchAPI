import dotenv from "dotenv";
dotenv.config();

import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASSWORD}@test1.0pe33.mongodb.net/?retryWrites=true&w=majority&appName=test1`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// update or create the database doc containing the token
export const sendToken = async (tokenData: { access_token: string; expires_in: number; token_type: string }) => {
    try {
      await client.connect();
      const db = client.db('twitch'); 
      const collection = db.collection('token');
  
      const tokenDoc = {
        access_token: tokenData.access_token,
        expires_at: new Date(Date.now() + tokenData.expires_in * 1000),
        token_type: tokenData.token_type,
        created_at: new Date(),
      };
      await collection.updateOne({}, { $set: tokenDoc }, { upsert: true });
      return tokenDoc;
  } catch (error) {
    throw new Error("Failed to store token in databese.");
  } finally {
    await client.close();
  }
};


// obligé de le mettre outside du scope de la fonction ?????
let cachedToken: { access_token: string; expires_at: number } | null = null;

// get token from Mongo
export const getTokenFromDB = async () => {
  // init Mongo
  await client.connect();
  const db = client.db("twitch");
  const collection = db.collection("token");

  const tokenDoc = await collection.findOne({});
  await client.close();

  if (!tokenDoc) throw new Error("No token found");

  cachedToken = {
      access_token: tokenDoc.access_token,
      expires_at: new Date(tokenDoc.expires_at).getTime(),
  };

  return cachedToken;
};