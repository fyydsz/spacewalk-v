import express from "express";
import apiRoutes from "./routes/v1";
import webhookRoutes from "./routes/webhook";
import authRoutes from "./routes/auth";
import cors from "cors";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
configDotenv();

const port = process.env.PORT;

const app = express();
app.use(cookieParser());
app.disable('etag')

app.use(cors({
  origin: [
    "https://spacewalk.my.id", 
    "https://www.spacewalk.my.id"
  ], // Specify the exact origin instead of wildcard
  credentials: true, // Enable credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie']
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/v1", apiRoutes);
app.use("/webhook", webhookRoutes);
app.get("/", (req, res) => {
  // Send an Easter Egg!
  res.send("Shh... You weren't supposed to find this.")
});

// Di bagian bawah file app.js/index.js, setelah semua route terdaftar
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: {
      code: "RESOURCE_NOT_FOUND",
      message: "The requested endpoint does not exist."
    }
  });
});
  
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});