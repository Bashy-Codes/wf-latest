import { useCallback } from "react";
import { usePaginatedQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Toast from "react-native-toast-message";

export const useCommunityRequests = (communityId: Id<"communities">) => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.communities.communities.getCommunityRequests,
    { communityId },
    { initialNumItems: 20 }
  );

  const acceptMutation = useMutation(api.communities.communities.acceptCommunityRequest);
  const rejectMutation = useMutation(api.communities.communities.rejectCommunityRequest);

  const requests = results ?? [];
  const loading = status === "LoadingFirstPage";

  const handleLoadMore = () => {
    if (status === "CanLoadMore") {
      loadMore(20);
    }
  };

  const handleAccept = useCallback(async (requestId: Id<"communityMembers">) => {
    try {
      await acceptMutation({ requestId });
      Toast.show({
        type: "success",
        text1: "Request Accepted",
        text2: "User has been added to the community",
      });
    } catch (error) {
      console.error("Failed to accept request:", error);
      Toast.show({
        type: "error",
        text1: "Accept Failed",
        text2: "Failed to accept request. Please try again.",
      });
    }
  }, [acceptMutation]);

  const handleReject = useCallback(async (requestId: Id<"communityMembers">) => {
    try {
      await rejectMutation({ requestId });
      Toast.show({
        type: "success",
        text1: "Request Rejected",
        text2: "Request has been removed",
      });
    } catch (error) {
      console.error("Failed to reject request:", error);
      Toast.show({
        type: "error",
        text1: "Reject Failed",
        text2: "Failed to reject request. Please try again.",
      });
    }
  }, [rejectMutation]);

  return {
    requests,
    loading,
    handleLoadMore,
    handleAccept,
    handleReject,
  };
};
