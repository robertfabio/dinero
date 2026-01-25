// components/TestErrorButton.jsx
// Temporary component to test Error Boundary (remove in production)
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function TestErrorButton() {
  const throwError = () => {
    throw new Error(
      "Teste de Error Boundary - Erro simulado para desenvolvimento",
    );
  };

  // Only show in development
  if (!__DEV__) return null;

  return (
    <TouchableOpacity style={styles.button} onPress={throwError}>
      <Text style={styles.text}>🚨 Testar Error Boundary</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    margin: 16,
    alignSelf: "center",
  },
  text: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
  },
});
