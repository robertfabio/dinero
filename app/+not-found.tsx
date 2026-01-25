import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../styles/globalStyles';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <LinearGradient
        colors={[COLORS.primary, '#1B9AE4']}
        style={styles.header}
      >
        <View style={styles.iconContainer}>
          <LucideIcons.Search 
            size={80} 
            strokeWidth={1.5} 
            {...({ color: 'white' } as any)}
          />
        </View>
        <Text style={styles.title}>Página não encontrada</Text>
        <Text style={styles.subtitle}>
          Ops! A página que você está procurando não existe ou foi removida.
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>O que você pode fazer:</Text>
          
          <Link href="/(tabs)/home" asChild>
            <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
              <LucideIcons.Home 
                size={20} 
                strokeWidth={2.5} 
                {...({ color: 'white' } as any)}
              />
              <Text style={styles.primaryButtonText}>Ir para a Tela Inicial</Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/(tabs)/home');
              }
            }}
          >
            <LucideIcons.ArrowLeft 
              size={20} 
              strokeWidth={2.5} 
              {...({ color: COLORS.primary } as any)}
            />
            <Text style={styles.buttonText}>Voltar à página anterior</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Precisa de ajuda?</Text>
          <Text style={styles.helpText}>
            Se você continua enfrentando problemas, entre em contato com nosso suporte.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primary,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  helpSection: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
});
