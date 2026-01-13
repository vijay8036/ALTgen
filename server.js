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
import { fileURLToPath } from 'url';

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

// Helper to get Gemini Instance safely
// This avoids top-level throws that would crash Vercel initialization if env vars are missing
const getGenAI = () => {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY is not set in environment variables.");
    return new GoogleGenerativeAI(key);
};

// Initialize OpenAI (Optional but recommended for fallback)
const openaiApiKey = process.env.OPENAI_API_KEY;
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;
if (!openai && process.env.NODE_ENV !== 'production') console.warn("OPENAI_API_KEY not found. OpenAI fallback will be disabled.");

// Helper to try generation with fallback
const generateWithFallback = async (prompt, imagePart) => {
    try {
        const genAI = getGenAI();
        const modelName = "Gemini 3 Flash Preview";
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        return { text: response.text(), modelUsed: modelName };
    } catch (error) {
        // Propagate missing key error explicitly
        if (error.message.includes('GEMINI_API_KEY')) {
            throw error;
        }

        const genAI = getGenAI();

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
                    try {
                        src = new URL(src, url).href;
                    } catch (e) {
                        return; // skip invalid
                    }
                }

                // Strict filtering for supported AI formats
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
                'Referer': imageUrl
            },
            httpsAgent: httpsAgent,
            timeout: 15000
        });
        const buffer = Buffer.from(imageResponse.data, 'binary');
        const mimeType = imageResponse.headers['content-type'] || 'image/jpeg';

        // Validate MIME type before sending to AI
        const supportedMimes = ['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif'];
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

        const prompt = `Analyze the provided image and generate ONE clear, human-readable, ADA-compliant ALT text.
                        Rules:
                        - Maximum length: 125 characters (strict).
                        - Describe only what is visually present (main subject + action).
                        - Use simple, natural language that is easy to read.
                        - Do NOT start with: "image of", "picture of", "photo of", or similar phrases.
                        - Avoid keyword stuffing, repetition, or assumptions.
                        - If the image represents a WEBSITE, WEB PAGE, or APP SCREEN:
                        - Combine the visual elements with the website context in a single ALT text.
                        - Clearly describe what the page shows and its purpose (e.g., dashboard, landing page, form).
                        - If multiple elements exist, focus on the primary visual purpose.
                        - Ensure the output is suitable for screen readers and follows ADA & HTML accessibility rules.

                        Output:
                        - Return ONLY the final ALT text.
                        - No quotes, no explanations, no extra text.`;

        // Use the unified fallback function
        const result = await generateWithFallback(prompt, imagePart);

        res.json({ altText: result.text.trim(), modelUsed: result.modelUsed });

    } catch (error) {
        console.error("URL Generation error:", error.message);

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

        const prompt = `Analyze the provided image and generate ONE clear, human-readable, ADA-compliant ALT text.
                        Rules:
                        - Maximum length: 125 characters (strict).
                        - Describe only what is visually present (main subject + action).
                        - Use simple, natural language that is easy to read.
                        - Do NOT start with: "image of", "picture of", "photo of", or similar phrases.
                        - Avoid keyword stuffing, repetition, or assumptions.
                        - If the image represents a WEBSITE, WEB PAGE, or APP SCREEN:
                        - Combine the visual elements with the website context in a single ALT text.
                        - Clearly describe what the page shows and its purpose (e.g., dashboard, landing page, form).
                        - If multiple elements exist, focus on the primary visual purpose.
                        - Ensure the output is suitable for screen readers and follows ADA & HTML accessibility rules.

                        Output:
                        - Return ONLY the final ALT text.
                        - No quotes, no explanations, no extra text.`;

        const result = await generateWithFallback(prompt, imagePart);
        res.json({ altText: result.text.trim(), modelUsed: result.modelUsed });

    } catch (error) {
        console.error("Server processing error:", error.message);

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
// Safe check that works on all platforms (Mac/Windows/Linux)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    app.listen(port, () => {
        console.log(`Backend server running at http://localhost:${port}`);
    });
}
