module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.[t]s?$",
  modulePathIgnorePatterns: ["/__tests__/mock"]
};