import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import GlobalState from "../context/GlobalState";

export default function RootLayout() {
  return (
    <GlobalState>
      <StatusBar style="light" backgroundColor="#252525" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="+not-found"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
    </GlobalState>
  );
}
