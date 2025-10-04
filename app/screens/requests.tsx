import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/Theme";
import { useCallback } from "react";
import { FlashList } from "@shopify/flash-list";
import { verticalScale } from "react-native-size-matters";
import { router } from "expo-router";

import { ScreenHeader } from "@/components/ScreenHeader";
import { ScreenLoading } from "@/components/ScreenLoading";
import { FriendRequestCard } from "@/components/friends/FriendRequestCard";
import { RequestViewer } from "@/components/friends/RequestViewer";
import { EmptyState } from "@/components/EmptyState";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import type { Request } from "@/types/friendships";

export default function RequestsScreen() {
  const theme = useTheme();
  const { t } = useTranslation();

  const {
    requestsData,
    requestsLoading,
    selectedRequest,
    handleRequestPress,
    handleCloseViewer,
    handleAcceptRequest,
    handleRejectRequest,
    handleLoadMore,
  } = useFriendRequests();

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const renderRequestItem = useCallback(
    ({ item }: { item: Request }) => (
      <FriendRequestCard
        data={item}
        type="request"
        onPress={() => handleRequestPress(item)}
      />
    ),
    [handleRequestPress]
  );

  const renderEmptyRequests = useCallback(() => {
    return <EmptyState fullScreen />;
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      paddingTop: verticalScale(20),
      paddingBottom: verticalScale(100),
    },
  });

  if (requestsLoading) {
    return <ScreenLoading onBack={handleBack} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ScreenHeader title={t("screenTitles.requests")} onBack={handleBack} rightComponent={null} />

      <View style={styles.content}>
        <FlashList
          data={requestsData}
          renderItem={renderRequestItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyRequests}
          contentContainerStyle={styles.contentContainer}
        />
      </View>

      <RequestViewer
        request={selectedRequest}
        visible={!!selectedRequest}
        onRequestClose={handleCloseViewer}
        onAccept={handleAcceptRequest}
        onReject={handleRejectRequest}
      />
    </SafeAreaView>
  );
}