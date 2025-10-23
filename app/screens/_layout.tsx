import { Stack } from "expo-router";

export default function ScreensLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="create-profile" />
      <Stack.Screen name="create-post" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="app-info" />
      <Stack.Screen name="compose-letter" />
      <Stack.Screen name="store" />
      <Stack.Screen name="report" />
      <Stack.Screen name="user-profile/[id]" />
      <Stack.Screen name="post/[id]" />
      <Stack.Screen name="conversation/[id]" />
      <Stack.Screen name="collection/[id]" />
      <Stack.Screen name="letter/[id]" />
    </Stack>
  );
}
