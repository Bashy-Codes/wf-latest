import React, { memo } from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";

interface NameContainerProps {
  name: string;
  isAdmin?: boolean;
  activeBadge?: string;
  size?: number;
  style?: ViewStyle;
}

const NameContainer: React.FC<NameContainerProps> = ({
  name,
  isAdmin = false,
  activeBadge,
  size = 24,
  style
}) => {
  const theme = useTheme();

  const fontSize = moderateScale(size);
  const iconSize = scale(size * 0.80);
  const marginBottom = verticalScale(size >= 24 ? 12 : 8);

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      margin: marginBottom,
    },
    name: {
      fontSize: fontSize,
      fontWeight: "700",
      color: theme.colors.text,
      textAlign: "center",
      textAlignVertical: "center",
    },
    verifiedIcon: {
      marginLeft: scale(6),
    },
    badgeIcon: {
      marginLeft: scale(4),
      width: iconSize,
      height: iconSize,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.name}>{name}</Text>
      {isAdmin && (
        <Ionicons
          name="shield-checkmark"
          size={iconSize}
          color={theme.colors.primary}
          style={styles.verifiedIcon}
        />
      )}
      {activeBadge && (
        <Image
          source={{ uri: `https://storage.worldfriends.app/${activeBadge}` }}
          style={styles.badgeIcon}
          contentFit="contain"
        />
      )}
    </View>
  );
};

export default memo(NameContainer);