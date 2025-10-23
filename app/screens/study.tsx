import React, { useState, useMemo } from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";
import { useFlashcards } from "@/hooks/useFlashcards";
import { FlashCard } from "@/components/study/FlashCard";
import { FlashCardViewer } from "@/components/study/FlashCardViewer";
import { QuizButton } from "@/components/study/QuizButton";
import { QuizModal } from "@/components/study/QuizModal";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Modal } from "react-native";
import { ScreenLoading } from "@/components/ScreenLoading";
import { KeyboardHandler } from "@/components/common/KeyboardHandler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Separator } from "@/components/common/Separator";
import { EmptyState } from "@/components/EmptyState";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/Button";

export default function StudyScreen() {
    const { t } = useTranslation();
    const theme = useTheme();

    // states
    const [word, setWord] = useState("");
    const [meaning, setMeaning] = useState("");
    const [search, setSearch] = useState("");
    const [viewerVisible, setViewerVisible] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);
    const [quizVisible, setQuizVisible] = useState(false);


    const { flashcards, loading, addFlashcard, deleteFlashcard } = useFlashcards();

    const filteredFlashcards = useMemo(() => {
        const filtered = search.trim()
            ? flashcards.filter(card =>
                card.word.toLowerCase().includes(search.toLowerCase())
            )
            : flashcards;
        // Show latest cards on top
        return filtered.reverse();
    }, [flashcards, search]);

    const handleAdd = async () => {
        if (word.trim() && meaning.trim()) {
            await addFlashcard(word, meaning);
            setWord("");
            setMeaning("");
        }
    };

    const handleView = (index: number) => {
        // index is from the filtered/reversed array, need to find original index
        const originalIndex = flashcards.indexOf(filteredFlashcards[index]);
        setViewerIndex(originalIndex);
        setViewerVisible(true);
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        content: {
            flex: 1,
            paddingHorizontal: scale(16),
        },
        form: {
            padding: scale(16),
            marginVertical: verticalScale(20),
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.md,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        input: {
            backgroundColor: theme.colors.background,
            borderRadius: theme.borderRadius.md,
            padding: scale(16),
            fontSize: scale(16),
            color: theme.colors.text,
            marginBottom: verticalScale(12)
        },
        addButton: {
            backgroundColor: theme.colors.primary,
            borderRadius: theme.borderRadius.lg,
            padding: scale(16),
            alignItems: "center"
        },
        addButtonText: {
            color: theme.colors.white,
            fontSize: scale(16),
            fontWeight: "600",
        },
        searchContainer: {
            marginVertical: verticalScale(16),
        },
        searchInput: {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.full,
            padding: scale(16),
            fontSize: scale(16),
            color: theme.colors.text
        },
        list: {
            flex: 1,
        },
        emptyState: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: verticalScale(40),
        },
        emptyText: {
            fontSize: scale(18),
            color: theme.colors.textSecondary,
            textAlign: "center",
        },
    });

    if (loading) {
        return (
            <ScreenLoading />
        );
    }

    return (

        <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
            <ScreenHeader title={t("screenTitles.study")} />
            <KeyboardHandler>
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.form}>
                        <TextInput
                            style={styles.input}
                            placeholder={t("study.word")}
                            placeholderTextColor={theme.colors.textSecondary}
                            value={word}
                            onChangeText={setWord}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder={t("study.meaning")}
                            placeholderTextColor={theme.colors.textSecondary}
                            value={meaning}
                            onChangeText={setMeaning}
                            multiline
                            numberOfLines={3}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={handleAdd} activeOpacity={0.8}>
                            <Ionicons name="add" size={scale(24)} color={theme.colors.white} />
                        </TouchableOpacity>
                    </View>

                    <Separator customOptions={["-----------"]} />

                    <Button
                        title="Start Quiz"
                        onPress={() => setQuizVisible(true)}
                        disabled={flashcards.length < 3}
                    />

                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder={t("common.searchPlaceholder")}
                            placeholderTextColor={theme.colors.textSecondary}
                            value={search}
                            onChangeText={setSearch}
                        />
                    </View>

                    <View style={styles.list}>
                        {filteredFlashcards.length === 0 ? (
                            <EmptyState />
                        ) : (
                            filteredFlashcards.map((card) => (
                                <FlashCard
                                    key={card.id}
                                    flashcard={card}
                                    onView={() => handleView(flashcards.indexOf(card))}
                                />
                            ))
                        )}
                    </View>
                </ScrollView>
            </KeyboardHandler>


            <Modal
                visible={viewerVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setViewerVisible(false)}
                statusBarTranslucent
            >
                <FlashCardViewer
                    flashcards={flashcards}
                    cardIndex={viewerIndex}
                    visible={viewerVisible}
                    onRequestClose={() => setViewerVisible(false)}
                    onDelete={deleteFlashcard}
                />
            </Modal>

            <QuizModal
                visible={quizVisible}
                flashcards={flashcards}
                onClose={() => setQuizVisible(false)}
            />
        </SafeAreaView >
    );
}