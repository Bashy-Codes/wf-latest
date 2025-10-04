import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";

interface FloatingButtonProps {
    onPress: () => void;
    iconName: keyof typeof Ionicons.glyphMap;
    position?: {
        bottom?: number;
        right?: number;
        top?: number;
        left?: number;
    };
    backgroundColor?: string;
    iconColor?: string;
    size?: number;
    style?: ViewStyle;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
    onPress,
    iconName,
    position = { bottom: verticalScale(100), right: scale(20) },
    backgroundColor,
    iconColor,
    size = 24,
    style,
}) => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        button: {
            position: "absolute",
            width: scale(60),
            height: scale(60),
            borderRadius: scale(28),
            marginBottom: verticalScale(20),
            backgroundColor: backgroundColor || theme.colors.primary,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: theme.colors.shadow,
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
            ...position,
        },
    });

    return (
        <TouchableOpacity
            style={[styles.button, style]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Ionicons
                name={iconName}
                size={scale(size)}
                color={iconColor || theme.colors.white}
            />
        </TouchableOpacity>
    );
};