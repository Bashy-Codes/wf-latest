import React from "react";
import {
    StyleSheet,
    TouchableOpacity,
    Text,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";
import { Flashcard } from "@/types/study";

interface FlashCardProps {
    flashcard: Flashcard;
    onView?: () => void;
}

export const FlashCard: React.FC<FlashCardProps> = ({
    flashcard,
    onView,
}) => {
    const theme = useTheme();

    const handlePress = () => {
        if (onView) {
            onView();
        }
    };

    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            padding: scale(32),
            marginHorizontal: scale(16),
            marginVertical: scale(12),
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
            minHeight: verticalScale(220),
            justifyContent: "center",
            alignItems: "center",
        },
        text: {
            fontSize: scale(24),
            fontWeight: "600",
            color: theme.colors.text,
            textAlign: "center",
            lineHeight: scale(32),
        },
    });

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handlePress}
            activeOpacity={0.9}
        >
            <Text style={styles.text}>{flashcard.word}</Text>
        </TouchableOpacity>
    );
};