import { MaterialIcons } from "@expo/vector-icons";
import * as LucideIcons from "lucide-react-native";
import { useContext, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AddTransactionScreen from "../../components/add-transaction";
import DineroModal from "../../components/DineroModal";
import TransactionItem from "../../components/TransactionItem";
import { DineroContext } from "../../context/GlobalState";
import { COLORS, GlobalStyles, THEME } from "../../styles/globalStyles";
import { storageUtils } from "../../utils/storage";

export default function TransactionScreen() {
  const [transactions, setTransactions] = useContext(DineroContext);
  const [deleteModal, setDeleteModal] = useState({ visible: false, id: null });
  const [addModalVisible, setAddModalVisible] = useState(false);

  const setAsyncStorage = (data) => {
    try {
      storageUtils.setItem("@dinero:transactions", JSON.stringify(data));
    } catch (error) {
      console.log("Error saving data to storage:", error);
    }
  };

  const handleDeleteTransaction = async () => {
    const updatedTransactions = transactions.filter(
      (t) => t.id !== deleteModal.id,
    );
    setTransactions(updatedTransactions);
    setAsyncStorage(updatedTransactions);
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

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setAddModalVisible(true)}
        activeOpacity={0.8}
      >
        <LucideIcons.Plus size={28} color={THEME.secondary} strokeWidth={3} />
      </TouchableOpacity>

      <Modal
        visible={addModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nova Transação</Text>
            <TouchableOpacity
              onPress={() => setAddModalVisible(false)}
              style={styles.closeButton}
            >
              <LucideIcons.X
                size={24}
                color={THEME.primary}
                strokeWidth={3}
              />
            </TouchableOpacity>
          </View>
          <AddTransactionScreen onSuccess={() => setAddModalVisible(false)} />
        </View>
      </Modal>

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

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: THEME.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
  },
  // Updated close button with 3D appearance
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: THEME.secondary,
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    // top highlight (subtle)
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.22)",
    // heavier bottom edge to simulate depth
    borderBottomWidth: 4,
    borderBottomColor: "rgba(0,0,0,0.28)",
    // cast shadow for raised look
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 6.27,
    elevation: 8,
    // slight upward shift so the shadow feels natural
    transform: [{ translateY: -2 }],
  },
});
