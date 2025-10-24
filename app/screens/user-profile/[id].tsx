import React, { useState, useCallback } from "react";
import { View, StyleSheet, useWindowDimensions, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/Theme";
import { TabView, TabBar } from "react-native-tab-view";
import type { Id } from "@/convex/_generated/dataModel";
import { useUserDetails } from "@/hooks/profile/useUserProfile";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// components
import { ScreenLoading } from "@/components/ScreenLoading";
import { ScreenPlaceholder } from "@/components/common/ScreenPlaceholder";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { ActionModal } from "@/components/common/ActionModal";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { LoadingModal } from "@/components/common/LoadingModal";
import { InputModal } from "@/components/common/InputModal";
import { PostsSection } from "@/components/profile/PostsSection";
import { CollectionsSection } from "@/components/profile/CollectionsSection";
import { GiftsSection } from "@/components/profile/GiftsSection";
import { PhotosSection } from "@/components/profile/PhotosSection";
import { KeyboardHandler } from "@/components/KeyboardHandler";

export default function UserProfileScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const layout = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = id as Id<"users">;


  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "profile", title: "Profile" },
    { key: "posts", title: "Posts" },
    { key: "photos", title: "Photos" },
    { key: "collections", title: "Collections" },
    { key: "gifts", title: "Gifts" },
  ]);

  const {
    userProfile,
    loading,
    restrictionError,
    showBlockConfirmation,
    isBlocking,
    showRemoveFriendConfirmation,
    profileLoadingModalState,
    blockLoadingModalState,
    showRequestModal,
    isProcessingRequest,
    isSendingFriendRequest,
    actionModalRef,
    handleEllipsisPress,
    handleConfirmBlock,
    handleCancelBlock,
    handleFriendAction,
    handleSendFriendRequest,
    handleConfirmRemoveFriend,
    handleCancelRemoveFriend,
    handleCancelRequest,
    handleProfileLoadingModalComplete,
    handleBlockLoadingModalComplete,
    actionModalOptions,
  } = useUserDetails(userId);

  const renderTabBar = useCallback(
    (props: any) => (
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: theme.colors.primary }}
        style={{ backgroundColor: theme.colors.background }}
        activeColor={theme.colors.primary}
        inactiveColor={theme.colors.textSecondary}
        labelStyle={{ fontWeight: "600", textTransform: "none", fontSize: 14 }}
        scrollEnabled
      />
    ),
    [theme]
  );

  const renderScene = useCallback(
    ({ route }: any) => {
      if (!userProfile) return null;

      switch (route.key) {
        case "profile":
          return (
            <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom }} showsVerticalScrollIndicator={false}>
              <ProfileSection
                profilePicture={userProfile.profilePicture}
                name={userProfile.name}
                gender={userProfile.gender}
                age={userProfile.age}
                countryCode={userProfile.country}
                isAdmin={userProfile.isAdmin}
                activeBadge={userProfile.activeBadge}
                aboutMe={userProfile.aboutMe}
                spokenLanguageCodes={userProfile.spokenLanguages}
                learningLanguageCodes={userProfile.learningLanguages}
                hobbies={userProfile.hobbies}
                showActions={!userProfile.isFriend}
                hasPendingRequest={userProfile.hasPendingRequest}
                onActionPress={handleFriendAction}
                isProcessingRequest={isProcessingRequest}
              />
            </ScrollView>
          );
        case "posts":
          return <PostsSection userId={userProfile.userId} isFriend={userProfile.isFriend} />;
        case "photos":
          return <PhotosSection userId={userProfile.userId} isFriend={userProfile.isFriend} />;
        case "collections":
          return <CollectionsSection userId={userProfile.userId} isFriend={userProfile.isFriend} showCreateButton={false} />;
        case "gifts":
          return <GiftsSection userId={userProfile.userId} isFriend={userProfile.isFriend} />;
        default:
          return null;
      }
    },
    [userProfile, theme, t, isProcessingRequest, handleFriendAction]
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });

  if (loading) {
    return <ScreenLoading />;
  }

  if (restrictionError) {
    return (
      <ScreenPlaceholder
        title={t("profile.restricted.title")}
        description={t("profile.restricted.description")}
        icon="lock-closed"
        showButton={false}
      />
    );
  }

  if (!userProfile) {
    return (
      <ScreenPlaceholder
        title="User not found"
        icon="person-circle-outline"
        showButton={false}
      />
    );
  }

  if (userProfile.isAdmin) {
    return (
      <ScreenPlaceholder
        title="WorldFriends Team"
        icon="shield-checkmark"
        showButton={false}
      />
    );
  }

  return (
    <>
      <KeyboardHandler style={styles.container}>
        <ScreenHeader
          title={userProfile.name}
          rightComponent="ellipsis"
          onRightPress={handleEllipsisPress}
        />

        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      </KeyboardHandler>

      <ActionModal ref={actionModalRef} options={actionModalOptions} />
      <ConfirmationModal
        visible={showBlockConfirmation}
        icon="ban"
        description={t("confirmation.blockUser.description")}
        onConfirm={handleConfirmBlock}
        onCancel={handleCancelBlock}
      />
      <ConfirmationModal
        visible={showRemoveFriendConfirmation}
        icon="person-remove"
        description={t("confirmation.removeFriend.description")}
        onConfirm={handleConfirmRemoveFriend}
        onCancel={handleCancelRemoveFriend}
      />
      <InputModal
        visible={showRequestModal}
        title={t("profile.friendRequestModal.title")}
        inputPlaceholder={t("profile.friendRequestModal.description") + userProfile.name}
        maxCharacters={300}
        onSubmit={handleSendFriendRequest}
        onCancel={handleCancelRequest}
        loading={isSendingFriendRequest}
      />
      <LoadingModal
        visible={profileLoadingModalState !== "hidden"}
        state={profileLoadingModalState === "hidden" ? "loading" : profileLoadingModalState}
        onComplete={handleProfileLoadingModalComplete}
      />
      <LoadingModal
        visible={blockLoadingModalState !== "hidden"}
        state={blockLoadingModalState === "hidden" ? "loading" : blockLoadingModalState}
        onComplete={handleBlockLoadingModalComplete}
      />
    </>
  );
}
