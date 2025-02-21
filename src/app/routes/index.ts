import { Router } from "express";
import twitchRoutes from "./twitch";

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../middlewares/swagger';

const router = Router();

router.use('/docs', swaggerUi.serve);  
router.get('/docs', swaggerUi.setup(swaggerSpec));
router.use("/twitch", twitchRoutes);


export default router;
