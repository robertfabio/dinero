import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { COLORS, GlobalStyles } from "../styles/globalStyles";
import AnimatedNumber from "./AnimatedNumber";

export default function StatCard({
  label,
  value,
  icon,
  iconColor = COLORS.primary,
  animated = false,
  numericValue,
}) {
  return (
    <View
      style={[
        GlobalStyles.duoContainer,
        {
          flex: 1,
          padding: 16,
          alignItems: "center",
        },
      ]}
    >
      {icon && (
        <MaterialIcons
          name={icon}
          size={28}
          color={iconColor}
          style={{ marginBottom: 8 }}
        />
      )}
      <Text
        style={{
          fontSize: 11,
          fontWeight: "800",
          color: COLORS.textLight,
          textTransform: "uppercase",
          marginBottom: 4,
          textAlign: "center",
        }}
      >
        {label}
      </Text>
      {animated && numericValue !== undefined ? (
        <AnimatedNumber
          value={numericValue}
          style={{
            fontSize: 18,
            fontWeight: "900",
            color: COLORS.text,
            textAlign: "center",
          }}
          prefix="R$ "
          decimals={2}
          duration={1000}
        />
      ) : (
        <Text
          style={{
            fontSize: 18,
            fontWeight: "900",
            color: COLORS.text,
            textAlign: "center",
          }}
        >
          {value}
        </Text>
      )}
    </View>
  );
}
