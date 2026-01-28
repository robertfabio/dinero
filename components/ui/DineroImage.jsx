import { Image, StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const DineroImage = ({ source, style, resizeMode = "cover", ...props }) => {
  return (
    <Animated.View style={[style, { overflow: "hidden" }]} entering={FadeIn}>
      <Image
        source={typeof source === "string" ? { uri: source } : source}
        style={StyleSheet.absoluteFillObject}
        resizeMode={resizeMode}
        {...props}
      />
    </Animated.View>
  );
};

export default DineroImage;
