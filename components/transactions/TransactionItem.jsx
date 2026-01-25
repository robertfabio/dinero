import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { categories } from "../../constants/categories";
import { COLORS, GlobalStyles } from "../../styles/globalStyles";

export default function TransactionItem({
  category,
  date,
  description,
  value,
  onDelete,
}) {
  const isIncome = category === "income";
  const valueColor = isIncome ? COLORS.secondary : COLORS.danger;
  const categoryInfo = categories[category] || categories.other;

  return (
    <View style={[GlobalStyles.duoContainer, styles.itemContainer]}>
      <View style={styles.headerRow}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: categoryInfo.background },
          ]}
        >
          <MaterialIcons
            name={categoryInfo.icon}
            size={24}
            color={COLORS.text}
          />
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{date}</Text>
        </View>
      </View>

      <View style={styles.contentRow}>
        <Text style={styles.descriptionText} numberOfLines={1}>
          {description}
        </Text>
        <Text style={[styles.valueText, { color: valueColor }]}>
          {isIncome ? "+ " : "- "}
          {value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Text>
        {onDelete && (
          <Pressable onPress={onDelete} style={styles.deleteButton} hitSlop={8}>
            <MaterialIcons name="delete" size={22} color={COLORS.danger} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: 12,
    paddingVertical: 16,
    height: "auto",
    minHeight: 80,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  iconContainer: {
    width: 44,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.neutralDark,
  },
  dateContainer: {
    backgroundColor: COLORS.screenBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textLight,
  },
  contentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  valueText: {
    fontSize: 18,
    fontWeight: "900",
  },
  deleteButton: {
    marginLeft: 8,
    padding: 4,
  },
});
