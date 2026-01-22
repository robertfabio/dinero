import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

const DEFAULT_CONFIG = {
  count: 8,
  duration: 800,
  scatterX: 100,
  scatterY: 200,
};

const MoneyParticle = ({ onComplete, config, duration }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: duration,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start(({ finished }) => {
      if (finished) onComplete?.();
    });
  }, [anim, duration, onComplete]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, config.y],
  });

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, config.x],
  });

  const opacity = anim.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [1, 1, 0],
  });

  const rotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", `${config.rotate}deg`],
  });

  const scale = anim.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, config.scale, config.scale * 0.8],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.particle,
        {
          opacity,
          transform: [{ translateX }, { translateY }, { rotate }, { scale }],
        },
      ]}
    >
      <Text style={styles.moneyText}>💵💵💵</Text>
    </Animated.View>
  );
};

const MoneyExplosion = forwardRef(
  (
    {
      count = DEFAULT_CONFIG.count,
      duration = DEFAULT_CONFIG.duration,
      scatterX = DEFAULT_CONFIG.scatterX,
      scatterY = DEFAULT_CONFIG.scatterY,
    },
    ref,
  ) => {
    const [particles, setParticles] = useState([]);

    useImperativeHandle(ref, () => ({
      trigger() {
        const newParticles = Array.from({ length: count }).map(() => ({
          id: Date.now() + Math.random(),
        }));
        setParticles((prev) => [...prev, ...newParticles]);
      },
    }));

    const removeParticle = (id) => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    };

    return (
      <View style={styles.wrapper} pointerEvents="none">
        {particles.map((p) => (
          <View key={p.id} style={styles.particleOrigin}>
            <MoneyParticle
              onComplete={() => removeParticle(p.id)}
              duration={duration}
              config={{
                x: (Math.random() - 0.5) * scatterX,
                y: -Math.random() * scatterY - 50,
                rotate: (Math.random() - 0.5) * 360,
                scale: 0.5 + Math.random(),
              }}
            />
          </View>
        ))}
      </View>
    );
  },
);

MoneyExplosion.displayName = "MoneyExplosion";

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  particleOrigin: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 0,
  },
  particle: {
    position: "absolute",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  moneyText: {
    fontSize: 24,
  },
});

export default MoneyExplosion;
