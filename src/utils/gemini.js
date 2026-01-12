/**
 * Generates ALT text by calling the local backend server.
 */
export const generateAltText = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch('http://localhost:3000/api/generate-alt', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        const data = await response.json();
        return { altText: data.altText, modelUsed: data.modelUsed };
    } catch (error) {
        console.error("API Error:", error);
        throw new Error(error.message || "Failed to generate ALT text.");
    }
};
