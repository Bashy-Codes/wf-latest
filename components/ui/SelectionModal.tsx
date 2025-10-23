import React, { forwardRef, useImperativeHandle, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";
import { WFModal } from "./WFModal";
import { FlashList } from "@shopify/flash-list";
import { EmptyState } from "@/components/EmptyState";

export interface SelectionItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  image?: React.ReactNode;
}

interface SelectionModalProps {
  items: SelectionItem[];
  loading?: boolean;
  onItemSelect: (item: SelectionItem) => void;
  onLoadMore?: () => void;
  canLoadMore?: boolean;
  headerIcon?: keyof typeof Ionicons.glyphMap;
  title?: string;
}

export interface SelectionModalRef {
  present: () => void;
  dismiss: () => void;
}

export const SelectionModal = forwardRef<SelectionModalRef, SelectionModalProps>(
  ({ items, loading = false, onItemSelect, onLoadMore, canLoadMore = false, headerIcon = "list", title }, ref) => {
    const theme = useTheme();
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      present: () => setVisible(true),
      dismiss: () => setVisible(false),
    }), []);

    const handleItemPress = useCallback((item: SelectionItem) => {
      onItemSelect(item);
      setVisible(false);
    }, [onItemSelect]);

    const handleClose = useCallback(() => {
      setVisible(false);
    }, []);

    const handleLoadMore = useCallback(() => {
      if (canLoadMore && onLoadMore) {
        onLoadMore();
      }
    }, [canLoadMore, onLoadMore]);

    const renderItem = useCallback(({ item }: { item: SelectionItem }) => {
      const styles = StyleSheet.create({
        itemContainer: {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: verticalScale(18),
          paddingHorizontal: scale(20),
          borderRadius: theme.borderRadius.xl,
          marginVertical: verticalScale(6),
          marginHorizontal: scale(4),
          backgroundColor: theme.colors.background,
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 4,
        },
        iconContainer: {
          width: scale(56),
          height: scale(56),
          borderRadius: scale(28),
          backgroundColor: `${theme.colors.primary}15`,
          alignItems: "center",
          justifyContent: "center",
          marginRight: scale(16),
        },
        textContainer: {
          flex: 1,
          justifyContent: "center",
          marginLeft: scale(12),
        },
        title: {
          fontSize: moderateScale(17),
          fontWeight: "700",
          color: theme.colors.text,
          marginBottom: item.subtitle ? verticalScale(3) : 0,
        },
        subtitle: {
          fontSize: moderateScale(14),
          color: theme.colors.textMuted,
          fontWeight: "500",
        },
      });

      return (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => handleItemPress(item)}
          activeOpacity={0.8}
        >
          {item.image ? (
            item.image
          ) : (
            <View style={styles.iconContainer}>
              <Ionicons
                name={item.icon || "folder"}
                size={scale(28)}
                color={theme.colors.primary}
              />
            </View>
          )}
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            {item.subtitle && (
              <Text style={styles.subtitle} numberOfLines={1}>
                {item.subtitle}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      );
    }, [handleItemPress, theme]);

    const styles = StyleSheet.create({
      listContainer: {
        height: verticalScale(460),
        marginHorizontal: scale(-16),
        marginVertical: scale(-24),
      },
      loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        minHeight: verticalScale(300),
      },
    });

    return (
      <WFModal
        visible={visible}
        onClose={handleClose}
        onConfirm={handleClose}
        headerIcon={headerIcon}
        title={title}
      >
        <View style={styles.listContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : (
            <FlashList
              data={items}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => <EmptyState style={{ flex: 1, minHeight: verticalScale(300) }} />}
              contentContainerStyle={{
                paddingVertical: verticalScale(8),
              }}
            />
          )}
        </View>
      </WFModal>
    );
  }
);