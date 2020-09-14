# My next recipe

[version en français](README.md)

_Ma prochaine recette_ (My next recipe) is a web application that allows you to display feasible recipes based on a catalog of recipes and the list of ingredients available in the fridge.

## Installation

Currently the only form of installation is the local one from sources.

### Requirements

To be able to run the applicaiton, you need the following requirements:

- [Python 3](https://www.python.org/) (preferably 3.8+)
- [Node.js](https://nodejs.org/) (preferably 12+)
- [Yarn](https://yarnpkg.com/)

### Procedure

You need to first clone locally the repository:

```bash
git clone https://github.com/paoli-a/MaProchaineRecette.git
```

The application is made up of two parts: the backend and the frontend, which must be installed and launched separately.

#### Backend

First install the backend:

```bash
pip install pipenv
cd ma-prochaine-recette/backend/
pipenv install
```

Once installed, you can start it with the following command:

```bash
cd maprochainerecette
pipenv run python manage.py runserver
```

The backend is then running. You can verify this by accessing the URL `http://127.0.0.1:8000/` which will allow you to navigate through the REST API web interface.

#### Frontend

Then, in another terminal, install the frontend:

```bash
cd ma-prochaine-recette/frontend/
yarn install
```

Once installed, you can run it with the following command:

```bash
yarn start
```

The application should the start and open the browser. It will be available from your browser at the address `http://127.0.0.1:3000/`.

## Features overview

The application consists of three main pages :

### The main page of feasible recipes and available fridge ingredients

- The feasible recipes are displayed in an order allowing to take into account the ingredients which will expire the fastest.
- For each recipe displayed, the ingredient from the fridge that expires the fastest is put in bold.
- For each recipe displayed, the ingredients that are present in it but whose type of unit does not allow their quantity to be compared with the corresponding ones in the fridge are displayed in gray and italics. These recipes are also surrounded by a gray frame to indicate that they may not be feasible.
- It is possible to filter the recipes by categories (for example starter, main course, dessert) or to filter by keyword using the search bar.
- When an ingredient is added to the fridge, if the same ingredient is already present with the same expiration date, the two ingredients will be merged and their quantity summed provided that their units are of the same type (for example `gram` and `kilogram`, while `gram` and `piece` will not be merged).

### The recipe catalog page

The recipe catalog contains all of your recipes, that will be taken into account to establish the list of feasible recipes.

### The ingredient catalog page

To add an ingredient in a recipe or in the fridge, the exact name of this ingredient must first be entered in the catalog of ingredients.

## Licence

This application is available under AGPL V3 license. For more details please read the [text of the license](LICENSE).

## Technical details

If you want more details on the technical aspect, the development tools and the documentation, please read the [README file of the backend](backend/README_en.md) and the [README file of the frontent](frontend/README_en.md).
