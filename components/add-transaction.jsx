import { useContext, useRef, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { categories } from "../constants/categories";
import { DineroContext } from "../context/GlobalState";
import { GlobalStyles, THEME } from "../styles/globalStyles";
import { storageUtils } from "../utils/storage";
import DineroButton from "./DineroButton";
import DineroDatePicker from "./DineroDatePicker";
import DineroInput from "./DineroInput";
import DineroPicker from "./DineroPicker";

const initialFormState = {
  description: "",
  value: 0,
  date: new Date().toLocaleDateString("pt-BR"),
  category: "income",
};

export default function AddTransactionScreen({ onSuccess, modal = false }) {
  const [form, setForm] = useState(initialFormState);
  const [transactions, setTransactions] = useContext(DineroContext);
  const valueInputRef = useRef();

  const setASyncStorage = (data) => {
    try {
      storageUtils.setItem("@dinero:transactions", JSON.stringify(data));
    } catch (error) {
      console.log("Error saving data to storage:", error);
    }
  };

  const handleCurrencyChange = (text) => {
    const formattedValue = text.replace(/\D/g, "");
    const numericValue = formattedValue ? parseFloat(formattedValue) / 100 : 0;
    setForm({ ...form, value: numericValue });
  };

  const AddTransaction = async () => {
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
    console.log("Transaction added:", newTransaction);
    setTransactions(updatedTransactions);
    setForm(initialFormState);
    setASyncStorage(updatedTransactions);
    Alert.alert("Sucesso", "Transação adicionada com sucesso!");
    onSuccess?.();
  };

  if (modal) {
    return (
      <View style={modalStyles.modalInner}>
        <View style={GlobalStyles.Content}>
          <View>
            <View style={GlobalStyles.Divider}>
              <DineroInput
                label={"Descrição da transação"}
                value={form.description}
                returnKeyType="next"
                onSubmitEditing={() => valueInputRef.current.focus()}
                placeholder="Descrição"
                onChangeText={(text) => setForm({ ...form, description: text })}
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
                onSelect={(item) => setForm({ ...form, category: item.value })}
                placeholder="Selecione uma categoria"
              />
            </View>
            <View style={{ marginTop: 4 }}>
              <DineroButton
                useParticles={true}
                initialFaceColor={THEME.text}
                initialShadowColor="#9E9E9E"
                initialTextColor={THEME.background}
                title={"Salvar Transação"}
                onPress={AddTransaction}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={[GlobalStyles.contentContainer, { padding: 14 }]}>
      <ScrollView contentContainerStyle={GlobalStyles.Content}>
        <View>
          <View style={GlobalStyles.Divider}>
            <DineroInput
              label={"Descrição da transação"}
              value={form.description}
              returnKeyType="next"
              onSubmitEditing={() => valueInputRef.current.focus()}
              placeholder="Descrição"
              onChangeText={(text) => setForm({ ...form, description: text })}
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
              onSelect={(item) => setForm({ ...form, category: item.value })}
              placeholder="Selecione uma categoria"
            />
          </View>
          <View style={{ marginTop: 40 }}>
            <DineroButton
              useParticles={true}
              initialFaceColor={THEME.text}
              initialShadowColor="#9E9E9E"
              initialTextColor={THEME.background}
              title={"Salvar Transação"}
              onPress={AddTransaction}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const modalStyles = StyleSheet.create({
  modalInner: {
    padding: 16,
    maxHeight: "80%",
  },
});
