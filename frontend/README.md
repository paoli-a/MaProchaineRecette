# Frontend

[english version](README_en.md)

Le frontend utilise React et Next.js.

## Tests de qualité de code

Pour lancer les tests de qualité de code il faut taper la commande suivante depuis le dossier `frontend/`, après avoir [procédé à l'installation](../README.md#frontend) :

```bash
yarn lint
```

## Tests unitaires

Pour lancer les tests unitaires il faut taper la commande suivante au niveau du dossier `frontend/`, après avoir [procédé à l'installation](../README.md#frontend) :

```bash
yarn test
```

## Tests de bout en bout

Les tests de bout en bout permettent de tester un nombre réduit de fonctionnalités en lançant à la fois le frontend, le backend, et un vrai navigateur chromium sur lequel l'action de l'utilisateur est simulée.

Les tests sont lancés depuis le répertoire `frontend/` et utilisent la librairie [CodeceptJS](https://codecept.io/).

Pour les lancer, il faut taper la commande :

```bash
yarn end_to_end
```

Un backend tournera sur le port 3501, et le frontend sur le port 3502, et une nouvelle base de données sera créée pour l'occasion de ces tests dans `backend/end_to_end_db.sqlite3`.

Le navigateur sera lancé en mode graphique et visible tout le long des tests. Pour lancer les tests en mode headless on peut ajouter la variable d'environnement `CI` :

```bash
CI=1 yarn end_to_end
```

## Documentation

La documentation du projet utilise [jsdoc](https://github.com/jsdoc/jsdoc).
Pour générer la documentation, il faut taper la commande :

```bash
yarn docs
```

La documentation sera alors disponible sous forme html dans le répertoire `frontend/docs/`.
