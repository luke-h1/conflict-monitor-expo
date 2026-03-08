import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { fetchEvents, fetchSignals } from "@/lib/api";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 10,
      retry: 2,
    },
  },
});

function PrefetchData() {
  const qc = useQueryClient();
  useEffect(() => {
    qc.prefetchQuery({ queryKey: ["events"], queryFn: fetchEvents });
    qc.prefetchQuery({ queryKey: ["signals"], queryFn: fetchSignals });
  }, [qc]);
  return null;
}

export const unstable_settings = {
  anchor: "(tabs)",
};

const sheetPresentation =
  Platform.OS === "ios"
    ? ("formSheet" as const)
    : ("card" as const);

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <PrefetchData />
        <Stack
          screenOptions={{
            fullScreenGestureEnabled: true,
            animation: "default",
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="event/[slug]"
            options={{
              title: "Event",
              headerBackTitle: "Events",
              presentation: sheetPresentation,
              headerLargeTitle: false,
            }}
          />
          <Stack.Screen
            name="signal/[id]"
            options={{
              title: "Signal",
              headerBackTitle: "Signals",
              presentation: sheetPresentation,
              headerLargeTitle: false,
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
