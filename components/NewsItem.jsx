import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";
import { ChevronRight, Newspaper } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, GlobalStyles } from "../styles/globalStyles";

export default function NewsItem({ item }) {
  const handlePress = async () => {
    try {
      if (item.link) {
        await WebBrowser.openBrowserAsync(item.link, {
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
          controlsColor: COLORS.primary,
          toolbarColor: COLORS.background,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        GlobalStyles.duoContainer,
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={
            item.imageUrl
              ? { uri: item.imageUrl }
              : require("../assets/images/teste.png")
          }
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <View style={styles.badge}>
            <Newspaper size={10} color={COLORS.primary} strokeWidth={2.5} />
            <Text style={styles.badgeText}>{item.source || "NOTÍCIA"}</Text>
          </View>
          <Text style={styles.dateText}>{item.pubDate || "Hoje"}</Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        {item.description && (
          <Text style={styles.description} numberOfLines={1}>
            {item.description}
          </Text>
        )}
      </View>

      <View style={styles.actionContainer}>
        <ChevronRight size={20} color={COLORS.neutralDark} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    flexDirection: "row",
    overflow: "hidden",
    marginBottom: 16,
    height: 110,
    backgroundColor: COLORS.background,
  },
  pressed: {
    backgroundColor: "#F5F5F5",
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    width: 100,
    height: "100%",
    borderRightWidth: 2,
    borderRightColor: COLORS.neutral,
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(28, 176, 246, 0.1)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.primary,
    textTransform: "uppercase",
  },
  dateText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textLight,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
    lineHeight: 20,
    marginTop: 4,
  },
  description: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textLight,
  },
  actionContainer: {
    width: 30,
    justifyContent: "center",
    alignItems: "center",
    borderLeftWidth: 2,
    borderLeftColor: COLORS.neutral,
    backgroundColor: "#FAFAFA",
  },
});
