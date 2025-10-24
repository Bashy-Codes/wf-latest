import React, { useState, useCallback } from "react";
import { View, StyleSheet, useWindowDimensions, ScrollView } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/Theme";
import { TabView, TabBar } from "react-native-tab-view";
import { useProfile } from "@/hooks/profile/useProfile";
import { TabHeader } from "@/components/TabHeader";
import { ScreenLoading } from "@/components/ScreenLoading";
import { ScreenPlaceholder } from "@/components/common/ScreenPlaceholder";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { Separator } from "@/components/common/Separator";
import { ActionItem } from "@/components/common/ActionItem";
import { PostsSection } from "@/components/profile/PostsSection";
import { CollectionsSection } from "@/components/profile/CollectionsSection";
import { GiftsSection } from "@/components/profile/GiftsSection";
import { PhotosSection } from "@/components/profile/PhotosSection";
import { KeyboardHandler } from "@/components/KeyboardHandler";

export default function ProfileTab() {
  const theme = useTheme();
  const { t } = useTranslation();
  const layout = useWindowDimensions();
  const { Profile, isLoading } = useProfile();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "profile", title: "Profile" },
    { key: "posts", title: "Posts" },
    { key: "collections", title: "Collections" },
    { key: "photos", title: "Photos" },
    { key: "gifts", title: "Gifts" },
  ]);

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
      if (!Profile) return null;

      switch (route.key) {
        case "profile":
          return (
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
              <ProfileSection
                profilePicture={Profile.profilePictureUrl}
                name={Profile.name}
                gender={Profile.gender}
                age={Profile.age}
                countryCode={Profile.country}
                isAdmin={Profile.isAdmin}
                activeBadge={Profile.activeBadge}
                aboutMe={Profile.aboutMe}
                spokenLanguageCodes={Profile.spokenLanguages}
                learningLanguageCodes={Profile.learningLanguages}
                hobbies={Profile.hobbies}
                onActionPress={() => { }}
              />
              <Separator customOptions={["⋆｡✿ ⋆ ── ⋆ ✿｡⋆"]} />
              <View style={styles.bottomSection}>
                <ActionItem
                  icon="gift"
                  iconColor={theme.colors.primary}
                  iconBgColor={`${theme.colors.primary}15`}
                  title="Inventory"
                  description="Manage your gifts and products"
                  type="navigation"
                  onPress={() => router.push("/screens/inventory")}
                />
                <ActionItem
                  icon="reader"
                  iconColor={theme.colors.primary}
                  iconBgColor={`${theme.colors.primary}15`}
                  title={t("profile.actions.study.title")}
                  description={t("profile.actions.study.description")}
                  type="navigation"
                  onPress={() => router.push("/screens/study")}
                />
                <ActionItem
                  icon="settings-outline"
                  iconColor={theme.colors.primary}
                  iconBgColor={`${theme.colors.primary}15`}
                  title={t("profile.actions.settings.title")}
                  description={t("profile.actions.settings.description")}
                  type="navigation"
                  onPress={() => router.push("/screens/settings")}
                />
              </View>
            </ScrollView>
          );
        case "posts":
          return <PostsSection userId={Profile.userId} />;
        case "photos":
          return <PhotosSection userId={Profile.userId} />;
        case "collections":
          return <CollectionsSection userId={Profile.userId} showCreateButton={true} />;
        case "gifts":
          return <GiftsSection userId={Profile.userId} />;
        default:
          return null;
      }
    },
    [Profile, theme, t]
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      paddingTop: verticalScale(100),
    },
    bottomSection: {
      paddingHorizontal: scale(20),
      paddingTop: verticalScale(20),
      paddingBottom: verticalScale(100),
    },
  });

  if (isLoading) {
    return <ScreenLoading />;
  }

  if (!Profile) {
    return (
      <ScreenPlaceholder
        title="Create Your Profile"
        icon="warning-outline"
        showButton={true}
        onButtonPress={() => router.push("/screens/create-profile")}
        buttonText="Create Profile"
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <TabHeader title={t("screenTitles.profile")} />
      <KeyboardHandler style={styles.content}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      </KeyboardHandler>
    </SafeAreaView>
  );
}
