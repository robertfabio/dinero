import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { COLORS } from "../../styles/globalStyles";
import { DineroButton } from "../ui/DineroButton";
import { GridCard } from "../ui/GridCard";

export const InstallmentAdvanceCard = ({ onNavigate }) => {
  const [installmentValue, setInstallmentValue] = useState("");
  const [discount, setDiscount] = useState("3");
  const [result, setResult] = useState(null);

  const calculateAdvance = () => {
    const value = parseFloat(installmentValue) || 0;
    const discountPercent = parseFloat(discount) || 0;

    const discountAmount = value * (discountPercent / 100);
    const discountedValue = value - discountAmount;

    // CDI approximate rate (3% a.a ~ 0.25% a.m)
    const monthlyRate = 0.0025;
    const futureValue = value * (1 + monthlyRate);

    setResult({
      original: value.toFixed(2),
      discounted: discountedValue.toFixed(2),
      saved: discountAmount.toFixed(2),
      futureValue: futureValue.toFixed(2),
      gainIfWait: (futureValue - value).toFixed(2),
      worthIt: discountAmount > futureValue - value,
    });
  };

  return (
    <GridCard variant="secondary" onPress={() => onNavigate?.("DebtModule")}>
      <View>
        <Text style={styles.title}>⏱️ Antecipar Parcela?</Text>
        <Text style={styles.subtitle}>Desconto vs CDI</Text>
      </View>

      {!result ? (
        <View style={styles.form}>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 2 }]}
              placeholder="Valor"
              placeholderTextColor="#fff8"
              keyboardType="decimal-pad"
              value={installmentValue}
              onChangeText={setInstallmentValue}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Desc %"
              placeholderTextColor="#fff8"
              keyboardType="decimal-pad"
              value={discount}
              onChangeText={setDiscount}
            />
          </View>
          <DineroButton
            title="Simular"
            onPress={calculateAdvance}
            variant="secondary"
            size="sm"
          />
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <View style={styles.resultRow}>
            <Text style={styles.label}>Ganho:</Text>
            <Text
              style={[
                styles.value,
                {
                  color: result.worthIt ? "#4ade80" : "#f87171",
                },
              ]}
            >
              {result.worthIt ? "✓" : "✗"} R$ {result.saved}
            </Text>
          </View>
          <Text style={styles.small}>Se esperar: R$ {result.gainIfWait}</Text>
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
  form: {
    gap: 8,
    marginTop: 12,
  },
  row: {
    flexDirection: "row",
    gap: 8,
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
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.9,
  },
  value: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
  },
  small: {
    fontSize: 11,
    color: COLORS.white,
    opacity: 0.7,
  },
});
