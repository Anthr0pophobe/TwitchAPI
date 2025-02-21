import express from "express";
import { getTokenFromDB } from "./app/middlewares/mongo";
import { setCachedToken } from "./app/middlewares/tokenCache";
import apiRoutes from "./app/routes/index";
import cors from "cors";

const app = express();
const port = 3008   ;
app.use(cors());

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

