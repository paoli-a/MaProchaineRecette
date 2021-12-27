/* eslint-disable @typescript-eslint/no-var-requires */
const execSync = require("child_process").execSync;

const cdFrontend = "cd ./";
const cdBackend = "cd ../backend/maprochainerecette";

module.exports = {
  start: function () {
    const databaseFile = "sqlite:///end_to_end_db.sqlite3";
    const djangoEnv = `${cdBackend} && DATABASE_URL=${databaseFile}`;
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
      `${cdFrontend} && NEXT_PUBLIC_PROXY_HOST=http://localhost:3501 node_modules/next/dist/bin/next build`,
      true
    );
    execute(
      `${cdFrontend} && node_modules/.bin/pm2 delete pm2_backend.json`,
      false
    );
    execute(
      `${cdFrontend} && node_modules/.bin/pm2 delete pm2_frontend.json`,
      false
    );
    execute(
      `${cdFrontend} && node_modules/.bin/pm2 start pm2_backend.json`,
      false
    );
    execute(
      `${cdFrontend} && node_modules/.bin/pm2 start pm2_frontend.json`,
      true
    );
  },
  stop: function () {
    execute(`${cdFrontend} && node_modules/.bin/pm2 stop frontend`, false);
    execute(`${cdFrontend} && node_modules/.bin/pm2 stop backend`, true);
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
