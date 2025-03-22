
import { Request, Response } from "express";
import { configDotenv } from "dotenv";
configDotenv();

const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;
const REDIRECT_URI = process.env.REDIRECT_URI!;
const JWT_SECRET = process.env.JWT_SECRET!;

export default function discordAuth(req: Request, res: Response) {
  const scopes = encodeURIComponent("identify email guilds");
  const discordAuthURL = `https://discord.com/oauth2/authorize` +
    `?client_id=${CLIENT_ID}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${scopes}`;

  res.redirect(discordAuthURL);
}