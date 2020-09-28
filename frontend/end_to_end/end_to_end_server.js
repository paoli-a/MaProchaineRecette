const execSync = require("child_process").execSync;

module.exports = {
  start: function () {
    execSync("node_modules/.bin/pm2 start pm2_backend.json", {
      encoding: "utf-8",
    });
    const output = execSync("node_modules/.bin/pm2 start pm2_frontend.json", {
      encoding: "utf-8",
    });
    console.log("Output was:\n", output);
  },

  stop: function () {
    execSync("node_modules/.bin/pm2 stop frontend", {
      encoding: "utf-8",
    });
    const output = execSync("node_modules/.bin/pm2 stop backend", {
      encoding: "utf-8",
    });
    console.log("Output was:\n", output);
  },
};
