import { LegendList } from "@legendapp/list";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { Pressable, RefreshControl, StyleSheet } from "react-native";

import { EventRow } from "@/components/event-row";
import { LoadingView } from "@/components/loading-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { fetchEvents } from "@/lib/api";
import { getErrorMessage } from "@/lib/error";

export default function EventsScreen() {
  const {
    data: events = [],
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  const loading = isLoading && events.length === 0;
  const errorMessage = getErrorMessage(error);

  const renderItem = useCallback(
    ({ item, index }: { item: (typeof events)[number]; index: number }) => (
      <EventRow event={item} index={index} />
    ),
    [],
  );

  if (loading) {
    return <LoadingView message="Loading events…" />;
  }

  if (errorMessage && events.length === 0) {
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

  return (
    <LegendList
      data={events}
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
  listContent: {
    paddingTop: 8,
    paddingBottom: 100,
    gap: 0,
  },
});
