module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  
  collectCoverageFrom: [
    "app/api/**/*.js",
    "!app/api/auth/[...nextauth]/route.js"
  ],

  collectCoverage: true, 
};
