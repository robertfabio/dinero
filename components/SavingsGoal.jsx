import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { COLORS, GlobalStyles } from "../styles/globalStyles";

export default function SavingsGoal({ balance, goal = 5000 }) {
  const percentage = Math.min((balance / goal) * 100, 100);
  const remaining = Math.max(goal - balance, 0);

  return (
    <View style={[GlobalStyles.duoContainer, { padding: 20 }]}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
      >
        <MaterialIcons name="flag" size={24} color={COLORS.primary} />
        <Text
          style={{
            marginLeft: 8,
            fontSize: 15,
            fontWeight: "800",
            color: COLORS.text,
            textTransform: "uppercase",
          }}
        >
          Meta de Economia
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Text
          style={{ fontSize: 13, color: COLORS.textLight, fontWeight: "600" }}
        >
          Atual:{" "}
          {balance.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Text>
        <Text
          style={{ fontSize: 13, color: COLORS.textLight, fontWeight: "600" }}
        >
          Meta:{" "}
          {goal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </Text>
      </View>

      <View
        style={{
          height: 12,
          backgroundColor: "#f0f0f0",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${percentage}%`,
            backgroundColor:
              percentage >= 100 ? COLORS.secondary : COLORS.primary,
            borderRadius: 6,
          }}
        />
      </View>

      {percentage >= 100 ? (
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}
        >
          <MaterialIcons
            name="check-circle"
            size={16}
            color={COLORS.secondary}
          />
          <Text
            style={{
              fontSize: 13,
              color: COLORS.secondary,
              fontWeight: "700",
              marginLeft: 4,
            }}
          >
            Meta alcançada! Parabéns!
          </Text>
        </View>
      ) : (
        <Text
          style={{
            fontSize: 13,
            color: COLORS.text,
            fontWeight: "600",
            marginTop: 8,
          }}
        >
          Faltam{" "}
          {remaining.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}{" "}
          ({percentage.toFixed(1)}%)
        </Text>
      )}
    </View>
  );
}
