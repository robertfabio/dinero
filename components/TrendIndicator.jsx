import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { COLORS } from "../styles/globalStyles";

export default function TrendIndicator({
  current,
  previous,
  type = "expense",
}) {
  if (!previous || previous === 0) return null;

  const change = ((current - previous) / previous) * 100;
  const isPositive = change > 0;
  const isGood = type === "income" ? isPositive : !isPositive;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
      <MaterialIcons
        name={isPositive ? "arrow-upward" : "arrow-downward"}
        size={14}
        color={isGood ? COLORS.secondary : COLORS.danger}
      />
      <Text
        style={{
          fontSize: 12,
          fontWeight: "700",
          color: isGood ? COLORS.secondary : COLORS.danger,
          marginLeft: 4,
        }}
      >
        {Math.abs(change).toFixed(1)}% vs período anterior
      </Text>
    </View>
  );
}
