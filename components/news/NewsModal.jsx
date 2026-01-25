import { LinearGradient } from "expo-linear-gradient";
import { Clock, ExternalLink, Newspaper, Share, X } from "lucide-react-native";
import { useCallback, useState } from "react";
import {
    Alert,
    Linking,
    Modal,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { WebView } from "react-native-webview";
import { COLORS } from "../../styles/globalStyles";

export default function NewsModal({ visible, onClose, article }) {
  const [webViewLoading, setWebViewLoading] = useState(true);

  const handleShare = useCallback(async () => {
    try {
      if (article.link) {
        await Share.share({
          message: `${article.title}\n\n${article.link}`,
          url: article.link,
          title: article.title,
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  }, [article]);

  const handleOpenExternal = useCallback(async () => {
    try {
      if (article.link) {
        const supported = await Linking.canOpenURL(article.link);
        if (supported) {
          await Linking.openURL(article.link);
        } else {
          Alert.alert("Erro", "Não foi possível abrir o link");
        }
      }
    } catch (_error) {
      Alert.alert("Erro", "Falha ao abrir o link externo");
    }
  }, [article]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffHours < 1) return "Agora mesmo";
      if (diffHours < 24) return `${diffHours}h atrás`;
      if (diffDays < 7) return `${diffDays}d atrás`;

      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "Data não disponível";
    }
  };

  if (!article) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <LinearGradient
        colors={[COLORS.primary, "#1B9AE4"]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="white" strokeWidth={2.5} />
          </TouchableOpacity>

          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <Share size={20} color="white" strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleOpenExternal}
              style={styles.actionButton}
            >
              <ExternalLink size={20} color="white" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.headerContent}>
          <View style={styles.sourceBadge}>
            <Newspaper size={12} color={COLORS.primary} strokeWidth={2.5} />
            <Text style={styles.sourceText}>{article.source || "NOTÍCIA"}</Text>
          </View>

          <Text style={styles.title} numberOfLines={3}>
            {article.title}
          </Text>

          {article.description && (
            <Text style={styles.description} numberOfLines={2}>
              {article.description}
            </Text>
          )}

          <View style={styles.metadata}>
            <Clock size={14} color="rgba(255,255,255,0.8)" strokeWidth={2} />
            <Text style={styles.dateText}>{formatDate(article.pubDate)}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.webViewContainer}>
        {webViewLoading && (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingSpinner} />
            <Text style={styles.loadingText}>Carregando notícia...</Text>
          </View>
        )}

        <WebView
          source={{ uri: article.link }}
          style={styles.webView}
          onLoadStart={() => setWebViewLoading(true)}
          onLoadEnd={() => setWebViewLoading(false)}
          onError={() => {
            setWebViewLoading(false);
          }}
          startInLoadingState
          scalesPageToFit
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    gap: 8,
  },
  sourceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  sourceText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.primary,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "white",
    lineHeight: 30,
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(255,255,255,0.9)",
    lineHeight: 22,
    marginTop: 4,
  },
  metadata: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingSpinner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: COLORS.neutral,
    borderTopColor: COLORS.primary,
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textLight,
  },
});
