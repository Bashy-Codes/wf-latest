import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";
import { Community } from "@/types/communities";

interface CommunityCardProps {
  community: Community;
  onPress: (community: Community) => void;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({
  community,
  onPress,
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      marginBottom: verticalScale(12),
      overflow: "hidden",
    },
    banner: {
      width: "100%",
      height: verticalScale(120),
      backgroundColor: theme.colors.surfaceSecondary,
    },
    content: {
      padding: scale(16),
    },
    title: {
      fontSize: moderateScale(16),
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: verticalScale(4),
    },
    description: {
      fontSize: moderateScale(14),
      color: theme.colors.textSecondary,
      lineHeight: moderateScale(20),
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(community)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: community.bannerUrl || "https://storage.worldfriends.app/community" }}
        style={styles.banner}
        contentFit="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {community.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};