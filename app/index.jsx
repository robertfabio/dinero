import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import DineroButton from "../components/DineroButton";
import { THEME } from "../styles/globalStyles";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    title: "Seu dinheiro,\nsob controle",
    subtitle: "Organize receitas e despesas de forma simples.",
    image: require("../assets/welcome/image1.png"),
    bgColor: "#a7fca4",
  },
  {
    id: "2",
    title: "Entenda para\nonde vai seu $",
    subtitle: "Categorias que mostram seus hábitos financeiros.",
    image: require("../assets/welcome/image2.png"),
    bgColor: "#fbfd90",
  },
  {
    id: "3",
    title: "Conquiste suas\nmetas",
    subtitle: "Acompanhe o progresso em tempo real.",
    image: require("../assets/welcome/image3.png"),
    bgColor: "#f6fff5",
  },
];

const Slide = ({ item, index, x }) => {
  const animatedImageStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = interpolate(
      x.value,
      inputRange,
      [0.9, 1.1, 0.9],
      Extrapolation.CLAMP,
    );

    const rotate = interpolate(
      x.value,
      inputRange,
      [-8, 0, 8],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ scale }, { rotate: `${rotate}deg` }],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      x.value,
      [(index - 0.8) * width, index * width, (index + 0.8) * width],
      [0, 1, 0],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      x.value,
      [(index - 0.8) * width, index * width, (index + 0.8) * width],
      [30, 0, 30],
      Extrapolation.CLAMP,
    );
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const animatedBgStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      x.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.9, 1, 0.9],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ scale }],
    };
  });

  return (
    <View style={styles.slideContainer}>
      <Animated.View
        style={[
          styles.cartoonBg,
          animatedBgStyle,
          { backgroundColor: item.bgColor },
        ]}
      />

      <View style={styles.imageContainer}>
        <Animated.View style={[styles.imageWrapper, animatedImageStyle]}>
          <Image
            source={item.image}
            style={styles.image}
            contentFit="contain"
          />
        </Animated.View>
      </View>

      <Animated.View style={[styles.textContainer, animatedTextStyle]}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </Animated.View>
    </View>
  );
};

const Dot = ({ index, x }) => {
  const animatedDotStyle = useAnimatedStyle(() => {
    const widthVal = interpolate(
      x.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [12, 28, 12],
      Extrapolation.CLAMP,
    );

    const scale = interpolate(
      x.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [1, 1.2, 1],
      Extrapolation.CLAMP,
    );

    return {
      width: widthVal,
      transform: [{ scale }],
    };
  });

  return <Animated.View style={[styles.dot, animatedDotStyle]} />;
};

const Pagination = ({ data, x }) => {
  return (
    <View style={styles.paginationContainer}>
      {data.map((_, index) => (
        <Dot key={index} index={index} x={x} />
      ))}
    </View>
  );
};

const WelcomeScreen = () => {
  const router = useRouter();
  const x = useSharedValue(0);
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: (event) => {
        x.value = event.contentOffset.x;
        runOnJS(setCurrentIndex)(Math.round(event.contentOffset.x / width));
      },
    },
    [],
  );

  const handleNext = () => {
    const nextIndex = Math.round(x.value / width) + 1;
    if (nextIndex < SLIDES.length) {
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      router.replace("/(tabs)");
    }
  };

  const handleSkip = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Pular</Text>
        </TouchableOpacity>
      </View>

      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Slide item={item} index={index} x={x} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        decelerationRate="fast"
      />

      <View style={styles.footer}>
        <Pagination data={SLIDES} x={x} />
        <DineroButton
          title={currentIndex === SLIDES.length - 1 ? "Começar" : "Próximo"}
          onPress={handleNext}
          useParticles={true}
        />

        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            Ao continuar, você concorda com os{" "}
            <Text
              style={styles.termsLink}
              onPress={() =>
                Linking.openURL(
                  "https://robertfabio.github.io/privacy-policy-piloteseguro/",
                )
              }
            >
              Termos de Serviço
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: THEME.backgroundDark,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: THEME.border,
  },
  skipText: {
    color: THEME.textWhite,
    fontSize: 14,
    fontWeight: "800",
  },
  slideContainer: {
    width: width,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  cartoonBg: {
    position: "absolute",
    top: "15%",
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: width * 0.1,
    borderWidth: 4,
    borderColor: THEME.border,
    transform: [{ rotate: "-5deg" }],
  },
  imageContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 80,
  },
  imageWrapper: {
    width: width * 0.8,
    height: width * 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    top: -20,
  },
  textContainer: {
    flex: 0.5,
    width: "100%",
    paddingTop: 40,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 45,
    fontWeight: "900",
    color: THEME.text,
    lineHeight: 48,
    marginBottom: 16,
    letterSpacing: -1,
    textAlign: "center",
    textShadowColor: THEME.border,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  subtitle: {
    fontSize: 17,
    color: THEME.textSecondary,
    lineHeight: 26,
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  paginationContainer: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    gap: 10,
  },
  dot: {
    height: 12,
    borderRadius: 6,
    backgroundColor: THEME.backgroundDark,
    borderWidth: 3,
    borderColor: THEME.border,
  },
  termsContainer: {
    marginTop: 12,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  termsText: {
    color: THEME.primary,
    fontSize: 12,
    textAlign: "center",
  },
  termsLink: {
    color: THEME.primary,
    textDecorationLine: "underline",
    fontWeight: "600",
  },
});

export default WelcomeScreen;
