import { TrendingDown, TrendingUp } from "lucide-react-native";
import { memo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../styles/globalStyles";

const CoinChip = memo(({ item }) => {
  const isPositive = item.change >= 0;
  const trendColor = isPositive ? COLORS.secondary : COLORS.danger;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  const formatPrice = (price) => {
    if (price >= 1000) {
      return price.toLocaleString("pt-BR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }
    return price.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <View style={styles.chip}>
      <Text style={styles.symbol}>{item.symbol}</Text>
      <Text style={styles.price}>R$ {formatPrice(item.price)}</Text>
      <View style={styles.changeContainer}>
        <TrendIcon size={10} color={trendColor} strokeWidth={3} />
        <Text style={[styles.change, { color: trendColor }]}>
          {Math.abs(item.change).toFixed(1)}%
        </Text>
      </View>
    </View>
  );
});

CoinChip.displayName = "CoinChip";

export default function CoinTicker({ coins, loading }) {
  if (loading || !coins || coins.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {coins.map((coin, index) => (
          <CoinChip key={`${coin.symbol}-${index}`} item={coin} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderBottomWidth: 3,
    borderColor: COLORS.neutral,
    gap: 8,
  },
  symbol: {
    fontSize: 11,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  price: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.text,
  },
  changeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  change: {
    fontSize: 10,
    fontWeight: "700",
  },
});
