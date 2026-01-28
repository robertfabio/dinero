// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

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

// Fix Windows path resolution
config.resolver.resolverMainFields = ["expo", "browser", "main"];
config.resolver.enableGlobalPackages = true;

module.exports = config;
