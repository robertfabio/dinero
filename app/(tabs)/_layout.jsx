import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Pressable } from "react-native";
import DineroModal from "../../components/DineroModal";
import DineroTabBar from "../../components/DineroTabBar";
import { COLORS } from "../../styles/globalStyles";

export default function TabsLayout() {
  const [resetModal, setResetModal] = useState(false);

  const handleResetAll = async () => {
    try {
      await AsyncStorage.removeItem("@dinero:transactions");
      if (global.location) {
        global.location.reload();
      }
    } catch (error) {
      console.error("Error resetting transactions:", error);
    }
  };

  return (
    <>
      <StatusBar style="dark" backgroundColor="#252525" />
      <Tabs
        tabBar={(props) => <DineroTabBar {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.background,
            borderBottomWidth: 2,
            borderBottomColor: COLORS.neutral,
          },
          headerTitleAlign: "left",
          headerTintColor: COLORS.text,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "900",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Transações",
            headerRight: () => (
              <Pressable
                onPress={() => setResetModal(true)}
                style={{
                  padding: 8,
                  marginRight: 12,
                  borderRadius: 8,
                  backgroundColor: COLORS.screenBg,
                  borderWidth: 2,
                  borderColor: COLORS.neutral,
                }}
              >
                <MaterialIcons name="refresh" size={24} color={COLORS.danger} />
              </Pressable>
            ),
          }}
        />
        <Tabs.Screen
          name="add-transaction"
          options={{ title: "Adicionar Transação" }}
        />
        <Tabs.Screen
          name="sumary"
          options={{
            title: "Resumo Financeiro",
          }}
        />
      </Tabs>

      <DineroModal
        visible={resetModal}
        onClose={() => setResetModal(false)}
        onConfirm={handleResetAll}
        title="Resetar Tudo"
        message="Tem certeza que deseja excluir TODAS as transações? Esta ação é irreversível e todos os dados serão perdidos."
        confirmText="Resetar Tudo"
        cancelText="Cancelar"
        type="warning"
      />
    </>
  );
}
