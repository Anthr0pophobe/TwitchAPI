import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

export const verifyTwitchWebhookSignature = (req: Request, res: Response, next: NextFunction) =>{
    const signature = req.headers['x-hub-signature'] as string;
    const payload = JSON.stringify(req.body);

    const hmac = crypto.createHmac('sha256', process.env.TWITCH_WEBHOOK_SECRET || 's3cRe7m334g3');
    const digest = `sha256=${hmac.update(payload).digest('hex')}`;

    if (digest === signature) {
        next();
    } else {
        res.status(400).send('Signature non valide');
    }
}
