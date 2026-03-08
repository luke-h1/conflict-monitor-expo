import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef } from "react";
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EventRow } from "@/components/event-row";
import { ListSearchInput } from "@/components/list-search-input";
import { SignalRow } from "@/components/signal-row";
import { ThemedText } from "@/components/themed-text";
import { fetchEvents, fetchSignals } from "@/lib/api";
import { filterEvents, filterSignals } from "@/lib/search";

const TAB_BAR_CLEARANCE = 88;

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string }>();
  const insets = useSafeAreaInsets();
  const searchQuery = params.q ?? "";
  const scrollRef = useRef<ScrollView>(null);
  const listBottomPadding = TAB_BAR_CLEARANCE + insets.bottom;

  useEffect(() => {
    if (searchQuery === "") {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
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

  const refetch = () => {
    refetchEvents();
    refetchSignals();
  };
  const loading = eventsLoading || signalsLoading;
  const isIOS = Platform.OS === "ios";

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
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.scrollContent, { paddingBottom: listBottomPadding }]}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      >
      {!isIOS && (
        <ListSearchInput
          value={searchQuery}
          onChangeText={(text) => router.setParams({ q: text })}
          placeholder="Search events and signals…"
        />
      )}
      {filteredEvents.length === 0 ? (
        <ThemedText style={styles.empty}>
          {searchQuery ? `No events match "${searchQuery}"` : "No events"}
        </ThemedText>
      ) : (
        <View style={styles.section}>
          {filteredEvents.map((event, index) => (
            <EventRow key={event.id} event={event} index={index} />
          ))}
        </View>
      )}
      {filteredSignals.length === 0 ? (
        <ThemedText style={styles.empty}>
          {searchQuery ? `No signals match "${searchQuery}"` : "No signals"}
        </ThemedText>
      ) : (
        <View style={styles.section}>
          {filteredSignals.map((signal, index) => (
            <SignalRow key={signal.id} signal={signal} index={index} />
          ))}
        </View>
      )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: {},
  section: { marginTop: 4 },
  empty: {
    paddingHorizontal: 28,
    paddingVertical: 16,
    opacity: 0.8,
  },
});
