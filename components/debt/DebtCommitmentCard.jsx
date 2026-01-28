import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../styles/globalStyles";
import { GridCard } from "../ui/GridCard";

export const DebtCommitmentCard = ({ totalCommitted = 500, months = 12 }) => {
  const monthlyAverage = (totalCommitted / months).toFixed(2);

  return (
    <GridCard variant="neutral" isWide={true} onPress={() => {}}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>📊 Compromissos</Text>
          <Text style={styles.amount}>R$ {totalCommitted.toFixed(2)}</Text>
          <Text style={styles.subtitle}>
            Comprometidos nos próximos {months} meses
          </Text>
          <Text style={styles.monthly}>~R$ {monthlyAverage}/mês</Text>
        </View>

        <View style={styles.indicator}>
          <View
            style={[
              styles.gauge,
              {
                width: Math.min((totalCommitted / 3000) * 100, 100) + "%",
              },
            ]}
          />
          <Text style={styles.gaugeLabel}>
            {Math.min(Math.round((totalCommitted / 3000) * 100), 100)}%
          </Text>
        </View>
      </View>
    </GridCard>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  amount: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  monthly: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: "500",
  },
  indicator: {
    alignItems: "flex-end",
    width: 60,
  },
  gauge: {
    height: 6,
    backgroundColor: COLORS.danger,
    borderRadius: 3,
    marginBottom: 4,
  },
  gaugeLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
  },
});
