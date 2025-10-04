import { useState, useCallback } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { scale, verticalScale } from "react-native-size-matters"
import { useTranslation } from "react-i18next"
import { router } from "expo-router"
import { useProfile } from "@/hooks/useProfile"

// components
import { TabHeader } from "@/components/TabHeader"
import { UserInfo } from "@/components/profile/UserInfo"
import { SegmentControl } from "@/components/profile/SegmentControl"
import { ProfileSection } from "@/components/profile/ProfileSection"
import { PostsSection } from "@/components/profile/PostsSection"
import { CollectionsSection } from "@/components/profile/CollectionsSection"
import { GiftsSection } from "@/components/profile/GiftsSection"
import { ActionItem } from "@/components/common/ActionItem"
import { ScreenPlaceholder } from "@/components/common/ScreenPlaceholder"
import { ScreenLoading } from "@/components/ScreenLoading"
import { Separator } from "@/components/common/Separator"

type TabType = "profile" | "posts" | "collections" | "gifts"

export default function ProfileTab() {
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()

  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>("profile")

  const {
    // Profile data and states
    Profile,
    isLoading,
    theme,
  } = useProfile()

  // Tab handlers
  const handleTabPress = useCallback((tab: TabType) => {
    setActiveTab(tab)
  }, [])

  const handleCreateProfile = useCallback(() => {
    router.push("/screens/create-profile")
  }, [])

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flex: 1,
    },
    contentContainer: {
      paddingTop: verticalScale(100),
    },
    segmentContentContainer: {
      flex: 1,
    },
    bottomSection: {
      paddingHorizontal: scale(20),
      paddingTop: verticalScale(20),
      paddingBottom: verticalScale(100),
    },
  })

  // Show loading screen while data is being fetched
  if (isLoading) {
    return <ScreenLoading />
  }

  if (!Profile) {
    return (
      <ScreenPlaceholder
        title="Create Your Profile"
        icon="warning-outline"
        showButton={true}
        onButtonPress={handleCreateProfile}
        buttonText="Create Profile"
      />
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <TabHeader title={t("screenTitles.profile")} />
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentContainerStyle={styles.contentContainer}
      >
        <UserInfo
          profilePicture={Profile.profilePictureUrl}
          name={Profile.name}
          gender={Profile.gender}
          age={Profile.age}
          countryCode={Profile.country}
          isAdmin={Profile.isAdmin}
          isSupporter={Profile.isSupporter}
        />
        {/* Segmented Control */}
        <SegmentControl activeTab={activeTab} onTabPress={handleTabPress} />

        {/* Tab Content */}
        <View style={styles.segmentContentContainer}>
          {activeTab === "profile" ? (
            <>
              <ProfileSection
                aboutMe={Profile.aboutMe}
                spokenLanguageCodes={Profile.spokenLanguages}
                learningLanguageCodes={Profile.learningLanguages}
                hobbies={Profile.hobbies}
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
                  onPress={() => { router.push("/screens/inventory") }}
                />
                <ActionItem
                  icon="reader"
                  iconColor={theme.colors.primary}
                  iconBgColor={`${theme.colors.primary}15`}
                  title={t("profile.actions.study.title")}
                  description={t("profile.actions.study.description")}
                  type="navigation"
                  onPress={() => { router.push("/screens/study") }}
                />
                <ActionItem
                  icon="settings-outline"
                  iconColor={theme.colors.primary}
                  iconBgColor={`${theme.colors.primary}15`}
                  title={t("profile.actions.settings.title")}
                  description={t("profile.actions.settings.description")}
                  type="navigation"
                  onPress={() => { router.push("/screens/settings") }}
                />
              </View>
            </>
          ) : activeTab === "posts" ? (
            <View style={{ paddingBottom: insets.bottom + verticalScale(12) }}>
              <PostsSection userId={Profile?.userId!} />
            </View>
          ) : activeTab === "collections" ? (
            <View style={{ paddingBottom: insets.bottom + verticalScale(12) }}>
              <CollectionsSection userId={Profile?.userId!} showCreateButton={true} />
            </View>
          ) : (
            <View style={{ paddingBottom: insets.bottom + verticalScale(24) }}>
              <GiftsSection userId={Profile?.userId!} />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
