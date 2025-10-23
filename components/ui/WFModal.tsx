import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";

interface WFModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  headerIcon?: keyof typeof Ionicons.glyphMap;
  title?: string;
  confirmIcon?: keyof typeof Ionicons.glyphMap;
  closeIcon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  children: React.ReactNode;
}

export const WFModal: React.FC<WFModalProps> = ({
  visible,
  onClose,
  onConfirm,
  headerIcon,
  title,
  confirmIcon = "checkmark",
  closeIcon = "close",
  loading = false,
  children,
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.95)",
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    headerContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: scale(24),
      width: "90%",
      alignItems: "center",
      marginBottom: verticalScale(16),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: moderateScale(24),
      fontWeight: "700",
      color: theme.colors.text,
      marginLeft: scale(8),
    },
    mainContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: scale(24),
      width: "90%",
      marginBottom: verticalScale(24),
    },
    buttonContainer: {
      flexDirection: "row",
      width: "90%",
      gap: scale(16),
    },
    actionButton: {
      flex: 1,
      height: verticalScale(50),
      borderRadius: theme.borderRadius.lg,
      justifyContent: "center",
      alignItems: "center",
    },
    closeButton: {
      backgroundColor: theme.colors.background,
    },
    confirmButton: {
      backgroundColor: theme.colors.primary,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modal}>
        <View style={styles.container}>
          {(headerIcon || title) && (
            <View style={styles.headerContainer}>
              <View style={styles.header}>
                {headerIcon && (
                  <Ionicons
                    name={headerIcon}
                    size={scale(32)}
                    color={theme.colors.primary}
                  />
                )}
                {title && <Text style={styles.title}>{title}</Text>}
              </View>
            </View>
          )}

          <View style={styles.mainContainer}>
            {children}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.closeButton]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Ionicons
                name={closeIcon}
                size={scale(24)}
                color={theme.colors.text}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton]}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator
                  size={"small"}
                />
              ) : (
                <Ionicons
                  name={confirmIcon}
                  size={scale(24)}
                  color={theme.colors.text}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};