#!/usr/bin/env node
// scripts/analyze-deps.js
// Analyze which dependencies are actually used in the codebase

const fs = require("fs");
const path = require("path");

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
const dependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};

console.log("📦 Analyzing dependencies usage...\n");

// Function to recursively find files
function findFiles(dir, extensions, result = []) {
  try {
    const items = fs.readdirSync(dir);

    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (
        stat.isDirectory() &&
        item !== "node_modules" &&
        item !== ".git" &&
        !item.startsWith(".")
      ) {
        findFiles(fullPath, extensions, result);
      } else if (
        stat.isFile() &&
        extensions.some((ext) => item.endsWith(ext))
      ) {
        result.push(fullPath);
      }
    });
  } catch (_e) {
    // Ignore directories we can't read
  }

  return result;
}

// Get all source files
const allFiles = findFiles(".", [".js", ".jsx", ".ts", ".tsx"]);

// Read all file contents
const allFileContents = allFiles
  .filter((file) => !file.includes("node_modules"))
  .map((file) => {
    try {
      return fs.readFileSync(file, "utf-8");
    } catch {
      return "";
    }
  })
  .join("\n");

const used = [];
const unused = [];

Object.keys(dependencies).forEach((dep) => {
  // Skip expo and react native core deps that are needed
  const corePackages = [
    "expo",
    "@expo/",
    "react",
    "react-dom",
    "react-native",
    "typescript",
    "@types/",
    "eslint",
    "metro",
  ];

  if (corePackages.some((core) => dep.includes(core))) {
    return;
  }

  // Check if dependency is imported anywhere
  const patterns = [
    `from "${dep}"`,
    `from '${dep}'`,
    `require("${dep}")`,
    `require('${dep}')`,
    `import "${dep}"`,
    `import '${dep}'`,
  ];

  const isUsed = patterns.some((pattern) => allFileContents.includes(pattern));

  // Also check for scoped packages
  if (dep.includes("/")) {
    const scopePattern = `from "${dep.split("/")[0]}`;
    const isUsedScope = allFileContents.includes(scopePattern);
    if (isUsed || isUsedScope) {
      used.push(dep);
    } else {
      unused.push(dep);
    }
  } else {
    if (isUsed) {
      used.push(dep);
    } else {
      unused.push(dep);
    }
  }
});

console.log("✅ Used dependencies:");
used.forEach((dep) => console.log(`  - ${dep}`));

console.log("\n❌ Potentially unused dependencies:");
unused.forEach((dep) => console.log(`  - ${dep}`));

console.log(`\n📊 Summary:`);
console.log(`  Total non-core dependencies: ${used.length + unused.length}`);
console.log(`  Used: ${used.length}`);
console.log(`  Potentially unused: ${unused.length}`);

if (unused.length > 0) {
  console.log("\n🚀 Consider reviewing these packages:");
  unused.forEach((dep) => console.log(`  npm uninstall ${dep}`));
}
