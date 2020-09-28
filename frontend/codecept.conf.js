const { setHeadlessWhen } = require("@codeceptjs/configure");

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

var server = require("./end_to_end/end_to_end_server");

exports.config = {
  tests: "./end_to_end/*_test.js",
  output: "./end_to_end/output",
  helpers: {
    Playwright: {
      url: "http://localhost:3502",
      show: true,
      browser: "chromium",
    },
  },
  include: {
    I: "./steps_file.js",
  },
  bootstrap: server.start,
  teardown: server.stop,
  mocha: {},
  name: "frontend",
  plugins: {
    retryFailedStep: {
      enabled: true,
    },
    screenshotOnFail: {
      enabled: true,
    },
  },
};
