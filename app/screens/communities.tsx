import React, { useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";
import { useCommunities } from "@/hooks/useCommunities";
import { Community, CommunitiesSection } from "@/types/communities";

// Components
import { ScreenHeader } from "@/components/ScreenHeader";
import { EmptyState } from "@/components/EmptyState";
import { CommunityCard } from "@/components/communities/CommunityCard";
import { CommunitiesHeader } from "@/components/communities/CommunitiesHeader";
import { ScreenLoading } from "@/components/ScreenLoading";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/Button";

export default function CommunitiesScreen() {
  const theme = useTheme();
  const {
    activeSection,
    isLoading,
    handleSectionChange,
    getCurrentData,
  } = useCommunities();

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleCreatePress = useCallback(() => {
    router.push("/screens/create-community");
  }, []);



  const handleCommunityPress = useCallback((community: any) => {
    const id = community.communityId || community._id;
    router.push(`/screens/community/${id}`);
  }, []);

  const renderSectionButton = useCallback((section: CommunitiesSection, iconName: string) => {
    const isActive = activeSection === section;

    const buttonStyles = StyleSheet.create({
      button: {
        flex: 1,
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(16),
        backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        marginHorizontal: scale(4),
        alignItems: "center",
        justifyContent: "center",
      },
    });

    return (
      <TouchableOpacity
        key={section}
        style={buttonStyles.button}
        onPress={() => handleSectionChange(section)}
        activeOpacity={0.8}
      >
        <Ionicons
          name={iconName as any}
          size={scale(20)}
          color={isActive ? theme.colors.white : theme.colors.text}
        />
      </TouchableOpacity>
    );
  }, [activeSection, theme, handleSectionChange]);

  const renderCommunity = useCallback(({ item }: { item: Community }) => {
    return <CommunityCard community={item} onPress={handleCommunityPress} />;
  }, [handleCommunityPress]);

  const data = getCurrentData();

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
    sectionsContainer: {
      flexDirection: "row",
      marginBottom: verticalScale(16),
      paddingHorizontal: scale(8),
    },
    listContainer: {
      flex: 1,
      minHeight: verticalScale(400),
    }
  });

  if (isLoading) {
    return <ScreenLoading />
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ScreenHeader title="Communities" onBack={handleBack} />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.content}>
          <CommunitiesHeader text="WorldFriends Communities" contentFit="contain" />

          <View style={{ paddingHorizontal: scale(8), paddingBottom: verticalScale(12) }}>
            <Button
              title="Create Community"
              iconName="add"
              onPress={handleCreatePress}
            />
          </View>

          <View style={styles.sectionsContainer}>
            {renderSectionButton("joined", "checkmark-circle")}
            {renderSectionButton("discover", "compass")}
          </View>

          <View style={styles.listContainer}>
            <FlashList
              data={data}
              keyExtractor={(item: any) => (item.communityId || item._id) as string}
              renderItem={renderCommunity}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => <EmptyState halfScreen />}
              contentContainerStyle={{
                paddingBottom: verticalScale(20),
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}