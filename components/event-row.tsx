import { Link } from "expo-router";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { slugify } from "@/lib/slug";
import type { MonitorEvent } from "@/types/events";

const SPRING_CONFIG = { damping: 18, stiffness: 400 };

function SeverityPill({ severity }: { severity: number }) {
  const scheme = useColorScheme() ?? "light";
  const c = Colors[scheme];
  const label = severity === 3 ? "High" : severity === 2 ? "Medium" : "Low";
  const bg =
    severity === 3
      ? `${c.severityHigh}18`
      : severity === 2
        ? `${c.severityMedium}18`
        : `${c.severityLow}18`;
  const color =
    severity === 3
      ? c.severityHigh
      : severity === 2
        ? c.severityMedium
        : c.severityLow;

  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.pillText, { color }]}>{label}</Text>
    </View>
  );
}

export function EventRow({
  event,
  index = 0,
}: {
  event: MonitorEvent;
  index?: number;
}) {
  const labelColor = useThemeColor({}, "label");
  const cardBg = useThemeColor({}, "card");
  const cardBorder = useThemeColor({}, "separator");
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.duration(400)
        .delay(index * 45)
        .springify()}
    >
      <Link
        href={{
          pathname: "/event/[slug]",
          params: { slug: slugify(event.title) || event.id },
        }}
        asChild
      >
        <Pressable
          onPressIn={() => {
            scale.value = withSpring(0.98, SPRING_CONFIG);
          }}
          onPressOut={() => {
            scale.value = withSpring(1, SPRING_CONFIG);
          }}
        >
          <Animated.View
            style={[
              styles.row,
              { backgroundColor: cardBg, borderColor: cardBorder },
              animatedStyle,
            ]}
          >
            <View style={styles.rowContent}>
              <ThemedText
                type="defaultSemiBold"
                numberOfLines={2}
                selectable
                style={styles.title}
              >
                {event.title}
              </ThemedText>
              <ThemedText
                style={[styles.location, { color: labelColor }]}
                numberOfLines={1}
                selectable
              >
                {event.location_name}
              </ThemedText>
              <View style={styles.meta}>
                <ThemedText style={[styles.category, { color: labelColor }]}>
                  {event.category}
                </ThemedText>
                <SeverityPill severity={event.severity} />
              </View>
            </View>
          </Animated.View>
        </Pressable>
      </Link>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 28,
    marginBottom: 16,
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 12,
    minHeight: 96,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  rowContent: {
    flex: 1,
    gap: 6,
    minWidth: 0,
  },
  title: {
    fontSize: 17,
    lineHeight: 23,
    letterSpacing: -0.3,
  },
  location: {
    fontSize: 14,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  category: {
    fontSize: 13,
    textTransform: "capitalize",
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  pillText: {
    fontSize: 11,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
});
