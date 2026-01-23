import { DollarSign, TrendingDown, TrendingUp } from "lucide-react-native";
import { memo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { COLORS, GlobalStyles } from "../styles/globalStyles";

const TickerItem = memo(({ item }) => {
  const isPositive = item.change >= 0;
  const trendColor = isPositive ? COLORS.secondary : COLORS.danger;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  return (
    <View style={[styles.card, { borderBottomColor: COLORS.neutral }]}>
      <View style={styles.header}>
        <View
          style={[
            styles.iconBox,
            { backgroundColor: isPositive ? "#E7F9D1" : "#FFE5E5" },
          ]}
        >
          <DollarSign size={14} color={trendColor} strokeWidth={3} />
        </View>
        <Text style={styles.symbol}>{item.symbol}</Text>
      </View>

      <Text style={styles.price}>
        {item.price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </Text>

      <View style={styles.footer}>
        <TrendIcon size={12} color={trendColor} strokeWidth={2.5} />
        <Text style={[styles.changeText, { color: trendColor }]}>
          {Math.abs(item.change).toFixed(2)}%
        </Text>
      </View>
    </View>
  );
});

TickerItem.displayName = "TickerItem";

export default function MarketTicker({ data }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.symbol}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <TickerItem item={item} />}
        getItemLayout={(data, index) => ({
          length: 140,
          offset: 140 * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 110,
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 4,
    gap: 12,
  },
  card: {
    ...GlobalStyles.duoContainer,
    width: 140,
    height: 100,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "space-between",
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  iconBox: {
    padding: 4,
    borderRadius: 8,
  },
  symbol: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.textLight,
    textTransform: "uppercase",
  },
  price: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: "800",
  },
});
