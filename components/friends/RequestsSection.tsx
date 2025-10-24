import { useCallback, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { verticalScale } from "react-native-size-matters";


import { EmptyState } from "@/components/EmptyState";
import { FriendRequestCard } from "@/components/friends/FriendRequestCard";
import { FriendCardSkeleton } from "@/components/friends/FriendCardSkeleton";
import { RequestViewer } from "@/components/friends/RequestViewer";
import { useFriendRequests } from "@/hooks/useFriendRequests";

export const RequestsSection = () => {
  const insets = useSafeAreaInsets();
  const {
    requestsData,
    requestsLoading,
    selectedRequest,
    isAccepting,
    handleRequestPress,
    handleAcceptRequest,
    handleRejectRequest,
    handleLoadMore,
  } = useFriendRequests();

  const renderRequest = useCallback(
    ({ item }: { item: any }) => (
      <FriendRequestCard
        data={item}
        type="request"
        onPress={() => handleRequestPress(item)}
      />
    ),
    [handleRequestPress]
  );

  const renderSkeleton = useCallback(() => <FriendCardSkeleton />, []);
  const skeletonData = useMemo(() => Array(10).fill(null), []);

  const renderFooter = useCallback(() => {
    return null;
  }, []);

  const renderEmptyState = useCallback(() => {
    return <EmptyState fullScreen />;
  }, []);

  const renderItem = requestsLoading ? renderSkeleton : renderRequest;

  const keyExtractor = useCallback(
    (item: any, index: number) => (requestsLoading ? `skeleton-${index}` : item.requestId),
    [requestsLoading]
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
        data={requestsLoading ? skeletonData : requestsData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={!requestsLoading ? renderEmptyState : null}
        contentContainerStyle={styles.contentContainer}
      />

      <RequestViewer
        request={selectedRequest}
        visible={!!selectedRequest}
        loading={isAccepting}
        onAccept={handleAcceptRequest}
        onReject={handleRejectRequest}
      />
    </View>
  );
};