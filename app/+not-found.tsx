import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Link href="/(tabs)/home" style={styles.link}>Ir para a Tela Inicial</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
