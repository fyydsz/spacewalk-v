import { Request, Response } from "express";

export default function discordLogout(req: Request, res: Response) {
  res.clearCookie("__Secure-token", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    domain: ".spacewalk.my.id",
    path: "/",
  });
  res.json({ success: true, message: "Logged out" });
}
