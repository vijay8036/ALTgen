/**
 * Simulates AI image analysis for ALT text generation.
 * In a real app, this would call an API like OpenAI GPT-4 Vision or Google Gemini Vision.
 */

const ALT_TEMPLATES = [
    "A high-quality photo showing dynamic content with visible text.",
    "An artistic shot capturing a specific mood with vibrant colors.",
    "A detailed view of an object with distinct features and texture.",
    "A group of people interacting in a natural setting, focused on an activity.",
    "A landscape scene with natural lighting and deep depth of field.",
    "A close-up shot emphasizing minute details and craftsmanship.",
    "A screenshot of a digital interface showing user interactions.",
    "A promotional image featuring stylized text and graphic elements."
];

// Helper to get a random template that hasn't been used recently if possible
// But for this simple mock, random is fine.
const getRandomAlt = () => {
    return ALT_TEMPLATES[Math.floor(Math.random() * ALT_TEMPLATES.length)];
}

export const analyzeImageMock = async (file) => {
    return new Promise((resolve) => {
        // Simulate network delay (2-4 seconds)
        const delay = 2000 + Math.random() * 2000;

        setTimeout(() => {
            // Basic logic based on file name or random
            let altText = "";

            if (file.name.toLowerCase().includes("screenshot")) {
                altText = "A screenshot of a software interface showing various control panels and data visualizations.";
            } else if (file.name.toLowerCase().includes("logo")) {
                altText = "A brand logo design featuring stylized typography and iconic graphic symbol.";
            } else {
                altText = getRandomAlt();
            }

            resolve(altText);
        }, delay);
    });
};
