import React, { useState, useCallback, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";
import { useTranslation } from "react-i18next";
import { useInventory, InventorySection } from "@/hooks/useInventory";
import { Id } from "@/convex/_generated/dataModel";

// Components
import { ScreenHeader } from "@/components/ScreenHeader";
import { EmptyState } from "@/components/EmptyState";
import { ProductCard } from "@/components/store/ProductCard";
import { GiftCard } from "@/components/store/GiftCard";
import { ProductViewer } from "@/components/store/ProductViewer";
import { GiftViewer } from "@/components/store/GiftViewer";
import { FriendsPickerModal, FriendsPickerModalRef } from "@/components/friends/FriendsPickerModal";

export default function InventoryScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const friendsPickerRef = useRef<FriendsPickerModalRef>(null);

  const {
    activeSection,
    handleSectionChange,
    getCurrentData,
    getCurrentStatus,
    handleLoadMore,
    sendGift,
  } = useInventory();

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedGift, setSelectedGift] = useState<any>(null);
  const [showProductViewer, setShowProductViewer] = useState(false);
  const [showGiftViewer, setShowGiftViewer] = useState(false);
  const [sendingGift, setSendingGift] = useState(false);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleProductPress = useCallback((product: any) => {
    if (activeSection === "owned") {
      setSelectedProduct(product);
      setShowProductViewer(true);
    }
  }, [activeSection]);

  const handleGiftPress = useCallback((gift: any) => {
    setSelectedGift(gift);
    setShowGiftViewer(true);
  }, []);

  const handleSendGift = useCallback(() => {
    friendsPickerRef.current?.present();
  }, []);

  const handleFriendSelect = useCallback(async (friend: any) => {
    if (!selectedProduct) return;

    setSendingGift(true);
    const result = await sendGift(friend.userId as Id<"users">, selectedProduct.productId);
    setSendingGift(false);

    if (result.success) {
      setShowProductViewer(false);
      setSelectedProduct(null);
    }
  }, [selectedProduct, sendGift]);

  const renderSectionButton = useCallback((section: InventorySection, title: string) => {
    const isActive = activeSection === section;

    const buttonStyles = StyleSheet.create({
      button: {
        flex: 1,
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(16),
        backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        marginHorizontal: scale(4),
      },
      text: {
        fontSize: moderateScale(14),
        fontWeight: "600",
        color: isActive ? theme.colors.white : theme.colors.text,
        textAlign: "center",
      },
    });

    return (
      <TouchableOpacity
        key={section}
        style={buttonStyles.button}
        onPress={() => handleSectionChange(section)}
        activeOpacity={0.8}
      >
        <Text style={buttonStyles.text}>{title}</Text>
      </TouchableOpacity>
    );
  }, [activeSection, theme, handleSectionChange]);

  const renderItem = useCallback(({ item }: { item: any }) => {
    if (activeSection === "owned") {
      return (
        <ProductCard
          product={item.productDetails}
          onPress={() => handleProductPress(item)}
          quantity={item.quantity}
        />
      );
    } else {
      return (
        <GiftCard
          title={item.productDetails?.title || "Unknown Gift"}
          onPress={() => handleGiftPress(item)}
        />
      );
    }
  }, [activeSection, handleProductPress, handleGiftPress]);

  const renderLoader = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );

  const data = getCurrentData();
  const status = getCurrentStatus();
  const isLoading = status === "LoadingFirstPage";

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flex: 1,
    },
    content: {
      paddingHorizontal: scale(16),
    },
    storeContainer: {
      backgroundColor: theme.colors.surface,
      paddingVertical: verticalScale(20),
      paddingHorizontal: scale(16),
      alignItems: "center",
      borderRadius: theme.borderRadius.lg,
      marginVertical: verticalScale(16),
    },
    storeIcon: {
      width: scale(100),
      height: scale(100),
      marginBottom: verticalScale(16),
    },
    sectionsContainer: {
      flexDirection: "row",
      marginBottom: verticalScale(16),
      paddingHorizontal: scale(8),
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      minHeight: verticalScale(400),
    },
    listContainer: {
      flex: 1,
      minHeight: verticalScale(400),
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ScreenHeader title="Inventory" onBack={handleBack} />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.content}>
          <View style={styles.storeContainer}>
            <Image
              source={{ uri: "https://storage.worldfriends.app/inventory.png" }}
              style={styles.storeIcon}
              contentFit="cover"
            />
          </View>

          <View style={styles.sectionsContainer}>
            {renderSectionButton("owned", "Owned")}
            {renderSectionButton("received", "Received")}
            {renderSectionButton("sent", "Sent")}
          </View>

          <View style={styles.listContainer}>
            {isLoading ? (
              renderLoader()
            ) : (
              <FlashList
                data={data}
                keyExtractor={(item, index) => `${activeSection}-${index}`}
                renderItem={renderItem}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => <EmptyState halfScreen />}
                contentContainerStyle={{
                  paddingBottom: verticalScale(20),
                }}
              />
            )}
          </View>
        </View>
      </ScrollView>

      <ProductViewer
        product={selectedProduct?.productDetails}
        visible={showProductViewer}
        onRequestClose={() => setShowProductViewer(false)}
        onPress={handleSendGift}
        buttonText="Send"
        loading={sendingGift}
      />

      <GiftViewer
        gift={selectedGift}
        visible={showGiftViewer}
        onRequestClose={() => setShowGiftViewer(false)}
      />

      <FriendsPickerModal
        ref={friendsPickerRef}
        onFriendSelect={handleFriendSelect}
      />
    </SafeAreaView>
  );
}