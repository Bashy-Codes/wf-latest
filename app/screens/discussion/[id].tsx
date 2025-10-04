import React from "react";
import { StyleSheet, View, ScrollView, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@/lib/Theme";
import { useDiscussion } from "@/hooks/useDiscussion";
import { Id } from "@/convex/_generated/dataModel";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { formatTimeAgo } from "@/utils/formatTime";

// UI components
import { ScreenHeader } from "@/components/ScreenHeader";
import { ScreenLoading } from "@/components/ScreenLoading";
import { KeyboardHandler } from "@/components/common/KeyboardHandler";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { ThreadInput } from "@/components/communities/ThreadInput";
import { ThreadItem } from "@/components/communities/ThreadItem";
import { Separator } from "@/components/common/Separator";
import { EmptyState } from "@/components/EmptyState";
import { ImageViewer } from "@/components/common/ImageViewer";

export default function DiscussionScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams();
  const discussionId = id as Id<"discussions">;
  const [showImageViewer, setShowImageViewer] = React.useState(false);

  const {
    discussion,
    threads,
    isLoading,
    isLoadingThreads,
    replyToThread,
    showDeleteModal,
    showDeleteDiscussionModal,
    handleLoadMoreThreads,
    handleDeleteThread,
    handleReplyToThread,
    handleCancelReply,
    handleSubmitThread,
    handleConfirmDelete,
    handleCloseDeleteModal,
    handleDeleteDiscussion,
    handleConfirmDeleteDiscussion,
    handleCloseDeleteDiscussionModal,
  } = useDiscussion(discussionId);

  const renderThreadItem = React.useCallback(
    ({ item }: { item: any }) => (
      <ThreadItem
        thread={item}
        onDeletePress={handleDeleteThread}
        onReplyPress={handleReplyToThread}
      />
    ),
    [handleDeleteThread, handleReplyToThread]
  );

  const renderLoader = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );

  const renderEmptyState = () => (
    <EmptyState halfScreen />
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
    discussionContainer: {
      padding: scale(16),
      marginBottom: verticalScale(8),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: verticalScale(12),
    },
    profileImage: {
      width: scale(48),
      height: scale(48),
      borderRadius: scale(24),
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
    title: {
      fontSize: moderateScale(18),
      fontWeight: "700",
      color: theme.colors.text,
      marginBottom: verticalScale(12),
    },
    discussionText: {
      fontSize: moderateScale(15),
      lineHeight: moderateScale(22),
      color: theme.colors.text,
      marginBottom: verticalScale(12),
    },
    discussionImage: {
      width: "100%",
      height: verticalScale(250),
      borderRadius: theme.borderRadius.md,
      marginTop: verticalScale(12),
    },
    threadsContainer: {
      flex: 1,
      paddingHorizontal: scale(8),
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: verticalScale(40),
    },
    listContent: {
      paddingVertical: verticalScale(8),
    },
  });

  if (isLoading) {
    return <ScreenLoading />;
  }

  if (!discussion) {
    return <EmptyState fullScreen />;
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <ScreenHeader
        title={discussion.communityTitle}
        rightComponent={discussion.canDelete ? "ellipsis" : null}
        onRightPress={discussion.canDelete ? handleDeleteDiscussion : undefined}
      />
      <KeyboardHandler enabled={true} style={styles.content}>
        <ScrollView contentContainerStyle={styles.listContent}>
          {/* Discussion Card */}
          <View style={styles.discussionContainer}>
            <View style={styles.header}>
              <Image
                source={{ uri: discussion.discussionAuthor.profilePicture }}
                style={styles.profileImage}
                contentFit="cover"
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {discussion.discussionAuthor.name}
                </Text>
                <Text style={styles.timeText}>
                  {formatTimeAgo(discussion.createdAt)}
                </Text>
              </View>
            </View>
            <Text style={styles.title}>{discussion.title}</Text>
            <Text style={styles.discussionText} selectable={true}>
              {discussion.content}
            </Text>
            {discussion.imageUrl && (
              <TouchableOpacity
                onPress={() => setShowImageViewer(true)}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: discussion.imageUrl }}
                  style={styles.discussionImage}
                  contentFit="cover"
                />
              </TouchableOpacity>
            )}
          </View>

          <Separator />

          {/* Threads List */}
          <View style={styles.threadsContainer}>
            {isLoadingThreads ? (
              renderLoader()
            ) : (
              <FlashList
                data={threads}
                keyExtractor={(item) => item.threadId}
                renderItem={renderThreadItem}
                onEndReached={handleLoadMoreThreads}
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyState}
              />
            )}
          </View>
        </ScrollView>

        {/* Thread Input at Bottom */}
        <ThreadInput
          onSubmitThread={handleSubmitThread}
          replyToThread={replyToThread}
          onCancelReply={handleCancelReply}
        />
      </KeyboardHandler>

      {/* Thread Delete Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteModal}
        icon="trash-outline"
        description="Are you sure you want to delete this reply?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteModal}
      />

      {/* Discussion Delete Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteDiscussionModal}
        icon="trash-outline"
        description="Are you sure you want to delete this discussion? All replies will be deleted."
        onConfirm={handleConfirmDeleteDiscussion}
        onCancel={handleCloseDeleteDiscussionModal}
      />

      {/* Image Viewer */}
      {discussion.imageUrl && (
        <ImageViewer
          images={[{ uri: discussion.imageUrl }]}
          imageIndex={0}
          visible={showImageViewer}
          onRequestClose={() => setShowImageViewer(false)}
        />
      )}
    </SafeAreaView>
  );
}