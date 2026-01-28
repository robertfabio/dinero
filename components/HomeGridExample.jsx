import { ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS, METRICS } from "../styles/globalStyles";
import { DebtCommitmentCard } from "./debt/DebtCommitmentCard";
import { InstallmentAdvanceCard } from "./debt/InstallmentAdvanceCard";
import { DeductibleTransactionsCard } from "./fiscal/DeductibleTransactionsCard";
import { TaxCalculatorCard } from "./fiscal/TaxCalculatorCard";
import { CurrencyConverterCard } from "./investments/CurrencyConverterCard";
import { SavingsVsCDICard } from "./investments/SavingsVsCDICard";
import { GridCard } from "./ui/GridCard";
import { ResponsiveGrid } from "./ui/ResponsiveGrid";
import { FipeCard } from "./vehicle/FipeCard";
import { FuelCalculatorCard } from "./vehicle/FuelCalculatorCard";

export const HomeGridExample = ({ navigation }) => {
  const handleNavigateToModule = (moduleName) => {
    console.log(`Navigate to ${moduleName}`);
    navigation?.navigate(moduleName);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: COLORS.screenBg }]}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {/* Section 1: Fiscal Module - 2x items */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📋 Fiscal & Tributos</Text>
          <Text style={styles.sectionSubtitle}>
            Gestão de impostos inteligente
          </Text>
        </View>
        <ResponsiveGrid columns={2} gap={12}>
          <TaxCalculatorCard onNavigate={handleNavigateToModule} />
          <DeductibleTransactionsCard onNavigate={handleNavigateToModule} />
        </ResponsiveGrid>
      </View>

      {/* Section 2: Debt & Credit Module - 2x items */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>💳 Dívidas & Crédito</Text>
          <Text style={styles.sectionSubtitle}>Gerencie suas parcelas</Text>
        </View>
        <ResponsiveGrid columns={1} gap={12}>
          <DebtCommitmentCard totalCommitted={1250} months={12} />
          <InstallmentAdvanceCard onNavigate={handleNavigateToModule} />
        </ResponsiveGrid>
      </View>

      {/* Section 3: Vehicles Module - 2x items */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🚗 Veículos</Text>
          <Text style={styles.sectionSubtitle}>Acompanhe seu patrimônio</Text>
        </View>
        <ResponsiveGrid columns={2} gap={12}>
          <FipeCard onNavigate={handleNavigateToModule} />
          <FuelCalculatorCard onNavigate={handleNavigateToModule} />
        </ResponsiveGrid>
      </View>

      {/* Section 4: Investments Module - 2x items */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>💎 Investimentos</Text>
          <Text style={styles.sectionSubtitle}>
            Educação financeira prática
          </Text>
        </View>
        <ResponsiveGrid columns={2} gap={12}>
          <SavingsVsCDICard onNavigate={handleNavigateToModule} />
          <CurrencyConverterCard onNavigate={handleNavigateToModule} />
        </ResponsiveGrid>
      </View>

      {/* Quick Actions - Wide cards */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>⚡ Ações Rápidas</Text>
        </View>
        <ResponsiveGrid columns={1} gap={12}>
          <GridCard
            variant="secondary"
            isWide={true}
            onPress={() => console.log("Add transaction")}
          >
            <View style={styles.quickActionContent}>
              <View>
                <Text style={styles.quickActionTitle}>
                  ➕ Adicionar Transação
                </Text>
                <Text style={styles.quickActionSubtitle}>
                  Marcar como dedutível
                </Text>
              </View>
              <Text style={styles.quickActionArrow}>→</Text>
            </View>
          </GridCard>

          <GridCard
            variant="primary"
            isWide={true}
            onPress={() => console.log("Generate report")}
          >
            <View style={styles.quickActionContent}>
              <View>
                <Text style={styles.quickActionTitle}>
                  📄 Gerar Relatório IRPF
                </Text>
                <Text style={styles.quickActionSubtitle}>
                  PDF para Receita Federal
                </Text>
              </View>
              <Text style={styles.quickActionArrow}>→</Text>
            </View>
          </GridCard>
        </ResponsiveGrid>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
  },
  section: {
    paddingVertical: METRICS.padding,
  },
  sectionHeader: {
    paddingHorizontal: METRICS.padding,
    marginBottom: METRICS.padding,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  quickActionContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.8,
  },
  quickActionArrow: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: "300",
  },
});
