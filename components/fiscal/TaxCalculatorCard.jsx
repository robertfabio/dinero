import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { COLORS, GlobalStyles } from "../../styles/globalStyles";
import { DineroButton } from "../ui/DineroButton";
import { GridCard } from "../ui/GridCard";

export const TaxCalculatorCard = ({ onNavigate }) => {
  const [salary, setSalary] = useState("");
  const [result, setResult] = useState(null);

  const calculateNetSalary = (gross) => {
    const grossNum = parseFloat(gross) || 0;
    const inss = grossNum * 0.08;

    let irrf = 0;
    if (grossNum > 1903.98) {
      if (grossNum <= 2826.65) {
        irrf = grossNum * 0.075 - 142.8;
      } else if (grossNum <= 3751.05) {
        irrf = grossNum * 0.15 - 354.8;
      } else if (grossNum <= 4664.68) {
        irrf = grossNum * 0.225 - 636.13;
      } else {
        irrf = grossNum * 0.275 - 869.36;
      }
    }

    const net = grossNum - inss - irrf;

    return {
      gross: grossNum.toFixed(2),
      inss: inss.toFixed(2),
      irrf: Math.max(0, irrf).toFixed(2),
      net: net.toFixed(2),
    };
  };

  const handleCalculate = () => {
    if (salary) {
      setResult(calculateNetSalary(salary));
    }
  };

  return (
    <GridCard variant="primary" onPress={() => onNavigate?.("TaxModule")}>
      <View>
        <Text style={styles.title}>💰 Salário Líquido</Text>
        <Text style={styles.subtitle}>CLT vs PJ</Text>
      </View>

      {!result ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={[GlobalStyles.duoContainer, styles.input]}
            placeholder="Salário bruto"
            placeholderTextColor={COLORS.textLight}
            keyboardType="decimal-pad"
            value={salary}
            onChangeText={setSalary}
          />
          <DineroButton
            title="Calcular"
            onPress={handleCalculate}
            variant="secondary"
            size="sm"
          />
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>
            Líquido: <Text style={styles.resultValue}>R$ {result.net}</Text>
          </Text>
          <Text style={styles.small}>
            INSS: R$ {result.inss} | IRRF: R$ {result.irrf}
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
    color: COLORS.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.8,
  },
  inputContainer: {
    gap: 8,
    marginTop: 12,
  },
  input: {
    height: 40,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: COLORS.text,
    fontSize: 14,
    backgroundColor: COLORS.background,
  },
  resultContainer: {
    gap: 6,
  },
  resultLabel: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
  },
  small: {
    fontSize: 11,
    color: COLORS.white,
    opacity: 0.7,
  },
});
