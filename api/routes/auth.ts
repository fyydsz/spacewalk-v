import express from "express";
import { configDotenv } from "dotenv";
import discordMe from "../auth/discordMe";
import discordAuth from "../auth/discordLogin";
import discordCallback from "../auth/discordCallback";
import logout from "../auth/discordLogout";
configDotenv();

const router = express.Router();

router.get("/discord", discordAuth);
router.get("/discord/callback", discordCallback);
router.get("/me", discordMe)
router.post("/logout", logout);

export default router;

