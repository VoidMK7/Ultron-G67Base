import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";
import multer from "multer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PORT = process.env.PORT || 10000;
const app = express();
const upload = multer({ dest: path.join(ROOT, "uploads") });

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req,res) => res.json({ ok:true, service:"AI Studio", mode: process.env.DEMO_MODE !== "false" ? "demo" : "live" }));

app.post("/api/generate", async (req,res) => {
  const { mode="video", prompt="", style="Cinematic", ratio="16:9", duration="30 sec", audio=true } = req.body || {};
  if (!prompt.trim()) return res.status(400).json({ ok:false, message:"Prompt is required." });

  const jobId = crypto.randomUUID();

  // DEMO MODE: keeps the free deployment testable without exposing an API key.
  // LIVE MODE: connect your chosen provider in this route and keep the secret in an environment variable.
  if (process.env.DEMO_MODE !== "false") {
    return res.json({
      ok:true,
      jobId,
      status:"queued",
      message:`Demo job ${jobId.slice(0,8)} queued. Connect your video/image provider to enable real generation.`
    });
  }

  // Provider integration intentionally lives behind the server.
  // Never put GEMINI_API_KEY or other provider secrets in React/Vite client code.
  return res.status(501).json({
    ok:false,
    jobId,
    message:"Live generation adapter is not configured yet. Add the provider adapter on the server."
  });
});

app.post("/api/upload", upload.single("file"), (req,res) => {
  if (!req.file) return res.status(400).json({ok:false,message:"No file uploaded."});
  res.json({ok:true,file:{name:req.file.originalname,size:req.file.size}});
});

const dist = path.join(ROOT, "dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*splat", (_req,res) => res.sendFile(path.join(dist,"index.html")));
} else {
  app.get("/", (_req,res) => res.json({ ok:true, message:"AI Studio API is running. Use npm run dev for the frontend." }));
}

app.listen(PORT, "0.0.0.0", () => console.log(`AI Studio listening on ${PORT}`));
