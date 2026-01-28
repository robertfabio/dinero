import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../styles/globalStyles";
import { GridCard } from "../ui/GridCard";

export const FipeCard = ({ carData = null, onNavigate }) => {
  const [fipeData, setFipeData] = useState(carData);
  const [loading, setLoading] = useState(false);

  const mockFipeData = {
    brand: "Hyundai",
    model: "HB20",
    year: 2022,
    value: 65800,
    lastValue: 62000,
    change: 3800,
  };

  useEffect(() => {
    if (!carData) {
      // Simulate API call
      setLoading(true);
      setTimeout(() => {
        setFipeData(mockFipeData);
        setLoading(false);
      }, 1200);
    }
  }, [carData]);

  const changePercent = fipeData
    ? (
        ((fipeData.value - fipeData.lastValue) / fipeData.lastValue) *
        100
      ).toFixed(1)
    : 0;

  const isPositive = fipeData && fipeData.change > 0;

  return (
    <GridCard
      variant="secondary"
      isWide={true}
      onPress={() => onNavigate?.("VehicleModule")}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#fff" size="small" />
          <Text style={styles.loadingText}>Consultando FIPE...</Text>
        </View>
      ) : fipeData ? (
        <View style={styles.content}>
          <View style={styles.carInfo}>
            <Text style={styles.model}>
              {fipeData.brand} {fipeData.model}
            </Text>
            <Text style={styles.year}>{fipeData.year}</Text>
          </View>

          <View style={styles.values}>
            <Text style={styles.mainValue}>
              R$ {fipeData.value.toLocaleString("pt-BR")}
            </Text>
            <View
              style={[
                styles.changeBadge,
                isPositive ? styles.changePositive : styles.changeNegative,
              ]}
            >
              <Text style={styles.changeText}>
                {isPositive ? "▲" : "▼"} {changePercent}%
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Cadastre seu veículo</Text>
        </View>
      )}
    </GridCard>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  loadingText: {
    color: COLORS.text,
    fontSize: 12,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  carInfo: {
    flex: 1,
  },
  model: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  year: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  values: {
    alignItems: "flex-end",
    gap: 6,
  },
  mainValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  changePositive: {
    backgroundColor: COLORS.secondary + "20",
    borderColor: COLORS.secondary,
  },
  changeNegative: {
    backgroundColor: COLORS.danger + "20",
    borderColor: COLORS.danger,
  },
  changeText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.text,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  emptyText: {
    color: COLORS.text,
    fontSize: 14,
  },
});
