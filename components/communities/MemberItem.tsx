import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";
import ProfilePhoto from "@/components/ui/ProfilePhoto";
import { Id } from "@/convex/_generated/dataModel";

interface MemberItemProps {
  userId: Id<"users">;
  profilePicture: string;
  name: string;
  gender: "male" | "female" | "other";
  age: number;
  country: string;
  isSupporter?: boolean;
  onPress: (userId: Id<"users">) => void;
}

export const MemberItem: React.FC<MemberItemProps> = ({
  userId,
  profilePicture,
  name,
  gender,
  age,
  country,
  isSupporter,
  onPress,
}) => {
  const theme = useTheme();

  const getGenderIcon = () => {
    switch (gender) {
      case "male":
        return "male";
      case "female":
        return "female";
      default:
        return "male-female";
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: scale(8),
      marginBottom: verticalScale(4),
      borderRadius: scale(theme.borderRadius.lg),
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      overflow: "hidden",
    },
    pressable: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(14),
    },
    profileSection: {
      marginRight: scale(12),
    },
    contentSection: {
      flex: 1,
      justifyContent: "center",
    },
    nameContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: verticalScale(4),
    },
    name: {
      fontSize: moderateScale(16),
      fontWeight: "600",
      color: theme.colors.text,
    },
    supporterIcon: {
      marginLeft: scale(4),
    },
    infoContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: scale(8),
    },
    infoItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: scale(4),
    },
    infoText: {
      fontSize: moderateScale(14),
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.pressable}
        onPress={() => onPress(userId)}
        activeOpacity={0.7}
      >
        <View style={styles.profileSection}>
          <ProfilePhoto profilePicture={profilePicture} size={52} />
        </View>

        <View style={styles.contentSection}>
          <View style={styles.nameContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            {isSupporter && (
              <Ionicons
                name="heart"
                size={scale(16)}
                color={theme.colors.secondary}
                style={styles.supporterIcon}
              />
            )}
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoText}>{age}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons
                name={getGenderIcon()}
                size={scale(14)}
                color={theme.colors.textSecondary}
              />
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoText}>{country}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
