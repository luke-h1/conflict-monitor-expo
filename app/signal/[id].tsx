import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { fetchSignals } from "@/lib/api";
import { getErrorMessage } from "@/lib/error";

export default function SignalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const {
    data: signals = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["signals"],
    queryFn: fetchSignals,
  });

  const signal = useMemo(
    () => (id ? (signals.find((s) => s.id === id) ?? null) : null),
    [signals, id],
  );

  const errorMessage = getErrorMessage(error);
  const notFound = !isLoading && signals.length > 0 && id && !signal;

  if (isLoading && !signal) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if ((errorMessage || notFound) && !signal) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText type="defaultSemiBold">
          {notFound ? "Signal not found" : errorMessage}
        </ThemedText>
        <ThemedText style={styles.backLink} onPress={() => router.back()}>
          Go back
        </ThemedText>
      </ThemedView>
    );
  }

  if (!signal) return null;

  return (
    <Animated.View entering={FadeIn.duration(350)} style={styles.scroll}>
      <ScrollView
        style={styles.scrollInner}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
      >
        <ThemedView style={styles.block}>
          <ThemedText type="subtitle">Content</ThemedText>
          <ThemedText selectable>{signal.content}</ThemedText>
        </ThemedView>
        {(signal.source != null || signal.source_type != null) && (
          <ThemedView style={styles.block}>
            <ThemedText type="subtitle">Source</ThemedText>
            <ThemedText selectable>
              {[signal.source_type, signal.source].filter(Boolean).join(" · ")}
            </ThemedText>
          </ThemedView>
        )}
        <ThemedView style={styles.block}>
          <ThemedText type="subtitle">Details</ThemedText>
          <ThemedText style={styles.muted} selectable>
            Created: {signal.created_at}
          </ThemedText>
          {signal.event_id != null && (
            <ThemedText style={styles.muted} selectable>
              Event: {signal.event_id}
            </ThemedText>
          )}
        </ThemedView>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollInner: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  backLink: { marginTop: 12, color: "#0a7ea4" },
  block: { paddingHorizontal: 20, paddingTop: 20, gap: 6 },
  muted: { fontSize: 13, opacity: 0.7 },
});
