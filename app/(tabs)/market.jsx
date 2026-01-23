import * as LucideIcons from "lucide-react-native";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Linking,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DineroButton from "../../components/DineroButton";
import { useMarketDeals } from "../../hooks/useMarketDeals";
import { COLORS, GlobalStyles } from "../../styles/globalStyles";

const DealCard = ({ item, isInWishlist, onToggleWishlist, onOpen }) => {
  const saved = isInWishlist(item.id);

  return (
    <View style={[GlobalStyles.duoContainer, styles.dealCard]}>
      <View style={styles.dealHeader}>
        <Text style={styles.dealEmoji}>{item.image}</Text>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-{item.discount}%</Text>
        </View>
      </View>

      <Text style={styles.dealTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.dealDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.priceContainer}>
        <Text style={styles.originalPrice}>
          R$ {item.originalPrice?.toFixed(2)}
        </Text>
        <Text style={styles.currentPrice}>R$ {item.price?.toFixed(2)}</Text>
      </View>

      <View style={styles.dealActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.buyButton]}
          onPress={() => onOpen(item.affiliateUrl)}
        >
          <LucideIcons.ExternalLink size={16} color="#fff" strokeWidth={2.5} />
          <Text style={styles.actionButtonText}>Ver Oferta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            saved ? styles.savedButton : styles.saveButton,
          ]}
          onPress={() => onToggleWishlist(item)}
        >
          <LucideIcons.Heart
            size={16}
            color={saved ? "#fff" : COLORS.danger}
            strokeWidth={2.5}
            fill={saved ? "#fff" : "transparent"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const WishlistItem = ({ item, onRemove, onOpen }) => {
  const isCustom = item.isCustom;

  return (
    <View style={[GlobalStyles.duoContainer, styles.wishlistItem]}>
      <View style={styles.wishlistItemContent}>
        <View style={styles.wishlistIcon}>
          {isCustom ? (
            <LucideIcons.Link
              size={20}
              color={COLORS.primary}
              strokeWidth={2}
            />
          ) : (
            <Text style={{ fontSize: 20 }}>{item.image || "🎁"}</Text>
          )}
        </View>
        <View style={styles.wishlistInfo}>
          <Text style={styles.wishlistTitle} numberOfLines={1}>
            {item.title}
          </Text>
          {item.description && (
            <Text style={styles.wishlistDesc} numberOfLines={1}>
              {item.description}
            </Text>
          )}
          {item.price && (
            <Text style={styles.wishlistPrice}>
              R$ {item.price?.toFixed(2)}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.wishlistActions}>
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={() => onOpen(item.affiliateUrl || item.url)}
        >
          <LucideIcons.ExternalLink
            size={18}
            color={COLORS.primary}
            strokeWidth={2}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={() => onRemove(item.id)}
        >
          <LucideIcons.Trash2 size={18} color={COLORS.danger} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function Market() {
  const {
    deals,
    wishlist,
    customLinks,
    loading,
    addToWishlist,
    removeFromWishlist,
    addCustomLink,
    isInWishlist,
  } = useMarketDeals();

  const [activeTab, setActiveTab] = useState("deals");
  const [addLinkModal, setAddLinkModal] = useState(false);
  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    description: "",
  });

  const openLink = useCallback(async (url) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Erro", "Não foi possível abrir este link");
      }
    } catch (error) {
      console.warn("Erro ao abrir link:", error);
    }
  }, []);

  const toggleWishlist = useCallback(
    (item) => {
      if (isInWishlist(item.id)) {
        removeFromWishlist(item.id);
      } else {
        addToWishlist(item);
      }
    },
    [isInWishlist, addToWishlist, removeFromWishlist],
  );

  const handleAddCustomLink = useCallback(() => {
    if (!newLink.title.trim() || !newLink.url.trim()) {
      Alert.alert("Erro", "Preencha o título e o link");
      return;
    }

    let url = newLink.url.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    addCustomLink(newLink.title.trim(), url, newLink.description.trim());
    setNewLink({ title: "", url: "", description: "" });
    setAddLinkModal(false);
  }, [newLink, addCustomLink]);

  const renderDealItem = useCallback(
    ({ item }) => (
      <DealCard
        item={item}
        isInWishlist={isInWishlist}
        onToggleWishlist={toggleWishlist}
        onOpen={openLink}
      />
    ),
    [isInWishlist, toggleWishlist, openLink],
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "deals" && styles.tabActive]}
          onPress={() => setActiveTab("deals")}
        >
          <LucideIcons.Sparkles
            size={18}
            color={activeTab === "deals" ? COLORS.primary : COLORS.textLight}
            strokeWidth={2}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "deals" && styles.tabTextActive,
            ]}
          >
            Ofertas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "wishlist" && styles.tabActive]}
          onPress={() => setActiveTab("wishlist")}
        >
          <LucideIcons.Heart
            size={18}
            color={activeTab === "wishlist" ? COLORS.danger : COLORS.textLight}
            strokeWidth={2}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "wishlist" && styles.tabTextActive,
            ]}
          >
            Lista de Desejos
          </Text>
          {wishlist.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{wishlist.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {activeTab === "deals" ? (
        <FlatList
          data={deals}
          keyExtractor={(item) => item.id}
          renderItem={renderDealItem}
          numColumns={2}
          columnWrapperStyle={styles.dealsRow}
          contentContainerStyle={styles.dealsContainer}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.dealsHeader}>
              <Text style={styles.headerTitle}>🔥 Ofertas Especiais</Text>
              <Text style={styles.headerSubtitle}>
                Produtos selecionados para você economizar
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <LucideIcons.PackageOpen
                size={48}
                color={COLORS.textLight}
                strokeWidth={1.5}
              />
              <Text style={styles.emptyText}>Nenhuma oferta disponível</Text>
            </View>
          }
        />
      ) : (
        <ScrollView
          style={styles.wishlistScrollView}
          contentContainerStyle={styles.wishlistContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Botão para adicionar link customizado */}
          <TouchableOpacity
            style={[GlobalStyles.duoContainer, styles.addLinkButton]}
            onPress={() => setAddLinkModal(true)}
          >
            <LucideIcons.Plus
              size={24}
              color={COLORS.primary}
              strokeWidth={2.5}
            />
            <View style={styles.addLinkText}>
              <Text style={styles.addLinkTitle}>Adicionar Link</Text>
              <Text style={styles.addLinkSubtitle}>
                Salve produtos de qualquer site
              </Text>
            </View>
          </TouchableOpacity>

          {/* Links customizados do usuário */}
          {customLinks.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <LucideIcons.Link
                  size={14}
                  color={COLORS.textLight}
                  strokeWidth={2}
                />
                <Text style={styles.sectionTitle}>Meus Links</Text>
              </View>
              {customLinks.map((item) => (
                <WishlistItem
                  key={item.id}
                  item={item}
                  onRemove={removeFromWishlist}
                  onOpen={openLink}
                />
              ))}
            </View>
          )}

          {/* Deals salvos */}
          {wishlist.filter((i) => !i.isCustom).length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <LucideIcons.Sparkles
                  size={14}
                  color={COLORS.textLight}
                  strokeWidth={2}
                />
                <Text style={styles.sectionTitle}>Ofertas Salvas</Text>
              </View>
              {wishlist
                .filter((i) => !i.isCustom)
                .map((item) => (
                  <WishlistItem
                    key={item.id}
                    item={item}
                    onRemove={removeFromWishlist}
                    onOpen={openLink}
                  />
                ))}
            </View>
          )}

          {wishlist.length === 0 && (
            <View style={styles.emptyContainer}>
              <LucideIcons.Heart
                size={48}
                color={COLORS.textLight}
                strokeWidth={1.5}
              />
              <Text style={styles.emptyText}>Sua lista está vazia</Text>
              <Text style={styles.emptySubtext}>
                Salve ofertas ou adicione seus próprios links
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Modal para adicionar link */}
      <Modal
        visible={addLinkModal}
        animationType="slide"
        transparent
        onRequestClose={() => setAddLinkModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setAddLinkModal(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adicionar Link</Text>
              <TouchableOpacity onPress={() => setAddLinkModal(false)}>
                <LucideIcons.X size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <LucideIcons.Type size={18} color={COLORS.textLight} />
              <TextInput
                style={styles.input}
                placeholder="Nome do produto"
                placeholderTextColor={COLORS.textLight}
                value={newLink.title}
                onChangeText={(text) =>
                  setNewLink((prev) => ({ ...prev, title: text }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <LucideIcons.Link size={18} color={COLORS.textLight} />
              <TextInput
                style={styles.input}
                placeholder="Cole o link aqui"
                placeholderTextColor={COLORS.textLight}
                value={newLink.url}
                onChangeText={(text) =>
                  setNewLink((prev) => ({ ...prev, url: text }))
                }
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>

            <View style={styles.inputContainer}>
              <LucideIcons.FileText size={18} color={COLORS.textLight} />
              <TextInput
                style={styles.input}
                placeholder="Descrição (opcional)"
                placeholderTextColor={COLORS.textLight}
                value={newLink.description}
                onChangeText={(text) =>
                  setNewLink((prev) => ({ ...prev, description: text }))
                }
              />
            </View>

            <View style={{ marginTop: 16 }}>
              <DineroButton
                title="Salvar na Lista"
                onPress={handleAddCustomLink}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.screenBg,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: COLORS.neutral,
    gap: 8,
  },
  tabActive: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(28, 176, 246, 0.1)",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textLight,
  },
  tabTextActive: {
    color: COLORS.text,
  },
  badge: {
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },
  dealsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  dealsRow: {
    gap: 12,
    marginBottom: 12,
  },
  dealsHeader: {
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  dealCard: {
    flex: 1,
    padding: 12,
  },
  dealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  dealEmoji: {
    fontSize: 32,
  },
  discountBadge: {
    backgroundColor: COLORS.danger,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
  },
  dealTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },
  dealDescription: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 8,
    lineHeight: 16,
  },
  priceContainer: {
    marginBottom: 12,
  },
  originalPrice: {
    fontSize: 12,
    color: COLORS.textLight,
    textDecorationLine: "line-through",
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.secondary,
  },
  dealActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  buyButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  saveButton: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.danger,
  },
  savedButton: {
    backgroundColor: COLORS.danger,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  wishlistScrollView: {
    flex: 1,
  },
  wishlistContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  addLinkButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  addLinkText: {
    flex: 1,
  },
  addLinkTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },
  addLinkSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  wishlistItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 10,
  },
  wishlistItemContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  wishlistIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(28, 176, 246, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  wishlistInfo: {
    flex: 1,
  },
  wishlistTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },
  wishlistDesc: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  wishlistPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.secondary,
    marginTop: 2,
  },
  wishlistActions: {
    flexDirection: "row",
    gap: 8,
  },
  wishlistButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.screenBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.neutral,
    paddingHorizontal: 14,
    marginBottom: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.text,
  },
});
