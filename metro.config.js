// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add support for Skia and other native modules
config.resolver.assetExts.push(
  // Fonts
  "ttf",
  "otf",
  "woff",
  "woff2",
  // Images
  "svg",
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
);

// Support for react-native-skia
config.resolver.platforms = ["native", "android", "ios", "web"];

module.exports = withNativeWind(config, { input: "./global.css" });
