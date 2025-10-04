import React, { useCallback, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { useTheme } from "@/lib/Theme";
import { useCommunityRequests } from "@/hooks/useCommunityRequests";
import { Id } from "@/convex/_generated/dataModel";
import { MemberItem } from "./MemberItem";
import { RequestViewer } from "@/components/friends/RequestViewer";
import { EmptyState } from "@/components/EmptyState";

interface CommunityRequestsSectionProps {
  communityId: Id<"communities">;
}

export const CommunityRequestsSection: React.FC<CommunityRequestsSectionProps> = ({
  communityId,
}) => {
  const theme = useTheme();
  const { requests, loading, handleLoadMore, handleAccept, handleReject } = useCommunityRequests(communityId);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [viewerVisible, setViewerVisible] = useState(false);

  const handleRequestPress = useCallback((request: any) => {
    setSelectedRequest(request);
    setViewerVisible(true);
  }, []);

  const handleAcceptRequest = useCallback(async () => {
    if (selectedRequest) {
      await handleAccept(selectedRequest.requestId);
      setViewerVisible(false);
      setSelectedRequest(null);
    }
  }, [selectedRequest, handleAccept]);

  const handleRejectRequest = useCallback(async () => {
    if (selectedRequest) {
      await handleReject(selectedRequest.requestId);
      setViewerVisible(false);
      setSelectedRequest(null);
    }
  }, [selectedRequest, handleReject]);

  const renderRequest = useCallback(
    ({ item }: { item: any }) => (
      <MemberItem
        userId={item.userId}
        profilePicture={item.profilePicture}
        name={item.name}
        gender={item.gender}
        age={item.age}
        country={item.country}
        isSupporter={item.isSupporter}
        onPress={() => handleRequestPress(item)}
      />
    ),
    [handleRequestPress]
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: verticalScale(40),
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={requests}
        renderItem={renderRequest}
        keyExtractor={(item) => item.requestId}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: verticalScale(32),
        }}
        ListEmptyComponent={() => <EmptyState halfScreen />}
      />

      <RequestViewer
        request={selectedRequest}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)}
        onAccept={handleAcceptRequest}
        onReject={handleRejectRequest}
      />
    </View>
  );
};
