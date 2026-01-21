import { useContext } from "react";
import { View } from "react-native";
import TransactionItem from "../../components/TransactionItem";
import { DineroContext } from "../../context/GlobalState";

export default function TransactionScreen() {
  const [transactions] = useContext(DineroContext);
  return (
    <View>
      {/*<Text>{transactions[1]?.description}</Text>    */}
      <TransactionItem />
    </View>
  );
}
