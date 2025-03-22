import { Request, Response } from "express";
import { configDotenv } from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";

configDotenv();
const SECRET_KEY = process.env.JWT_SECRET!;

export default function discordMe(req: Request, res: Response) {
  const token = req.cookies['__Secure-token'];
  if (!token) {
    return res.status(401).json({ success: false, error: { code: "NO_TOKEN", message: "No token provided." } });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    res.json({
      success: true,
      user: {
        id: decoded.id,
        username: decoded.username,
        name: decoded.global_name,
        avatar: decoded.avatar
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, error: { code: "INVALID_TOKEN", message: "Invalid or expired token." } });
  }
}
