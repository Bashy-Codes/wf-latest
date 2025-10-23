import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/Theme";

export interface TabItem {
  id: string;
  title?: string;
  iconName?: string;
}

interface TabControlProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (tabId: string) => void;
  showText?: boolean;
  showIcon?: boolean;
}

export const TabControl: React.FC<TabControlProps> = ({
  tabs,
  activeTab,
  onTabPress,
  showText = false,
  showIcon = true,
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      marginBottom: verticalScale(16),
      paddingHorizontal: scale(8),
    },
    tabButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: verticalScale(12),
      paddingHorizontal: scale(16),
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      marginHorizontal: scale(4),
      ...Platform.select({
        ios: {
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 1,
        },
        android: {
          elevation: 0.5,
        },
      }),
    },
    activeTabButton: {
      backgroundColor: theme.colors.primary,
      ...Platform.select({
        ios: {
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        },
        android: {
          elevation: 1,
        },
      }),
    },
    tabText: {
      fontSize: moderateScale(14),
      fontWeight: "600",
      color: theme.colors.text,
      marginLeft: showIcon && showText ? scale(6) : 0,
    },
    activeTabText: {
      color: theme.colors.white,
    },
  });

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              isActive && styles.activeTabButton,
            ]}
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.8}
          >
            {showIcon && tab.iconName && (
              <Ionicons
                name={tab.iconName as any}
                size={scale(18)}
                color={isActive ? theme.colors.white : theme.colors.text}
              />
            )}
            {showText && tab.title && (
              <Text
                style={[
                  styles.tabText,
                  isActive && styles.activeTabText,
                ]}
              >
                {tab.title}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};