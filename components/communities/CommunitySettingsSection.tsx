import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";

interface CommunitySettingsSectionProps {
  isAdmin: boolean;
  onLeave: () => void;
  onDelete: () => void;
  isLeaving: boolean;
  isDeleting: boolean;
}

export const CommunitySettingsSection: React.FC<CommunitySettingsSectionProps> = ({
  isAdmin,
  onLeave,
  onDelete,
  isLeaving,
  isDeleting,
}) => {
  const theme = useTheme();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      padding: scale(16),
    },
    section: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      overflow: "hidden",
      marginBottom: verticalScale(16),
    },
    sectionTitle: {
      fontSize: moderateScale(16),
      fontWeight: "600",
      color: theme.colors.text,
      padding: scale(16),
      paddingBottom: verticalScale(8),
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      padding: scale(16),
    },
    optionIcon: {
      marginRight: scale(12),
    },
    optionText: {
      flex: 1,
      fontSize: moderateScale(14),
      fontWeight: "500",
      color: theme.colors.text,
    },
    dangerText: {
      color: theme.colors.error,
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {isAdmin && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.option}
              onPress={() => setShowDeleteModal(true)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="trash-outline"
                size={scale(20)}
                color={theme.colors.error}
                style={styles.optionIcon}
              />
              <Text style={[styles.optionText, styles.dangerText]}>
                Delete Community
              </Text>
              <Ionicons
                name="chevron-forward"
                size={scale(20)}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => setShowLeaveModal(true)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="exit-outline"
              size={scale(20)}
              color={theme.colors.error}
              style={styles.optionIcon}
            />
            <Text style={[styles.optionText, styles.dangerText]}>
              Leave Community
            </Text>
            <Ionicons
              name="chevron-forward"
              size={scale(20)}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ConfirmationModal
        visible={showLeaveModal}
        title="Leave Community"
        message="Are you sure you want to leave this community?"
        confirmText="Leave"
        onConfirm={() => {
          setShowLeaveModal(false);
          onLeave();
        }}
        onCancel={() => setShowLeaveModal(false)}
        loading={isLeaving}
      />

      <ConfirmationModal
        visible={showDeleteModal}
        title="Delete Community"
        message="Are you sure you want to delete this community? This action cannot be undone."
        confirmText="Delete"
        onConfirm={() => {
          setShowDeleteModal(false);
          onDelete();
        }}
        onCancel={() => setShowDeleteModal(false)}
        loading={isDeleting}
      />
    </ScrollView>
  );
};