import { Request, Response } from "express";
import { configDotenv } from "dotenv";
import axios from "axios";
import jwt from "jsonwebtoken";
import { URLSearchParams } from "node:url";
import cookieParser from "cookie-parser";

configDotenv();

const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;
const REDIRECT_URI = process.env.REDIRECT_URI!;
const JWT_SECRET = process.env.JWT_SECRET!;

export default async function discordCallback(req: Request, res: Response) {
  const code = req.query.code as string;
  if (!code) return res.status(400).json({ success: false, error: "No code provided" });

  try {
    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
        scope: "identify email"
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const userResponse = await axios.get("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` },
    });

    const user = userResponse.data;
    const sessionToken = jwt.sign({
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.global_name,
      avatar: user.avatar
    }, JWT_SECRET, { expiresIn: "7d" });

    // Set token di HTTPS-only cookie
    res.cookie("__Secure-token", sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax", 
      domain: ".spacewalk.my.id", 
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect("https://spacewalk.my.id/");
  } catch (error: any) {
    console.error("Error during Discord OAuth:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: "Authentication failed" });
  }
}
