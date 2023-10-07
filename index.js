const { main } = require("./src/index.js");

exports.handler = async () => {
  await main();
};
