import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/lib/Theme";
import { LetterCardProps } from "@/types";
import { getCountryByCode } from "@/constants/geographics";
import { ActionModal, ActionModalRef } from "@/components/common/ActionModal";
import { useTranslation } from "react-i18next";
import AgeGenderChip from "../ui/AgeGenderChip";
import ProfilePhoto from "../ui/ProfilePhoto";
import NameContainer from "../ui/NameContainer";


export const LetterCard: React.FC<LetterCardProps> = ({
  letter,
  onDelete,
  onOpen,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  // refs
  const actionModalRef = useRef<ActionModalRef>(null);

  // Determine if this is a received or sent letter
  const isReceived = !!letter.sender;
  const displayUser = isReceived ? letter.sender! : letter.recipient!;

  // Get status icon and text
  const getStatusIcon = () => {
    if (isReceived) {
      // For received letters, show truck-fast icon for "composed X days ago"
      return "truck-delivery";
    } else {
      // For sent letters, show delivery status icons
      if (letter.isDelivered) {
        return "truck-check"; // Delivered
      } else {
        return "truck-fast"; // Delivers in X days
      }
    }
  };

  const getStatusColor = () => {
    if (isReceived) {
      return theme.colors.success;
    } else {
      return letter.isDelivered ? theme.colors.success : theme.colors.textMuted;
    }
  };

  const handleOptionsPress = () => {
    actionModalRef.current?.present();
  };

  const handleDeletePress = () => {
    onDelete(letter.letterId);
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: scale(theme.borderRadius.lg),
      padding: scale(16),
      marginHorizontal: scale(16),
      marginVertical: verticalScale(6),
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 3,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: verticalScale(12),
    },
    userInfo: {
      flex: 1,
    },

    userDetails: {
      fontSize: moderateScale(12),
      color: theme.colors.textSecondary,
    },
    flagContainer: {
      backgroundColor: theme.colors.background,
      width: scale(62),
      height: scale(62),
      borderRadius: theme.borderRadius.lg,
      justifyContent: "center",
      alignItems: "center"
    },
    flag: {
      fontSize: moderateScale(36),
    },
    title: {
      fontSize: moderateScale(24),
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: verticalScale(8),
      lineHeight: moderateScale(30),
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    statusContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: scale(theme.borderRadius.md),
      padding: scale(8),
      flexDirection: "row",
      alignItems: "center",
    },
    statusIcon: {
      marginRight: scale(6),
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
    },
    actionButton: {
      padding: scale(8),
      borderRadius: scale(theme.borderRadius.full),
      backgroundColor: theme.colors.surfaceSecondary,
      marginLeft: scale(8),
    },
    deleteButton: {
      backgroundColor: theme.colors.surfaceSecondary,
    },
    optionsButton: {
      padding: scale(8),
      borderRadius: scale(theme.borderRadius.full),
      backgroundColor: theme.colors.surfaceSecondary,
    },
  });

  return (
    <>
      <TouchableOpacity
        style={styles.card}
        onPress={() => onOpen(letter.letterId)}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
          <ProfilePhoto profilePicture={displayUser.profilePicture} size={70} />
          <View style={styles.userInfo}>
            <NameContainer
              name={displayUser.name}
              size={20}
              activeBadge={displayUser.activeBadge}
              style={{ margin: scale(10), justifyContent: "flex-start" }}
            />
            <AgeGenderChip
              size="small"
              gender={displayUser.gender}
              age={displayUser.age}
              style={{ justifyContent: "flex-start", marginLeft: scale(10) }}
            />
          </View>
          <View style={styles.flagContainer}>
            <Text style={styles.flag}>
              {getCountryByCode(displayUser.country)?.flag}
            </Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {letter.title}
        </Text>

        <View style={styles.footer}>
          <View style={styles.statusContainer}>
            <MaterialCommunityIcons
              name={getStatusIcon()}
              size={scale(26)}
              color={getStatusColor()}
              style={styles.statusIcon}
            />
          </View>
          <TouchableOpacity
            style={styles.optionsButton}
            onPress={handleOptionsPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={scale(20)}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <ActionModal
        ref={actionModalRef}
        options={[
          {
            id: "delete",
            title: t("actions.deleteLetter"),
            icon: "trash-outline",
            color: theme.colors.error,
            onPress: handleDeletePress,
          },
        ]}
      />
    </>
  );
};
