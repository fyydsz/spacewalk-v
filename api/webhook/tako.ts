import { configDotenv } from "dotenv";
import { Request, Response } from "express";
import crypto from "crypto";
configDotenv();

const TOKEN = process.env.TAKO_WEBHOOK;

export default function takoWebhook(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: 405, message: "Method Not Allowed" });
  }
  try {
    const takoSignatureFromHeader = req.headers['x-tako-signature'] as string;
    
    // Jika token ada dan header signature ada, lakukan validasi
    if (TOKEN && takoSignatureFromHeader) {
      const computedSignature = crypto
        .createHmac("sha256", TOKEN)
        .update(JSON.stringify(req.body))
        .digest("hex");
      
      // Bandingkan signature
      try {
        const isValid = crypto.timingSafeEqual(
          Buffer.from(computedSignature),
          Buffer.from(takoSignatureFromHeader)
        );
        
        if (!isValid) {
          return res.status(401).json({ error: "Unauthorized: Invalid signature" });
        }
      } catch (error) {
        return res.status(401).json({ error: "Unauthorized: Signature comparison failed" });
      }
    } else if (TOKEN && !takoSignatureFromHeader) {
      return res.status(401).json({ error: "Unauthorized: Missing signature header" });
    }
    
    console.log("Webhook payload:", req.body);
    res.json({ success: true, message: "Webhook received successfully" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}