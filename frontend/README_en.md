# Frontend

[version en français](README.md)

The frontend uses React and Next.js.

## Code quality checks

To run the code quality checks please run the following command from the folder `frontend/`, after [having installed the frontend](../README_en.md#frontend):

```bash
yarn lint
```

## Unit tests

To run the unit tests please run the following command from the folder `frontend/`, after [having installed the frontend](../README_en.md#frontend):

```bash
yarn test
```

## End to end tests

End to end tests let us test a small number of functionnalities implying the frontend, the backend, and a real chromium browser on which the user activity is simulated.

The tests are launched from `frontend/` repository and use [CodeceptJS](https://codecept.io/).

To run the tests, please run the following command:

```bash
yarn end_to_end
```

The backend will run on 3501 port, and the frontend on 3502, and a new database will be created for end to end tests at `backend/end_to_end_db.sqlite3`.

The browser will be launched in graphical mode, and will be visible throughout the tests. To run the tests in headless mode you can add the `CI` environment variable:

```bash
CI=1 yarn end_to_end
```

## Documentation

The documentation uses [jsdoc](https://github.com/jsdoc/jsdoc).
To generate the documentation, please run the following command:

```bash
yarn docs
```

The documentation will then be available as html in the directory `frontend/docs/`.
