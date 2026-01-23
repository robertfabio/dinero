import { MaterialIcons } from "@expo/vector-icons";
import * as LucideIcons from "lucide-react-native";
import { useContext, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
        transparent={true}
        presentationStyle="overFullScreen"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setAddModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.centeredView} pointerEvents="box-none">
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova Transação</Text>
              <TouchableOpacity
                onPress={() => setAddModalVisible(false)}
                style={styles.closeButton}
              >
                <LucideIcons.X
                  size={24}
                  color={THEME.primary}
                  strokeWidth={4}
                />
              </TouchableOpacity>
            </View>
            <AddTransactionScreen
              onSuccess={() => setAddModalVisible(false)}
              modal
            />
          </View>
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
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  closeButton: {
    padding: 8,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  modalCard: {
    width: "100%",
    maxWidth: 720,
    maxHeight: "80%",
    borderRadius: 12,
    backgroundColor: COLORS.screenBg,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
});
