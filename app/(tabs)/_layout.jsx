import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as LucideIcons from "lucide-react-native";
import React, { useState } from "react";
import { ActivityIndicator, Modal, Pressable, View } from "react-native";
import AuthScreen from "../../components/AuthScreen";
import DineroModal from "../../components/DineroModal";
import DineroTabBar from "../../components/DineroTabBar";
import SecuritySettings from "../../components/SecuritySettings";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../styles/globalStyles";
import { storageUtils } from "../../utils/storage";

export default function TabsLayout() {
  const [resetModal, setResetModal] = useState(false);
  const [securityModal, setSecurityModal] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  const handleResetAll = () => {
    try {
      storageUtils.removeItem("@dinero:transactions");
      if (global.location) {
        global.location.reload();
      }
    } catch (error) {
      console.error("Error resetting transactions:", error);
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.screenBg,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

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
        <Tabs.Screen name="home" options={{ headerShown: false }} />

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
        <Tabs.Screen
          name="index"
          options={{
            title: "Transações",
            headerRight: () => (
              <View style={{ flexDirection: "row", marginRight: 12 }}>
                <Pressable
                  onPress={() => setSecurityModal(true)}
                  style={{
                    padding: 8,
                    marginRight: 8,
                    borderRadius: 8,
                    backgroundColor: COLORS.screenBg,
                    borderWidth: 2,
                    borderColor: COLORS.neutral,
                  }}
                >
                  <LucideIcons.Shield
                    size={24}
                    color={COLORS.primary}
                    strokeWidth={2}
                  />
                </Pressable>
                <Pressable
                  onPress={() => setResetModal(true)}
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor: COLORS.screenBg,
                    borderWidth: 2,
                    borderColor: COLORS.neutral,
                  }}
                >
                  <MaterialIcons
                    name="refresh"
                    size={24}
                    color={COLORS.danger}
                  />
                </Pressable>
              </View>
            ),
          }}
        />
      </Tabs>

      <Modal
        visible={securityModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSecurityModal(false)}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingTop: 60,
              paddingBottom: 20,
              backgroundColor: COLORS.screenBg,
              borderBottomWidth: 1,
              borderBottomColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <Pressable
              onPress={() => setSecurityModal(false)}
              style={{ padding: 8 }}
            >
              <LucideIcons.X size={24} color={COLORS.text} />
            </Pressable>
          </View>
          <SecuritySettings />
        </View>
      </Modal>

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
