import React, { useCallback, useState } from "react";
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/Theme";
import { useTranslation } from "react-i18next";
import { usePhotos } from "@/hooks/profile/usePhotos";
import { Id } from "@/convex/_generated/dataModel";
import { ImageViewer } from "@/components/common/ImageViewer";
import { EmptyState } from "@/components/EmptyState";

interface PhotosSectionProps {
  userId: Id<"users">;
  isFriend?: boolean;
}

export const PhotosSection: React.FC<PhotosSectionProps> = ({ userId, isFriend = true }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { photos, loading, loadingMore, handleLoadMore } = usePhotos({
    userId,
    skip: !isFriend
  });
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewerVisible, setViewerVisible] = useState(false);

  const handlePhotoPress = useCallback((index: number) => {
    setSelectedImages(photos);
    setSelectedIndex(index);
    setViewerVisible(true);
  }, [photos]);

  const renderPhoto = useCallback(({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => handlePhotoPress(index)}
      style={styles.photoContainer}
    >
      <Image
        source={{ uri: item }}
        style={styles.photo}
        contentFit="cover"
        transition={200}
        placeholder={"/assets/images/photo.png"}
      />
    </TouchableOpacity>
  ), [handlePhotoPress]);

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    return (
      <View style={{ paddingVertical: verticalScale(20), alignItems: "center" }}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  }, [loadingMore, theme.colors.primary]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingVertical: verticalScale(12)
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: verticalScale(40),
    },
    photoContainer: {
      padding: 3,
    },
    photo: {
      width: "100%",
      aspectRatio: Math.random() > 0.5 ? 1 : 0.75,
      borderRadius: theme.borderRadius.sm,
    },
    restrictedContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: scale(32),
      paddingVertical: verticalScale(40),
    },
    restrictedMessage: {
      fontSize: moderateScale(16),
      fontWeight: "500",
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: verticalScale(12),
    },
  });

  if (!isFriend) {
    return (
      <View style={styles.restrictedContainer}>
        <Ionicons
          name="lock-closed"
          size={scale(48)}
          color={theme.colors.textMuted}
        />
        <Text style={styles.restrictedMessage}>{t("profile.restriction.photos")}</Text>
      </View>
    );
  }

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
        data={photos}
        numColumns={2}
        masonry={true}
        renderItem={renderPhoto}
        keyExtractor={(item, index) => `${item}-${index}`}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={() => <EmptyState fullScreen />}
        ListFooterComponent={renderFooter}
      />

      <ImageViewer
        images={selectedImages.map((uri) => ({ uri }))}
        imageIndex={selectedIndex}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)}
      />
    </View>
  );
};
