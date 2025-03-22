import { Request, Response } from "express";

export default function helloHandler(req: Request, res: Response) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.json({ message: "Hello, world!" });
}
