import { Router } from "express";
import tokenRoutes from "./token";
import twitchRoutes from "./twitch";

const router = Router();
router.use("/token", tokenRoutes);
router.use("/twitch", twitchRoutes)

export default router;
