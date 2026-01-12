import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

// 1x1 Transparent PNG
const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');

async function test() {
    const form = new FormData();
    form.append('image', buffer, { filename: 'test.png', contentType: 'image/png' });

    try {
        console.log("Sending request to backend...");
        const response = await fetch('http://localhost:3000/api/generate-alt', {
            method: 'POST',
            body: form
        });

        if (!response.ok) {
            const txt = await response.text();
            throw new Error(`Server Error ${response.status}: ${txt}`);
        }

        const data = await response.json();
        console.log("✅ API Test Success!");
        console.log("Received ALT Text:", data.altText);
    } catch (e) {
        console.error("❌ API Test Failed:", e.message);
    }
}

test();
