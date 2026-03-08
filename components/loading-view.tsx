import { ActivityIndicator, StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";

export function LoadingView({ message }: { message?: string }) {
  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.center}>
      <ActivityIndicator size="large" />
      {message != null && (
        <ThemedText style={styles.message}>{message}</ThemedText>
      )}
    </Animated.View>
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
  message: { marginTop: 8 },
});
