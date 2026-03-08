import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import { LoadingView } from "@/components/loading-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { fetchEvents } from "@/lib/api";
import { getErrorMessage } from "@/lib/error";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { slugify } from "@/lib/slug";
import type { MonitorEvent } from "@/types/events";

function markerPinColor(severity: number): string {
  switch (severity) {
    case 3:
      return "red";
    case 2:
      return "orange";
    default:
      return "teal";
  }
}

const DEFAULT_REGION = {
  latitude: 20,
  longitude: 0,
  latitudeDelta: 80,
  longitudeDelta: 160,
};

export default function MapScreen() {
  const mapRef = useRef<React.ComponentRef<typeof MapView>>(null);
  const router = useRouter();
  const hasFittedRef = useRef(false);

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

  const eventsWithLocation = useMemo(
    () =>
      events.filter(
        (e) => typeof e.lat === "number" && typeof e.lng === "number",
      ),
    [events],
  );

  const coordinates = useMemo(
    () =>
      events
        .filter(
          (e) => typeof e.lat === "number" && typeof e.lng === "number",
        )
        .map((e) => ({ latitude: e.lat, longitude: e.lng })),
    [events],
  );

  useEffect(() => {
    if (
      coordinates.length > 0 &&
      mapRef.current &&
      !hasFittedRef.current &&
      Platform.OS !== "web"
    ) {
      hasFittedRef.current = true;
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 80, right: 40, bottom: 80, left: 40 },
        animated: true,
      });
    }
  }, [coordinates]);

  const onMarkerPress = useCallback(
    (event: MonitorEvent) => {
      router.push({
        pathname: "/event/[slug]",
        params: { slug: slugify(event.title) || event.id },
      });
    },
    [router],
  );

  const errorMessage = getErrorMessage(error);
  const loading = isLoading && events.length === 0;
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];

  if (Platform.OS === "web") {
    return (
      <ThemedView style={styles.center}>
        <ThemedText type="subtitle">Map view</ThemedText>
        <ThemedText style={styles.webMessage}>
          The interactive map is available in the iOS and Android app. On web
          you can browse events and signals in the list views.
        </ThemedText>
        <Pressable onPress={() => refetch()} style={styles.retry}>
          <ThemedText type="link">Refresh events</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  if (loading) {
    return <LoadingView message="Loading map…" />;
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

  const mapType = Platform.select<"mutedStandard" | "standard">({
    ios: "mutedStandard",
    android: "standard",
    default: "standard",
  });

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        mapType={mapType}
        showsUserLocation={false}
        showsCompass={true}
        showsScale={Platform.OS === "ios"}
        rotateEnabled={true}
      >
        {eventsWithLocation.map((event) => (
          <Marker
            key={event.id}
            coordinate={{ latitude: event.lat, longitude: event.lng }}
            title={event.title}
            description={event.location_name}
            pinColor={markerPinColor(event.severity)}
            onPress={() => onMarkerPress(event)}
          />
        ))}
      </MapView>
      {isRefetching && (
        <View
          style={[
            styles.refreshOverlay,
            {
              backgroundColor: themeColors.card,
              borderColor: themeColors.separator,
            },
          ]}
        >
          <ActivityIndicator size="small" color={themeColors.tint} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    padding: 24,
  },
  webMessage: {
    textAlign: "center",
    marginTop: 8,
    opacity: 0.9,
  },
  errorText: { textAlign: "center" },
  retry: { marginTop: 8 },
  refreshOverlay: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 10,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: { elevation: 3 },
    }),
  },
});
