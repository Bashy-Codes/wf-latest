import { Tabs } from "expo-router";
import { CustomTabBar } from "@/components/CustomTabBar";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="discover" />
      <Tabs.Screen name="friends" />
      <Tabs.Screen name="conversations" />
      <Tabs.Screen name="letters" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
