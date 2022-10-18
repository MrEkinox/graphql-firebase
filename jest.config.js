/* eslint-disable */
module.exports = {
  testMatch: ["**/*.test.ts"],
  testTimeout: 60000,
  testEnvironment: "node",
  preset: "ts-jest",
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/", "/generated/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
      "uuid": require.resolve('uuid'),
  },
};
