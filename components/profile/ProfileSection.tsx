import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/Theme";
import { getCountryByCode } from "@/constants/geographics";
import { ProfileItem } from "./ProfileItem";
import ProfilePhoto from "../ui/ProfilePhoto";
import NameContainer from "../ui/NameContainer";
import AgeGenderChip from "../ui/AgeGenderChip";
import { Button } from "../ui/Button";
import { Separator } from "../common/Separator";

interface ProfileSectionProps {
  profilePicture: string;
  name: string;
  gender: "male" | "female" | "other";
  age: number;
  countryCode: string;
  isAdmin?: boolean;
  activeBadge?: string;
  aboutMe: string;
  spokenLanguageCodes: string[];
  learningLanguageCodes: string[];
  hobbies: string[];
  showActions?: boolean;
  hasPendingRequest?: boolean;
  onActionPress: () => void;
  isProcessingRequest?: boolean;
}

export const ProfileSection = memo<ProfileSectionProps>(
  ({
    profilePicture,
    name,
    gender,
    age,
    countryCode,
    isAdmin = false,
    activeBadge,
    aboutMe,
    spokenLanguageCodes,
    learningLanguageCodes,
    hobbies,
    showActions = false,
    hasPendingRequest = false,
    onActionPress,
    isProcessingRequest = false,
  }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const country = getCountryByCode(countryCode);

    const styles = StyleSheet.create({
      userInfoContainer: {
        alignItems: "center",
        paddingVertical: verticalScale(20),
        paddingHorizontal: scale(20),
      },
      detailRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: `${theme.colors.info}15`,
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(10),
        borderRadius: scale(theme.borderRadius.full),
        gap: scale(8),
      },
      countryFlag: {
        fontSize: moderateScale(18),
      },
      countryText: {
        fontSize: moderateScale(16),
        fontWeight: "600",
        color: theme.colors.text,
      },
      actionsContainer: {
        paddingHorizontal: scale(20),
        paddingVertical: verticalScale(16),
      },
    });

    return (
      <View>
        <View style={styles.userInfoContainer}>
          <ProfilePhoto profilePicture={profilePicture} size={120} />
          <NameContainer
            size={32}
            name={name}
            isAdmin={isAdmin}
            activeBadge={activeBadge}
          />
          <AgeGenderChip size="large" gender={gender} showGenerText age={age} />
          <View style={styles.detailRow}>
            <Text style={styles.countryFlag}>{country?.flag}</Text>
            <Text style={styles.countryText}>{country?.name}</Text>
          </View>
        </View>

        {showActions && (
          <View style={styles.actionsContainer}>
            {hasPendingRequest ? (
              <Button
                iconName="time"
                title={t("profile.pendingRequest")}
                disabled
                onPress={() => { }}
              />
            ) : (
              <Button
                iconName="person-add"
                title={t("profile.addFriend")}
                onPress={onActionPress}
                disabled={isProcessingRequest}
              />
            )}
          </View>
        )}

        <Separator customOptions={["⋆｡✿ ⋆ ── ⋆ ✿｡⋆"]} />

        <ProfileItem
          type="about"
          title={t("profile.items.aboutMe")}
          icon="person-circle"
          data={{ aboutMe }}
        />
        <ProfileItem
          type="languages"
          title={t("profile.items.languages")}
          icon="language"
          data={{
            spokenLanguages: spokenLanguageCodes,
            learningLanguages: learningLanguageCodes,
          }}
        />
        <ProfileItem
          type="hobbies"
          title={t("profile.items.hobbies")}
          icon="heart"
          data={{ hobbies }}
        />
      </View>
    );
  }
);