import { memo, useCallback, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { router } from "expo-router";
import { useMutation } from "convex/react";
import { useTheme } from "@/lib/Theme";
import { getCountryByCode } from "@/constants/geographics";
import type { Friend, Request } from "@/types/friendships";
import { api } from "@/convex/_generated/api";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import AgeGenderChip from "../ui/AgeGenderChip";
import NameContainer from "../ui/NameContainer";
import ProfilePhoto from "../ui/ProfilePhoto";

interface FriendRequestCardProps {
  data: Friend | Request;
  type: "friend" | "request";
  onPress?: () => void;
}

const FriendRequestCardComponent: React.FC<FriendRequestCardProps> = ({
  data,
  type,
  onPress,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

  const createConversationMutation = useMutation(
    api.communications.conversations.createConversation,
  );
  const country = getCountryByCode(data.country);

  const handleMessage = useCallback(async () => {
    if (isCreatingConversation || type !== "friend") return;

    try {
      setIsCreatingConversation(true);
      const friend = data as Friend;
      const conversationId = await createConversationMutation({
        otherUserId: friend.userId,
      });
      router.push(`/screens/conversation/${conversationId}` as any);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    } finally {
      setIsCreatingConversation(false);
    }
  }, [data, type, createConversationMutation, isCreatingConversation]);

  const handleCardPress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: scale(theme.borderRadius.lg),
      padding: scale(20),
      marginHorizontal: scale(16),
      marginVertical: verticalScale(8),
      alignItems: "center",
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    countryContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: scale(theme.borderRadius.full),
      padding: scale(14),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: verticalScale(20),
    },
    flagEmoji: {
      fontSize: moderateScale(14),
      marginRight: scale(8),
    },
    countryText: {
      fontSize: moderateScale(16),
      color: theme.colors.text,
      fontWeight: "600",
    },
    buttonsContainer: {
      flexDirection: "row",
      width: "100%",
      gap: scale(12),
    },
  });

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      activeOpacity={0.8}
      style={styles.card}
    >
      <ProfilePhoto
        profilePicture={data.profilePicture}
        size={100}
      />
      <NameContainer
        name={data.name}
        activeBadge={data.activeBadge}
        size={28}
      />
      <AgeGenderChip
        size="medium"
        gender={data.gender}
        age={data.age}
      />

      <View style={styles.countryContainer}>
        <Text style={styles.flagEmoji}>{country?.flag}</Text>
        <Text style={styles.countryText}>{country?.name}</Text>
      </View>

      {type === "friend" && (
        <View style={styles.buttonsContainer}>
          <Button
            iconName="chatbubble-ellipses"
            onPress={handleMessage}
            style={{ flex: 1 }}
            loading={isCreatingConversation}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export const FriendRequestCard = memo(FriendRequestCardComponent);