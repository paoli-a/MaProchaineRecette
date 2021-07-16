# Ma prochaine recette

[english version](README_en.md)

Ma prochaine recette est une application web permettant d'afficher les recettes faisables en fonction d'un catalogue de recettes et de la liste des ingrédients présents dans le frigo.

## Fonctionnalités

L'application est composée de trois pages principales :

### La page des recettes faisables et des ingrédients du frigo

- Les recettes faisables sont affichées dans un ordre permettant de prendre en compte les ingrédients qui vont se périmer le plus vite.
- Pour chaque recette affichée, l'ingrédient du frigo qui périme le plus vite est mis en gras.
- Pour chaque recette affichée, les ingrédients qui sont présents dans celle-ci mais dont le type d'unité ne permet pas de comparer leur quantité avec ceux du frigo correspondants sont mis en grisé italique. La recette est alors entourée d'un cadre gris pour indiquer qu'elle n'est peut être pas faisable.
- Il est possible de filtrer les recettes par catégories (par exemple entrée, plat, dessert) ou de filtrer par mot-clé grace à la barre de recherche.
- Lorsqu'un ingrédient est ajouté dans le frigo, dans le cas où le même ingredient est déjà présent avec la même date de péremption, les deux ingrédients seront fusionnés et leur leur quantité sommée à condition que leur unités soient du même type (par exemple `gramme` et `kilogramme`, alors que `gramme` et `pièce` ne le pourront pas).

### La page du catalogue de recettes

Le catalogue des recettes contient l'ensemble de vos recettes, qui seront prises en compte pour établir la liste des recettes faisables.

### La page du catalogue d'ingrédients

Pour ajouter un ingrédient dans une recette ou dans le frigo, il faut d'abord que le nom exact de cet ingrédient soit entré dans le catalogue des ingrédients.

## Installation

Actuellement la seule forme d'installation est l'installation locale à partir des sources.

### Prérequis

Pour pouvoir lancer l'application, il vous faut installer une version de :

- [Python 3](https://www.python.org/) (de préférence 3.9+)
- [Node.js](https://nodejs.org/) (de préférence 16+)

### Procédure

Il faut d'abord cloner localement le répertoire :

```bash
git clone https://github.com/paoli-a/MaProchaineRecette.git
```

L'application est composée de deux parties : le backend et le frontend, qu'il faut installer et lancer séparément.

#### Backend

Il faut d'abord installer le backend :

```bash
pip install pipenv
cd ma-prochaine-recette/backend/
pipenv install
```

Une fois installé, vous pouvez le lancer avec la commande suivante :

```bash
cd maprochainerecette
pipenv run python manage.py runserver
```

Le backend est alors en fonctionnement. Vous pouvez le vérifier en accédant à l'adresse `http://127.0.0.1:8000/` qui vous permettra de naviguer dans l'interface web de l'API REST.

#### Frontend

Il faut ensuite, dans un autre terminal, installer le frontend et donc également si nécessaire Yarn (`npm install --global yarn`):

```bash
cd ma-prochaine-recette/frontend/
yarn
```

Une fois installé, vous pouvez lancer le serveur de développement avec la commande suivante :

```bash
yarn dev
```

L'application devrait alors se lancer toute seule. Elle sera disponible depuis votre navigateur à l'adresse `http://127.0.0.1:3000/`.

Le serveur de production peut être lancé avec les commandes suivantes :

```bash
yarn build
yarn start
```

## Licence

Cette application est disponible sous licence AGPL V3. Pour plus de détails n'hésitez pas à consulter le [texte de la licence](LICENSE).

## Détails techniques

Si vous souhaitez plus de détails sur l'aspect technique, les outils de développement et la documentation, n'hésitez pas à consulter le [README du backend](backend/README.md) et le [README du frontent](frontend/README.md).
