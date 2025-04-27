import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import fs from "fs";
import path from "path";
import { openaiService } from "./services/openai.service";
import { anthropicService } from "./services/anthropic.service";
import { imageService } from "./services/image.service";

// Set up multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Image comparison API endpoint
  app.post(
    "/api/compare-images",
    upload.fields([
      { name: "image1", maxCount: 1 },
      { name: "image2", maxCount: 1 },
    ]),
    async (req, res) => {
      try {
        // Get files or URLs
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const image1File = files?.["image1"]?.[0];
        const image2File = files?.["image2"]?.[0];
        const image1Url = req.body.image1Url;
        const image2Url = req.body.image2Url;

        if ((!image1File && !image1Url) || (!image2File && !image2Url)) {
          return res.status(400).send("Missing images. Please provide both images.");
        }

        // Process the image comparison
        const result = await imageService.compareImages(
          image1File?.path || image1Url,
          image2File?.path || image2Url
        );

        // Clean up temporary files if needed
        if (image1File?.path) {
          fs.unlinkSync(image1File.path);
        }
        if (image2File?.path) {
          fs.unlinkSync(image2File.path);
        }

        res.json(result);
      } catch (error: any) {
        console.error("Error comparing images:", error);
        res.status(500).send(error.message || "Error processing the image comparison");
      }
    }
  );

  // Brand name comparison API endpoint
  app.post("/api/compare-brands", async (req, res) => {
    try {
      const { brand1, brand2 } = req.body;

      if (!brand1?.name || !brand2?.name) {
        return res.status(400).send("Missing brand names. Please provide both brand names.");
      }

      // Process the brand name comparison using Anthropic
      const result = await anthropicService.compareBrands(brand1, brand2);
      res.json(result);
    } catch (error: any) {
      console.error("Error comparing brands:", error);
      res.status(500).send(error.message || "Error processing the brand comparison");
    }
  });

  // Chatbot API endpoint
  app.post("/api/chatbot", async (req, res) => {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).send("Missing message. Please provide a message.");
      }

      // Process the chatbot message using Anthropic
      const response = await anthropicService.generateChatResponse(message);
      res.json({ response });
    } catch (error: any) {
      console.error("Error generating chatbot response:", error);
      res.status(500).send(error.message || "Error processing the chatbot message");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
