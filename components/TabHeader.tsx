import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";
import { useRouter } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface TabHeaderProps {
  title: string;
  onNotificationPress?: () => void;
}

export const TabHeader: React.FC<TabHeaderProps> = ({ title }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const hasUnreadNotifications = useQuery(api.notifications.hasUnreadNotifications);

  const handleNotificationPress = useCallback(() => {
    router.push("/screens/notifications");
  }, []);

  const handleTranslationPress = useCallback(() => {
    router.push("/screens/translation");
  }, []);

  const handleStorePress = useCallback(() => {
    router.push("/screens/store");
  }, []);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      paddingTop: insets.top + verticalScale(8),
      paddingHorizontal: scale(16),
      paddingBottom: verticalScale(16),
      borderBottomLeftRadius: scale(theme.borderRadius.xl),
      borderBottomRightRadius: scale(theme.borderRadius.xl),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      overflow: "visible",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
    },
    title: {
      fontSize: moderateScale(26),
      fontWeight: "700",
      color: theme.colors.text,
      flex: 1,
    },
    iconButton: {
      padding: scale(8),
      borderRadius: scale(theme.borderRadius.xl),
      backgroundColor: theme.colors.background,
      position: "relative",
    },
    button: {
      padding: scale(8),
      borderRadius: scale(theme.borderRadius.lg),
      backgroundColor: theme.colors.background,
      marginLeft: scale(8),
      position: "relative",
    },
  });

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleTranslationPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name="language-outline"
            size={scale(24)}
            color={theme.colors.text}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleStorePress}
          activeOpacity={0.7}
        >
          <Ionicons
            name="storefront"
            size={scale(24)}
            color={theme.colors.text}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleNotificationPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name={hasUnreadNotifications ? "notifications" : "notifications-outline"}
            size={scale(24)}
            color={hasUnreadNotifications ? theme.colors.error : theme.colors.text}
          />
        </TouchableOpacity>
      </View>


    </>
  );
};
