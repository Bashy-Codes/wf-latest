import { useState, useMemo, useCallback } from "react";
import { usePaginatedQuery, useMutation } from "convex/react";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { api } from "@/convex/_generated/api";
import { ConversationData } from "@/types/conversations";

/**
 * Custom hook for managing conversations with pagination
 *
 * This hook provides:
 * - Paginated conversation loading
 * - Loading states based on actual query status
 * - Error handling
 * - Load more functionality
 * - Client-side search filtering
 * - Navigation handler
 * - Delete conversation mutation
 */
export const useConversations = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    results: conversations,
    status,
    loadMore,
    isLoading,
  } = usePaginatedQuery(
    api.communications.conversations.getUserConversations,
    {},
    { initialNumItems: 10 }
  );

  // Transform the data to match our ConversationData interface
  const transformedConversations: ConversationData[] = conversations.map(
    (conv) => ({
      conversationGroupId: conv.conversationGroupId,
      createdAt: conv.createdAt,
      lastMessageId: conv.lastMessageId,
      lastMessageTime: conv.lastMessageTime,
      hasUnreadMessages: conv.hasUnreadMessages,
      otherUser: conv.otherUser,
      lastMessage: conv.lastMessage
        ? {
          messageId: conv.lastMessage.messageId,
          createdAt: conv.lastMessage.createdAt,
          conversationGroupId: conv.conversationGroupId,
          senderId: conv.lastMessage.senderId,
          content: conv.lastMessage.content,
          type: conv.lastMessage.type,
          imageId: undefined,
          replyParentId: undefined,
          sender: {
            userId: conv.otherUser.userId,
            name: conv.otherUser.name,
            profilePicture: conv.otherUser.profilePicture,
          },
          isOwner: false, // This will be determined by the component
        }
        : undefined,
    })
  );

  // Iinitial Loading state
  const loading = status === "LoadingFirstPage";

  // Client-side search filtering
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return transformedConversations;

    const query = searchQuery.toLowerCase();
    return transformedConversations.filter((conv) =>
      conv.otherUser.name.toLowerCase().includes(query)
    );
  }, [transformedConversations, searchQuery]);

  // Delete conversation mutation
  const deleteConversationMutation = useMutation(api.communications.conversations.deleteConversation);

  // Navigation handler
  const handleConversationPress = useCallback(
    (conversationGroupId: string) => {
      router.push(`/screens/conversation/${conversationGroupId}` as any);
    },
    [router]
  );

  // Delete conversation handler
  const handleDeleteConversation = useCallback(
    async (conversationGroupId: string) => {
      try {
        await deleteConversationMutation({ conversationGroupId });
        Toast.show({
          type: "success",
          text1: t("toasts.conversationDeleted.text1"),
          text2: t("toasts.conversationDeleted.text2"),
          position: "top",
        });
      } catch (error) {
        console.error("Failed to delete conversation:", error);
        Toast.show({
          type: "error",
          text1: t("errorToasts.genericError.text1"),
          text2: t("errorToasts.genericError.text2"),
          position: "top",
        });
      }
    },
    [deleteConversationMutation, t]
  );

  // Load more handler
  const handleLoadMore = useCallback(() => {
    if (status === "CanLoadMore" && !isLoading) {
      loadMore(10);
    }
  }, [status, isLoading, loadMore]);

  return {
    conversations: filteredConversations,
    isLoading,
    loading,
    status,
    loadMore,
    hasMore: status === "CanLoadMore",
    // search 
    searchQuery,
    setSearchQuery,

    // hanlders
    handleConversationPress,
    handleDeleteConversation,
    loadMoreConversations: handleLoadMore,
  };
};