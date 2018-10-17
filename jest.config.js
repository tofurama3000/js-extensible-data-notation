module.exports = {
  coverageReporters: ["cobertura", "lcov"],
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js"
  ],
  transform: {
    "\\.(ts|tsx)$": "ts-jest"
  },
  testRegex: ".*\\.spec\\.(ts|tsx|js)$"
};
