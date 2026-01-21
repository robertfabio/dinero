import { Tabs } from "expo-router";
import React from "react";
import DineroTabBar from "../../components/DineroTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <DineroTabBar {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#252525",
        },
        headerTitleAlign: "center",
        headerTintColor: "#FFFFFF",
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Transações" }} />
      <Tabs.Screen
        name="add-transaction"
        options={{ title: "Adicionar Transação" }}
      />
      <Tabs.Screen name="summary" options={{ title: "Resumo" }} />
    </Tabs>
  );
}
