import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { generateTokenTwitch } from "../middlewares/tokenCache";

dotenv.config();

//: Promise<any> dans chacune des foncions pour l'instant
// génère et store un token dans la base de données.

// TO DO DELETE THOSES ENDPOINTS no user purpose

const generateToken = async (_req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const data = await generateTokenTwitch();
        return res.json({ success: true, data });
    } catch (error: unknown) {
        next(error);
        const err = error as Error;
        return res.json({ success: false, message: err.message });
    }
};




export default { generateToken };
