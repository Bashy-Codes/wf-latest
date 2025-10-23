import { useState, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Thread } from "@/types/discussions";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

interface UseDiscussionReturn {
  discussion: any;
  threads: Thread[];
  isLoading: boolean;
  isLoadingThreads: boolean;
  replyToThread: Thread | null;
  showDeleteModal: boolean;
  showDeleteDiscussionModal: boolean;
  handleLoadMoreThreads: () => void;
  handleDeleteThread: (threadId: Id<"discussionThreads">) => void;
  handleReplyToThread: (thread: Thread) => void;
  handleCancelReply: () => void;
  handleSubmitThread: (content: string) => Promise<void>;
  handleConfirmDelete: () => void;
  handleCloseDeleteModal: () => void;
  handleDeleteDiscussion: () => void;
  handleConfirmDeleteDiscussion: () => Promise<void>;
  handleCloseDeleteDiscussionModal: () => void;
}

export const useDiscussion = (discussionId: Id<"discussions">): UseDiscussionReturn => {
  const [replyToThread, setReplyToThread] = useState<Thread | null>(null);
  const [threadToDelete, setThreadToDelete] = useState<Id<"discussionThreads"> | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteDiscussionModal, setShowDeleteDiscussionModal] = useState(false);

  const discussion = useQuery(api.communities.discussions.getDiscussion, { discussionId });

  const threadsResult = useQuery(api.communities.discussions.getDiscussionThreads, {
    discussionId,
    paginationOpts: { numItems: 50, cursor: null },
  });

  const createThreadMutation = useMutation(api.communities.discussions.createThread);
  const deleteThreadMutation = useMutation(api.communities.discussions.deleteThread);
  const deleteDiscussionMutation = useMutation(api.communities.discussions.deleteDiscussion);

  const threads = threadsResult?.page || [];
  const isLoading = discussion === undefined;
  const isLoadingThreads = threadsResult === undefined;

  const handleLoadMoreThreads = useCallback(() => {
    // Pagination will be handled later if needed
  }, []);

  const handleDeleteThread = useCallback((threadId: Id<"discussionThreads">) => {
    setThreadToDelete(threadId);
    setShowDeleteModal(true);
  }, []);

  const handleReplyToThread = useCallback((thread: Thread) => {
    setReplyToThread(thread);
  }, []);

  const handleCancelReply = useCallback(() => {
    setReplyToThread(null);
  }, []);

  const handleSubmitThread = useCallback(async (content: string) => {
    try {
      await createThreadMutation({
        discussionId,
        content,
        parentId: replyToThread?.threadId,
      });
      setReplyToThread(null);
    } catch (error) {
      console.error("Failed to create thread:", error);
      Toast.show({
        type: "error",
        text1: "Failed to add reply",
        text2: "Please try again",
      });
    }
  }, [discussionId, replyToThread, createThreadMutation]);

  const handleConfirmDelete = useCallback(async () => {
    if (!threadToDelete) return;

    try {
      await deleteThreadMutation({ threadId: threadToDelete });
      setShowDeleteModal(false);
      setThreadToDelete(null);
    } catch (error) {
      console.error("Failed to delete thread:", error);
      Toast.show({
        type: "error",
        text1: "Failed to delete reply",
        text2: "Please try again",
      });
    }
  }, [threadToDelete, deleteThreadMutation]);

  const handleCloseDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setThreadToDelete(null);
  }, []);

  const handleDeleteDiscussion = useCallback(() => {
    setShowDeleteDiscussionModal(true);
  }, []);

  const handleConfirmDeleteDiscussion = useCallback(async () => {
    try {
      await deleteDiscussionMutation({ discussionId });
      setShowDeleteDiscussionModal(false);
      Toast.show({
        type: "success",
        text1: "Discussion deleted",
        text2: "The discussion has been deleted",
      });
      router.back();
    } catch (error) {
      console.error("Failed to delete discussion:", error);
      Toast.show({
        type: "error",
        text1: "Failed to delete discussion",
        text2: "Please try again",
      });
    }
  }, [discussionId, deleteDiscussionMutation]);

  const handleCloseDeleteDiscussionModal = useCallback(() => {
    setShowDeleteDiscussionModal(false);
  }, []);

  return {
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
  };
};