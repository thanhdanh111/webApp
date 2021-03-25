module.exports = {
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js"],
  testPathIgnorePatterns: ["./.next/", "./node_modules/"],
  testTimeout: 120000,
  maxWorkers: 3,
  testRegex: ".test.ts$",
  // testMatch: ["**/__tests__/*.(ts|tsx)"],
  setupFilesAfterEnv: ["./jest.setup.js"],
  //   "ts-jest": {
  //     tsConfig: "tsconfig.jest.json"
  //   }
  // },
};
