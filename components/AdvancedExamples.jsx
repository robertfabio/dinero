import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useDebtCalculations } from "../hooks/useDebtCalculations";
import { useFuelCalculations } from "../hooks/useFuelCalculations";
import { useInvestmentComparisons } from "../hooks/useInvestmentComparisons";
import { useTaxCalculations } from "../hooks/useTaxCalculations";

export const FiscalDashboard = () => {
  const { calculateNetSalary, compareCLTvsPJ } = useTaxCalculations();
  const [salary, setSalary] = useState(3000);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const comparison = compareCLTvsPJ(salary);
    setResults(comparison);
  }, [salary]);

  if (!results) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simulador CLT vs PJ</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CLT - Empregado</Text>
        <View style={styles.row}>
          <Text>Bruto:</Text>
          <Text style={styles.value}>R$ {results.clt.gross}</Text>
        </View>
        <View style={styles.row}>
          <Text>INSS:</Text>
          <Text style={styles.value}>-R$ {results.clt.inss}</Text>
        </View>
        <View style={styles.row}>
          <Text>IRRF:</Text>
          <Text style={styles.value}>-R$ {results.clt.irrf}</Text>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalText}>Líquido:</Text>
          <Text style={[styles.value, styles.totalValue]}>
            R$ {results.clt.net}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PJ - Autônomo</Text>
        <View style={styles.row}>
          <Text>Faturamento:</Text>
          <Text style={styles.value}>R$ {results.pj.gross}</Text>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalText}>Líquido (est):</Text>
          <Text style={[styles.value, styles.totalValue]}>
            R$ {results.pj.net}
          </Text>
        </View>
      </View>

      {results.pj.advantage ? (
        <View style={[styles.badge, styles.advantageBadge]}>
          <Text style={styles.badgeText}>
            ✓ PJ sai melhor por R${" "}
            {(parseFloat(results.pj.net) - parseFloat(results.clt.net)).toFixed(
              2,
            )}
          </Text>
        </View>
      ) : (
        <View style={[styles.badge, styles.disadvantageBadge]}>
          <Text style={styles.badgeText}>CLT segue melhor neste caso</Text>
        </View>
      )}
    </View>
  );
};

export const DebtStrategyAnalyzer = () => {
  const { projectDebt } = useDebtCalculations();

  const mockDebts = [
    { name: "Cartão 1", amount: 2000, rate: 0.0275 }, // 33% yearly
    { name: "Cartão 2", amount: 1500, rate: 0.0225 }, // 27% yearly
    { name: "Pessoal", amount: 5000, rate: 0.015 }, // 18% yearly
  ];

  const monthlyPayment = 1000;
  const months = 12;

  const avalancheOrder = [...mockDebts].sort((a, b) => b.rate - a.rate);
  const snowballOrder = [...mockDebts].sort((a, b) => a.amount - b.amount);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estratégias de Pagamento</Text>

      <View style={styles.comparisonContainer}>
        <View style={styles.strategyBox}>
          <Text style={styles.strategyTitle}>
            Avalanche (Juros Altos Primeiro)
          </Text>
          {avalancheOrder.map((debt, idx) => (
            <Text key={idx} style={styles.debtItem}>
              {idx + 1}. {debt.name} - R$ {debt.amount}
            </Text>
          ))}
          <Text style={styles.strategyTip}>💡 Economiza mais com juros</Text>
        </View>

        <View style={styles.strategyBox}>
          <Text style={styles.strategyTitle}>
            Snowball (Valores Menores Primeiro)
          </Text>
          {snowballOrder.map((debt, idx) => (
            <Text key={idx} style={styles.debtItem}>
              {idx + 1}. {debt.name} - R$ {debt.amount}
            </Text>
          ))}
          <Text style={styles.strategyTip}>💡 Motivação psicológica</Text>
        </View>
      </View>
    </View>
  );
};

export const InvestmentOpportunityFinder = () => {
  const { compareInvestments } = useInvestmentComparisons();

  const scenarios = [
    { amount: 500, months: 3, label: "Curto prazo (3 meses)" },
    { amount: 1000, months: 6, label: "Médio prazo (6 meses)" },
    { amount: 5000, months: 12, label: "Longo prazo (1 ano)" },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Simulador Multi-Cenário</Text>

      {scenarios.map((scenario, idx) => {
        const investments = compareInvestments(
          scenario.amount,
          scenario.months,
        );

        const best = Object.entries(investments).reduce((prev, current) =>
          parseFloat(current[1].profit) > parseFloat(prev[1].profit)
            ? current
            : prev,
        );

        return (
          <View key={idx} style={styles.scenarioCard}>
            <Text style={styles.scenarioTitle}>{scenario.label}</Text>
            <Text style={styles.scenarioSubtitle}>
              Investindo R$ {scenario.amount.toFixed(2)}
            </Text>

            {Object.entries(investments).map(([type, data]) => (
              <View
                key={type}
                style={[
                  styles.investmentRow,
                  best[0] === type && styles.investmentRowBest,
                ]}
              >
                <View>
                  <Text style={styles.investmentType}>
                    {type.toUpperCase()}
                  </Text>
                  <Text style={styles.investmentReturn}>
                    Lucro: R$ {data.profit}
                  </Text>
                </View>
                <Text style={styles.investmentPercent}>
                  {data.profitPercent}%
                </Text>
                {best[0] === type && (
                  <Text style={styles.bestBadge}>MELHOR</Text>
                )}
              </View>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
};

export const FuelStationTracker = () => {
  const { calculateBestFuel } = useFuelCalculations();

  const stations = [
    { name: "Shell Pampulha", gas: 6.89, ethanol: 4.65 },
    { name: "Ipiranga Savassi", gas: 6.79, ethanol: 4.59 },
    { name: "BR Petrobras", gas: 6.95, ethanol: 4.72 },
    { name: "Alesat Belvedere", gas: 6.72, ethanol: 4.52 },
  ];

  const [bestOption, setBestOption] = useState(null);

  useEffect(() => {
    let best = { station: "", difference: -Infinity };

    stations.forEach((station) => {
      const calc = calculateBestFuel(station.gas, station.ethanol);

      if (parseFloat(calc.savings100km) > best.difference) {
        best = {
          station: station.name,
          difference: parseFloat(calc.savings100km),
          calc,
        };
      }
    });

    setBestOption(best);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rastreador de Combustível</Text>

      {bestOption && (
        <View style={styles.bestStationCard}>
          <Text style={styles.bestStationTitle}>🏆 Melhor opção hoje</Text>
          <Text style={styles.bestStationName}>{bestOption.station}</Text>
          <Text style={styles.bestStationSavings}>
            Economia: R$ {bestOption.difference}/100km
          </Text>
        </View>
      )}

      {stations.map((station, idx) => {
        const calc = calculateBestFuel(station.gas, station.ethanol);

        return (
          <View key={idx} style={styles.stationCard}>
            <Text style={styles.stationName}>{station.name}</Text>
            <View style={styles.priceRow}>
              <View style={styles.priceColumn}>
                <Text style={styles.fuelType}>Gasolina</Text>
                <Text style={styles.price}>R$ {station.gas.toFixed(2)}</Text>
              </View>
              <View style={styles.priceColumn}>
                <Text style={styles.fuelType}>Álcool</Text>
                <Text style={styles.price}>
                  R$ {station.ethanol.toFixed(2)}
                </Text>
              </View>
              <View
                style={[
                  styles.badgeSmall,
                  calc.worthEthanol ? styles.ethanol : styles.gasoline,
                ]}
              >
                <Text style={styles.badgeTextSmall}>
                  {calc.worthEthanol ? "Álcool" : "Gasolina"}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1f2937",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#374151",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 8,
    marginTop: 8,
  },
  totalText: {
    fontSize: 14,
    fontWeight: "700",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#667eea",
  },
  totalValue: {
    fontSize: 16,
  },
  badge: {
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  advantageBadge: {
    backgroundColor: "#d1fae5",
  },
  disadvantageBadge: {
    backgroundColor: "#fee2e2",
  },
  badgeText: {
    fontWeight: "600",
    textAlign: "center",
  },
  comparisonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  strategyBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
  },
  strategyTitle: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
    color: "#374151",
  },
  debtItem: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 4,
  },
  strategyTip: {
    marginTop: 8,
    fontSize: 11,
    fontStyle: "italic",
    color: "#9ca3af",
  },
  scenarioCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  scenarioTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
    color: "#1f2937",
  },
  scenarioSubtitle: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 8,
  },
  investmentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: "#f9fafb",
  },
  investmentRowBest: {
    backgroundColor: "#dbeafe",
    borderWidth: 1,
    borderColor: "#667eea",
  },
  investmentType: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  investmentReturn: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 2,
  },
  investmentPercent: {
    fontSize: 14,
    fontWeight: "700",
    color: "#667eea",
  },
  bestBadge: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
    backgroundColor: "#667eea",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bestStationCard: {
    backgroundColor: "#fff59d",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  bestStationTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6b5b00",
    marginBottom: 4,
  },
  bestStationName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  bestStationSavings: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2d6a4f",
  },
  stationCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  stationName: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1f2937",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  priceColumn: {
    flex: 1,
  },
  fuelType: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
  },
  badgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ethanol: {
    backgroundColor: "#d1fae5",
  },
  gasoline: {
    backgroundColor: "#fee2e2",
  },
  badgeTextSmall: {
    fontSize: 10,
    fontWeight: "600",
  },
});
