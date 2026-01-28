import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { DineroButton } from "../ui/DineroButton";
import { GridCard } from "../ui/GridCard";

export const SavingsVsCDICard = ({ onNavigate }) => {
  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState("12");
  const [result, setResult] = useState(null);

  const calculateComparison = () => {
    const principal = parseFloat(amount) || 0;
    const period = parseFloat(months) || 12;

    const savingsRate = 0.105 / 12;
    const savingsReturn = principal * (Math.pow(1 + savingsRate, period) - 1);

    const cdiRate = 0.105 / 12;
    const cdiReturn = principal * (Math.pow(1 + cdiRate, period) - 1);

    // CDB: 90% of CDI on average ~9.45% a.a
    const cdbRate = (0.105 * 0.9) / 12;
    const cdbReturn = principal * (Math.pow(1 + cdbRate, period) - 1);

    setResult({
      principal: principal.toFixed(2),
      savingsReturn: savingsReturn.toFixed(2),
      savingsFinal: (principal + savingsReturn).toFixed(2),
      cdbReturn: cdbReturn.toFixed(2),
      cdbFinal: (principal + cdbReturn).toFixed(2),
      bestChoice: cdbReturn > savingsReturn ? "CDB" : "Poupança",
      difference: Math.abs(cdbReturn - savingsReturn).toFixed(2),
    });
  };

  return (
    <GridCard
      variant="neutral"
      onPress={() => onNavigate?.("InvestmentModule")}
    >
      <View>
        <Text style={styles.title}>💎 Poupança vs CDB</Text>
        <Text style={styles.subtitle}>Comparação real</Text>
      </View>

      {!result ? (
        <View style={styles.form}>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 2 }]}
              placeholder="Valor"
              placeholderTextColor="#fff8"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Meses"
              placeholderTextColor="#fff8"
              keyboardType="decimal-pad"
              value={months}
              onChangeText={setMonths}
            />
          </View>
          <DineroButton
            title="Simular"
            onPress={calculateComparison}
            variant="secondary"
            size="sm"
          />
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <View style={styles.comparison}>
            <View style={styles.option}>
              <Text style={styles.label}>Poupança</Text>
              <Text style={styles.amount}>R$ {result.savingsFinal}</Text>
            </View>
            <View style={styles.separator}>
              <Text style={styles.vs}>vs</Text>
            </View>
            <View
              style={[
                styles.option,
                result.bestChoice === "CDB" && styles.optionBest,
              ]}
            >
              <Text style={styles.label}>CDB</Text>
              <Text style={styles.amount}>R$ {result.cdbFinal}</Text>
            </View>
          </View>
          <Text style={styles.difference}>
            CDB ganha: R$ {result.difference}
          </Text>
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
  comparison: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  option: {
    flex: 1,
    backgroundColor: "#fff2",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  optionBest: {
    backgroundColor: "#4ade8033",
    borderWidth: 2,
    borderColor: "#4ade80",
  },
  label: {
    fontSize: 11,
    color: "#fff8",
    marginBottom: 2,
  },
  amount: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  separator: {
    height: 40,
    justifyContent: "center",
  },
  vs: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff8",
  },
  difference: {
    fontSize: 11,
    color: "#fff8",
    textAlign: "center",
  },
});
