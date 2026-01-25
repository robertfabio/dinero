import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "react-native-screens";
import ErrorBoundary from "../components/errors/ErrorBoundary";
import AuthProvider from "../context/AuthContext";
import GlobalState from "../context/GlobalState";
import { LanguageProvider } from "../context/LanguageContext";
import "../lib/i18n"; // Initialize i18n

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <GlobalState>
            <StatusBar style="light" backgroundColor="#252525" />
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="settings"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="+not-found"
                options={{ presentation: "modal", title: "Página não encontrada" }}
              />
            </Stack>
          </GlobalState>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
