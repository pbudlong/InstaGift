import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import Stripe from "stripe";
import { businessAnalysisSchema, insertGiftSchema } from "@shared/schema";
import { z } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required secret: STRIPE_SECRET_KEY');
}

if (!process.env.ANTHROPIC_API_KEY && !process.env.OPENAI_API_KEY) {
  throw new Error('Missing required secret: Either ANTHROPIC_API_KEY or OPENAI_API_KEY is required');
}

const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
}) : null;

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.post("/api/analyze-business", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ message: "URL is required" });
      }

      const prompt = `You are analyzing a local business website to create a branded gift card. 
      
Given this URL: ${url}

Please analyze the business and return a JSON object with the following structure:
{
  "businessName": "The business name",
  "businessType": "Type of business (e.g., 'Coffee Shop', 'Auto Detailing')",
  "brandColors": ["#hex1", "#hex2"],
  "emoji": "A single emoji that represents the business",
  "vibe": "Short description of the brand vibe (e.g., 'Cozy and artisanal')",
  "description": "One sentence description of what the business offers"
}

Make educated guesses based on the URL and common business patterns. Be creative but realistic.
Return ONLY the JSON object, no other text.`;

      let responseText = '';
      
      try {
        if (anthropic) {
          console.log("Trying Anthropic Claude for business analysis...");
          const message = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20240620",
            max_tokens: 1024,
            messages: [{
              role: "user",
              content: prompt
            }]
          });

          responseText = message.content[0].type === 'text' 
            ? message.content[0].text 
            : '';
          console.log("Anthropic analysis successful");
        } else {
          throw new Error("Anthropic not available");
        }
      } catch (anthropicError: any) {
        console.error("Anthropic failed:", anthropicError.message);
        
        if (!openai) {
          throw new Error("Both Anthropic and OpenAI are unavailable");
        }
        
        console.log("Falling back to OpenAI...");
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{
            role: "user",
            content: prompt
          }],
          max_tokens: 1024,
        });
        
        responseText = completion.choices[0]?.message?.content || '';
        console.log("OpenAI analysis successful");
      }
      
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Failed to extract JSON from AI response");
      }

      const parsedData = JSON.parse(jsonMatch[0]);
      const validatedData = businessAnalysisSchema.parse(parsedData);
      
      res.json(validatedData);
    } catch (error: any) {
      console.error("Business analysis error:", error);
      res.status(500).json({ 
        message: "Error analyzing business: " + error.message 
      });
    }
  });

  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      
      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: "Valid amount is required" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Payment intent error:", error);
      res.status(500).json({ 
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  app.post("/api/create-gift", async (req, res) => {
    try {
      const giftData = insertGiftSchema.parse(req.body);
      
      const cardNumber = `4242 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;
      const cardExpiry = `12/${new Date().getFullYear() + 3}`;
      const cardCvv = Math.floor(100 + Math.random() * 900).toString();
      
      const gift = await storage.createGift({
        ...giftData,
        cardNumber,
        cardExpiry,
        cardCvv,
      });

      res.json(gift);
    } catch (error: any) {
      console.error("Gift creation error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid gift data", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        message: "Error creating gift: " + error.message 
      });
    }
  });

  app.get("/api/gifts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const gift = await storage.getGift(id);
      
      if (!gift) {
        return res.status(404).json({ message: "Gift not found" });
      }

      res.json(gift);
    } catch (error: any) {
      console.error("Gift retrieval error:", error);
      res.status(500).json({ 
        message: "Error retrieving gift: " + error.message 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
