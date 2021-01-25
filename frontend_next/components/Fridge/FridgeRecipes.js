import React, { useState, useMemo } from "react";
import Recipe from "../Recipe/Recipe";
import RecipesToolbar from "../Recipe/RecipesToolbar";
import Highlighter from "react-highlight-words";
import PropTypes from "prop-types";

/**
 * Ce composant permet d'afficher les recettes. Il donne la possibilité
 * de trier les recettes par catégories mais aussi de faire une recherche
 * "filtrante" sur le titre, la description ou le nom d'un ingrédient.
 *
 * @component
 */
function FridgeRecipes({ recipes }) {
  const [categories, setCategories] = useState([]);
  const [searchResults, setSearchResults] = useState("");

  const categoriesPossibles = () => {
    const categories = {};
    for (let recipe of recipes) {
      for (let categorie of recipe.categories)
        if (categorie in categories) {
          categories[categorie] += 1;
        } else {
          categories[categorie] = 1;
        }
    }
    return categories;
  };

  const searchedWords = useMemo(() => {
    const removePunctuation = (results) => {
      const punctuationRegex = /[…~`!@#$%^&*(){}[\];:"'<,.>?/\\|_+=-]/g;
      let resultWithoutPunctuation = results.replace(punctuationRegex, "");
      return resultWithoutPunctuation.replace(/\s{2,}/g, " ");
    };

    const removeStopwords = (results) => {
      const stopword = require("stopword");
      return stopword.removeStopwords(results, stopword.fr);
    };

    const resultWithoutPunctuation = removePunctuation(searchResults);
    return removeStopwords(resultWithoutPunctuation.split(" "));
  }, [searchResults]);

  const filteredRecipes = useMemo(() => {
    const filterUtilCategories = function (recipe) {
      for (let categorie of categories) {
        if (recipe.categories.includes(categorie)) {
          return true;
        }
      }
      return false;
    };

    const filterRecipesCategories = (recipesToFilter) => {
      if (categories.length === 0) {
        return recipesToFilter;
      } else {
        return recipesToFilter.filter(filterUtilCategories);
      }
    };

    const lowerResults = (recipe) => {
      const ingredientsListLower = recipe.ingredients.map((ingredientInfos) => {
        return ingredientInfos.ingredient.toLowerCase();
      });
      const resultsLower = {
        recipeTitle: recipe.title.toLowerCase(),
        description: recipe.description.toLowerCase(),
        ingredientsList: ingredientsListLower,
      };
      return resultsLower;
    };

    const filterUtilSearch = function (recipe) {
      const { recipeTitle, description, ingredientsList } = lowerResults(
        recipe
      );
      for (let mot of searchedWords) {
        if (mot.length > 1) {
          if (recipeTitle.includes(mot) || description.includes(mot)) {
            return true;
          } else {
            for (let ingredient of ingredientsList) {
              if (ingredient.includes(mot)) {
                return true;
              }
            }
          }
        }
      }
      return false;
    };

    const filterRecipesSearch = function (recipesToFilter) {
      if (searchResults.length === 0) {
        return recipesToFilter;
      } else {
        return recipesToFilter.filter(filterUtilSearch);
      }
    };

    return filterRecipesSearch(filterRecipesCategories(recipes));
  }, [recipes, categories, searchedWords, searchResults]);

  const handleHighlight = (texte) => {
    return (
      <Highlighter
        highlightClassName="searchHighlight"
        searchWords={searchedWords}
        textToHighlight={texte}
      />
    );
  };

  const displayedRecipes = filteredRecipes.map((myRecipe) => {
    return (
      <Recipe
        key={myRecipe.id}
        recipe={myRecipe}
        highlight={searchResults ? handleHighlight : undefined}
      />
    );
  });

  const handleChangeCategories = (updatedCategories) => {
    setCategories(updatedCategories);
  };

  const handleChangeSearch = (search) => {
    setSearchResults(search.toLowerCase());
  };

  return (
    <section className="fridge-recipes">
      <h1 className="fridge-recipes__title">Mes prochaines recettes</h1>
      <RecipesToolbar
        onChangeCategories={handleChangeCategories}
        onChangeSearch={handleChangeSearch}
        categories={categoriesPossibles()}
      />
      <div className="fridge-recipes">{displayedRecipes}</div>
    </section>
  );
}

FridgeRecipes.propTypes = {
  recipes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      categories: PropTypes.arrayOf(PropTypes.string).isRequired,
      title: PropTypes.string.isRequired,
      ingredients: PropTypes.arrayOf(
        PropTypes.shape({
          ingredient: PropTypes.string.isRequired,
          amount: PropTypes.string.isRequired,
          unit: PropTypes.string.isRequired,
        }).isRequired
      ),
      duration: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default FridgeRecipes;
