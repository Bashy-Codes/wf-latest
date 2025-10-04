import React, { memo } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";

interface GiftCardProps {
  title: string;
  onPress: () => void;
}

const GiftCardComponent: React.FC<GiftCardProps> = ({ title, onPress }) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: scale(16),
      marginBottom: verticalScale(16),
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    image: {
      width: "100%",
      height: verticalScale(120),
      borderRadius: theme.borderRadius.md,
      marginBottom: verticalScale(24),
    },
    title: {
      padding: scale(12),
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background,
      fontSize: moderateScale(18),
      fontWeight: "600",
      color: theme.colors.text,
      textAlign: "center",
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: "https://storage.worldfriends.app/gift-icon" }}
        style={styles.image}
        contentFit="contain"
        transition={{ duration: 300, effect: "cross-dissolve" }}
      />
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export const GiftCard = memo(GiftCardComponent);