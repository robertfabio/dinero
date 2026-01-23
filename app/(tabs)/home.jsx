import { MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import * as LucideIcons from "lucide-react-native";
import { useContext, useMemo, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedNumber from "../../components/AnimatedNumber";
import NewsItem from "../../components/NewsItem";
import QuickInsights from "../../components/QuickInsights";
import StatCard from "../../components/StatCard";
import TransactionItem from "../../components/TransactionItem";
import { DineroContext } from "../../context/GlobalState";
import { useNewsFeeds } from "../../hooks/useNewsFeeds";
import { COLORS, GlobalStyles } from "../../styles/globalStyles";

export default function Home() {
  const [transactions] = useContext(DineroContext);
  const { news, loading: newsLoading, refresh: refreshNews } = useNewsFeeds();
  const [showNews, setShowNews] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const summary = useMemo(() => {
    let income = 0;
    let expenses = 0;
    const categoryData = {};

    transactions.forEach((t) => {
      if (t.category === "income") {
        income += t.value;
      } else {
        expenses += t.value;
        categoryData[t.category] = (categoryData[t.category] || 0) + t.value;
      }
    });

    return {
      income,
      expenses,
      balance: income - expenses,
      categoryData,
    };
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    return transactions.slice(-5).reverse();
  }, [transactions]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshNews();
    setRefreshing(false);
  };

  const combinedData = useMemo(() => {
    const items = [];

    recentTransactions.forEach((transaction) => {
      items.push({ type: "transaction", data: transaction });
    });

    if (showNews) {
      news.slice(0, 5).forEach((newsItem) => {
        items.push({ type: "news", data: newsItem });
      });
    }

    return items;
  }, [recentTransactions, news, showNews]);

  const renderItem = ({ item }) => {
    if (item.type === "transaction") {
      return (
        <TransactionItem
          category={item.data.category}
          date={item.data.date}
          description={item.data.description}
          value={item.data.value}
        />
      );
    } else if (item.type === "news") {
      return <NewsItem item={item.data} />;
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.screenBg} />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá! 👋</Text>
          <Text style={styles.subtitle}>Seu resumo financeiro</Text>
        </View>
        <TouchableOpacity style={styles.avatarCircle}>
          <LucideIcons.User size={24} color={COLORS.text} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <FlashList
        data={combinedData}
        estimatedItemSize={100}
        keyExtractor={(item, index) =>
          item.type === "transaction"
            ? `tx-${item.data.id}`
            : `news-${item.data.id}`
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListHeaderComponent={
          <View>
            <View style={[GlobalStyles.duoContainer, styles.balanceCard]}>
              <View style={styles.balanceHeader}>
                <MaterialIcons
                  name="account-balance-wallet"
                  size={28}
                  color={COLORS.primary}
                />
                <Text style={styles.balanceLabel}>Saldo Atual</Text>
              </View>
              <AnimatedNumber
                value={summary.balance}
                style={[
                  styles.balanceValue,
                  {
                    color:
                      summary.balance >= 0 ? COLORS.secondary : COLORS.danger,
                  },
                ]}
                prefix="R$ "
                decimals={2}
                duration={1200}
              />
            </View>
            <View style={styles.statsGrid}>
              <StatCard
                label="Receitas"
                value={summary.income.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
                numericValue={summary.income}
                animated
                icon="trending-up"
                iconColor={COLORS.secondary}
              />
              <StatCard
                label="Despesas"
                value={summary.expenses.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
                numericValue={summary.expenses}
                animated
                icon="trending-down"
                iconColor={COLORS.danger}
              />
            </View>

            {transactions.length > 0 && (
              <View>
                <QuickInsights
                  summary={summary}
                  categoryData={summary.categoryData}
                />
              </View>
            )}

            {recentTransactions.length > 0 && (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Transações Recentes</Text>
                <MaterialIcons
                  name="history"
                  size={20}
                  color={COLORS.textLight}
                />
              </View>
            )}

            {news.length > 0 && (
              <View style={styles.newsHeaderContainer}>
                <View style={styles.sectionHeader}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <LucideIcons.Newspaper
                      size={18}
                      color={COLORS.primary}
                      strokeWidth={2}
                    />
                    <Text style={[styles.sectionTitle, { marginLeft: 6 }]}>
                      Notícias Financeiras
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setShowNews(!showNews)}
                    style={styles.toggleButton}
                  >
                    <LucideIcons.ChevronDown
                      size={20}
                      color={COLORS.textLight}
                      strokeWidth={2}
                      style={{
                        transform: [{ rotate: showNews ? "180deg" : "0deg" }],
                      }}
                    />
                  </TouchableOpacity>
                </View>
                {newsLoading && (
                  <View style={{ alignItems: "center", paddingVertical: 16 }}>
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  </View>
                )}
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[GlobalStyles.duoContainer, styles.emptyCard]}>
              <LucideIcons.Inbox
                size={60}
                color={COLORS.textLight}
                strokeWidth={1.5}
              />
              <Text style={styles.emptyTitle}>Nenhuma transação ainda</Text>
              <Text style={styles.emptySubtitle}>
                Comece adicionando sua primeira transação usando o botão +
                abaixo
              </Text>
            </View>
          </View>
        }
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.text,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
    fontWeight: "600",
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: COLORS.neutral,
    alignItems: "center",
    justifyContent: "center",
  },
  balanceCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
  },
  balanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginLeft: 8,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.text,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  newsHeaderContainer: {
    marginTop: 8,
  },
  toggleButton: {
    padding: 4,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  emptyCard: {
    padding: 40,
    alignItems: "center",
    marginHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 20,
  },
});
