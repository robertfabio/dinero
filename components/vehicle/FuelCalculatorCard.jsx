import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { DineroButton } from "../ui/DineroButton";
import { GridCard } from "../ui/GridCard";

export const FuelCalculatorCard = ({ onNavigate }) => {
  const [gasPrice, setGasPrice] = useState("");
  const [ethanolPrice, setEthanolPrice] = useState("");
  const [result, setResult] = useState(null);

  const calculateBestFuel = () => {
    const gas = parseFloat(gasPrice) || 0;
    const ethanol = parseFloat(ethanolPrice) || 0;

    // Rule of 70%: Ethanol is worth it if price ≤ 70% of gas
    const threshold = gas * 0.7;
    const worthEthanol = ethanol <= threshold;

    const ratio = ((ethanol / gas) * 100).toFixed(1);

    setResult({
      gas: gas.toFixed(2),
      ethanol: ethanol.toFixed(2),
      ratio,
      worthEthanol,
      savings: worthEthanol
        ? ((gas - ethanol) * 10).toFixed(2)
        : ((ethanol - gas) * 10).toFixed(2),
    });
  };

  return (
    <GridCard variant="primary" onPress={() => onNavigate?.("VehicleModule")}>
      <View>
        <Text style={styles.title}>⛽ Álcool vs Gasolina</Text>
        <Text style={styles.subtitle}>Regra dos 70%</Text>
      </View>

      {!result ? (
        <View style={styles.form}>
          <View style={styles.row}>
            <TextInput
              style={[styles.input]}
              placeholder="Gasolina"
              placeholderTextColor="#fff8"
              keyboardType="decimal-pad"
              value={gasPrice}
              onChangeText={setGasPrice}
            />
            <TextInput
              style={[styles.input]}
              placeholder="Álcool"
              placeholderTextColor="#fff8"
              keyboardType="decimal-pad"
              value={ethanolPrice}
              onChangeText={setEthanolPrice}
            />
          </View>
          <DineroButton
            title="Comparar"
            onPress={calculateBestFuel}
            variant="secondary"
            size="sm"
          />
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {result.worthEthanol
                ? "✓ Álcool compensa"
                : "✗ Gasolina é melhor"}
            </Text>
          </View>
          <Text style={styles.ratio}>{result.ratio}% do preço da gasolina</Text>
          <Text style={styles.savings}>Economiza R$ {result.savings}/tank</Text>
        </View>
      )}
    </GridCard>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#fff8",
  },
  form: {
    gap: 8,
    marginTop: 12,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff2",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#fff",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#fff4",
  },
  resultContainer: {
    gap: 8,
  },
  badge: {
    backgroundColor: "#fff2",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  ratio: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  savings: {
    fontSize: 12,
    color: "#fff8",
  },
});
