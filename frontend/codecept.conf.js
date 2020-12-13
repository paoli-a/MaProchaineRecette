const { setHeadlessWhen } = require("@codeceptjs/configure");

setHeadlessWhen(process.env.CI);

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
    REST: {
      endpoint: "http://localhost:3501/api/",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
    ApiDataFactory: {
      endpoint: "http://localhost:3501/api/",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      factories: {
        catalogIngredient: {
          uri: "/catalogs/ingredients/",
          factory: "./end_to_end/factories/catalogIngredient",
          delete: { delete: "/catalogs/ingredients/{id}/" },
          fetchId: (data) => data.name,
        },
      },
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
