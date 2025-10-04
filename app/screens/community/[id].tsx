import React, { useCallback, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";
import { useCommunity } from "@/hooks/useCommunity";
import { Id } from "@/convex/_generated/dataModel";

// Components
import { ScreenHeader } from "@/components/ScreenHeader";
import { CommunitiesHeader } from "@/components/communities/CommunitiesHeader";
import { CommunityHomeSection } from "@/components/communities/CommunityHomeSection";
import { CommunityInfoSection } from "@/components/communities/CommunityInfoSection";
import { CommunityMembersSection } from "@/components/communities/CommunityMembersSection";
import { CommunityRequestsSection } from "@/components/communities/CommunityRequestsSection";
import { CommunitySettingsSection } from "@/components/communities/CommunitySettingsSection";
import { ScreenLoading } from "@/components/ScreenLoading";
import { EmptyState } from "@/components/EmptyState";
import { InputModal } from "@/components/common/InputModal";
import { Ionicons } from "@expo/vector-icons";

type CommunitySection = "home" | "info" | "members" | "requests" | "settings";

export default function CommunityScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams();
  const communityId = id as Id<"communities">;

  const {
    community,
    isLoading,
    activeSection,
    handleSectionChange,
    handleJoinCommunity,
    handleLeaveCommunity,
    handleDeleteCommunity,
    isJoining,
    isLeaving,
    isDeleting,
  } = useCommunity(communityId);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const [showInputModal, setShowInputModal] = useState(false);

  const handleCreateDiscussion = useCallback(() => {
    console.log("Create discussion");
  }, []);

  const handleJoinPress = useCallback(() => {
    setShowInputModal(true);
  }, []);

  const handleSubmitRequest = useCallback((message: string) => {
    handleJoinCommunity(message);
    setShowInputModal(false);
  }, [handleJoinCommunity]);



  const renderSectionButton = useCallback((section: CommunitySection, iconName: string) => {
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

  const renderSection = useCallback(() => {
    if (!community) return null;

    switch (activeSection) {
      case "home":
        if (community.hasPendingRequest) {
          return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: scale(20) }}>
              <Text style={{ fontSize: moderateScale(16), color: theme.colors.text, textAlign: "center" }}>
                Your community join request will be reviewed by Community Admin {community.communityAdmin.name}
              </Text>
            </View>
          );
        }
        return (
          <CommunityHomeSection
            communityId={communityId}
            isMember={community.isMember}
            onJoinPress={handleJoinPress}
            isJoining={isJoining}
          />
        );
      case "info":
        return <CommunityInfoSection community={community} />;
      case "members":
        return (
          <CommunityMembersSection
            communityId={communityId}
            isMember={community.isMember}
          />
        );
      case "requests":
        return community.isAdmin ? (
          <CommunityRequestsSection communityId={communityId} />
        ) : null;
      case "settings":
        return community.isMember ? (
          <CommunitySettingsSection
            isAdmin={community.isAdmin}
            onLeave={handleLeaveCommunity}
            onDelete={handleDeleteCommunity}
            isLeaving={isLeaving}
            isDeleting={isDeleting}
          />
        ) : null;
      default:
        return null;
    }
  }, [
    community,
    activeSection,
    handleJoinPress,
    handleLeaveCommunity,
    handleDeleteCommunity,
    isJoining,
    isLeaving,
    isDeleting,
    theme,
  ]);

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
    sectionContent: {
      flex: 1,
      minHeight: verticalScale(400),
    },
  });

  if (isLoading) {
    return (
      <ScreenLoading />
    );
  }

  if (!community) {
    return (
      <EmptyState fullScreen />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ScreenHeader title={community.title} onBack={handleBack} />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.content}>
          <CommunitiesHeader
            text={community.title}
            bannerUrl={community.bannerUrl}
            contentFit="cover"
          />

          <View style={styles.sectionsContainer}>
            {renderSectionButton("home", "home")}
            {renderSectionButton("info", "information-circle")}
            {renderSectionButton("members", "people")}
            {community.isAdmin && renderSectionButton("requests", "mail")}
            {community.isMember && renderSectionButton("settings", "settings")}
          </View>

          <View style={styles.sectionContent}>
            {renderSection()}
          </View>
        </View>
      </ScrollView>

      <InputModal
        visible={showInputModal}
        title="Join Community"
        inputPlaceholder="Write a message to the admin..."
        maxCharacters={200}
        onSubmit={handleSubmitRequest}
        onCancel={() => setShowInputModal(false)}
      />
    </SafeAreaView>
  );
}