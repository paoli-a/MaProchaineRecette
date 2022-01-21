import axios from "axios";
import React, { useMemo, useState } from "react";
import Highlighter from "react-highlight-words";
import * as stopword from "stopword";
import { mutate } from "swr";
import { API_PATHS } from "../../constants/paths";
import { FridgeRecipe } from "../../constants/types";
import { useFridgeRecipes } from "../../hooks";
import Recipe from "../Recipe/Recipe";
import RecipesToolbar from "../Recipe/RecipesToolbar";
import styles from "./FridgeRecipe.module.scss";

type ConsumeError = {
  id?: string;
  value?: string;
};

type CategoriesPossibles = {
  [key: string]: number;
};

/**
 * Ce composant permet d'afficher les recettes. Il donne la possibilité
 * de trier les recettes par catégories mais aussi de faire une recherche
 * "filtrante" sur le titre, la description ou le nom d'un ingrédient.
 *
 * @component
 */
function FridgeRecipes() {
  const [categories, setCategories] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState("");
  const [consumeError, setConsumeError] = useState<ConsumeError>({});
  const { fridgeRecipes } = useFridgeRecipes();

  const categoriesPossibles = () => {
    const categories: CategoriesPossibles | Record<string, never> = {};
    for (const recipe of fridgeRecipes) {
      for (const categorie of recipe.categories)
        if (categorie in categories) {
          categories[categorie] += 1;
        } else {
          categories[categorie] = 1;
        }
    }
    return categories;
  };

  const searchedWords = useMemo(() => {
    const removePunctuation = (results: string): string => {
      const punctuationRegex = /[…~`!@#$%^&*(){}[\];:"'<,.>?/\\|_+=-]/g;
      const resultWithoutPunctuation = results.replace(punctuationRegex, "");
      return resultWithoutPunctuation.replace(/\s{2,}/g, " ");
    };

    const removeStopwords = (results: string[]) => {
      return stopword.removeStopwords(results, stopword.fr);
    };

    const resultWithoutPunctuation = removePunctuation(searchResults);
    return removeStopwords(resultWithoutPunctuation.split(" "));
  }, [searchResults]);

  const filteredRecipes = useMemo(() => {
    const filterUtilCategories = function (recipe: FridgeRecipe) {
      for (const categorie of categories) {
        if (recipe.categories.includes(categorie)) {
          return true;
        }
      }
      return false;
    };

    const filterRecipesCategories = (recipesToFilter: FridgeRecipe[]) => {
      if (categories.length === 0) {
        return recipesToFilter;
      } else {
        return recipesToFilter.filter(filterUtilCategories);
      }
    };

    const lowerResults = (recipe: FridgeRecipe) => {
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

    const filterUtilSearch = function (recipe: FridgeRecipe) {
      const { recipeTitle, description, ingredientsList } =
        lowerResults(recipe);
      for (const mot of searchedWords) {
        if (mot.length > 1) {
          if (recipeTitle.includes(mot) || description.includes(mot)) {
            return true;
          } else {
            for (const ingredient of ingredientsList) {
              if (ingredient.includes(mot)) {
                return true;
              }
            }
          }
        }
      }
      return false;
    };

    const filterRecipesSearch = function (recipesToFilter: FridgeRecipe[]) {
      if (searchResults.length === 0) {
        return recipesToFilter;
      } else {
        return recipesToFilter.filter(filterUtilSearch);
      }
    };

    return filterRecipesSearch(filterRecipesCategories(fridgeRecipes));
  }, [fridgeRecipes, categories, searchedWords, searchResults]);

  const handleHighlight = (texte: string) => {
    return (
      <Highlighter
        highlightClassName="searchHighlight"
        searchWords={searchedWords}
        textToHighlight={texte}
      />
    );
  };

  const handleConsume = (id: string) => {
    axios
      .post(API_PATHS.consume(id))
      .then(() => {
        void mutate(API_PATHS.fridgeIngredients);
        void mutate(API_PATHS.fridgeRecipes);
      })
      .catch(() => {
        setConsumeError({
          id,
          value:
            "La recette n'a pas pu être consommée, veuillez réessayer plus tard",
        });
      });
  };

  const displayedRecipes = filteredRecipes.map((myRecipe: FridgeRecipe) => {
    const consumeButton = (
      <button
        className={`${
          styles.consumeButton
        } ${"button"} ${"secondaryButtonAccent"}
        `}
        onClick={() => myRecipe.id && handleConsume(myRecipe.id)}
      >
        Consommer la recette
      </button>
    );
    return (
      <Recipe
        key={myRecipe.id}
        recipe={myRecipe}
        optionalButton={consumeButton}
        highlight={searchResults ? handleHighlight : undefined}
        error={consumeError.id === myRecipe.id ? consumeError.value : ""}
      />
    );
  });

  const handleChangeCategories = (updatedCategories: string[]) => {
    setCategories(updatedCategories);
  };

  const handleChangeSearch = (search: string) => {
    setSearchResults(search.toLowerCase());
  };

  return (
    <section className={styles.fridgeRecipesSection}>
      <h1 className={styles.title}>Recettes possibles</h1>
      <div className={styles.fridgeRecipesWrapper}>
        <RecipesToolbar
          onChangeCategories={handleChangeCategories}
          onChangeSearch={handleChangeSearch}
          categories={categoriesPossibles()}
        />
        <div className={styles.fridgeRecipes}>{displayedRecipes}</div>
      </div>
    </section>
  );
}

export default FridgeRecipes;
