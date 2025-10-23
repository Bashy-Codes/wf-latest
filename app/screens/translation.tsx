import React, { useState, useRef, useCallback } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Clipboard,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/lib/Theme";
import { useTranslation } from "@/hooks/useTranslation";
import { ItemPickerModal, ItemPickerModalRef } from "@/components/ItemPickerModal";
import { ScreenHeader } from "@/components/ScreenHeader";
import { TRANSLATION_LANGUAGES } from "@/hooks/useTranslation";
import { useTranslation as useT } from "react-i18next";
import { Button } from "@/components/ui/Button";

export default function TranslationScreen() {
    const { t } = useT();
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const { translate, loading, error } = useTranslation();

    const [text, setText] = useState("");
    const [targetLang, setTargetLang] = useState("EN");
    const [translatedText, setTranslatedText] = useState("");
    const [copied, setCopied] = useState(false);

    const targetPickerRef = useRef<ItemPickerModalRef>(null);

    const handleTranslate = useCallback(async () => {
        if (!text.trim() || !targetLang) return;

        const result = await translate(text, targetLang);
        if (result) {
            setTranslatedText(result);
            setCopied(false); // Reset copied state on new translation
        }
    }, [text, targetLang, translate]);

    const handleCopy = useCallback(() => {
        if (translatedText) {
            Clipboard.setString(translatedText);
            setCopied(true);
            // Reset copied state after 4 seconds
            setTimeout(() => setCopied(false), 3000);
        }
    }, [translatedText]);

    const handleTargetSelect = useCallback((selected: string[]) => {
        setTargetLang(selected[0] || "EN");
    }, []);

    const getLanguageName = (code: string | null) => {
        if (!code) return "Auto-detected";
        const lang = TRANSLATION_LANGUAGES.find(l => l.id === code);
        return lang ? `${lang.emoji} ${lang.name}` : code;
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        content: {
            flex: 1,
            paddingHorizontal: scale(20),
            paddingTop: verticalScale(20),
        },
        inputSection: {
            marginBottom: verticalScale(24),
        },
        textInput: {
            backgroundColor: theme.colors.surface,
            borderRadius: scale(theme.borderRadius.lg),
            padding: scale(16),
            fontSize: moderateScale(16),
            color: theme.colors.text,
            minHeight: verticalScale(100),
            textAlignVertical: "top",
        },
        languageSelectors: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: verticalScale(16),
        },
        languageButton: {
            flex: 1,
            backgroundColor: theme.colors.surface,
            borderRadius: scale(theme.borderRadius.md),
            padding: scale(12),
            marginHorizontal: scale(4),
            alignItems: "center",
        },
        languageText: {
            fontSize: moderateScale(14),
            color: theme.colors.text,
            fontWeight: "500",
        },
        arrowContainer: {
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: scale(8),
        },
        translateButton: {
            marginBottom: verticalScale(6)
        },
        resultSection: {
            flex: 1,
        },
        resultText: {
            backgroundColor: theme.colors.surface,
            borderRadius: scale(theme.borderRadius.lg),
            padding: scale(16),
            fontSize: moderateScale(16),
            color: theme.colors.text,
            minHeight: verticalScale(100),
            justifyContent: error ? "center" : undefined,
            alignItems: error ? "center" : undefined
        },
        copyButton: {
            marginTop: verticalScale(12)
        }
    });

    return (
        <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
            <ScreenHeader title={t("screenTitles.translation")} />

            <ScrollView
                style={styles.content}
                contentContainerStyle={{
                    paddingBottom: insets.bottom + verticalScale(20),
                }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Input Section */}
                <View style={styles.inputSection}>
                    <TextInput
                        style={styles.textInput}
                        value={text}
                        onChangeText={setText}
                        placeholder={t("common.enterText")}
                        placeholderTextColor={theme.colors.textMuted}
                        multiline
                    />
                </View>

                {/* Language Selectors */}
                <View style={styles.languageSelectors}>
                    <View style={styles.languageButton}>
                        <MaterialIcons name="auto-awesome" color={theme.colors.primary} size={scale(18)} />
                    </View>

                    <View style={styles.arrowContainer}>
                        <Ionicons
                            name="arrow-forward"
                            size={scale(20)}
                            color={theme.colors.textMuted}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.languageButton}
                        onPress={() => targetPickerRef.current?.present()}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.languageText}>{getLanguageName(targetLang)}</Text>
                    </TouchableOpacity>
                </View>

                {/* Translate Button */}
                <TouchableOpacity
                    style={styles.translateButton}
                    onPress={handleTranslate}
                    activeOpacity={0.7}
                    disabled={loading || !text.trim() || !targetLang}
                >
                    <Button iconName="checkmark" onPress={handleTranslate} style={styles.translateButton} disabled={!text.trim() || !targetLang} loading={loading} />
                </TouchableOpacity>

                {/* Result Section */}
                <View style={styles.resultSection}>
                    {error ? (
                        <View style={styles.resultText}>
                            <Ionicons name="alert-circle" size={scale(46)} color={theme.colors.error} />
                        </View>
                    ) : (
                        <Text style={styles.resultText}>{translatedText}</Text>
                    )}
                </View>
                {translatedText && (
                    <Button
                        style={styles.copyButton}
                        onPress={handleCopy}
                        iconName={copied ? "checkmark-circle" : "copy"}
                        iconSize={scale(18)}
                        iconColor={copied ? theme.colors.success : theme.colors.primary}
                        bgColor={theme.colors.surface}
                    >
                    </Button>
                )}
            </ScrollView>

            {/* Target Language Picker */}
            <ItemPickerModal
                ref={targetPickerRef}
                items={TRANSLATION_LANGUAGES}
                selectedItems={[targetLang]}
                onSelectionChange={handleTargetSelect}
                onConfirm={() => { }}
                multiSelect={false}
                minSelection={1}
            />
        </SafeAreaView>
    );
};