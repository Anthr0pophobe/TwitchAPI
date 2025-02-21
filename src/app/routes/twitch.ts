import { Router } from "express";
import twitchController from "../controllers/twitch";

const router = Router();

/**
 * @swagger
 * /twitch/islive:
 *   get:
 *     summary: Vérifie si un utilisateur est en live
 *     responses:
 *       200:
 *         description: L'utilisateur est en live
 *       404:
 *         description: L'utilisateur n'est pas en live
 */
router.get("/islive", twitchController.getLiveStatic);

/**
 * @swagger
 * /twitch/isLive/{username}:
 *   get:
 *     summary: Vérifie si un utilisateur spécifique est en direct
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: Nom de l'utilisateur Twitch
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: L'utilisateur est en direct 
 *       404:
 *         description: L'utilisateur n'est pas en direct
 */
router.get("/isLive/:username", twitchController.getLiveUser);

/**
 * @swagger
 * /twitch/user/{username}:
 *   get:
 *     summary: Récupère les informations d'un utilisateur Twitch
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: Nom d'utilisateur Twitch
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur récupérées avec succès
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get("/user/:username", twitchController.getUserInfos);

/**
 * @swagger
 * /twitch/schedule/{broadcasterId}:
 *   get:
 *     summary: Récupère le planning d'un utilisateur Twitch
 *     parameters:
 *       - in: path
 *         name: broadcasterId
 *         required: true
 *         description: ID du diffuseur pour récupérer son planning
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Planning récupéré avec succès
 *       404:
 *         description: Aucun planning trouvé pour cet utilisateur
 */
router.get("/schedule/:broadcasterId", twitchController.getScheduleInfos);

export default router;
