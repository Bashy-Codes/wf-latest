import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";
import { Discussion } from "@/types/discussions";
import { formatTimeAgo } from "@/utils/formatTime";

interface DiscussionCardProps {
  discussion: Discussion;
  onPress: (discussion: Discussion) => void;
}

export const DiscussionCard: React.FC<DiscussionCardProps> = ({
  discussion,
  onPress,
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: scale(16),
      marginBottom: verticalScale(12),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: verticalScale(12),
    },
    profileImage: {
      width: scale(40),
      height: scale(40),
      borderRadius: scale(20),
      marginRight: scale(12),
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: moderateScale(14),
      fontWeight: "600",
      color: theme.colors.text,
    },
    timeText: {
      fontSize: moderateScale(12),
      color: theme.colors.textSecondary,
      marginTop: verticalScale(2),
    },
    title: {
      fontSize: moderateScale(16),
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: verticalScale(8),
    },
    content: {
      fontSize: moderateScale(14),
      color: theme.colors.textSecondary,
      lineHeight: moderateScale(20),
      marginBottom: verticalScale(12),
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    repliesContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    repliesText: {
      fontSize: moderateScale(12),
      color: theme.colors.textSecondary,
      marginRight: scale(4),
    },
    discussionImage: {
      width: "100%",
      height: verticalScale(200),
      borderRadius: theme.borderRadius.md,
      marginBottom: verticalScale(12),
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(discussion)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Image
          source={{ uri: discussion.discussionAuthor.profilePicture }}
          style={styles.profileImage}
          contentFit="cover"
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{discussion.discussionAuthor.name}</Text>
          <Text style={styles.timeText}>{formatTimeAgo(discussion.createdAt)}</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {discussion.title}
      </Text>
      <Text style={styles.content} numberOfLines={3} ellipsizeMode="tail">
        {discussion.content}
      </Text>

      {discussion.imageUrl && (
        <Image
          source={{ uri: discussion.imageUrl }}
          style={styles.discussionImage}
          contentFit="cover"
        />
      )}

      <View style={styles.footer}>
        <View style={styles.repliesContainer}>
          <Text style={styles.repliesText}>
            {discussion.repliesCount}
          </Text>
          <Ionicons
            name="chatbubble-outline"
            size={scale(16)}
            color={theme.colors.textSecondary}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};