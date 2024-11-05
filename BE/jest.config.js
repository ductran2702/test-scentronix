// jest.config.js
export default {
  preset: "ts-jest/presets/default-esm", // Use the ESM preset
  testEnvironment: "node", // Set the test environment to Node.js
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }],
  },
  moduleNameMapper: {
    // Add any module name mappings here if needed
  },
  extensionsToTreatAsEsm: [".ts"], // Treat .ts files as ESM
  globals: {
    "ts-jest": {
      useESM: true, // Enable ESM support in ts-jest
    },
  },
  setupFiles: ["<rootDir>/jest.setup.js"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  testPathIgnorePatterns: ["/node_modules/"], // Ignore node_modules when searching for tests
  moduleDirectories: ["./node_modules"], // Module directories
};
