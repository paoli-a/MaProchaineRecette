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
        catalogRecipe: {
          uri: "/catalogs/recipes/",
          factory: "./end_to_end/factories/catalogRecipe",
          delete: { delete: "/catalogs/recipes/{id}/" },
          fetchId: (data) => data.id,
        },
        fridgeIngredient: {
          uri: "/fridge/ingredients/",
          factory: "./end_to_end/factories/fridgeIngredient",
          delete: { delete: "/fridge/ingredients/{id}/" },
          fetchId: (data) => data.id,
        },
      },
    },
    DjangoHelper: {
      require: "./end_to_end/django_helper.js",
      databaseFile: "sqlite:///end_to_end_db.sqlite3",
      backendPath: "../backend/maprochainerecette",
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
    customLocator: {
      enabled: true,
      attribute: "data-testid",
    },
  },
};
