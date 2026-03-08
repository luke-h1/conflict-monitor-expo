import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";

export function ListSearchInput({
  value,
  onChangeText,
  placeholder = "Search…",
  autoCapitalize = "none",
  autoCorrect = false,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const iconColor = useThemeColor({}, "icon");
  const bgColor = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");

  return (
    <View style={[styles.wrapper, { backgroundColor: bgColor }]}>
      <View style={styles.icon}>
        <IconSymbol
          name="magnifyingglass"
          size={18}
          color={focused ? iconColor : `${iconColor}99`}
        />
      </View>
      <TextInput
        style={[styles.input, { color: textColor }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={iconColor}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText("")}
          hitSlop={8}
          style={styles.clear}
        >
          <IconSymbol name="xmark.circle.fill" size={18} color={iconColor} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    minHeight: 44,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 17,
    paddingVertical: 4,
  },
  clear: {
    padding: 4,
  },
});
