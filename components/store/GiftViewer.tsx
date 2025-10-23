import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  Modal,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";
import { getCountryByCode } from "@/constants/geographics";
import { formatTimeAgo } from "@/utils/formatTime";

const { height: screenHeight } = Dimensions.get("window");

interface GiftViewerProps {
  gift: {
    productDetails?: {
      title: string;
      image: string;
    };
    senderInfo?: {
      name: string;
      country: string;
    };
    receiverInfo?: {
      name: string;
      country: string;
    };
    createdAt: number;
  } | null;
  visible: boolean;
  onRequestClose: () => void;
}

export const GiftViewer: React.FC<GiftViewerProps> = ({
  gift,
  visible,
  onRequestClose,
}) => {
  const theme = useTheme();

  if (!gift || !gift.productDetails) return null;

  const userInfo = gift.senderInfo || gift.receiverInfo;
  const country = userInfo ? getCountryByCode(userInfo.country) : null;

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.95)",
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: verticalScale(24),
    },
    giftContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: scale(24),
      width: "90%",
      alignItems: "center",
      marginBottom: verticalScale(16),
    },
    image: {
      width: "100%",
      height: screenHeight * 0.25,
      borderRadius: theme.borderRadius.lg,
      marginBottom: verticalScale(16),
    },
    title: {
      fontSize: moderateScale(20),
      fontWeight: "700",
      color: theme.colors.text,
      textAlign: "center",
      backgroundColor: theme.colors.background,
      padding: scale(16),
      borderRadius: theme.borderRadius.lg,
    },
    userInfoContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: scale(20),
      width: "90%",
      marginBottom: verticalScale(24),
    },
    infoCard: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      padding: scale(16),
      flexDirection: "row",
      alignItems: "center",
      marginBottom: verticalScale(12),
    },
    infoIcon: {
      marginRight: scale(16),
    },
    infoValue: {
      fontSize: moderateScale(15),
      color: theme.colors.text,
      fontWeight: "600",
    },
    closeButton: {
      width: "90%",
      height: verticalScale(50),
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
      statusBarTranslucent
    >
      <View style={styles.modal}>
        <View style={styles.container}>
          <View style={styles.giftContainer}>
            <Image
              source={{ uri: gift.productDetails.image }}
              style={styles.image}
              contentFit="contain"
            />
            <Text style={styles.title}>{gift.productDetails.title}</Text>
          </View>

          {userInfo && (
            <View style={styles.userInfoContainer}>
              <View style={styles.infoCard}>
                <Ionicons
                  name={gift.senderInfo ? "arrow-forward-outline" : "paper-plane"}
                  size={scale(24)}
                  color={theme.colors.primary}
                  style={styles.infoIcon}
                />
                <Text style={styles.infoValue}>{userInfo.name}</Text>
              </View>

              <View style={styles.infoCard}>
                <Ionicons
                  name="time"
                  size={scale(24)}
                  color={theme.colors.info}
                  style={styles.infoIcon}
                />
                <Text style={styles.infoValue}>
                  {formatTimeAgo(gift.createdAt)}
                </Text>
              </View>

              <View style={styles.infoCard}>
                <Ionicons
                  name="location"
                  size={scale(24)}
                  color={theme.colors.error}
                  style={styles.infoIcon}
                />
                <Text style={styles.infoValue}>
                  {country?.flag} {country?.name}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onRequestClose}
            activeOpacity={0.8}
          >
            <Ionicons
              name="close"
              size={scale(24)}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};