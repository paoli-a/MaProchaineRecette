const execSync = require("child_process").execSync;

module.exports = {
  start: function () {
    const databaseFile = "sqlite:///end_to_end_db.sqlite3";
    const backendPath = "../backend/maprochainerecette";
    const djangoEnv = `cd ${backendPath} && DATABASE_URL=${databaseFile}`;
    execute(
      `${djangoEnv} pipenv run python manage.py reset_db --noinput`,
      true
    );
    execute(`${djangoEnv} pipenv run python manage.py makemigrations`, true);
    execute(
      `${djangoEnv} pipenv run python manage.py migrate --run-syncdb`,
      true
    );
    execute(
      "NEXT_PUBLIC_PROXY_HOST=http://localhost:3501 node_modules/next/dist/bin/next build",
      true
    );
    execute("node_modules/.bin/pm2 delete pm2_backend.json", false);
    execute("node_modules/.bin/pm2 delete pm2_frontend.json", false);
    execute("node_modules/.bin/pm2 start pm2_backend.json", false);
    execute("node_modules/.bin/pm2 start pm2_frontend.json", true);
  },
  stop: function () {
    execute("node_modules/.bin/pm2 stop frontend", false);
    execute("node_modules/.bin/pm2 stop backend", true);
  },
};

function execute(command, outputResult = true) {
  let options = {
    encoding: "utf-8",
  };
  if (outputResult) {
    options.stdio = "inherit";
  }
  execSync(command, options);
}
