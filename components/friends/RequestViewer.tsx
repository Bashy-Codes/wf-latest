import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
  Animated,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";
import { Id } from "@/convex/_generated/dataModel";

interface BaseRequest {
  requestMessage: string;
}

interface FriendRequest extends BaseRequest {
  requestId: Id<"friendRequests">;
  senderId: Id<"users">;
}

interface CommunityRequest extends BaseRequest {
  requestId: Id<"communityMembers">;
  userId: Id<"users">;
}

type RequestType = FriendRequest | CommunityRequest;

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface RequestViewerProps {
  request: RequestType | null;
  visible: boolean;
  onRequestClose: () => void;
  onAccept: () => void;
  onReject: () => void;
}

export const RequestViewer: React.FC<RequestViewerProps> = ({
  request,
  visible,
  onRequestClose,
  onAccept,
  onReject,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: scale(20),
    },
    messageContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: scale(theme.borderRadius.lg),
      padding: scale(24),
      maxWidth: screenWidth - scale(40),
      maxHeight: screenHeight * 0.6,
      minWidth: screenWidth - scale(80),
      minHeight: verticalScale(200),
    },
    messageText: {
      fontSize: moderateScale(16),
      color: theme.colors.text,
      lineHeight: moderateScale(22),
    },
    buttonsContainer: {
      position: "absolute",
      bottom: insets.bottom + verticalScale(20),
      left: scale(20),
      right: scale(20),
      flexDirection: "row",
      gap: scale(12),
    },
    button: {
      flex: 1,
      height: verticalScale(50),
      borderRadius: scale(theme.borderRadius.lg),
      justifyContent: "center",
      alignItems: "center",
    },
    acceptButton: {
      backgroundColor: theme.colors.success,
    },
    rejectButton: {
      backgroundColor: theme.colors.error,
    },
  });

  if (!request) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
      statusBarTranslucent
    >
      <Animated.View
        style={[
          styles.modal,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.container}>
          <Animated.View
            style={[
              styles.messageContainer,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.messageText}>{request.requestMessage}</Text>
          </Animated.View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={onReject}
              activeOpacity={0.8}
            >
              <Ionicons
                name="trash"
                size={scale(24)}
                color={theme.colors.white}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={onAccept}
              activeOpacity={0.8}
            >
              <Ionicons
                name="checkmark"
                size={scale(24)}
                color={theme.colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};