import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/Theme";

interface QuizButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export const QuizButton: React.FC<QuizButtonProps> = ({ onPress, disabled }) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    button: {
      borderRadius: theme.borderRadius.xl,
      overflow: "hidden",
      marginVertical: verticalScale(20),
      elevation: 4,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    gradient: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: scale(18),
      gap: scale(12),
    },
    icon: {
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: theme.borderRadius.full,
      padding: scale(8),
    },
    text: {
      fontSize: scale(18),
      fontWeight: "700",
      color: theme.colors.white,
    },
    disabled: {
      opacity: 0.5,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[theme.colors.primary, "#9C27B0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Ionicons name="school" size={scale(24)} color={theme.colors.white} />
        <Text style={styles.text}>Start Quiz</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};
