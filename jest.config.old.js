module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/__tests__/)",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
};
