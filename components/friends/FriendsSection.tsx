import { useCallback, useMemo } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { verticalScale } from "react-native-size-matters";
import { router } from "expo-router";
import { Id } from "@/convex/_generated/dataModel";

import { EmptyState } from "@/components/EmptyState";
import { FriendRequestCard } from "@/components/friends/FriendRequestCard";
import { FriendCardSkeleton } from "@/components/friends/FriendCardSkeleton";
import { useFriends } from "@/hooks/useFriends";

export const FriendsSection = () => {
  const insets = useSafeAreaInsets();
  const { friendsData, friendsLoading, loadMoreFriends } = useFriends();

  const handleLoadMore = useCallback(() => {
    loadMoreFriends();
  }, [loadMoreFriends]);

  const handleViewProfile = useCallback((userId: Id<"users">) => {
    router.push(`/screens/user-profile/${userId}`);
  }, []);

  const renderFriend = useCallback(
    ({ item }: { item: any }) => (
      <FriendRequestCard
        data={item}
        type="friend"
        onPress={() => handleViewProfile(item.userId)}
      />
    ),
    [handleViewProfile]
  );

  const renderSkeleton = useCallback(() => <FriendCardSkeleton />, []);
  const skeletonData = useMemo(() => Array(10).fill(null), []);

  const renderEmptyState = useCallback(() => {
    return <EmptyState fullScreen />;
  }, []);

  const renderItem = friendsLoading ? renderSkeleton : renderFriend;
  const keyExtractor = useCallback(
    (item: any, index: number) => (friendsLoading ? `skeleton-${index}` : item.userId),
    [friendsLoading]
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      minHeight: verticalScale(400),
    },
    contentContainer: {
      paddingTop: verticalScale(20),
      paddingBottom: insets.bottom,
    },
  });

  return (
    <View style={styles.container}>
      <FlashList
        data={friendsLoading ? skeletonData : friendsData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!friendsLoading ? renderEmptyState : null}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};