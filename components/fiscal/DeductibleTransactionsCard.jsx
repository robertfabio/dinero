import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../styles/globalStyles";
import { GridCard } from "../ui/GridCard";

export const DeductibleTransactionsCard = ({ onNavigate }) => {
  const [showPreview, setShowPreview] = useState(false);

  const mockDeductibles = [
    { id: 1, category: "Saúde", amount: 1250.5, count: 8, icon: "⚕️" },
    { id: 2, category: "Educação", amount: 3450, count: 12, icon: "📚" },
    { id: 3, category: "Trabalho", amount: 680.25, count: 5, icon: "💼" },
  ];

  const totalDeductible = mockDeductibles.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  const estimatedReturn = (totalDeductible * 0.15).toFixed(2);

  return (
    <GridCard
      variant="secondary"
      isWide={true}
      onPress={() => onNavigate?.("TaxModule")}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>📋 Dedutíveis IRPF</Text>
          <Text style={styles.amount}>
            R${" "}
            {totalDeductible.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            Retorno est.: R$ {estimatedReturn}
          </Text>
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        {mockDeductibles.map((item) => (
          <View key={item.id} style={styles.categoryItem}>
            <Text style={styles.categoryIcon}>{item.icon}</Text>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{item.category}</Text>
              <Text style={styles.categoryCount}>{item.count} transações</Text>
            </View>
            <Text style={styles.categoryAmount}>
              R$ {item.amount.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      <Pressable
        onPress={() => setShowPreview(!showPreview)}
        style={styles.previewButton}
      >
        <Text style={styles.previewButtonText}>
          {showPreview ? "▼ Ocultar Preview" : "▶ Preview PDF →"}
        </Text>
      </Pressable>
    </GridCard>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
  },
  badge: {
    backgroundColor: COLORS.background,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.text,
  },
  categoriesContainer: {
    gap: 6,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.white,
  },
  categoryCount: {
    fontSize: 10,
    color: COLORS.white,
    opacity: 0.8,
  },
  categoryAmount: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.white,
  },
  previewButton: {
    marginTop: 8,
    paddingVertical: 6,
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  previewButtonText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.text,
  },
});
