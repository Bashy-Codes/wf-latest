import { useState } from "react";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const useCommunityMembers = (communityId: Id<"communities">) => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.communities.communities.getCommunityMembers,
    { communityId },
    { initialNumItems: 20 }
  );

  const members = results ?? [];
  const loading = status === "LoadingFirstPage";

  const handleLoadMore = () => {
    if (status === "CanLoadMore") {
      loadMore(20);
    }
  };

  return {
    members,
    loading,
    handleLoadMore,
  };
};
