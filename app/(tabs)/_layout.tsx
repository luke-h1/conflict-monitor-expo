import {
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from "expo-router/unstable-native-tabs";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme ?? "light"].tint;

  return (
    <NativeTabs iconColor={tint} blurEffect="regular">
      <NativeTabs.Trigger name="index" hidden />
      <NativeTabs.Trigger name="map">
        <Icon
          sf={{ default: "map", selected: "map.fill" }}
          androidSrc={<VectorIcon family={MaterialIcons} name="map" />}
        />
        <Label>Map</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="events">
        <Icon
          sf={{ default: "list.bullet", selected: "list.bullet" }}
          androidSrc={<VectorIcon family={MaterialIcons} name="list" />}
        />
        <Label>Events</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search">
        <Icon
          sf={{ default: "magnifyingglass", selected: "magnifyingglass" }}
          androidSrc={<VectorIcon family={MaterialIcons} name="search" />}
        />
        <Label>Search</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="signals">
        <Icon
          sf={{ default: "doc.text", selected: "doc.text.fill" }}
          androidSrc={<VectorIcon family={MaterialIcons} name="description" />}
        />
        <Label>Signals</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
