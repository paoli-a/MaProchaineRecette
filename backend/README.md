# Backend

[english version](README_en.md)

Le backend utilise Django et Django Rest Framework, et fournit une API REST pour le frontend.

## Base de données

Il y a déjà une base de données sqlite qui peut permettre de réaliser des tests, mais nous vous conseillons de la supprimer et de la recréer avec vos propres données.

Pour ce faire tapez les commandes suivantes à partir du dossier `backend/maprochainerecette/`:

```bash
rm db.sqlite3
pipenv run python manage.py makemigrations
pipenv run python manage.py migrate
```

Et répondez aux questions. Il vous sera demandé de créer un superutilisateur pour Django. Ce compte vous permettra d'accéder à l'interface d'admin de Django à l'adresse `http://127.0.0.1:8000/admin/` lorsque le serveur sera lancé.

## Tests unitaires

Pour lancer les tests unitaires il suffit de taper la commande suivante au niveau du dossier `backend/maprochainerecette/`, après avoir [procédé à l'installation](../README.md#backend) :

```bash
pipenv run pytest
```

## Documentation

La documentation est disponible via les docstrings mais aucune autre forme de documentation n'a encore été mise en place.
