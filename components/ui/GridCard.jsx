import { Pressable, StyleSheet } from "react-native";
import { COLORS, METRICS } from "../../styles/globalStyles";

export const GridCard = ({
  onPress,
  disabled = false,
  variant = "primary",
  children,
  style,
  isWide = false,
}) => {
  const getCardStyle = () => {
    switch (variant) {
      case "secondary":
        return styles.secondaryCard;
      case "neutral":
        return styles.neutralCard;
      default:
        return styles.primaryCard;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.pressable,
        getCardStyle(),
        isWide && styles.wideCard,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    minHeight: 140,
    borderRadius: METRICS.radius,
    backgroundColor: COLORS.background,
    borderWidth: METRICS.borderWidth,
    borderBottomWidth: METRICS.borderBottomHeight,
    borderColor: COLORS.neutral,
    borderBottomColor: COLORS.neutralDark,
    padding: METRICS.padding,
    justifyContent: "space-between",
    marginVertical: 8,
  },
  wideCard: {
    minHeight: 120,
    flexDirection: "row",
    alignItems: "center",
  },
  primaryCard: {
    backgroundColor: COLORS.primary,
    borderBottomColor: COLORS.primaryDark,
  },
  secondaryCard: {
    backgroundColor: COLORS.secondary,
    borderBottomColor: COLORS.secondaryDark,
  },
  neutralCard: {
    backgroundColor: COLORS.background,
    borderBottomColor: COLORS.neutralDark,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ translateY: 2 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
