import { Router } from "express";
import tokenController from "../controllers/token";

const router = Router();

router.get("/generatetoken", tokenController.generateToken);

export default router;
