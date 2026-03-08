import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { Pressable, RefreshControl, StyleSheet } from "react-native";

import { LoadingView } from "@/components/loading-view";
import { SignalRow } from "@/components/signal-row";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { fetchSignals } from "@/lib/api";
import { getErrorMessage } from "@/lib/error";
import type { MonitorSignal } from "@/types/signals";

export default function SignalsScreen() {
  const {
    data: signals = [],
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["signals"],
    queryFn: fetchSignals,
  });

  const loading = isLoading && signals.length === 0;
  const errorMessage = getErrorMessage(error);

  const renderItem = useCallback(
    ({ item, index }: { item: MonitorSignal; index: number }) => (
      <SignalRow signal={item} index={index} />
    ),
    [],
  );

  const keyExtractor = useCallback((item: MonitorSignal) => item.id, []);

  if (loading) {
    return <LoadingView message="Loading signals…" />;
  }

  if (errorMessage && signals.length === 0) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText type="defaultSemiBold" style={styles.errorText}>
          {errorMessage}
        </ThemedText>
        <Pressable onPress={() => refetch()} style={styles.retry}>
          <ThemedText type="link">Tap to retry</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  if (signals.length === 0) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText type="subtitle">No signals yet</ThemedText>
        <ThemedText style={styles.emptySub}>Pull to refresh.</ThemedText>
        <Pressable onPress={() => refetch()} style={styles.retry}>
          <ThemedText type="link">Refresh</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <FlashList
      data={signals}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
      }
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    padding: 24,
  },
  errorText: { textAlign: "center" },
  retry: { marginTop: 8 },
  emptySub: { marginTop: 4, opacity: 0.8, textAlign: "center" },
  listContent: { paddingTop: 8, paddingBottom: 100, gap: 0 },
});
