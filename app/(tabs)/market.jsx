import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../../styles/globalStyles";
import { storage } from "../../utils/storage";

const STORAGE_KEY = "savedRecommendations_v1";

const SAMPLE_RECS = [
  {
    id: "1",
    title: "High-yield savings account",
    description: "Earn more interest than a regular savings account.",
    url: "https://example.com/high-yield-savings",
  },
  {
    id: "2",
    title: "Low-cost index fund",
    description: "Diversified broad-market exposure with low fees.",
    url: "https://example.com/index-fund",
  },
  {
    id: "3",
    title: "Round-up investing app",
    description: "Automatically invest spare change from purchases.",
    url: "https://example.com/round-up",
  },
];

export default function Market() {
  const [savedIds, setSavedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSaved();
  }, []);

  async function loadSaved() {
    try {
      const json = await storage.getItem(STORAGE_KEY);
      const parsed = json ? JSON.parse(json) : [];
      setSavedIds(parsed);
    } catch (e) {
      console.warn("Failed to load saved recommendations", e);
    } finally {
      setLoading(false);
    }
  }

  async function toggleSave(id) {
    try {
      const newSaved = savedIds.includes(id)
        ? savedIds.filter((s) => s !== id)
        : [...savedIds, id];
      setSavedIds(newSaved);
      await storage.setItem(STORAGE_KEY, JSON.stringify(newSaved));
    } catch (e) {
      console.warn("Failed to save recommendation", e);
    }
  }

  async function clearSaved() {
    try {
      await storage.removeItem(STORAGE_KEY);
      setSavedIds([]);
    } catch (e) {
      console.warn("Failed to clear saved recommendations", e);
    }
  }

  async function openLink(url) {
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert("Cannot open URL", url);
        return;
      }
      await Linking.openURL(url);
    } catch (e) {
      Alert.alert("Failed to open link");
      console.warn(e);
    }
  }

  function renderItem({ item }) {
    const saved = savedIds.includes(item.id);
    return (
      <View style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.desc}>{item.description}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => openLink(item.url)}
            style={[styles.btn, styles.buyBtn]}
          >
            <Text style={styles.btnText}>Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => toggleSave(item.id)}
            style={[styles.btn, saved ? styles.savedBtn : styles.saveBtn]}
          >
            <Text style={styles.btnText}>{saved ? "Saved" : "Save"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const savedItems = SAMPLE_RECS.filter((r) => savedIds.includes(r.id));

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recommendations</Text>
        <TouchableOpacity onPress={clearSaved} style={styles.clearBtn}>
          <Text style={styles.clearText}>Clear saved</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.savedSection}>
        <Text style={styles.sectionTitle}>Saved</Text>
        {savedItems.length === 0 ? (
          <Text style={styles.emptyText}>No saved recommendations yet.</Text>
        ) : (
          savedItems.map((s) => (
            <View key={s.id} style={styles.savedItem}>
              <Text style={styles.savedText}>{s.title}</Text>
            </View>
          ))
        )}
      </View>

      <FlatList
        data={SAMPLE_RECS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: "700", flex: 1 },
  clearBtn: { padding: 6 },
  clearText: { color: "#d00" },
  savedSection: {
    marginBottom: 12,
    borderRadius: 8,
    padding: 8,
    backgroundColor: "#f7f7f7",
  },
  sectionTitle: { fontWeight: "700", marginBottom: 6 },
  emptyText: { color: "#666" },
  savedItem: {
    paddingVertical: 4,
  },
  savedText: { color: "#333" },
  card: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  desc: { color: "#666" },
  actions: { justifyContent: "space-between", alignItems: "flex-end" },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 6,
  },
  buyBtn: { backgroundColor: "#0a84ff" },
  saveBtn: { backgroundColor: "#2d2d2d" },
  savedBtn: { backgroundColor: "#0fbf60" },
  btnText: { color: "#fff", fontWeight: "600" },
});
