import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import fs from 'fs';
import https from 'https';
import axios from 'axios';
import * as cheerio from 'cheerio';

dotenv.config();

const app = express();
const port = 3000;

// Create an HTTPS agent that ignores SSL errors (for staging/dev sites)
const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

// Middleware
app.use(cors());
app.use(express.json());

// Configure Multer for memory storage (we just pass the buffer to Gemini)
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("GEMINI_API_KEY is not set in .env file");
const genAI = new GoogleGenerativeAI(apiKey);

// Initialize OpenAI (Optional but recommended for fallback)
const openaiApiKey = process.env.OPENAI_API_KEY;
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;
if (!openai) console.warn("OPENAI_API_KEY not found. OpenAI fallback will be disabled.");

/**
 * Endpoint: POST /api/scan-url
 * Scrapes a website for images.
 */
app.post('/api/scan-url', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ error: 'URL is required' });

        // Add robust headers to mimic a real modern browser
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Referer': url // Some sites check this
            },
            httpsAgent: httpsAgent,
            timeout: 15000 // Increase timeout to 15s
        });
        const html = response.data;
        const $ = cheerio.load(html);
        const images = [];

        $('img').each((i, el) => {
            let src = $(el).attr('src');
            if (src) {
                // Handle relative URLs
                if (src.startsWith('//')) {
                    src = 'https:' + src;
                } else if (src.startsWith('/')) {
                    const parsedUrl = new URL(url);
                    src = `${parsedUrl.origin}${src}`;
                } else if (!src.startsWith('http')) {
                    // Try to resolve relative path
                    const parsedUrl = new URL(url);
                    // Simple join - strictly could be better with path.resolve logic but URL does a good job
                    try {
                        src = new URL(src, url).href;
                    } catch (e) {
                        return; // skip invalid
                    }
                }

                // Strict filtering for supported AI formats
                // Gemini/OpenAI typically support: PNG, JPEG, WEBP, HEIC, HEIF
                // We exclude SVG, ICO, BMP, TIFF to avoid errors
                if (/\.(svg|ico|bmp|tiff|tif)($|\?)/i.test(src)) {
                    return;
                }

                images.push({
                    src,
                    originalAlt: $(el).attr('alt') || ''
                });
            }
        });

        // Limit to top 20 to avoid overwhelming
        res.json({ images: images.slice(0, 20) });

    } catch (error) {
        console.error("Scanning error:", error.message);
        const status = error.response ? error.response.status : 500;
        const msg = error.response ? `Upstream Error ${status}: ${error.response.statusText}` : error.message;
        res.status(status).json({ error: 'Failed to scan website. ' + msg });
    }
});

/**
 * Endpoint: POST /api/generate-alt-from-url
 * Fetches an image from a URL and generates ALT text.
 */
app.post('/api/generate-alt-from-url', async (req, res) => {
    try {
        const { imageUrl } = req.body;
        if (!imageUrl) return res.status(400).json({ error: 'Image URL is required' });

        // Fetch the image buffer with robust headers
        const imageResponse = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Sec-Fetch-Dest': 'image',
                'Sec-Fetch-Mode': 'no-cors',
                'Sec-Fetch-Site': 'cross-site',
                'Referer': imageUrl // Or the original site URL if we had it, but image URL is often safer self-ref
            },
            httpsAgent: httpsAgent,
            timeout: 15000
        });
        const buffer = Buffer.from(imageResponse.data, 'binary');
        const mimeType = imageResponse.headers['content-type'] || 'image/jpeg';

        // Validate MIME type before sending to AI
        const supportedMimes = ['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif'];
        // Note: checking startsWith('image/') is too broad as it includes svg
        if (!supportedMimes.some(type => mimeType.toLowerCase().includes(type.split('/')[1]))) {
            return res.status(400).json({
                error: `Unsupported image format (${mimeType}). AI models only support PNG, JPEG, and WEBP.`
            });
        }

        const imagePart = {
            inlineData: {
                data: buffer.toString('base64'),
                mimeType,
            },
        };

        const prompt = "Generate a single, concise, ADA-compliant ALT text for this image. strictly under 125 characters. Describe the main subject and action. Do not start with 'Image of' or 'Picture of'.";

        // Use the unified fallback function
        const result = await generateWithFallback(prompt, imagePart);

        res.json({ altText: result.text.trim(), modelUsed: result.modelUsed });

    } catch (error) {
        console.error("URL Generation error:", error.message);

        // Handle Gemini Rate Limits (if even fallback fails)
        if (error.message.includes('429') || error.message.includes('QuotaExceeded')) {
            return res.status(429).json({
                error: 'AI Usage Limit Exceeded on all models. Please wait a minute before trying again.'
            });
        }

        const status = error.response ? error.response.status : 500;
        const msg = error.response ? `Upstream Error ${status}: ${error.response.statusText}` : error.message;
        res.status(status).json({ error: 'Failed to generate for URL. ' + msg });
    }
});

// Helper to try generation with fallback
const generateWithFallback = async (prompt, imagePart) => {
    try {
        // Try with primary model
        const modelName = "Gemini 3 Flash Preview";
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        return { text: response.text(), modelUsed: modelName };
    } catch (error) {
        // If rate limited or not found, try fallback model
        if (error.message.includes('429') || error.message.includes('QuotaExceeded') || error.message.includes('404')) {
            console.log("Primary model failed, switching to fallback Gemini model (gemini-2.0-flash)...");
            try {
                const modelName = "Gemini 2.0 Flash";
                const fallbackModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
                const result = await fallbackModel.generateContent([prompt, imagePart]);
                const response = await result.response;
                return { text: response.text(), modelUsed: modelName };
            } catch (fallbackError) {
                console.error("Gemini fallback failed:", fallbackError.message);

                // Final Fallback: OpenAI
                if (openai) {
                    console.log("Switching to OpenAI (gpt-4o-mini)...");
                    try {
                        const response = await openai.chat.completions.create({
                            model: "gpt-4o-mini",
                            messages: [
                                {
                                    role: "user",
                                    content: [
                                        { type: "text", text: prompt },
                                        { type: "image_url", image_url: { url: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}` } }
                                    ],
                                },
                            ],
                            max_tokens: 150,
                        });
                        return { text: response.choices[0].message.content, modelUsed: "GPT-4o Mini" };
                    } catch (openaiError) {
                        console.error("OpenAI fallback failed:", openaiError.message);
                        throw openaiError; // Throw if ALL fail
                    }
                }
                throw fallbackError;
            }
        }
        throw error;
    }
};

/**
 * Endpoint: POST /api/generate-alt
 * Accepts multipart/form-data with a file field named 'image'.
 */
app.post('/api/generate-alt', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        // Convert buffer to base64 for Gemini SDK
        const imagePart = {
            inlineData: {
                data: req.file.buffer.toString('base64'),
                mimeType: req.file.mimetype,
            },
        };

        const prompt = "Generate a single, concise, ADA-compliant ALT text for this image. strictly under 125 characters. Describe the main subject and action. Do not start with 'Image of' or 'Picture of'.";

        const result = await generateWithFallback(prompt, imagePart);
        res.json({ altText: result.text.trim(), modelUsed: result.modelUsed });

    } catch (error) {
        console.error("Server processing error:", error.message);

        // Handle Gemini Rate Limits (if even fallback fails)
        if (error.message.includes('429') || error.message.includes('QuotaExceeded')) {
            return res.status(429).json({
                error: 'AI Usage Limit Exceeded on all models. Please wait a minute before trying again.'
            });
        }

        res.status(500).json({ error: 'Failed to generate ALT text. ' + error.message });
    }
});

// Export the app for Vercel
export default app;

// Only listen if running locally
if (process.env.NODE_ENV !== 'production' || process.argv[1] === new URL(import.meta.url).pathname) {
    app.listen(port, () => {
        console.log(`Backend server running at http://localhost:${port}`);
    });
}
