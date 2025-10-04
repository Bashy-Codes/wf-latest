import React, { useState, memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";
import { formatTimeAgo } from "@/utils/formatTime";
import { Id } from "@/convex/_generated/dataModel";
import { Thread } from "@/types/discussions";

export interface ThreadItemProps {
  thread: Thread;
  onDeletePress: (threadId: Id<"discussionThreads">) => void;
  onReplyPress: (thread: Thread) => void;
}

export const ThreadItem: React.FC<ThreadItemProps> = memo(({
  thread,
  onDeletePress,
  onReplyPress,
}) => {
  const theme = useTheme();
  const [isReplyExpanded, setIsReplyExpanded] = useState(false);

  const handleToggleReply = () => {
    setIsReplyExpanded(!isReplyExpanded);
  };

  const handleReply = () => {
    onReplyPress(thread);
  };

  const handleDelete = () => {
    onDeletePress(thread.threadId);
  };

  const handleDeleteReply = () => {
    if (thread.reply) {
      onDeletePress(thread.reply.threadId);
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      marginVertical: verticalScale(6),
      borderRadius: moderateScale(16),
      padding: scale(16),
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
      fontSize: moderateScale(15),
      fontWeight: "600",
      color: theme.colors.text,
    },
    timeText: {
      fontSize: moderateScale(12),
      color: theme.colors.textMuted,
      marginTop: verticalScale(2),
    },
    threadText: {
      fontSize: moderateScale(14),
      lineHeight: moderateScale(20),
      color: theme.colors.text,
      marginBottom: verticalScale(4),
    },
    deleteButton: {
      padding: scale(8),
      borderRadius: moderateScale(20),
      backgroundColor: theme.colors.background,
    },
    actionsContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: verticalScale(8),
      gap: scale(16),
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: scale(4),
    },
    actionText: {
      fontSize: moderateScale(12),
      color: theme.colors.textMuted,
      fontWeight: "500",
    },
    replyContainer: {
      marginTop: verticalScale(12),
      marginLeft: scale(20),
      position: "relative",
    },
    replyLinkLine: {
      position: "absolute",
      left: scale(-15),
      top: scale(-8),
      width: scale(15),
      height: scale(20),
      borderLeftWidth: 2,
      borderBottomWidth: 2,
      borderColor: theme.colors.primary + "60",
      borderBottomLeftRadius: scale(8),
    },
    replyItem: {
      backgroundColor: theme.colors.background,
      borderRadius: moderateScale(12),
      padding: scale(12),
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.primary + "40",
    },
    replyHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: verticalScale(8),
    },
    replyProfileImage: {
      width: scale(32),
      height: scale(32),
      borderRadius: scale(16),
      marginRight: scale(8),
    },
    replyUserInfo: {
      flex: 1,
    },
    replyUserName: {
      fontSize: moderateScale(13),
      fontWeight: "600",
      color: theme.colors.text,
    },
    replyTimeText: {
      fontSize: moderateScale(11),
      color: theme.colors.textMuted,
      marginTop: verticalScale(1),
    },
    replyText: {
      fontSize: moderateScale(13),
      lineHeight: moderateScale(18),
      color: theme.colors.text,
    },
    replyDeleteButton: {
      padding: scale(4),
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: thread.threadAuthor.profilePicture }}
          style={styles.profileImage}
          contentFit="cover"
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>
            {thread.threadAuthor.name}
          </Text>
          <Text style={styles.timeText}>
            {formatTimeAgo(thread.createdAt)}
          </Text>
        </View>
        {thread.isOwner && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Ionicons
              name="trash-outline"
              size={scale(16)}
              color={theme.colors.error}
            />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.threadText} selectable={true}>
        {thread.content}
      </Text>

      <View style={styles.actionsContainer}>
        {thread.hasReply ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleToggleReply}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isReplyExpanded ? "remove" : "add"}
              size={scale(14)}
              color={theme.colors.textMuted}
            />
            <Text style={styles.actionText}>
              {isReplyExpanded ? "Hide reply" : "Show reply"}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleReply}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-undo"
              size={scale(14)}
              color={theme.colors.textMuted}
            />
            <Text style={styles.actionText}>Reply</Text>
          </TouchableOpacity>
        )}
      </View>

      {thread.hasReply && thread.reply && isReplyExpanded && (
        <View style={styles.replyContainer}>
          <View style={styles.replyLinkLine} />
          <View style={styles.replyItem}>
            <View style={styles.replyHeader}>
              <Image
                source={{ uri: thread.reply.threadAuthor.profilePicture }}
                style={styles.replyProfileImage}
              />
              <View style={styles.replyUserInfo}>
                <Text style={styles.replyUserName} numberOfLines={1}>
                  {thread.reply.threadAuthor.name}
                </Text>
                <Text style={styles.replyTimeText}>
                  {formatTimeAgo(thread.reply.createdAt)}
                </Text>
              </View>
              {thread.reply.isOwner && (
                <TouchableOpacity
                  style={styles.replyDeleteButton}
                  onPress={handleDeleteReply}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="trash-outline"
                    size={scale(14)}
                    color={theme.colors.error}
                  />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.replyText}>{thread.reply.content}</Text>
          </View>
        </View>
      )}
    </View>
  );
});

ThreadItem.displayName = "ThreadItem";