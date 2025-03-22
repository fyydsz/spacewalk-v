import { Router } from "express";
import takoWebhook from "../webhook/tako";

const router = Router();

router.all("/tako", takoWebhook);

export default router;