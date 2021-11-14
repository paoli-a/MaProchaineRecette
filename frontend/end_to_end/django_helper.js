/* eslint-disable @typescript-eslint/no-var-requires */
const Helper = require("@codeceptjs/helper");
const execSync = require("child_process").execSync;

class DjangoHelper extends Helper {
  constructor(config) {
    super(config);
    this.backendPath = config.backendPath;
    this.databaseFile = config.databaseFile;
  }
  runDjangoCommand(command) {
    const djangoEnv = `cd ${this.backendPath} && DATABASE_URL=${this.databaseFile}`;
    execute(`${djangoEnv} pipenv run python manage.py ${command}`);
  }
}

module.exports = DjangoHelper;

function execute(command) {
  let output = execSync(command, {
    encoding: "utf-8",
  });
  if (output) {
    console.log("__________\n", output);
  }
}
