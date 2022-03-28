/* eslint-disable @typescript-eslint/no-var-requires */
require("ts-node/register");
const { setHeadlessWhen } = require("@codeceptjs/configure");

setHeadlessWhen(process.env.CI);

var server = require("./config/end_to_end_server");

exports.config = {
  tests: "./tests/*_test.ts",
  output: "./output",
  helpers: {
    Playwright: {
      url: "http://localhost:3502",
      show: true,
      browser: "chromium",
      waitForAction: 30,
      pressKeyDelay: 3,
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
          factory: "./factories/catalogIngredient",
          delete: { delete: "/catalogs/ingredients/{id}/" },
          fetchId: (data) => data.name,
        },
        catalogRecipe: {
          uri: "/catalogs/recipes/",
          factory: "./factories/catalogRecipe",
          delete: { delete: "/catalogs/recipes/{id}/" },
          fetchId: (data) => data.id,
        },
        fridgeIngredient: {
          uri: "/fridge/ingredients/",
          factory: "./factories/fridgeIngredient",
          delete: { delete: "/fridge/ingredients/{id}/" },
          fetchId: (data) => data.id,
        },
      },
    },
    DjangoHelper: {
      require: "./helpers/django_helper.ts",
      databaseFile: "sqlite:///end_to_end_db.sqlite3",
      backendPath: "../backend/maprochainerecette",
    },
  },
  include: {
    I: "./config/steps_file.js",
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
    customLocator: {
      enabled: true,
      attribute: "data-testid",
    },
  },
};
