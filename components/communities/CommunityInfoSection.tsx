import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";
import { CommunityInfo } from "@/types/communities";
import ProfilePhoto from "@/components/ui/ProfilePhoto";

interface CommunityInfoSectionProps {
  community: CommunityInfo;
}

export const CommunityInfoSection: React.FC<CommunityInfoSectionProps> = ({
  community,
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      padding: scale(3),
      // backgroundColor: theme.colors.error,
    },
    section: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: scale(16),
      marginBottom: verticalScale(16),
    },
    sectionTitle: {
      fontSize: moderateScale(16),
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: verticalScale(12),
    },
    description: {
      fontSize: moderateScale(14),
      color: theme.colors.textSecondary,
      lineHeight: moderateScale(20),
    },
    adminContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    adminInfo: {
      marginLeft: scale(12),
    },
    adminName: {
      fontSize: moderateScale(14),
      fontWeight: "600",
      color: theme.colors.text,
    },
    adminLabel: {
      fontSize: moderateScale(12),
      color: theme.colors.textSecondary,
      marginTop: verticalScale(2),
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: verticalScale(8),
      paddingBottom: verticalScale(12),
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.border,
    },
    infoLabel: {
      fontSize: moderateScale(14),
      color: theme.colors.textSecondary,
    },
    infoValue: {
      fontSize: moderateScale(14),
      fontWeight: "600",
      color: theme.colors.text,
    },
    ruleItem: {
      flexDirection: "row",
      marginBottom: verticalScale(8),
    },
    bullet: {
      width: scale(6),
      height: scale(6),
      borderRadius: scale(3),
      backgroundColor: theme.colors.primary,
      marginRight: scale(8),
      marginTop: moderateScale(7),
    },
    ruleText: {
      flex: 1,
      fontSize: moderateScale(14),
      color: theme.colors.textSecondary,
      lineHeight: moderateScale(20),
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{community.description}</Text>
        </View>

        {community.communityAdmin && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Admin</Text>
            <View style={styles.adminContainer}>
              <ProfilePhoto
                profilePicture={community.communityAdmin.profilePicture || undefined}
                size={48}
              />
              <View style={styles.adminInfo}>
                <Text style={styles.adminName}>{community.communityAdmin.name}</Text>
                <Text style={styles.adminLabel}>Community Admin</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Info</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age Group</Text>
            <Text style={styles.infoValue}>{community.ageGroup}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>
              {community.gender === "all" ? "All Genders" : community.gender}
            </Text>
          </View>
        </View>

        {community.rules.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Community Rules</Text>
            {community.rules.map((rule, index) => (
              <View key={index} style={styles.ruleItem}>
                <View style={styles.bullet} />
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};