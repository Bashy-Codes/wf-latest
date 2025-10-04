import { PickerItem } from '@/components/ItemPickerModal';
import { useState } from 'react';

// Supported languages for translation
export const TRANSLATION_LANGUAGES: PickerItem[] = [
    { id: "BG", name: "Bulgarian", emoji: "🇧🇬" },
    { id: "CS", name: "Czech", emoji: "🇨🇿" },
    { id: "DA", name: "Danish", emoji: "🇩🇰" },
    { id: "DE", name: "German", emoji: "🇩🇪" },
    { id: "EL", name: "Greek", emoji: "🇬🇷" },
    { id: "EN-US", name: "English", emoji: "🇺🇸" },
    { id: "ES", name: "Spanish", emoji: "🇪🇸" },
    { id: "ET", name: "Estonian", emoji: "🇪🇪" },
    { id: "FI", name: "Finnish", emoji: "🇫🇮" },
    { id: "FR", name: "French", emoji: "🇫🇷" },
    { id: "HU", name: "Hungarian", emoji: "🇭🇺" },
    { id: "IT", name: "Italian", emoji: "🇮🇹" },
    { id: "JA", name: "Japanese", emoji: "🇯🇵" },
    { id: "LT", name: "Lithuanian", emoji: "🇱🇹" },
    { id: "LV", name: "Latvian", emoji: "🇱🇻" },
    { id: "NL", name: "Dutch", emoji: "🇳🇱" },
    { id: "PL", name: "Polish", emoji: "🇵🇱" },
    { id: "PT-BR", name: "Portuguese", emoji: "🇧🇷" },
    { id: "PT-PT", name: "Portuguese", emoji: "🇵🇹" },
    { id: "RO", name: "Romanian", emoji: "🇷🇴" },
    { id: "RU", name: "Russian", emoji: "🇷🇺" },
    { id: "SK", name: "Slovak", emoji: "🇸🇰" },
    { id: "SL", name: "Slovenian", emoji: "🇸🇮" },
    { id: "SV", name: "Swedish", emoji: "🇸🇪" },
    { id: "ZH", name: "Chinese", emoji: "🇨🇳" },
];

export const useTranslation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const translate = async (text: string, targetLang: string) => {
        setLoading(true);
        setError(null);
        try {
            const baseUrl = process.env.EXPO_PUBLIC_CONVEX_URL!.replace('.convex.cloud', '.convex.site');
            const response = await fetch(`${baseUrl}/translate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    target_lang: targetLang,
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            return data.translated;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Translation failed');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { translate, loading, error };
};