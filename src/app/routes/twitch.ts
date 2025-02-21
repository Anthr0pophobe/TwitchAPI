import { Router } from "express";
import twitchController from "../controllers/twitch";

const router = Router();

router.get("/islive", twitchController.getLiveStatic);
router.get("/isLive/:username", twitchController.getLiveUser);
router.get("/user/:username", twitchController.getUserInfos);
router.get("/schedule/:broadcasterId", twitchController.getScheduleInfos);

export default router;
