import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { getTokenFromDB } from "./app/middlewares/mongo";
import { setCachedToken, getCachedToken } from "./app/middlewares/tokenCache";
import apiRoutes from "./app/routes/index";

const app = express();
const port = 3000;

// load token from mongo
const loadToken = async () => {
    const tokenFromDB = await getTokenFromDB();
    if (tokenFromDB) {
        setCachedToken({
            access_token: tokenFromDB.access_token,
            expires_at: tokenFromDB.expires_at,
        });
        console.log("Token loaded");
    } else {
        console.warn("No token found !");
    }
};
loadToken();

app.get('/', (_req, res) => {
	res.json({ message: 'APIREST' });
});

app.use('/api', apiRoutes);

app.listen(port, () =>{
    console.log(`Server live on http://localhost:${port}`);
});

