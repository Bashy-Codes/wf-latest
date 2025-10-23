import React, { useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  View,
  FlatList,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";;
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// hooks and types
import { useTheme } from "@/lib/Theme";
import { useStore } from "@/hooks/store/useStore";
import { Product } from "@/types/store";
import { useTranslation } from "react-i18next"

// UI Components
import { SafeAreaView } from "react-native-safe-area-context";
import { Separator } from "@/components/common/Separator";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductViewer } from "@/components/store/ProductViewer";
import { StoreSearch } from "@/components/store/StoreSearch";
import { ScreenHeader } from "@/components/ScreenHeader";
import { EmptyState } from "@/components/EmptyState";

export default function StoreScreen() {
  const { t } = useTranslation();
  const theme = useTheme();

  // States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [purchasing, setPurchasing] = useState(false);

  const { products } = useStore();
  const purchaseProductMutation = useMutation(api.store.purchaseProduct);

  const handleProductPress = useCallback((product: Product) => {
    setSelectedProduct(product);
    setViewerVisible(true);
  }, []);

  const handleCloseViewer = useCallback(() => {
    setViewerVisible(false);
    setSelectedProduct(null);
  }, []);

  const handlePurchase = useCallback(async () => {
    if (!selectedProduct) return;

    setPurchasing(true);
    try {
      await purchaseProductMutation({ productId: selectedProduct.id });
      setViewerVisible(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Purchase failed:", error);
    } finally {
      setPurchasing(false);
    }
  }, [selectedProduct, purchaseProductMutation]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }

    const query = searchQuery.toLowerCase();
    return products.filter(product =>
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const renderProduct = useCallback(({ item }: { item: Product }) => (
    <ProductCard product={item} onPress={handleProductPress} />
  ), [handleProductPress]);

  const renderHeader = useCallback(() => (
    <>
      <StoreSearch onSearch={handleSearch} placeholder={t("common.searchPlaceholder")} />
      <Separator />
    </>
  ), [handleSearch]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: scale(16),
    },
    list: {
      paddingTop: verticalScale(16),
    },
  });

  return (
    <>
      <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
        <ScreenHeader title={t("screenTitles.store")} />
        <View style={styles.content}>
          {products.length === 0 ? (
            <EmptyState
            />
          ) : (
            <FlatList
              data={filteredProducts}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={renderHeader}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </SafeAreaView>

      <ProductViewer
        product={selectedProduct}
        visible={viewerVisible}
        onRequestClose={handleCloseViewer}
        onPress={handlePurchase}
        loading={purchasing}
      />
    </>
  );
}