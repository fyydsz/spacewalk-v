import express, { RequestHandler, RequestParamHandler } from "express";
import { configDotenv } from "dotenv";
import discordMe from "../auth/discordMe";
import discordAuth from "../auth/discordLogin";
import discordCallback from "../auth/discordCallback";
import logout from "../auth/discordLogout";
configDotenv();

const router = express.Router();

router.get("/discord", discordAuth as RequestHandler);
router.get("/discord/callback", discordCallback as RequestHandler);
router.get("/me", discordMe as RequestHandler);
router.post("/logout", logout as RequestHandler);

export default router;

