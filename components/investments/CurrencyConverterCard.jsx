import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { GridCard } from "../ui/GridCard";

export const CurrencyConverterCard = ({ onNavigate }) => {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock exchange rates
  const mockRates = {
    USD: 5.12,
    EUR: 5.68,
    BTC: 180000,
  };

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setRates(mockRates);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <GridCard
      variant="primary"
      isWide={true}
      onPress={() => onNavigate?.("InvestmentModule")}
    >
      <View>
        <Text style={styles.title}>💱 Cotações</Text>
        <Text style={styles.subtitle}>Tempo real</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#fff" size="small" />
        </View>
      ) : rates ? (
        <View style={styles.ratesContainer}>
          {Object.entries(rates).map(([currency, rate]) => (
            <View key={currency} style={styles.rateRow}>
              <Text style={styles.currency}>{currency}</Text>
              <Text style={styles.rate}>
                R${" "}
                {typeof rate === "number" && rate > 1000
                  ? (rate / 1000).toFixed(1) + "k"
                  : rate.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </GridCard>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    color: "#fff8",
    marginBottom: 8,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 60,
  },
  ratesContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-around",
  },
  rateRow: {
    alignItems: "center",
    flex: 1,
  },
  currency: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff8",
    marginBottom: 2,
  },
  rate: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },
});
