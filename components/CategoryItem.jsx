import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, View } from "react-native";
import { categories } from "../constants/categories";

export default function CategoryItem({ category }) {
  return (
    <View style={styles({ category }).background}>
      <MaterialIcons
        name={categories[category].icon}
        size={24}
        color="#252525"
      />
    </View>
  );
}

const styles = ({ category }) =>
  StyleSheet.create({
    background: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: categories[category].background,
    },
  });
