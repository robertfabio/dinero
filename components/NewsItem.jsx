import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";
import * as LucideIcons from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, GlobalStyles } from "../styles/globalStyles";

export default function NewsItem({ item }) {
  const handlePress = async () => {
    try {
      await WebBrowser.openBrowserAsync(item.link, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        controlsColor: COLORS.primary,
      });
    } catch (error) {
      console.error("Error opening browser:", error);
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
      <View style={styles.content}>
        {item.imageUrl && (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            contentFit="cover"
            placeholder={require("../assets/icon.jpg")}
            transition={200}
          />
        )}
        <View style={styles.textContainer}>
          <View style={styles.header}>
            <View style={styles.sourceBadge}>
              <LucideIcons.Newspaper
                size={12}
                color={COLORS.primary}
                strokeWidth={2}
              />
              <Text style={styles.sourceText}>{item.source}</Text>
            </View>
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          {item.description && (
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    padding: 0,
    overflow: "hidden",
  },
  pressed: {
    opacity: 0.7,
  },
  content: {
    flexDirection: "row",
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  textContainer: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  sourceBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "rgba(28, 176, 246, 0.1)",
    borderRadius: 6,
    gap: 4,
  },
  sourceText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.primary,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
    lineHeight: 18,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 16,
  },
});
