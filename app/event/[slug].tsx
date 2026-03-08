import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { fetchEvents } from "@/lib/api";
import { getErrorMessage } from "@/lib/error";
import { isUuid, slugify } from "@/lib/slug";
import type { MonitorEvent } from "@/types/events";

function findEvent(
  events: MonitorEvent[],
  slugOrId: string,
): MonitorEvent | null {
  if (!slugOrId) return null;
  if (isUuid(slugOrId)) {
    return events.find((e) => e.id === slugOrId) ?? null;
  }
  const slug = slugOrId.toLowerCase();
  return events.find((e) => slugify(e.title) === slug) ?? null;
}

export default function EventDetailScreen() {
  const { slug: slugOrId } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const labelColor = useThemeColor({}, "label");
  const cardBg = useThemeColor({}, "card");
  const cardBorder = useThemeColor({}, "separator");

  const {
    data: events = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  const event = useMemo(
    () => (slugOrId ? findEvent(events, slugOrId) : null),
    [events, slugOrId],
  );
  const errorMessage = getErrorMessage(error);
  const notFound = !isLoading && events.length > 0 && slugOrId && !event;

  if (isLoading && !event) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if ((errorMessage || notFound) && !event) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText type="defaultSemiBold">
          {notFound ? "Event not found" : errorMessage}
        </ThemedText>
        <ThemedText style={styles.backLink} onPress={() => router.back()}>
          Go back
        </ThemedText>
      </ThemedView>
    );
  }

  if (!event) return null;

  const severityLabel =
    event.severity === 3 ? "High" : event.severity === 2 ? "Medium" : "Low";

  return (
    <Animated.View entering={FadeIn.duration(350)} style={styles.scroll}>
      <ScrollView
        style={styles.scrollInner}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
      >
        <ThemedView
          style={[
            styles.card,
            { backgroundColor: cardBg, borderColor: cardBorder },
          ]}
        >
          <ThemedText type="title" selectable>
            {event.title}
          </ThemedText>
          <View style={styles.meta}>
            <ThemedText style={[styles.category, { color: labelColor }]}>
              {event.category}
            </ThemedText>
            <ThemedText style={[styles.severity, { color: labelColor }]}>
              {severityLabel} severity
            </ThemedText>
          </View>
        </ThemedView>
        <ThemedView
          style={[
            styles.card,
            { backgroundColor: cardBg, borderColor: cardBorder },
          ]}
        >
          <ThemedText type="subtitle">Location</ThemedText>
          <ThemedText selectable>{event.location_name}</ThemedText>
          <ThemedText style={[styles.region, { color: labelColor }]} selectable>
            {event.region} · {event.country}
          </ThemedText>
        </ThemedView>
        <ThemedView
          style={[
            styles.card,
            { backgroundColor: cardBg, borderColor: cardBorder },
          ]}
        >
          <ThemedText type="subtitle">Summary</ThemedText>
          <ThemedText selectable>{event.summary}</ThemedText>
        </ThemedView>
        <ThemedView
          style={[
            styles.card,
            { backgroundColor: cardBg, borderColor: cardBorder },
          ]}
        >
          <ThemedText type="subtitle">Details</ThemedText>
          <ThemedText selectable>
            Confidence: {event.confidence}% · Signals: {event.signal_count}
          </ThemedText>
          <ThemedText style={[styles.muted, { color: labelColor }]} selectable>
            Sources: {event.source_types}
          </ThemedText>
          <ThemedText style={[styles.muted, { color: labelColor }]} selectable>
            Updated: {event.updated_at}
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollInner: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  backLink: { marginTop: 12, color: "#0a7ea4" },
  card: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  meta: { flexDirection: "row", gap: 12, marginTop: 6 },
  category: { textTransform: "capitalize", fontSize: 14 },
  severity: { fontSize: 14 },
  region: { fontSize: 14 },
  muted: { fontSize: 13 },
});
