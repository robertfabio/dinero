import { MaterialIcons } from "@expo/vector-icons";
import * as LucideIcons from "lucide-react-native";
import { useContext, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DineroButton from "../../components/DineroButton";
import DineroDatePicker from "../../components/DineroDatePicker";
import DineroInput from "../../components/DineroInput";
import DineroModal from "../../components/DineroModal";
import DineroPicker from "../../components/DineroPicker";
import TransactionItem from "../../components/TransactionItem";
import { categories } from "../../constants/categories";
import { DineroContext } from "../../context/GlobalState";
import { COLORS, GlobalStyles, THEME } from "../../styles/globalStyles";
import { storageUtils } from "../../utils/storage";

const initialFormState = {
  description: "",
  value: 0,
  date: new Date().toLocaleDateString("pt-BR"),
  category: "income",
};

export default function TransactionScreen() {
  const [transactions, setTransactions] = useContext(DineroContext);
  const [deleteModal, setDeleteModal] = useState({ visible: false, id: null });
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const valueInputRef = useRef();

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

  const handleCurrencyChange = (text) => {
    const formattedValue = text.replace(/\D/g, "");
    const numericValue = formattedValue ? parseFloat(formattedValue) / 100 : 0;
    setForm({ ...form, value: numericValue });
  };

  const addTransaction = async () => {
    const canSubmit = form.description?.trim()
      ? form.value && form.value > 0
        ? true
        : false
      : false;

    if (!canSubmit) {
      Alert.alert(
        "Erro",
        "Preencha a descrição e informe um valor maior que zero.",
      );
      return;
    }

    const newTransaction = { id: Date.now(), ...form };
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    setForm(initialFormState);
    setAsyncStorage(updatedTransactions);
    setAddModalVisible(false);
    Alert.alert("Sucesso", "Transação adicionada com sucesso!");
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
              onPress={() => {
                setAddModalVisible(false);
                setForm(initialFormState);
              }}
              style={styles.closeButton}
            >
              <LucideIcons.X size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <View>
              <View style={GlobalStyles.Divider}>
                <DineroInput
                  label="Descrição da transação"
                  value={form.description}
                  returnKeyType="next"
                  onSubmitEditing={() => valueInputRef.current?.focus()}
                  placeholder="Descrição"
                  onChangeText={(text) =>
                    setForm({ ...form, description: text })
                  }
                />
                <DineroInput
                  label="Valor da transação"
                  ref={valueInputRef}
                  value={form.value.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                  placeholder="Valor (R$)"
                  keyboardType="numeric"
                  placeholderTextColor={THEME.textSecondary}
                  onChangeText={handleCurrencyChange}
                />
                <DineroDatePicker
                  label="Data da transação"
                  value={form.date}
                  onChange={(date) => {
                    const formatted = `${String(date.getDate()).padStart(2, "0")}/${String(
                      date.getMonth() + 1,
                    ).padStart(2, "0")}/${date.getFullYear()}`;
                    setForm({
                      ...form,
                      date: formatted,
                      dateObject: date.toISOString(),
                    });
                  }}
                  placeholder="Selecione a data"
                />
                <DineroPicker
                  label="Categoria"
                  value={form.category}
                  options={Object.keys(categories).map((key) => ({
                    label: categories[key].displayName,
                    value: key,
                    icon: categories[key].icon,
                    background: categories[key].background,
                  }))}
                  onSelect={(item) =>
                    setForm({ ...form, category: item.value })
                  }
                  placeholder="Selecione uma categoria"
                />
              </View>
              <View style={{ marginTop: 40, marginBottom: 20 }}>
                <DineroButton
                  useParticles={true}
                  initialFaceColor={THEME.text}
                  initialShadowColor="#9E9E9E"
                  initialTextColor={THEME.background}
                  title="Salvar Transação"
                  onPress={addTransaction}
                />
              </View>
            </View>
          </ScrollView>
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
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    padding: 20,
    paddingBottom: 40,
  },
});
