import React, { useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { useTheme } from "@/lib/Theme";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/Button";
import { DiscussionCard } from "@/components/communities/DiscussionCard";
import { EmptyState } from "@/components/EmptyState";
import { Discussion } from "@/types/discussions";

interface CommunityHomeSectionProps {
  communityId: Id<"communities">;
  isMember: boolean;
  onJoinPress: () => void;
  isJoining: boolean;
}

export const CommunityHomeSection: React.FC<CommunityHomeSectionProps> = ({
  communityId,
  isMember,
  onJoinPress,
  isJoining,
}) => {
  const theme = useTheme();

  const discussionsResult = useQuery(
    api.communities.discussions.getCommunityDiscussions,
    isMember ? { communityId, paginationOpts: { numItems: 50, cursor: null } } : "skip"
  );

  const discussions = discussionsResult?.page || [];
  const isLoading = discussionsResult === undefined;

  const handleDiscussionPress = useCallback((discussion: Discussion) => {
    router.push(`/screens/discussion/${discussion.discussionId}`);
  }, []);

  const handleCreateDiscussion = useCallback(() => {
    router.push({ pathname: "/screens/create-discussion", params: { communityId } });
  }, [communityId]);

  const renderDiscussion = useCallback(
    ({ item }: { item: Discussion }) => (
      <DiscussionCard discussion={item} onPress={handleDiscussionPress} />
    ),
    [handleDiscussionPress]
  );

  const ListHeader = useCallback(() => (
    <View style={{ paddingHorizontal: scale(8), paddingBottom: verticalScale(12) }}>
      <Button
        title="Create Discussion"
        iconName="add"
        onPress={handleCreateDiscussion}
      />
    </View>
  ), [handleCreateDiscussion]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
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
      marginBottom: verticalScale(24),
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: verticalScale(40),
    },
    listContainer: {
      flex: 1,
      minHeight: verticalScale(400),
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
          Join this community to see discussions
        </Text>
        <Button
          title="Join Community"
          onPress={onJoinPress}
          loading={isJoining}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      <FlashList
        data={discussions}
        keyExtractor={(item) => item.discussionId}
        renderItem={renderDiscussion}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={() => <EmptyState halfScreen />}
        contentContainerStyle={{
          paddingBottom: verticalScale(20),
        }}
      />
    </View>
  );
};