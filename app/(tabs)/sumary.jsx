import { MaterialIcons } from "@expo/vector-icons";
import * as Print from "expo-print";
import { useNavigation } from "expo-router";
import * as Sharing from "expo-sharing";
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  Share,
  Text,
  View,
} from "react-native";

import AnimatedPieChart from "../../components/charts/AnimatedPieChart";
import PeriodFilter from "../../components/filters/PeriodFilter";
import GoalsManager from "../../components/goals/GoalsManager";
import CategoryListItem from "../../components/lists/CategoryListItem";
import QuickInsights from "../../components/summary/QuickInsights";
import StatCard from "../../components/summary/StatCard";
import SummaryCard from "../../components/summary/SummaryCard";
import TransactionCalendar from "../../components/transactions/TransactionCalendar";
import AnimatedCard from "../../components/ui/AnimatedCard";
import DineroButton from "../../components/ui/DineroButton";
import { DineroContext } from "../../context/GlobalState";
import { storageUtils } from "../../store/storage";
import { COLORS, GlobalStyles } from "../../styles/globalStyles";
import { generatePDFContent } from "../../utils/pdfGenerator";
import { usePeriodComparison } from "../../utils/usePeriodComparison";
import { useSummaryData } from "../../utils/useSummaryData";

const screenWidth = Dimensions.get("window").width;

function EmptyState() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.screenBg }}>
      <ScrollView
        contentContainerStyle={[
          GlobalStyles.contentContainer,
          { justifyContent: "center" },
        ]}
      >
        <View
          style={[
            GlobalStyles.duoContainer,
            { padding: 30, alignItems: "center" },
          ]}
        >
          <MaterialIcons
            name="insert-chart"
            size={60}
            color={COLORS.textLight}
          />
          <Text
            style={{
              color: COLORS.text,
              textAlign: "center",
              fontSize: 18,
              fontWeight: "800",
              marginTop: 16,
              marginBottom: 8,
            }}
          >
            Nenhuma transação ainda
          </Text>
          <Text
            style={{
              color: COLORS.textLight,
              textAlign: "center",
              fontSize: 15,
              fontWeight: "600",
            }}
          >
            Adicione transações para ver seu resumo financeiro aqui.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default function SumaryScreen() {
  const [transactions] = useContext(DineroContext);
  const [period, setPeriod] = useState("all");
  const [isExporting, setIsExporting] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [currentGoal, setCurrentGoal] = useState(null);
  const exportButtonRef = useRef();
  const navigation = useNavigation();

  const summary = useSummaryData(transactions, period);
  const comparison = usePeriodComparison(transactions, period);

  // Load goal from storage
  useEffect(() => {
    const loadGoal = async () => {
      try {
        const savedGoal = await storageUtils.getItem("@dinero:goal");
        if (savedGoal) {
          setCurrentGoal(JSON.parse(savedGoal));
        }
      } catch (error) {
        console.error("Error loading goal:", error);
      }
    };
    loadGoal();
  }, []);

  // Save goal to storage
  const handleGoalChange = async (goal) => {
    setCurrentGoal(goal);
    try {
      await storageUtils.setItem("@dinero:goal", JSON.stringify(goal));
    } catch (error) {
      console.error("Error saving goal:", error);
    }
  };

  const shareText = useCallback(async () => {
    const text = `Meu Resumo Financeiro - Dinero\n\nReceitas: ${summary.income.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
    \nDespesas: ${summary.expenses.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
    \nSaldo: ${summary.balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
    \n\nTotal de ${summary.transactionCount} transações com média de ${summary.avgTransaction.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} por transação.`;

    try {
      await Share.share({
        message: text,
      });
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  }, [summary]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={shareText}
          style={{
            padding: 8,
            marginRight: 12,
            borderRadius: 8,
            backgroundColor: COLORS.screenBg,
            borderWidth: 2,
            borderColor: COLORS.neutral,
          }}
        >
          <MaterialIcons name="share" size={24} color={COLORS.primary} />
        </Pressable>
      ),
    });
  }, [navigation, summary, shareText]);

  const exportToPDF = async () => {
    try {
      setIsExporting(true);
      exportButtonRef.current?.triggerExplosion?.();

      const html = generatePDFContent(summary, summary.categoryData);
      const { uri } = await Print.printToFileAsync({ html });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          dialogTitle: "Compartilhar Resumo Financeiro",
          mimeType: "application/pdf",
          UTI: "com.adobe.pdf",
        });
      } else {
        Alert.alert("Sucesso", "PDF gerado com sucesso!");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível gerar o PDF: " + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  if (transactions.length === 0) return <EmptyState />;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.screenBg }}>
      <ScrollView
        contentContainerStyle={[
          GlobalStyles.contentContainer,
          { paddingBottom: 110, paddingTop: 2 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <PeriodFilter
          selected={period}
          onSelect={setPeriod}
          style={{ marginBottom: 8 }}
        />
        <AnimatedCard delay={0}>
          <View style={{ gap: 12 }}>
            <SummaryCard
              icon="trending-up"
              label="Receitas"
              value={summary.income}
              type="income"
              previousValue={comparison.previous?.income}
            />
            <SummaryCard
              icon="trending-down"
              label="Despesas"
              value={summary.expenses}
              type="expense"
              previousValue={comparison.previous?.expenses}
            />
            <SummaryCard
              icon="account-balance-wallet"
              label="Saldo"
              value={summary.balance}
              type="balance"
              previousValue={comparison.previous?.balance}
            />
          </View>
        </AnimatedCard>

        <AnimatedCard delay={100}>
          <View style={{ flexDirection: "row", gap: 4, marginTop: 16 }}>
            <StatCard
              icon="receipt-long"
              iconColor={COLORS.primary}
              label="Transações"
              value={summary.transactionCount}
            />
            <StatCard
              icon="payments"
              iconColor={COLORS.secondary}
              label="Média"
              value={summary.avgTransaction.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                maximumFractionDigits: 0,
              })}
            />
            <StatCard
              icon="local-fire-department"
              iconColor={COLORS.danger}
              label="Maior"
              value={summary.largestExpense.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                maximumFractionDigits: 0,
              })}
            />
          </View>
        </AnimatedCard>

        {summary.balance > 0 && (
          <AnimatedCard delay={200} style={{ marginTop: 16 }}>
            <GoalsManager
              balance={summary.balance}
              currentGoal={currentGoal}
              onGoalChange={handleGoalChange}
            />
          </AnimatedCard>
        )}

        <AnimatedCard delay={300} style={{ marginTop: 16 }}>
          <QuickInsights
            summary={summary}
            categoryData={summary.categoryData}
          />
        </AnimatedCard>

        <AnimatedCard delay={350} style={{ marginTop: 16 }}>
          <TransactionCalendar transactions={transactions} />
        </AnimatedCard>

        {summary.chartData.length > 0 && (
          <>
            <AnimatedCard delay={400} style={{ marginTop: 20 }}>
              <View style={[GlobalStyles.duoContainer, { padding: 20 }]}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <MaterialIcons
                    name="pie-chart"
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text
                    style={{
                      marginLeft: 8,
                      fontSize: 16,
                      fontWeight: "800",
                      color: COLORS.text,
                      textTransform: "uppercase",
                    }}
                  >
                    Despesas por Categoria
                  </Text>
                </View>
                <AnimatedPieChart
                  data={summary.chartData}
                  size={Math.min(screenWidth - 80, 280)}
                />
              </View>
            </AnimatedCard>

            <AnimatedCard delay={500} style={{ marginTop: 20 }}>
              <Pressable
                onPress={() => setShowDetails(!showDetails)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialIcons name="list" size={20} color={COLORS.text} />
                  <Text
                    style={{
                      marginLeft: 8,
                      fontSize: 14,
                      fontWeight: "800",
                      color: COLORS.text,
                      textTransform: "uppercase",
                    }}
                  >
                    Detalhes por Categoria
                  </Text>
                </View>
                <MaterialIcons
                  name={showDetails ? "expand-less" : "expand-more"}
                  size={24}
                  color={COLORS.text}
                />
              </Pressable>
              {showDetails &&
                Object.entries(summary.categoryData)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, value]) => (
                    <CategoryListItem
                      key={category}
                      category={category}
                      value={value}
                      total={summary.expenses}
                    />
                  ))}
            </AnimatedCard>
          </>
        )}

        <AnimatedCard delay={600} style={{ marginTop: 20 }}>
          <DineroButton
            ref={exportButtonRef}
            title={isExporting ? "GERANDO..." : "EXPORTAR PDF"}
            onPress={exportToPDF}
            initialFaceColor={COLORS.primary}
            initialShadowColor={COLORS.primaryDark}
            initialTextColor={COLORS.white}
            useParticles={true}
          />
        </AnimatedCard>
      </ScrollView>
    </View>
  );
}
