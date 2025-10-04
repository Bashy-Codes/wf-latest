import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";
import { useCreateCommunity } from "@/hooks/useCreateCommunity";

// Components
import { ScreenHeader } from "@/components/ScreenHeader";
import { Button } from "@/components/ui/Button";

export default function CreateCommunityScreen() {
  const theme = useTheme();
  const [newRule, setNewRule] = useState("");
  
  const {
    title,
    description,
    rules,
    genderOption,
    bannerUri,
    isCreating,
    agreementAccepted,
    setTitle,
    setDescription,
    addRule,
    removeRule,
    setGenderOption,
    setBannerUri,
    setAgreementAccepted,
    createCommunity,
    canCreate,
  } = useCreateCommunity();

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleAddRule = useCallback(() => {
    if (newRule.trim()) {
      addRule(newRule);
      setNewRule("");
    }
  }, [newRule, addRule]);

  const handleCreate = useCallback(async () => {
    const success = await createCommunity();
    if (success) {
      router.back();
    }
  }, [createCommunity]);

  const handleImagePicker = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setBannerUri(result.assets[0].uri);
    }
  }, [setBannerUri]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: scale(16),
    },
    section: {
      marginBottom: verticalScale(24),
    },
    sectionTitle: {
      fontSize: moderateScale(16),
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: verticalScale(12),
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: scale(16),
      fontSize: moderateScale(16),
      color: theme.colors.text,
      minHeight: verticalScale(50),
    },
    textArea: {
      minHeight: verticalScale(100),
      textAlignVertical: "top",
    },
    ruleContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: verticalScale(8),
    },
    ruleInput: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: scale(12),
      fontSize: moderateScale(14),
      color: theme.colors.text,
      marginRight: scale(8),
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      padding: scale(12),
    },
    ruleItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: scale(12),
      marginBottom: verticalScale(8),
    },
    ruleText: {
      flex: 1,
      fontSize: moderateScale(14),
      color: theme.colors.text,
    },
    removeButton: {
      padding: scale(4),
    },
    genderOption: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: scale(16),
      marginBottom: verticalScale(12),
    },
    genderText: {
      flex: 1,
      fontSize: moderateScale(16),
      color: theme.colors.text,
    },
    agreementContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: scale(16),
      marginBottom: verticalScale(24),
    },
    agreementText: {
      flex: 1,
      fontSize: moderateScale(14),
      color: theme.colors.text,
      marginLeft: scale(12),
    },
    bannerContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      height: verticalScale(120),
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    bannerImage: {
      width: "100%",
      height: "100%",
    },
    bannerPlaceholder: {
      alignItems: "center",
    },
    bannerText: {
      fontSize: moderateScale(14),
      color: theme.colors.textSecondary,
      marginTop: verticalScale(8),
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ScreenHeader title="Create Community" onBack={handleBack} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter community title"
            placeholderTextColor={theme.colors.textSecondary}
            maxLength={50}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your community"
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            maxLength={500}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Banner Image</Text>
          <TouchableOpacity
            style={styles.bannerContainer}
            onPress={handleImagePicker}
            activeOpacity={0.8}
          >
            {bannerUri ? (
              <Image
                source={{ uri: bannerUri }}
                style={styles.bannerImage}
                contentFit="cover"
              />
            ) : (
              <View style={styles.bannerPlaceholder}>
                <Ionicons
                  name="image"
                  size={scale(32)}
                  color={theme.colors.textSecondary}
                />
                <Text style={styles.bannerText}>Tap to add banner</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Rules</Text>
          <View style={styles.ruleContainer}>
            <TextInput
              style={styles.ruleInput}
              value={newRule}
              onChangeText={setNewRule}
              placeholder="Add a rule"
              placeholderTextColor={theme.colors.textSecondary}
              onSubmitEditing={handleAddRule}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddRule}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={scale(20)} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
          
          {rules.map((rule, index) => (
            <View key={index} style={styles.ruleItem}>
              <Text style={styles.ruleText}>{rule}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeRule(index)}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={scale(16)} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gender Preference</Text>
          <TouchableOpacity
            style={styles.genderOption}
            onPress={() => setGenderOption("all")}
            activeOpacity={0.8}
          >
            <Text style={styles.genderText}>All Genders</Text>
            <Ionicons
              name={genderOption === "all" ? "radio-button-on" : "radio-button-off"}
              size={scale(20)}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.genderOption}
            onPress={() => setGenderOption("my_gender")}
            activeOpacity={0.8}
          >
            <Text style={styles.genderText}>My Gender Only</Text>
            <Ionicons
              name={genderOption === "my_gender" ? "radio-button-on" : "radio-button-off"}
              size={scale(20)}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.agreementContainer}>
          <Switch
            value={agreementAccepted}
            onValueChange={setAgreementAccepted}
            trackColor={{ false: theme.colors.surfaceSecondary, true: theme.colors.primary }}
            thumbColor={theme.colors.white}
          />
          <Text style={styles.agreementText}>
            I agree to be fair and make WorldFriends friendly and contribute positively
          </Text>
        </View>

        <Button
          title="Create Community"
          onPress={handleCreate}
          loading={isCreating}
          disabled={!canCreate}
        />
      </ScrollView>
    </SafeAreaView>
  );
}