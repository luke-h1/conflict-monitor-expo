import {
  Icon,
  Label,
  NativeTabs,
} from "expo-router/unstable-native-tabs";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme ?? "light"].tint;

  return (
    <NativeTabs iconColor={tint} blurEffect="regular">
      <NativeTabs.Trigger name="index" hidden />
      <NativeTabs.Trigger name="events">
        <Icon sf={{ default: "map", selected: "map.fill" }} />
        <Label>Events</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search">
        <Icon sf={{ default: "magnifyingglass", selected: "magnifyingglass" }} />
        <Label>Search</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="signals">
        <Icon sf={{ default: "doc.text", selected: "doc.text.fill" }} />
        <Label>Signals</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
