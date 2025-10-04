import { useMemo } from "react";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Friend } from "@/types/friendships";

export const useFriends = () => {
  const {
    results: friendsData,
    status: friendsStatus,
    loadMore: loadMoreFriends,
  } = usePaginatedQuery(
    api.friendships.getUserFriends,
    {},
    { initialNumItems: 10 }
  );

  const sortedFriendsData = useMemo(() => {
    return (friendsData || []).sort((a, b) => a.name.localeCompare(b.name));
  }, [friendsData]);

  return {
    friendsData: sortedFriendsData,
    friendsLoading: friendsStatus === "LoadingFirstPage",
    loadMoreFriends: () => {
      if (friendsStatus === "CanLoadMore") {
        loadMoreFriends(10);
      }
    },
  };
};
