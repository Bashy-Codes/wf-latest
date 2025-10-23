import React, { useState, useCallback, useMemo } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { verticalScale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/Theme";
import { TabView, TabBar } from "react-native-tab-view";

// components
import { TabHeader } from "@/components/TabHeader";
import { Greetings } from "@/components/feed/Greetings";
import { ReceivedLettersSection } from "@/components/letters/ReceivedLettersSection";
import { SentLettersSection } from "@/components/letters/SentLettersSection";

export default function LettersScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "received", title: "Received" },
    { key: "sent", title: "Sent" },
  ]);

  const handleComposeLetter = useCallback(() => {
    router.push("/screens/compose-letter");
  }, []);

  const renderTabBar = useCallback(
    (props: any) => (
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: theme.colors.primary }}
        style={{ backgroundColor: theme.colors.background }}
        activeColor={theme.colors.primary}
        inactiveColor={theme.colors.textSecondary}
        labelStyle={{ fontWeight: "600", textTransform: "none" }}
      />
    ),
    [theme]
  );

  const headerComponent = useMemo(
    () => <Greetings onCreatePost={handleComposeLetter} actionText={t("actions.composeLetter")} />,
    [handleComposeLetter, t]
  );

  const renderScene = useCallback(
    ({ route }: any) => {
      switch (route.key) {
        case "received":
          return <ReceivedLettersSection headerComponent={headerComponent} />;
        case "sent":
          return <SentLettersSection headerComponent={headerComponent} />;
        default:
          return null;
      }
    },
    [headerComponent]
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      paddingTop: verticalScale(100),
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <TabHeader title="Letters" />
      <View style={styles.content}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      </View>
    </SafeAreaView>
  );
}