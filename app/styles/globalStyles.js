import { StyleSheet } from "react-native";

export const GlobalStyles = StyleSheet.create({
  ScreenContainer: {
    display: "flex",
    flex: 1,
  },
  Content: {
    gap: 12,
    paddingHorizontal: 20,
  },
  Input: {
    borderWidth: 1,
    borderColor: "#252525",
    borderRadius: 8,
    padding: 12,
    color: "#252525",
  },
  Divider: {
    marginBottom: 20,
  },
});
