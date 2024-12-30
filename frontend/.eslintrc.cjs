module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "airbnb",
    "airbnb-typescript",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  plugins: ["react-refresh", "jsx-a11y"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    // Allow .tsx files to contain jsx, not just .jsx
    "react/jsx-filename-extension": [1, { extensions: [".jsx", ".tsx"] }],
    // In react 18 we don't need to import react to use jsx
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
  },
};
