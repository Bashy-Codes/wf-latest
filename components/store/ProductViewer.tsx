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
import { Product } from "@/types/store";
import { Button } from "../ui/Button";

const { height: screenHeight } = Dimensions.get("window");

interface ProductViewerProps {
  product: Product | null;
  visible: boolean;
  onRequestClose: () => void;
  onPress?: () => void;
  buttonText?: string;
  loading?: boolean;
}

export const ProductViewer: React.FC<ProductViewerProps> = ({
  product,
  visible,
  onRequestClose,
  onPress,
  buttonText,
  loading = false,
}) => {
  const theme = useTheme();

  if (!product) return null;

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
    imageContainer: {
      width: "90%",
      height: screenHeight * 0.4,
      borderRadius: theme.borderRadius.xl,
      overflow: "hidden",
      marginBottom: verticalScale(16),
      backgroundColor: theme.colors.surface,
      padding: scale(24)
    },
    image: {
      width: "100%",
      height: "100%",
    },
    contentContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: scale(24),
      width: "90%",
      alignItems: "center",
    },
    title: {
      fontSize: moderateScale(24),
      fontWeight: "700",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: verticalScale(12),
    },
    description: {
      fontSize: moderateScale(14),
      color: theme.colors.textMuted,
      textAlign: "center",
      lineHeight: moderateScale(20),
      marginBottom: verticalScale(16),
    },
    closeButtonContainer: {
      position: "absolute",
      bottom: verticalScale(24),
      left: scale(20),
      right: scale(20),
      zIndex: 10,
    },
    closeButton: {
      width: "100%",
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
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product.image }}
              style={styles.image}
              contentFit="contain"
            />
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.description}>{product.description}</Text>
            <Button
              title={buttonText || `Purchase - $${product.price}`}
              onPress={loading ? () => { } : (onPress || (() => console.log("Purchase", product.id)))}
              style={{ width: "100%" }}
              loading={loading}
            />
          </View>

          <View style={styles.closeButtonContainer}>
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
      </View>
    </Modal>
  );
};