import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/Theme";
import { useFriends } from "@/hooks/useFriends";
import { useCallback, useMemo } from "react";
import { FlashList } from "@shopify/flash-list";
import { verticalScale } from "react-native-size-matters";
import { router } from "expo-router";

import { TabHeader } from "@/components/TabHeader";
import { FriendRequestCard } from "@/components/friends/FriendRequestCard";
import { FriendCardSkeleton } from "@/components/friends/FriendCardSkeleton";
import { FloatingButton } from "@/components/common/FloatingButton";
import { EmptyState } from "@/components/EmptyState";
import type { Friend } from "@/types/friendships";

export default function FriendsTab() {
  const theme = useTheme();
  const { t } = useTranslation();

  const {
    friendsData,
    friendsLoading,
    loadMoreFriends,
  } = useFriends();

  const handleFriendPress = useCallback((friend: Friend) => {
    router.push(`/screens/user-profile/${friend.userId as string}` as any);
  }, []);

  const handleRequestsPress = useCallback(() => {
    router.push("/screens/requests" as any);
  }, []);



  const renderFriendItem = useCallback(
    ({ item }: { item: Friend }) => (
      <FriendRequestCard
        data={item}
        type="friend"
        onPress={() => handleFriendPress(item)}
      />
    ),
    [handleFriendPress]
  );

  const renderSkeleton = useCallback(() => <FriendCardSkeleton />, []);

  const renderEmptyFriends = useCallback(() => {
    return <EmptyState fullScreen />;
  }, []);

  const skeletonData = useMemo(() => Array(10).fill(null), []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      paddingTop: verticalScale(100),
      paddingBottom: verticalScale(100),
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <TabHeader title={t("screenTitles.friends")} />
      <View style={styles.content}>
        <FlashList
          data={friendsLoading ? skeletonData : friendsData}
          renderItem={friendsLoading ? renderSkeleton : renderFriendItem}
          keyExtractor={(item, index) =>
            friendsLoading ? `skeleton-${index}` : item.userId
          }
          onEndReached={loadMoreFriends}
          onEndReachedThreshold={0.1}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!friendsLoading ? renderEmptyFriends : null}
          contentContainerStyle={styles.contentContainer}
        />
      </View>
      <FloatingButton
        iconName="mail"
        onPress={handleRequestsPress}
      />
    </SafeAreaView>
  );
}
