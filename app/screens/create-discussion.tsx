import React from "react";
import { StyleSheet, ScrollView, View, TextInput, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/Theme";
import { useCreateDiscussion } from "@/hooks/useCreateDiscussion";
import { ScreenHeader } from "@/components/ScreenHeader";
import { LargeInputContainer } from "@/components/common/LargeInputContainer";
import { AddImageSection } from "@/components/feed/AddImageSection";
import { ImagePickerModal } from "@/components/common/ImagePicker";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { LoadingModal } from "@/components/common/LoadingModal";

export default function CreateDiscussionScreen() {
  const theme = useTheme();

  const {
    title,
    content,
    image,
    canCreate,
    showDiscardModal,
    showCreateModal,
    loadingModalState,
    imagePickerRef,
    setTitle,
    setContent,
    handleBack,
    handleCreate,
    confirmCreate,
    confirmDiscard,
    closeDiscardModal,
    closeCreateModal,
    handleLoadingModalComplete,
    handleAddImage,
    handleImageSelected,
    handleRemoveImage,
  } = useCreateDiscussion();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(16),
    },
    titleInputContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: scale(theme.borderRadius.lg),
      padding: scale(16),
      marginBottom: verticalScale(12),
    },
    titleInput: {
      fontSize: moderateScale(18),
      fontWeight: "600",
      color: theme.colors.text,
      textAlignVertical: "top",
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ScreenHeader
        title="Create Discussion"
        onBack={handleBack}
        rightComponent="button"
        rightButtonText={
          <Ionicons
            name="checkmark-circle"
            size={scale(20)}
            color={theme.colors.white}
          />
        }
        onRightPress={handleCreate}
        rightButtonEnabled={canCreate}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: verticalScale(20) }}
      >
        <View style={styles.titleInputContainer}>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Discussion title..."
            placeholderTextColor={theme.colors.textMuted}
            selectionColor={theme.colors.primary}
            maxLength={100}
          />
        </View>

        <LargeInputContainer
          value={content}
          onChangeText={setContent}
          maxLength={1000}
          placeholder="Share your thoughts..."
          placeholderTextColor={theme.colors.textMuted}
          autoCorrect={true}
        />

        <AddImageSection
          images={image ? [image] : []}
          onAddImage={handleAddImage}
          onRemoveImage={handleRemoveImage}
          maxImages={1}
        />
      </ScrollView>

      <ImagePickerModal
        ref={imagePickerRef}
        onImageSelected={handleImageSelected}
      />

      <ConfirmationModal
        visible={showDiscardModal}
        icon="warning-outline"
        description="Discard this discussion?"
        confirmButtonColor={theme.colors.error}
        onConfirm={confirmDiscard}
        onCancel={closeDiscardModal}
      />

      <ConfirmationModal
        visible={showCreateModal}
        icon="checkmark-circle-outline"
        description="Create this discussion?"
        iconColor={theme.colors.info}
        confirmButtonColor={theme.colors.success}
        onConfirm={confirmCreate}
        onCancel={closeCreateModal}
      />

      <LoadingModal
        visible={loadingModalState !== "hidden"}
        state={loadingModalState === "hidden" ? "loading" : loadingModalState}
        onComplete={handleLoadingModalComplete}
      />
    </SafeAreaView>
  );
}
