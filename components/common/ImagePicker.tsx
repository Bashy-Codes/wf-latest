import React, { forwardRef, useState, useCallback, useImperativeHandle } from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/Theme";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

interface ImagePickerProps {
  onImageSelected: (imageUri: string) => void;
}

export interface ImagePickerRef {
  present: () => void;
  dismiss: () => void;
}

export const ImagePickerModal = forwardRef<ImagePickerRef, ImagePickerProps>(
  ({ onImageSelected }, ref) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      present: () => setVisible(true),
      dismiss: () => setVisible(false),
    }), []);

    const handleClose = useCallback(() => {
      setVisible(false);
    }, []);

    const styles = StyleSheet.create({
      modal: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        justifyContent: "center",
        alignItems: "center",
      },
      container: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.xl,
        padding: scale(46),
        flexDirection: "row",
        gap: scale(20),
      },
      option: {
        width: scale(80),
        height: scale(80),
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.surface,
        justifyContent: "center",
        alignItems: "center",
      },
    });

    const handleCameraPress = async () => {
      try {
        // Request camera permissions
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Toast.show({
            type: "error",
            text1: t("errorToasts.cameraPermission.text1"),
            text2: t("errorToasts.cameraPermission.text2"),
            position: "top",
          });
          return;
        }

        // Launch camera
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          // aspect: [1, 1],
          // quality: 1,
        });

        if (!result.canceled && result.assets[0]) {
          onImageSelected(result.assets[0].uri);
          setVisible(false);
        }
      } catch (error) {
        console.error("Camera error:", error);
        Toast.show({
          type: "error",
          text1: t("errorToasts.genericError.text1"),
          text2: t("errorToasts.genericError.text2"),
          position: "top",
        });
      }
    };

    const handleGalleryPress = async () => {
      try {
        // Request media library permissions
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Toast.show({
            type: "error",
            text1: t("errorToasts.photoLibraryPermission.text1"),
            text2: t("errorToasts.photoLibraryPermission.text2"),
            position: "top",
          });
          return;
        }

        // Launch image picker
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          // aspect: [1, 1],
          // quality: 1,
        });

        if (!result.canceled && result.assets[0]) {
          onImageSelected(result.assets[0].uri);
          setVisible(false);
        }
      } catch (error) {
        console.error("Gallery error:", error);
        Toast.show({
          type: "error",
          text1: t("errorToasts.genericError.text1"),
          text2: t("errorToasts.genericError.text2"),
          position: "top",
        });
      }
    };

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleClose}
      >
        <TouchableOpacity
          style={styles.modal}
          activeOpacity={1}
          onPress={handleClose}
        >
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.option}
              onPress={handleCameraPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name="camera"
                size={scale(32)}
                color={theme.colors.error}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={handleGalleryPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name="images"
                size={scale(32)}
                color={theme.colors.error}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
);