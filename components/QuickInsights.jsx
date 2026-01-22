import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { COLORS, GlobalStyles } from "../styles/globalStyles";

export default function QuickInsights({ summary, categoryData }) {
  const insights = [];

  if (summary.balance > 0) {
    insights.push({
      icon: "thumb-up",
      color: COLORS.secondary,
      text: `Saldo positivo de ${summary.balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`,
    });
  }

  const topCategory = Object.entries(categoryData).sort(
    ([, a], [, b]) => b - a,
  )[0];

  if (topCategory) {
    const [cat, value] = topCategory;
    const percentage = ((value / summary.expenses) * 100).toFixed(0);
    insights.push({
      icon: "info",
      color: COLORS.primary,
      text: `${percentage}% das despesas em ${cat}`,
    });
  }

  if (summary.expenses > summary.income) {
    const deficit = summary.expenses - summary.income;
    insights.push({
      icon: "warning",
      color: COLORS.danger,
      text: `Gastos excedem receitas em ${deficit.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`,
    });
  }

  if (insights.length === 0) return null;

  return (
    <View style={[GlobalStyles.duoContainer, { padding: 16 }]}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
      >
        <MaterialIcons name="lightbulb" size={20} color={COLORS.primary} />
        <Text
          style={{
            marginLeft: 8,
            fontSize: 13,
            fontWeight: "800",
            color: COLORS.text,
            textTransform: "uppercase",
          }}
        >
          Insights
        </Text>
      </View>
      {insights.map((insight, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: index < insights.length - 1 ? 8 : 0,
          }}
        >
          <MaterialIcons name={insight.icon} size={16} color={insight.color} />
          <Text
            style={{
              marginLeft: 8,
              fontSize: 13,
              color: COLORS.text,
              fontWeight: "600",
              flex: 1,
            }}
          >
            {insight.text}
          </Text>
        </View>
      ))}
    </View>
  );
}
