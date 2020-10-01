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
    ApiDataFactory: {
      endpoint: "http://localhost:3501/api/",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      factories: {
        catalogRecipe: {
          uri: "/catalogs/recipes/",
          factory: "./end_to_end/factories/catalogRecipe",
        },
        catalogIngredient: {
          uri: "/catalogs/ingredients/",
          factory: "./end_to_end/factories/catalogIngredient",
        },
        catalogCategory: {
          uri: "/catalogs/categories/",
          factory: "./end_to_end/factories/catalogCategory",
        },
        unit: {
          uri: "/units/units/",
          factory: "./end_to_end/factories/unit",
        },
        unitType: {
          uri: "/units/types/",
          factory: "./end_to_end/factories/unitType",
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
