import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  TextInput,
} from "react-native";
import { Image } from "expo-image";
import { scale, verticalScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";
import { Ionicons } from "@expo/vector-icons";

interface StoreSearchProps {
  onSearch: (query: string) => void;
  placeholder: string;
}

export const StoreSearch: React.FC<StoreSearchProps> = ({ onSearch, placeholder }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    onSearch(text);
  }, [onSearch]);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      paddingVertical: verticalScale(20),
      paddingHorizontal: scale(16),
      alignItems: "center",
      borderRadius: theme.borderRadius.lg
    },
    iconContainer: {
      marginBottom: verticalScale(24),
      alignItems: "center",
      shadowColor: theme.colors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    storeIcon: {
      width: scale(100),
      height: scale(100),
    },
    searchContainer: {
      width: "100%",
      position: "relative",
    },
    searchInput: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(12),
      paddingLeft: scale(44),
      fontSize: scale(16),
      color: theme.colors.text,
    },
    searchIcon: {
      position: "absolute",
      left: scale(14),
      top: verticalScale(14),
      zIndex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image
          source={{ uri: "https://storage.worldfriends.app/wf-store.png" }}
          style={styles.storeIcon}
          contentFit="cover"
        />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={scale(20)}
          color={theme.colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={handleSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
};