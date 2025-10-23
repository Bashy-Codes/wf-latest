import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

// Translation endpoint
const translate = httpAction(async (ctx, request) => {
    if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    const { text, source_lang, target_lang } = await request.json();

    if (!text || !target_lang) {
        return new Response('Missing text or target_lang', { status: 400 });
    }

    const apiKey = process.env.DEEPL_API_KEY;
    if (!apiKey) {
        return new Response('API key not configured', { status: 500 });
    }

    try {
        const response = await fetch('https://api-free.deepl.com/v2/translate', {
            method: 'POST',
            headers: {
                'Authorization': `DeepL-Auth-Key ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: [text],
                source_lang: source_lang || null,
                target_lang,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return new Response(JSON.stringify(data), { status: response.status });
        }

        const translated = data.translations[0].text;
        return new Response(JSON.stringify({ translated }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        return new Response('Translation service error', { status: 500 });
    }
});

http.route({
    path: "/translate",
    method: "POST",
    handler: translate,
});

export default http;
