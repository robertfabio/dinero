import { ScrollView } from "react-native";
import { COLORS } from "../../styles/globalStyles";
import { DebtCommitmentCard } from "../debt/DebtCommitmentCard";
import { InstallmentAdvanceCard } from "../debt/InstallmentAdvanceCard";
import { DeductibleTransactionsCard } from "../fiscal/DeductibleTransactionsCard";
import { TaxCalculatorCard } from "../fiscal/TaxCalculatorCard";
import { CurrencyConverterCard } from "../investments/CurrencyConverterCard";
import { SavingsVsCDICard } from "../investments/SavingsVsCDICard";
import { ResponsiveGrid } from "../ui/ResponsiveGrid";
import { FipeCard } from "../vehicle/FipeCard";
import { FuelCalculatorCard } from "../vehicle/FuelCalculatorCard";

export default function HomeGridExample() {
  return (
    <ScrollView style={{ backgroundColor: COLORS.screenBg }}>
      <ResponsiveGrid>
        <TaxCalculatorCard />
        <DeductibleTransactionsCard />
        <DebtCommitmentCard />
        <InstallmentAdvanceCard />
        <FipeCard />
        <FuelCalculatorCard />
        <SavingsVsCDICard />
        <CurrencyConverterCard />
      </ResponsiveGrid>
    </ScrollView>
  );
}
