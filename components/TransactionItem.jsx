import { StyleSheet, Text, View } from "react-native";

export default function TransactionItem() {
  return (
    <View style={styles.textContainer}>
      <View style={styles.textContainer}>
        <Text> 03/03/2005 </Text>
        <View style={styles.bottomLineContainer}>
          <Text> Marmita </Text>
          <Text> RS 400.00 </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    marginLeft: 12,
    paddingVertical: 4,
  },
  bottomLineContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
