import { LegendList } from "@legendapp/list";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { Pressable, RefreshControl, StyleSheet } from "react-native";

import { LoadingView } from "@/components/loading-view";
import { SignalRow } from "@/components/signal-row";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { fetchSignals } from "@/lib/api";
import { getErrorMessage } from "@/lib/error";

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
    ({ item, index }: { item: (typeof signals)[number]; index: number }) => (
      <SignalRow signal={item} index={index} />
    ),
    [],
  );

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
    <LegendList
      data={signals}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
      }
      recycleItems
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
