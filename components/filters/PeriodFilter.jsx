import { Pressable, ScrollView, Text } from "react-native";
import { COLORS, METRICS } from "../styles/globalStyles";

export default function PeriodFilter({ selected, onSelect }) {
  const periods = [
    { id: "all", label: "Todos" },
    { id: "month", label: "Este Mês" },
    { id: "30days", label: "30 Dias" },
    { id: "90days", label: "90 Dias" },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginVertical: 16 }}
      contentContainerStyle={{ gap: 8 }}
    >
      {periods.map((period) => (
        <Pressable
          key={period.id}
          onPress={() => onSelect(period.id)}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: METRICS.radius,
            borderWidth: METRICS.borderWidth,
            borderBottomWidth:
              selected === period.id
                ? METRICS.borderBottomHeight
                : METRICS.borderWidth,
            borderColor:
              selected === period.id ? COLORS.primary : COLORS.neutral,
            backgroundColor:
              selected === period.id ? COLORS.primary : COLORS.background,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "800",
              color: selected === period.id ? COLORS.white : COLORS.text,
              textTransform: "uppercase",
            }}
          >
            {period.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
