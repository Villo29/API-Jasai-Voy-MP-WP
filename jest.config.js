/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest", // Usa ts-jest para transpilar TypeScript a JavaScript
    testEnvironment: "node",
  testTimeout: 30000, // Ajusta el tiempo de espera según sea necesario
    moduleFileExtensions: ["ts", "js"],
  testMatch: ["**/*.test.ts"], // Indica que las pruebas deben estar en archivos .test.ts
    coveragePathIgnorePatterns: ["/node_modules/"],
};
