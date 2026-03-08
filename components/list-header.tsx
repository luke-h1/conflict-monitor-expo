import { GlassView, isGlassEffectAPIAvailable } from "expo-glass-effect";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";

export function ListHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const separatorColor = useThemeColor({}, "icon");
  const colorScheme = useColorScheme() ?? "light";
  const useGlass = isGlassEffectAPIAvailable();

  const rule = <View style={[styles.rule, { backgroundColor: `${separatorColor}30` }]} />;
  const content = (
    <>
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.title}>{title}</ThemedText>
        {subtitle != null && <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>}
      </View>
      {rule}
    </>
  );

  return (
    <View style={styles.wrapper}>
      {useGlass && (
        <GlassView
          style={StyleSheet.absoluteFill}
          glassEffectStyle="regular"
          colorScheme={colorScheme === "dark" ? "dark" : "light"}
        />
      )}
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 20,
    paddingBottom: 8,
    overflow: "hidden",
    borderCurve: "continuous",
    borderRadius: 12,
  },
  header: {
    paddingHorizontal: 20,
    gap: 4,
  },
  title: {
    fontSize: 28,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.65,
  },
  rule: {
    height: 1,
    marginHorizontal: 20,
    marginTop: 16,
  },
});
