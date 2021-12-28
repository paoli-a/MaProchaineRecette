import Helper from "@codeceptjs/helper";
import child from "child_process";

const execSync = child.execSync;

class DjangoHelper extends Helper {
  private backendPath: string;
  private databaseFile: string;

  constructor(config: { backendPath: string; databaseFile: string }) {
    super(config);
    this.backendPath = config.backendPath;
    this.databaseFile = config.databaseFile;
  }
  runDjangoCommand(command: string): void {
    const djangoEnv = `cd ${this.backendPath} && DATABASE_URL=${this.databaseFile}`;
    execute(`${djangoEnv} pipenv run python manage.py ${command}`);
  }
}

module.exports = DjangoHelper;

function execute(command: string): void {
  execSync(command, {
    encoding: "utf-8",
    stdio: "inherit",
  });
}
