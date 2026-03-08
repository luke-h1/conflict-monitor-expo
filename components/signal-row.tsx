import { Link } from "expo-router";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import type { MonitorSignal } from "@/types/signals";

const SPRING_CONFIG = { damping: 18, stiffness: 400 };

export function SignalRow({
  signal,
  index = 0,
}: {
  signal: MonitorSignal;
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
        href={{ pathname: "/signal/[id]", params: { id: signal.id } }}
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
                {signal.content}
              </ThemedText>
              {signal.source_type != null && (
                <ThemedText style={[styles.meta, { color: labelColor }]}>
                  {signal.source_type}
                </ThemedText>
              )}
              <ThemedText
                style={[styles.muted, { color: labelColor }]}
                selectable
              >
                {signal.created_at}
              </ThemedText>
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
    minHeight: 88,
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
  meta: { fontSize: 13, textTransform: "capitalize" },
  muted: { fontSize: 13 },
});
