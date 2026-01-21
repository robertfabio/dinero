import { useContext } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TransactionItem from "../../components/TransactionItem";
import { DineroContext } from "../../context/GlobalState";
import { COLORS, GlobalStyles } from "../../styles/globalStyles";

export default function TransactionScreen() {
  const [transactions] = useContext(DineroContext);

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <Text style={GlobalStyles.title}>Extrato</Text>

      <FlatList
        contentContainerStyle={GlobalStyles.contentContainer}
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TransactionItem
            category={item.category}
            date={item.date}
            description={item.description}
            value={item.value}
          />
        )}
        ListEmptyComponent={
          <View
            style={[
              GlobalStyles.duoContainer,
              { padding: 30, alignItems: "center", marginTop: 20 },
            ]}
          >
            <Text style={{ fontSize: 40, marginBottom: 16 }}>�</Text>
            <Text
              style={{
                color: COLORS.text,
                textAlign: "center",
                fontSize: 18,
                fontWeight: "800",
                marginBottom: 8,
              }}
            >
              Nada por aqui!
            </Text>
            <Text
              style={{
                color: COLORS.textLight,
                textAlign: "center",
                fontSize: 15,
                fontWeight: "600",
              }}
            >
              Suas transações aparecerão nesta tela.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
