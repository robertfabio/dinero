import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useState } from "react";
import { FlatList, Text, View } from "react-native";
import DineroModal from "../../components/DineroModal";
import TransactionItem from "../../components/TransactionItem";
import { DineroContext } from "../../context/GlobalState";
import { COLORS, GlobalStyles } from "../../styles/globalStyles";

export default function TransactionScreen() {
  const [transactions, setTransactions] = useContext(DineroContext);
  const [deleteModal, setDeleteModal] = useState({ visible: false, id: null });

  const setAsyncStorage = async (data) => {
    try {
      await AsyncStorage.setItem("@dinero:transactions", JSON.stringify(data));
    } catch (error) {
      console.log("Error saving data to AsyncStorage:", error);
    }
  };

  const handleDeleteTransaction = async () => {
    const updatedTransactions = transactions.filter(
      (t) => t.id !== deleteModal.id,
    );
    setTransactions(updatedTransactions);
    await setAsyncStorage(updatedTransactions);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.screenBg }}>
      <FlatList
        contentContainerStyle={[
          GlobalStyles.contentContainer,
          { paddingBottom: 100 },
        ]}
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TransactionItem
            category={item.category}
            date={item.date}
            description={item.description}
            value={item.value}
            onDelete={() => setDeleteModal({ visible: true, id: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={{ flex: 1, justifyContent: "center" }}>
            <View
              style={[
                GlobalStyles.duoContainer,
                { padding: 30, alignItems: "center", marginTop: 20 },
              ]}
            >
              <MaterialIcons name="inbox" size={60} color={COLORS.textLight} />
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
          </View>
        }
      />

      <DineroModal
        visible={deleteModal.visible}
        onClose={() => setDeleteModal({ visible: false, id: null })}
        onConfirm={handleDeleteTransaction}
        title="Excluir Transação"
        message="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        type="warning"
      />
    </View>
  );
}
