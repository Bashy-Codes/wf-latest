import React, { memo, useCallback, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/Theme";
import { PostTypes } from "@/types/feed";
import { formatTimeAgo } from "@/utils/formatTime";
import { Id } from "@/convex/_generated/dataModel";
import { Separator } from "@/components/common/Separator";
import { AddReactionModal } from "./AddReactionModal";
import { PostMeta } from "./PostMeta";
import { PostImages } from "./PostImages";
import NameContainer from "@/components/ui/NameContainer";

// Props for Post Card
interface PostCardProps {
  post: PostTypes;
  onReaction: (postId: Id<"posts">, emoji: string) => void;
  onComment: (postId: Id<"posts">) => void;
  onImagePress: (images: string[], index: number) => void;
  onReadMore: (postId: Id<"posts">) => void;
  onReactionsPress: (postId: Id<"posts">) => void;
  onUserPress?: (userId: Id<"users">, isOwner: boolean, isAdmin: boolean) => void;
  onOptionsPress?: (post: PostTypes) => void;
  showFullText?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const PostCardComponent: React.FC<PostCardProps> = ({
  post,
  onReaction,
  onComment,
  onImagePress,
  onReadMore,
  onReactionsPress,
  onUserPress,
  onOptionsPress,
  showFullText = false,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [showAddReactionModal, setShowAddReactionModal] = useState(false);

  const handleReaction = useCallback((postId: Id<"posts">, emoji: string) => {
    onReaction(postId, emoji);
  }, [onReaction]);

  const handleReactionsPress = useCallback(() => {
    onReactionsPress(post.postId);
  }, [post.postId, onReactionsPress]);

  const handleReactionButtonPress = useCallback(() => {
    setShowAddReactionModal(true);
  }, []);

  const handleCommentPress = useCallback(() => {
    onComment(post.postId);
  }, [post.postId, onComment]);

  const closeAddReactionModal = useCallback(() => {
    setShowAddReactionModal(false);
  }, []);

  const handleUserPress = useCallback(() => {
    onUserPress?.(post.postAuthor.userId, post.isOwner, post.postAuthor.isAdmin || false);
  }, [post.postAuthor.userId, post.isOwner, post.postAuthor.isAdmin, onUserPress]);

  const handleOptionsPress = useCallback(() => {
    onOptionsPress?.(post);
  }, [post, onOptionsPress]);

  const handleReadMore = useCallback(() => {
    onReadMore(post.postId);
  }, [post.postId, onReadMore]);

  const handleImagePress = useCallback((index: number = 0) => {
    if (post.postImages && post.postImages.length > 0) {
      onImagePress?.(post.postImages, index);
    }
  }, [post.postImages, onImagePress]);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      width: SCREEN_WIDTH,
      marginBottom: verticalScale(1),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(12),
    },
    userSection: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    profilePicture: {
      width: scale(48),
      height: scale(48),
      borderRadius: scale(theme.borderRadius.full),
      marginRight: scale(12),
    },
    userInfo: {
      flex: 1,
    },

    timeContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    timeText: {
      fontSize: moderateScale(12),
      color: theme.colors.textMuted,
    },
    moreButton: {
      padding: scale(8),
    },
    content: {
      paddingHorizontal: scale(16),
      marginBottom: verticalScale(12),
    },
    contentText: {
      fontSize: moderateScale(15),
      color: theme.colors.text,
      lineHeight: moderateScale(20),
    },
    readMoreText: {
      color: theme.colors.primary,
      fontWeight: "700",
    },

    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: scale(20),
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.userSection}
          onPress={handleUserPress}
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: post.postAuthor.profilePicture }}
            style={styles.profilePicture}
            contentFit="cover"
            priority="normal"
            cachePolicy={"memory"}
            placeholder={"@/assets/images/user.png"}
            placeholderContentFit="scale-down"
          />
          <View style={styles.userInfo}>
            <NameContainer
              name={post.postAuthor.name}
              isAdmin={post.postAuthor.isAdmin}
              activeBadge={post.postAuthor.activeBadge}
              size={18}
              style={{ margin: 0, justifyContent: "flex-start", marginBottom: verticalScale(2) }}
            />
            <View style={styles.timeContainer}>
              <Ionicons
                name="time"
                size={scale(12)}
                color={theme.colors.success}
              />
              <Text style={styles.timeText}>
                {formatTimeAgo(post.createdAt)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        {/* Show ellipsis button only if not admin post */}
        {!post.postAuthor.isAdmin && onOptionsPress && (
          <TouchableOpacity
            style={styles.moreButton}
            onPress={handleOptionsPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={scale(20)}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <TouchableOpacity activeOpacity={0.8} onPress={handleReadMore} style={styles.content}>
        <Text style={styles.contentText} numberOfLines={3} ellipsizeMode="tail">
          {post.content}
        </Text>
      </TouchableOpacity>
      {/* Images */}
      {post.postImages && post.postImages.length > 0 && (
        <>
          <Separator customOptions={["⋆｡✿ ⋆ ── ⋆ ✿｡⋆"]} />
          <PostImages images={post.postImages} onImagePress={handleImagePress} />
        </>
      )}
      {/* Post Meta - Tags and Actions */}
      <PostMeta
        postId={post.postId}
        reactionsCount={post.reactionsCount}
        commentsCount={post.commentsCount}
        hasReacted={post.hasReacted}
        userReaction={post.userReaction}
        onReactionButtonPress={handleReactionButtonPress}
        onReactionsPress={handleReactionsPress}
        onCommentPress={handleCommentPress}
      />

      {/* Add Reaction Modal */}
      <AddReactionModal
        visible={showAddReactionModal}
        postId={post.postId}
        currentReaction={post.userReaction}
        onClose={closeAddReactionModal}
        onReaction={handleReaction}
      />
    </View>
  );
};

export const PostCard = memo(PostCardComponent);