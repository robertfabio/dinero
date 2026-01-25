// Performance optimized Image component with react-native-fast-image
import { StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";

const DineroImage = ({
  source,
  style,
  resizeMode = FastImage.resizeMode.cover,
  fallback,
  priority = FastImage.priority.normal,
  ...props
}) => {
  return (
    <View style={style}>
      <FastImage
        source={
          typeof source === "string"
            ? {
                uri: source,
                priority,
                cache: FastImage.cacheControl.immutable,
              }
            : source
        }
        style={StyleSheet.absoluteFillObject}
        resizeMode={resizeMode}
        fallback={fallback}
        {...props}
      />
    </View>
  );
};

export default DineroImage;
