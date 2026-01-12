export const scanWebsite = async (url) => {
    const response = await fetch('http://localhost:3000/api/scan-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
    });

    if (!response.ok) {
        throw new Error('Failed to scan website');
    }

    return response.json();
};

export const generateAltFromUrl = async (imageUrl) => {
    const response = await fetch('http://localhost:3000/api/generate-alt-from-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to generate ALT text');
    }

    const data = await response.json();
    return data.altText;
};
