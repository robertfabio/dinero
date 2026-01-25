import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { COLORS, GlobalStyles } from "../styles/globalStyles";
import TrendIndicator from "./TrendIndicator";

export default function SummaryCard({
  icon,
  label,
  value,
  type = "neutral",
  previousValue,
}) {
  const colors = {
    income: COLORS.secondary,
    expense: COLORS.danger,
    balance: value >= 0 ? COLORS.primary : COLORS.danger,
    neutral: COLORS.text,
  };

  const color = colors[type];

  return (
    <View
      style={[
        GlobalStyles.duoContainer,
        {
          padding: 20,
          borderLeftWidth: 6,
          borderLeftColor: color,
        },
      ]}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
      >
        <MaterialIcons name={icon} size={24} color={color} />
        <Text
          style={{
            marginLeft: 8,
            fontSize: 13,
            fontWeight: "800",
            color: COLORS.textLight,
            textTransform: "uppercase",
          }}
        >
          {label}
        </Text>
      </View>
      <Text
        style={{
          fontSize: type === "balance" ? 32 : 28,
          fontWeight: "900",
          color,
        }}
      >
        {value.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </Text>
      {previousValue !== undefined && previousValue !== null && (
        <TrendIndicator
          current={value}
          previous={previousValue}
          type={type === "income" ? "income" : "expense"}
        />
      )}
    </View>
  );
}
