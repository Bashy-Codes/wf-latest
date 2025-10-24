import { useCallback } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { verticalScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";
import { getProductById } from "@/constants/products";

import { EmptyState } from "@/components/EmptyState";
import { GiftCard } from "@/components/store/GiftCard";

interface SentGiftsSectionProps {
  onGiftPress: (gift: any) => void;
}

export const SentGiftsSection = ({ onGiftPress }: SentGiftsSectionProps) => {
  const theme = useTheme();

  const {
    results: sentGifts,
    status: sentStatus,
    loadMore: loadMoreSent,
  } = usePaginatedQuery(
    api.store.getUserSentGifts,
    {},
    { initialNumItems: 10 }
  );

  const handleLoadMore = useCallback(() => {
    if (sentStatus === "CanLoadMore") {
      loadMoreSent(10);
    }
  }, [sentStatus, loadMoreSent]);

  const data = sentGifts?.map(gift => ({
    ...gift,
    productDetails: getProductById(gift.productId)
  })) || [];

  const renderItem = useCallback(({ item }: { item: any }) => (
    <GiftCard
      title={item.productDetails?.title || "Unknown Gift"}
      onPress={() => onGiftPress(item)}
    />
  ), [onGiftPress]);

  const isLoading = sentStatus === "LoadingFirstPage";

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      minHeight: verticalScale(400),
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      minHeight: verticalScale(400),
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={data}
        keyExtractor={(item, index) => `sent-${index}`}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => <EmptyState fullScreen />}
        contentContainerStyle={{
          paddingVertical: verticalScale(20),
        }}
      />
    </View>
  );
};