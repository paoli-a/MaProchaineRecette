import React, { useState, useMemo } from "react";
import "./RecettesAffichage.css";
import Recette from "./Recette";
import RecettesToolbar from "./RecettesToolbar";
import Highlighter from "react-highlight-words";

function RecettesAffichage({ recettes }) {
  const [categories, setCategories] = useState([]);
  const [searchResults, setSearchResults] = useState("");
  const titrePage = "Recettes";

  const categoriesPossibles = () => {
    const categories = {};
    for (let recette of recettes) {
      for (let categorie of recette.categorie)
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

  const recettesFiltrees = useMemo(() => {
    const filtreurUtilCategories = function (recette) {
      for (let categorie of categories) {
        if (recette.categorie.includes(categorie)) {
          return true;
        }
      }
      return false;
    };

    const filtreurRecettesCategories = (recettesAFiltrer) => {
      if (categories.length === 0) {
        return recettesAFiltrer;
      } else {
        return recettesAFiltrer.filter(filtreurUtilCategories);
      }
    };

    const lowerResults = (recette) => {
      const ingredients = Object.keys(recette.ingredients);
      const ingredientsListLower = ingredients.map((ingredient) => {
        return ingredient.toLowerCase();
      });
      const resultsLower = {
        titreRecette: recette.titre.toLowerCase(),
        description: recette.description.toLowerCase(),
        ingredientsList: ingredientsListLower,
      };
      return resultsLower;
    };

    const filtreurUtilSearch = function (recette) {
      const { titreRecette, description, ingredientsList } = lowerResults(
        recette
      );
      for (let mot of searchedWords) {
        if (mot.length > 1) {
          if (titreRecette.includes(mot) || description.includes(mot)) {
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

    const filtreurRecettesSearch = function (recettesAFiltrer) {
      if (searchResults.length === 0) {
        return recettesAFiltrer;
      } else {
        return recettesAFiltrer.filter(filtreurUtilSearch);
      }
    };

    return filtreurRecettesSearch(filtreurRecettesCategories(recettes));
  }, [recettes, categories, searchedWords, searchResults]);

  const handleHighlight = (texte) => {
    return (
      <Highlighter
        highlightClassName="searchHighlight"
        searchWords={searchedWords}
        textToHighlight={texte}
      />
    );
  };

  const recettesAffichees = recettesFiltrees.map((maRecette) => {
    return (
      <Recette
        key={maRecette.id}
        recette={maRecette}
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
    <div>
      <h1>{titrePage}</h1>
      <RecettesToolbar
        onChangeCategories={handleChangeCategories}
        onChangeSearch={handleChangeSearch}
        categories={categoriesPossibles()}
      />
      <div id="RecettesAffichage">{recettesAffichees}</div>
    </div>
  );
}

export default RecettesAffichage;
