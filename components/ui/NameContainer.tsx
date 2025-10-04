import React, { memo } from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";

interface NameContainerProps {
  name: string;
  isAdmin?: boolean;
  isSupporter?: boolean;
  size?: number;
  style?: ViewStyle;
}

const NameContainer: React.FC<NameContainerProps> = ({
  name,
  isAdmin = false,
  isSupporter = false,
  size = 24,
  style
}) => {
  const theme = useTheme();

  const fontSize = moderateScale(size);
  const iconSize = scale(size * 0.75);
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
    },
    verifiedIcon: {
      marginLeft: scale(6),
    },
    supporterIcon: {
      marginLeft: scale(4),
      paddingTop: scale(6)
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
      {isSupporter && (
        <Ionicons
          name="heart"
          size={iconSize}
          color={theme.colors.secondary}
          style={styles.supporterIcon}
        />
      )}
    </View>
  );
};

export default memo(NameContainer);