import { useState, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

type CommunitySection = "home" | "info" | "members" | "requests" | "settings";

interface UseCommunityReturn {
  community: any;
  isLoading: boolean;
  activeSection: CommunitySection;
  handleSectionChange: (section: CommunitySection) => void;
  handleJoinCommunity: (requestMessage?: string) => Promise<void>;
  handleLeaveCommunity: () => Promise<void>;
  handleDeleteCommunity: () => Promise<void>;
  isJoining: boolean;
  isLeaving: boolean;
  isDeleting: boolean;
}

export const useCommunity = (communityId: Id<"communities">): UseCommunityReturn => {
  const [activeSection, setActiveSection] = useState<CommunitySection>("home");
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const community = useQuery(api.communities.communities.getCommunityInfo, { communityId });
  const joinMutation = useMutation(api.communities.communities.joinCommunity);
  const deleteMutation = useMutation(api.communities.communities.deleteCommunity);

  const isLoading = community === undefined;

  const handleSectionChange = useCallback((section: CommunitySection) => {
    setActiveSection(section);
  }, []);

  const handleJoinCommunity = useCallback(async (requestMessage?: string) => {
    setIsJoining(true);
    try {
      await joinMutation({ communityId, requestMessage });
      Toast.show({
        type: "success",
        text1: "Request Sent",
        text2: "Your join request has been sent to the admin",
      });
    } catch (error) {
      console.error("Failed to join community:", error);
      Toast.show({
        type: "error",
        text1: "Request Failed",
        text2: "Failed to send join request. Please try again.",
      });
    } finally {
      setIsJoining(false);
    }
  }, [communityId, joinMutation]);

  const handleLeaveCommunity = useCallback(async () => {
    setIsLeaving(true);
    try {
      // Leave mutation will be implemented later
      Toast.show({
        type: "success",
        text1: "Left Community",
        text2: "You have left this community.",
      });
      router.back();
    } catch (error) {
      console.error("Failed to leave community:", error);
      Toast.show({
        type: "error",
        text1: "Leave Failed",
        text2: "Failed to leave community. Please try again.",
      });
    } finally {
      setIsLeaving(false);
    }
  }, []);

  const handleDeleteCommunity = useCallback(async () => {
    setIsDeleting(true);
    try {
      await deleteMutation({ communityId });
      Toast.show({
        type: "success",
        text1: "Community Deleted",
        text2: "The community has been deleted successfully.",
      });
      router.back();
    } catch (error) {
      console.error("Failed to delete community:", error);
      Toast.show({
        type: "error",
        text1: "Delete Failed",
        text2: "Failed to delete community. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  }, [communityId, deleteMutation]);

  return {
    community,
    isLoading,
    activeSection,
    handleSectionChange,
    handleJoinCommunity,
    handleLeaveCommunity,
    handleDeleteCommunity,
    isJoining,
    isLeaving,
    isDeleting,
  };
};