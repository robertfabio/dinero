import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useRef, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DineroButton from "../../components/DineroButton";
import DineroDatePicker from "../../components/DineroDatePicker";
import DineroInput from "../../components/DineroInput";
import DineroPicker from "../../components/DineroPicker";
import { categories } from "../../constants/categories";
import { DineroContext } from "../../context/GlobalState";
import { GlobalStyles, THEME } from "../../styles/globalStyles";

const initialFormState = {
  description: "",
  value: 0,
  date: new Date().toLocaleDateString("pt-BR"),
  category: "income",
};

export default function AddTransactionScreen() {
  const [form, setForm] = useState(initialFormState);
  const [transactions, setTransactions] = useContext(DineroContext);
  const valueInputRef = useRef();

  const setASyncStorage = async (data) => {
    try {
      await AsyncStorage.setItem("@dinero:transactions", JSON.stringify(data));
    } catch (error) {
      console.log("Error saving data to AsyncStorage:", error);
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

    const newTransaction = { id: transactions.length + 1, ...form };
    const updatedTransactions = [...transactions, newTransaction];
    console.log("Transaction added:", newTransaction);
    setTransactions(updatedTransactions);
    setForm(initialFormState);
    await setASyncStorage(updatedTransactions);
    Alert.alert("Sucesso", "Transação adicionada com sucesso!");
  };

  return (
    <SafeAreaView style={[GlobalStyles.ScreenContainer, { padding: 14 }]}>
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
            {/*<View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                value={form.date}
                placeholder="Data (DD/MM/AAAA)"
                editable={false}
                style={[GlobalStyles.Input, { flex: 1 }]}
                placeholderTextColor={THEME.textSecondary}
                onFocus={showDatePicker}
              />
              <Pressable
                onPress={showDatePicker}
                style={{
                  borderRadius: 8,
                  borderColor: THEME.text,
                  borderWidth: 1,
                  marginLeft: 8,
                  padding: 3,
                }}
              >
                <EvilIcons name="calendar" size={38} color={THEME.text} />
              </Pressable>
            </View>
            <DateTimePicker
              isVisible={isDatePickerVisible}
              mode="date"
              date={form.dateObject ? new Date(form.dateObject) : new Date()}
              onConfirm={handleConfirmDate}
              onCancel={hideDatePicker}
            />}
            {/*<TextInput
              value={form.category}
              placeholder="Despesa"
              style={GlobalStyles.Input}
              placeholderTextColor={THEME.textSecondary}
              onChangeText={(text) => setForm({ ...form, category: text })}
            />
          </View>*/}
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
