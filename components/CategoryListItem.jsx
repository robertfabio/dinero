import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { categories } from "../constants/categories";
import { COLORS, GlobalStyles } from "../styles/globalStyles";

export default function CategoryListItem({ category, value, total }) {
  const percentage = ((value / total) * 100).toFixed(1);
  const categoryInfo = categories[category];

  return (
    <View
      style={[
        GlobalStyles.duoContainer,
        {
          paddingVertical: 16,
          paddingHorizontal: 16,
          marginBottom: 8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: categoryInfo?.background || "#f0f0f0",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <MaterialIcons
            name={categoryInfo?.icon || "label"}
            size={20}
            color={COLORS.text}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: "800", color: COLORS.text }}>
            {categoryInfo?.displayName || category}
          </Text>
          <View
            style={{
              height: 6,
              backgroundColor: "#f0f0f0",
              borderRadius: 3,
              marginTop: 6,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: "100%",
                width: `${percentage}%`,
                backgroundColor: COLORS.primary,
                borderRadius: 3,
              }}
            />
          </View>
        </View>
      </View>
      <View style={{ marginLeft: 12, alignItems: "flex-end" }}>
        <Text style={{ fontSize: 16, fontWeight: "900", color: COLORS.text }}>
          {value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Text>
        <Text
          style={{ fontSize: 12, fontWeight: "700", color: COLORS.textLight }}
        >
          {percentage}%
        </Text>
      </View>
    </View>
  );
}
