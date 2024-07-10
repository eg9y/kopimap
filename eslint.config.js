import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginTypescript from "@typescript-eslint/eslint-plugin";
import parserTypescript from "@typescript-eslint/parser";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";

export default [
  ...pluginQuery.configs["flat/recommended"],
  {
    files: ["./src/**/*.{ts,tsx}"],
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "src/components/ui/**",
      "src/components/catalyst/**",
    ],
    languageOptions: {
      parser: parserTypescript,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": pluginTypescript,
      "react-hooks": pluginReactHooks,
      "react-refresh": pluginReactRefresh,
    },
    rules: {
      ...pluginTypescript.configs["recommended"].rules,
      ...pluginReactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-explicit-any": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];