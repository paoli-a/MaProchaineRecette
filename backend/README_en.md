# Backend

[version en français](README_en.md)

The backend uses Django and Django Rest Framework, and provides a REST API for the frontend.

## Database

There is already an sqlite database that can be used for testing, but we recommend that you drop it and recreate it with your own data.

To do that, run the following commands from the folder `backend/maprochainerecette/`:

```bash
rm db.sqlite3
pipenv run python manage.py makemigrations
pipenv run python manage.py migrate
```

And answer the questions. You will be asked to create a superuser for Django. This account will allow you to access the Django admin interface at `http://127.0.0.1:8000/admin/` when the server will be starged.

## Unit tests

To run the unit tests please run the following command from the folder `backend/maprochainerecette/`, after [having installed the backend](../README_en.md#backend):

```bash
pipenv run pytest
```

## Documentation

The documentation is available through the docstrings but no other form of documentation has yet been implemented.
