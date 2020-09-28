const execSync = require("child_process").execSync;

module.exports = {
  start: function (done) {
    let output = execSync("pm2 start pm2_backend.json", {
      encoding: "utf-8",
    });
    console.log("Output was:\n", output);
    console.log("done", done);
    output = execSync("pm2 start pm2_frontend.json", {
      encoding: "utf-8",
    });
    console.log("Output was:\n", output);
    console.log("done", done);
  },

  stop: function (done) {
    let output = execSync("pm2 stop frontend", {
      encoding: "utf-8",
    });
    console.log("Output was:\n", output);
    console.log("done", done);
    output = execSync("pm2 stop backend", {
      encoding: "utf-8",
    });
    console.log("Output was:\n", output);
    console.log("done", done);
  },
};
