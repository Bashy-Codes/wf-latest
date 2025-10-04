import React, { useCallback } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { useTheme } from "@/lib/Theme";
import { useCommunityMembers } from "@/hooks/useCommunityMembers";
import { Id } from "@/convex/_generated/dataModel";
import { MemberItem } from "./MemberItem";
import { EmptyState } from "@/components/EmptyState";

interface CommunityMembersSectionProps {
  communityId: Id<"communities">;
  isMember: boolean;
}

export const CommunityMembersSection: React.FC<CommunityMembersSectionProps> = ({
  communityId,
  isMember,
}) => {
  const theme = useTheme();
  const { members, loading, handleLoadMore } = useCommunityMembers(communityId);

  const handleMemberPress = useCallback((userId: Id<"users">) => {
    router.push({ pathname: "/screens/user-profile/[id]", params: { id: userId } });
  }, []);

  const renderMember = useCallback(
    ({ item }: { item: any }) => (
      <MemberItem
        userId={item.userId}
        profilePicture={item.profilePicture}
        name={item.name}
        gender={item.gender}
        age={item.age}
        country={item.country}
        isSupporter={item.isSupporter}
        onPress={handleMemberPress}
      />
    ),
    [handleMemberPress]
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: verticalScale(40),
    },
    restrictedContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: scale(40),
      paddingVertical: verticalScale(40),
    },
    restrictedText: {
      fontSize: moderateScale(16),
      fontWeight: "500",
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: verticalScale(12),
    },
  });

  if (!isMember) {
    return (
      <View style={styles.restrictedContainer}>
        <Ionicons
          name="lock-closed"
          size={scale(48)}
          color={theme.colors.textMuted}
        />
        <Text style={styles.restrictedText}>
          Join this community to see members
        </Text>
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
        data={members}
        renderItem={renderMember}
        keyExtractor={(item) => item.userId}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: verticalScale(32),
        }}
        ListEmptyComponent={() => <EmptyState halfScreen />}
      />
    </View>
  );
};
