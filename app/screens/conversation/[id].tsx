import React, { useCallback, useMemo } from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import { verticalScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/Theme";
import { useConversation } from "@/hooks/conversations/useConversation";
import { useMessages } from "@/hooks/conversations/useMessages";
import { MessageData } from "@/types/conversations";
import { shouldShowTimeSeparator, formatTimeSeparator } from "@/utils/chatTimeFormat";

// components
import { KeyboardHandler } from "@/components/common/KeyboardHandler";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { EmptyState } from "@/components/EmptyState";
import { ConversationHeader } from "@/components/conversations/ConversationHeader";
import { MessageBubble } from "@/components/conversations/MessageBubble";
import { MessageInput } from "@/components/conversations/MessageInput";
import { TimeSeparator } from "@/components/conversations/TimeSeparator";
import { ActionModal } from "@/components/conversations/ActionModal";
import { ScreenLoading } from "@/components/ScreenLoading";

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { t } = useTranslation();

  // Validate conversationGroupId
  if (!id) {
    return <EmptyState style={{ flex: 1 }} />;
  }
  const conversationGroupId = id as string;

  const { messages, isLoading, loadOlderMessages, hasOlderMessages } = useMessages(conversationGroupId);

  const {
    conversationInfo,
    selectedMessage,
    replyingTo,
    isLoadingConversation,
    isSending,
    error,
    actionModalVisible,
    deleteMessageModalVisible,
    flatListRef,
    handleBackPress,
    handleMessageLongPress,
    handleReply,
    handleDeleteMessage,
    handleSendMessage,
    handleSendImage,
    setActionModalVisible,
    setDeleteMessageModalVisible,
    confirmDeleteMessage,
    cancelReply,
  } = useConversation(conversationGroupId);

  // Reverse messages for FlashList v2 (replaces inverted prop)
  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);

  // Handle load more messages (now at start since data is reversed)
  const handleLoadMore = useCallback(() => {
    if (hasOlderMessages && !isLoading) {
      console.log("Loading Older Messages...");
      loadOlderMessages();
    }
  }, [hasOlderMessages, isLoading, loadOlderMessages]);

  // Render message item with time separator
  const renderMessage = useCallback(
    ({ item, index }: { item: MessageData; index: number }) => {
      const previousMessage = index > 0 ? reversedMessages[index - 1] : undefined;
      const showTimeSeparator = shouldShowTimeSeparator(item, previousMessage);

      return (
        <>
          {showTimeSeparator && (
            <TimeSeparator text={formatTimeSeparator(item.createdAt)} />
          )}
          <MessageBubble message={item} onLongPress={handleMessageLongPress} />
        </>
      );
    },
    [handleMessageLongPress, reversedMessages]
  );

  const renderListHeader = useCallback(() => {
    if (isLoading && messages.length > 0) {
      return (
        <View style={{ paddingVertical: verticalScale(12), alignItems: "center" }}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      );
    }
    return null;
  }, [isLoading, messages.length, theme.colors.primary]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    messagesContent: {
      paddingVertical: verticalScale(16),
    },
  });

  // Show loading state when either conversation info or initial messages are loading
  if (isLoadingConversation || (isLoading && messages.length === 0)) {
    return <ScreenLoading />;
  }

  if (error || !conversationInfo) {
    return <EmptyState style={{ flex: 1 }} />;
  }

  return (
    <KeyboardHandler enabled={true} style={styles.container}>
      {/* Header */}
      <ConversationHeader
        otherUser={conversationInfo.otherUser}
        onBackPress={handleBackPress}
        onOptionsPress={() => { }}
      />

      {/* Messages List */}
      <FlashList
        ref={flatListRef}
        contentContainerStyle={styles.messagesContent}
        data={reversedMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.messageId}
        onStartReached={handleLoadMore}
        onStartReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderListHeader}
        maintainVisibleContentPosition={{
          autoscrollToBottomThreshold: 0.3,
          startRenderingFromBottom: true,
        }}
      />

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onSendImage={handleSendImage}
        replyingTo={replyingTo}
        onCancelReply={cancelReply}
        isSending={isSending}
        messagePlaceholder={t("common.typeMessage")}
      />

      {/* Action Modal for message actions */}
      <ActionModal
        visible={actionModalVisible}
        message={selectedMessage}
        onReply={handleReply}
        onDelete={handleDeleteMessage}
        onClose={() => setActionModalVisible(false)}
      />

      {/* Delete Message Confirmation Modal */}
      <ConfirmationModal
        visible={deleteMessageModalVisible}
        icon="trash-outline"
        iconColor={theme.colors.error}
        description={t("confirmation.deleteMessage.description")}
        confirmButtonColor={theme.colors.error}
        onConfirm={confirmDeleteMessage}
        onCancel={() => setDeleteMessageModalVisible(false)}
      />
    </KeyboardHandler>
  );
}