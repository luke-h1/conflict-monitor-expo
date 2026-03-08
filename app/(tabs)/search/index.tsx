import { FlashList, type FlashListRef } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Platform, RefreshControl, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EventRow } from "@/components/event-row";
import { ListSearchInput } from "@/components/list-search-input";
import { SignalRow } from "@/components/signal-row";
import { ThemedText } from "@/components/themed-text";
import { fetchEvents, fetchSignals } from "@/lib/api";
import { filterEvents, filterSignals } from "@/lib/search";
import type { MonitorEvent } from "@/types/events";
import type { MonitorSignal } from "@/types/signals";

const TAB_BAR_CLEARANCE = 88;

type SearchListItem =
  | { type: "event"; id: string; data: MonitorEvent }
  | { type: "signal"; id: string; data: MonitorSignal }
  | { type: "empty"; id: string; section: "events" | "signals"; searchQuery: string };

function EmptyRow({ section, searchQuery }: { section: "events" | "signals"; searchQuery: string }) {
  const msg =
    section === "events"
      ? searchQuery
        ? `No events match "${searchQuery}"`
        : "No events"
      : searchQuery
        ? `No signals match "${searchQuery}"`
        : "No signals";
  return <ThemedText style={styles.empty}>{msg}</ThemedText>;
}

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string }>();
  const insets = useSafeAreaInsets();
  const searchQuery = params.q ?? "";
  const listRef = useRef<FlashListRef<SearchListItem>>(null);
  const listBottomPadding = TAB_BAR_CLEARANCE + insets.bottom;

  useEffect(() => {
    if (searchQuery === "") {
      listRef.current?.scrollToTop({ animated: true });
    }
  }, [searchQuery]);

  const { data: events = [], isLoading: eventsLoading, refetch: refetchEvents } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });
  const { data: signals = [], isLoading: signalsLoading, refetch: refetchSignals } = useQuery({
    queryKey: ["signals"],
    queryFn: fetchSignals,
  });

  const filteredEvents = useMemo(
    () => filterEvents(events, searchQuery),
    [events, searchQuery]
  );
  const filteredSignals = useMemo(
    () => filterSignals(signals, searchQuery),
    [signals, searchQuery]
  );

  const listData = useMemo((): SearchListItem[] => {
    const items: SearchListItem[] = [];
    if (filteredEvents.length === 0) {
      items.push({ type: "empty", id: "empty-events", section: "events", searchQuery });
    } else {
      filteredEvents.forEach((e) => items.push({ type: "event", id: e.id, data: e }));
    }
    if (filteredSignals.length === 0) {
      items.push({ type: "empty", id: "empty-signals", section: "signals", searchQuery });
    } else {
      filteredSignals.forEach((s) => items.push({ type: "signal", id: s.id, data: s }));
    }
    return items;
  }, [filteredEvents, filteredSignals, searchQuery]);

  const refetch = useCallback(() => {
    refetchEvents();
    refetchSignals();
  }, [refetchEvents, refetchSignals]);

  const loading = eventsLoading || signalsLoading;
  const isIOS = Platform.OS === "ios";

  const renderItem = useCallback(({ item }: { item: SearchListItem }) => {
    switch (item.type) {
      case "event":
        return <EventRow event={item.data} index={0} />;
      case "signal":
        return <SignalRow signal={item.data} index={0} />;
      case "empty":
        return <EmptyRow section={item.section} searchQuery={item.searchQuery} />;
      default:
        return null;
    }
  }, []);

  const getItemType = useCallback((item: SearchListItem) => item.type, []);

  const keyExtractor = useCallback((item: SearchListItem) => item.id, []);

  const ListHeader = useCallback(
    () =>
      !isIOS ? (
        <ListSearchInput
          value={searchQuery}
          onChangeText={(text) => router.setParams({ q: text })}
          placeholder="Search events and signals…"
        />
      ) : null,
    [isIOS, searchQuery, router]
  );

  return (
    <>
      {isIOS && (
        <Stack.Screen
          options={{
            headerSearchBarOptions: {
              placeholder: "Search events and signals…",
              onChangeText: (e) =>
                router.setParams({ q: e.nativeEvent.text ?? "" }),
              hideWhenScrolling: false,
            },
          }}
        />
      )}
      <FlashList<SearchListItem>
        ref={listRef}
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        ListHeaderComponent={ListHeader}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: listBottomPadding }}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  empty: {
    paddingHorizontal: 28,
    paddingVertical: 16,
    opacity: 0.8,
  },
});
