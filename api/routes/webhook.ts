import { RequestHandler, Router } from "express";
import takoWebhook from "../webhook/tako";

const router = Router();

router.all("/tako", takoWebhook as RequestHandler);

export default router;