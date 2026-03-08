import { Stack } from "expo-router";

export default function SignalsLayout() {
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerTitle: "Signals",
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: true }} />
    </Stack>
  );
}
